title: js原生函数之call和apply，bind
date: 2016-05-16 18:12:34
category: javascript #分类
tags:
- javascript
---

##  call 和 apply
`call` 和 `apply` 和 `bind` 都是为了改变某个函数运行时的 context 即上下文而存在的，换句话说，就是为了改变函数体内部 this 的指向。

js原生函数中的call和apply都不陌生，这两个方法的作用相似，接受两类参数。
> 第一类是context（上下文），传入的参数作为执行函数的上下文，也是要传入的第一个参数。
> 第二类的argument（参数），传入的参数作为函数执行的参数,call是逐个参数传入，apply是将参数以数组方式传入。

应用如下
```js
var callObj = {c:1};
var applyObj = {c:2};
function fun(a,b){
    return a+b+this.c;
}

fun(2,3);//NaN
fun.call(callObj,2,3);//6;
fun.apply(applyObj,[2,3]);//7

```
## 应用

日常的应用这里不提了，收集了一些我平时看到的，比较意想不到的应用。

### 将NodeList转数组
`document.querySelectorAll()`是大家常用的DOM元素选择器，他会返回查询到的DOM元素的数组，也就是NodeList;
我曾经试过使用forEach去循环监听里面的各个dom，结果失败了，因为NodeList并不具有数组的函数功能。
如果我们要对每个Node遍历处理，就不能用数组的方式去处理了，当然，通过`for`循环还是可以的。
另一方面，出于其他理由，我们要将NodeList转成数组呢。
于是可以用到call
```
var pList = document.querySelectorAll('p');//NodeList
var pArray = [].slice.call(pList);//Array
```
顺便一提，ES6标准中有一个`Array.from()` 方法可以将一个类数组对象或可迭代对象转换成真正的数组。
```
var pList = document.querySelectorAll('p');//NodeList
var pArray = Array.from(pList);//Array
```

### Currying(柯里化)
Currying(柯里化)(部分函数应用)是应用 call 和 apply 的一个函数式编程。Currying 允许我们创建返回已知条件的函数
```
function curry(fun){
    if(arguments.length < 1){
        return this;
    }
    //获取后面的参数
    var args = Array.prototype.slice.call(arguments, 1);
    console.log(args);
    //将后面的参数作为fun的参数
    return function () {
        //这里的arguments和上面的arguments不是同一个变量，这是传入本function的参数
        return fun.apply(this, args.concat(Array.prototype.slice.call(arguments,0)));
    }
}

//定义一个函数是 1 + a + b
function addOneToNumber(a , b) {
    return 1 + a + b;
}

// 将addOneToNumber柯里化
var addOneCurried = curry(addOneToNumber, 10);// 柯里化同时传进一个参数，将a常数化/已知化
console.log(addOneCurried(10, 2)); // 1 + 10 + 10 = 21；
```
其实也是通过`Array.prototype.slice`将类数组转换成数组的一个应用，只是赋予了更加复杂的应用逻辑;
这里同时也是闭包的一个应用过程；

### bind
说了call和apply，也是要介绍一下bind的。
bind方法用于明确指定调用 this 方法。在作用域方面，类似于 call 和 apply 。当你将一个对象绑定到一个函数的 this对象时，你就会用到 bind。
```
var tom = {
    hobby: 'reading',
    advantage: 'programming'
};

function getHobby(){
    return this.hobby;
}

console.log(getHobby());//undefined
console.log(getHobby.bind(tom)());//reading
```
bind 和 call的使用方式很类似，同样接受两部分参数，上下文this和作用函数的后续参数，下面是我猜想的bind的模拟实现方法。
```
Function.prototype.bind = function(scope) {
    var _that = this;
    var args = Array.prototype.slice.call(arguments,1);
    return function() {
        return _that.apply(scope, args.concat(Array.prototype.slice.call(arguments)));
    }
};
```
bind和call的主要区别在于，bind返回的是一个新函数，而call这是直接执行了该函数。

## 总结
本来想写一篇call/apply整理一次自己的思路的，原本以为可以写很多，最后发现实在想不起什么了，自己果然还是学得太少。
后来想到了bind，作为和call的对比也就加了进来，之前没想到bind除了thisArg外还可以继续接受其他参数，因为之前看别人写的bind方法模拟不是这样的，
原来我看到的别人写的bind实现原理代码是这样的：
```
Function.prototype.bind = function(scope) {
  var _that = this;

  return function() {
    return _that.apply(scope, arguments);
  }
}
```
后来自己实验了一遍，发现不对，才自己做了修改
```
Function.prototype.bind = function(scope) {
    var _that = this;
    var args = Array.prototype.slice.call(arguments,1);
    return function() {
        return _that.apply(scope, args.concat(Array.prototype.slice.call(arguments)));
    }
};
```
虽然不一定是正确的，但至少是我的理解范围内的原理解释。
想不到最终收获的是`bind`。