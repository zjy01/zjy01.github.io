---
title: 初探ES7 Decorator
date: 2018-02-01 18:57:24
category: javascript #分类
tags:
- javascript
description: 第一次尝试写decorator
---

## 装饰器

装饰器是 ES7 新有的特性，它允许我们使用简洁的方式，为已有的类、类的方法、类的属性 添加有趣的修饰。
<!-- more -->
可使用如下：
```js
// deco.js
// 假设已实现 装饰器 studentDecorator、readonly、shouldITellYou
@studentDecorator
class Person{

  @readonly
  name = 'carvenzhang';

  @shouldITellYou
  getInfo(){
    //...
  }
}
```

目前，node 还不支持 decorator，但是，感谢 babel，它提供了转译支持。
我们可以运行使用如下：
```bash
# 先安装 babel-cli 及 babel-plugin-transform-decorators-legacy
babel --plugins transform-decorators-legacy deco.js > deco.es5.js && node deco.es5.js
```

## 实现 Decorator
那么，装饰器要怎么实现了，什么场景下需要用到`decorator`呢。
装饰器比较使用于，在完整的系统功能上，提供辅助能力。比如 *记录日志* 、 *查询权限*。
目前由一个很好的集成装饰器，可以提供学习：[core-decorators](https://github.com/jayphelps/core-decorators)。

我们可以通过编写一个权限审核的Decorator，达到学习decorator的目的。

###  编写一个原始类
我们编写一个很简单的class，模拟一些操作。
```js
// deco.js
class DBAct{
  constructor(options){
    this._options = Object.assign({
      auths:[]
    }, options);
  }
  add(){
    console.log('db add');
  }
  delete(){
    console.log('db delete');
  }
  update(){
    console.log('db update');
  }
  select(){
    console.log('db select');
  }
}
```
这是一个数据库操作集合，可以通过调用方法， 实现增删改查。

我们通过编写decorator，为其提供操作数据库前的权限审核能力。

### 实现方法型decorator
首先，我们实现一个 decoraotr，为每个方法提供一个权限检查的能力。
供给方法使用的 decorator 有三个参数，`target`、`name`、`descriptor`，与[`Object.defineProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)的参数一一对应。

> target: 类的原型对象，比如 DBAct.prototype  
> name: 要修饰的方法的属性名，比如 add  
> descriptor: 该属性的描述对象，包含 {configurable, enumerable, value, writable } 等值，其中value即实际修饰的函数。  

实现如下：
```js
function authMethodDecorator(auth){
  //函数封装层，返回decorator
  return function(target, name, descriptor){
    // 获取原函数
    const method = descriptor.value;
    // 重写函数
    descriptor.value = function(...args) {
      // 判断是否有该权限
      if(this._options.auths.includes(auth)){
        // 继续调用原函数
        return method.apply(this, args);
      } else {
        // 无权限
        console.log(`no permission to exec ${name}`)
      }
    }
    return descriptor;
  }
}
```

整合起来调用如下：
```js
// deco.js
class DBAct{
  constructor(options){
    this._options = Object.assign({
      auth:{}
    }, options);
  }

  // 只有在有 add 权限的情况下，才能进行 add 操作。
  @authMethodDecorator('add')
  add(){
    console.log('db add');
  }

  // 只有在有 delete 权限的情况下，才能进行 delete 操作。
  @authMethodDecorator('delete')
  delete(){
    console.log('db delete');
  }
  update(){
    console.log('db update');
  }
  select(){
    console.log('db select');
  }
}

// 实例化
const user1 = new DBAct({
  auths:['add'] // user1 仅有 add 权限
});
r1.add();
r1.delete();

// 关于方法的decorator
function authMethodDecorator(auth){
  //..
}
```

最终通过babel转译，node调用，得到以下结果

```bash
# exec
babel --plugins transform-decorators-legacy deco.js > deco.es5.js && node deco.es5.js

# echo
db add
no permission to exec delete
```

### 实现类的Decorator
我们也可以实现一个Decorator，为整个class的每一个方法都统一做权限检查。
类的decorator仅有一个参数:
> target: 调用的类本身，比如 DBAct  

实现如下：
```js
function authClassDecorator(auth){
   //函数封装层，返回decorator
  return function(target){
    // 获取 class 上所有的描述对象
    const descs = Object.getOwnPropertyDescriptors(target.prototype);
    // 获取 class 上所有的属性名,此方法不兼容 Symbol，实际解决方案参考 core-decorator
    const keys = Object.keys(descs);
    //循环处理每一个方法
    for (let i = 0, l = keys.length; i < l; i++) {
      const name = keys[i];
      const desc = descs[name];

      // 不处理 非函数 和 构造函数
      if (typeof desc.value !== 'function' || name === 'constructor') {
        continue;
      }
      // 为每个方法分别调用一次 authMethodDecorator，重写给 target.prototype
      Object.defineProperty(target.prototype, name, authMethodDecorator(auth)(target.prototype, name, desc));
    }
  }
}
```

整合起来调用如下：
```js
// deco.js
//所有方法都需要connect权限才能执行
@authClassDecorator('connect')
class DBAct{
  constructor(options){
    this._options = Object.assign({
      auth:{}
    }, options);
  }
  add(){
    console.log('db add');
  }
  delete(){
    console.log('db delete');
  }
  update(){
    console.log('db update');
  }
  select(){
    console.log('db select');
  }
}

// 实例化
const user1 = new DBAct({
  auths:['add'] // user1 仅有 add 权限
});
r1.add();
r1.delete();

// 关于方法的decorator
function authMethodDecorator(auth){
  //..
}
// 关于类的decorator
function authClassDecorator(auth){
  //..
}
```

最终通过babel转译，node调用，得到以下结果

```bash
# exec
babel --plugins transform-decorators-legacy deco.js > deco.es5.js && node deco.es5.js

# echo
no permission to exec add
no permission to exec delete
```

### decorator整合
那么，我们能不能实现一个decoraotor，既能给calss用，也能给method用呢？
可以的：
```js
@authDecorator('connect')
class DBAct{
  constructor(options){
    this._options = Object.assign({
      auths:[]
    }, options);
  }

  @authDecorator('add')
  add(){
    console.log('db add');
  }

  @authDecorator('delete')
  delete(){
    console.log('db delete');
  }
  update(){
    console.log('db update');
  }
  select(){
    console.log('db select');
  }
}

const user1 = new DBAct({
  auths:['add', 'connect'] // user1 仅有 add 权限
});
user1.add();
user1.delete();


function authMethodDecorator(auth, target, name, descriptor){
  // 获取原函数
  const method = descriptor.value;
  // 重写函数
  descriptor.value = function(...args) {
    // 判断是否有该权限
    // if(this === target){
    //   return method.apply(target, args)
    // }
    if(this._options.auths.includes(auth)){
      // 继续调用原函数
      return method.apply(this, args);
    } else {
      // 无权限
      console.log(`no permission to exec ${name}`)
    }
  }
  return descriptor;
}

function authClassDecorator(auth, target){
  // 获取 class 上所有的描述对象
  const descs = Object.getOwnPropertyDescriptors(target.prototype);
  // 获取 class 上所有的属性名,此方法不兼容 Symbol，实际解决方案参考 core-decorator
  const keys = Object.keys(descs);
  //循环处理每一个方法
  for (let i = 0, l = keys.length; i < l; i++) {
    const name = keys[i];
    const desc = descs[name];

    // 不处理 非函数 和 构造函数
    if (typeof desc.value !== 'function' || name === 'constructor') {
      continue;
    }
    // 为每个方法分别调用一次 authMethodDecorator，重写给 target.prototype
    Object.defineProperty(target.prototype, name, authMethodDecorator(auth, target.prototype, name, desc));
  }
}

// 通过参数个数判断是 调用方式 method 还是 class
function authDecorator(auth){
  return function handle(...args) {
    if (args.length === 1) {
      return authClassDecorator(auth, ...args);
    }
    return authMethodDecorator(auth, ...args);
  };
}
```

最终通过babel转译，node调用，得到以下结果

```bash
# exec
babel --plugins transform-decorators-legacy deco.js > deco.es5.js && node deco.es5.js

# echo
db add
no permission to exec delete
```
这样，一个通用的decorator就出来了。
