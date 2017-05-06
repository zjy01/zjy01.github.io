title: 体验koa
date: 2016-09-01 16:09:57
category: 后端 #分类
tags:
- nodejs
---

## 体验koa

之前使用`nodejs`开发后台服务，使用的一直是`express`。
后来了解到`express`开发团队重新开发了一个框架`koa`。

先不说优点有什么，秉着探索的精神，先体验一下 koa

## 不同之处

[koa 中文文档](https://github.com/guo-yu/koa-guide)

koa 给人感觉最大的不同就是，在处理流程上使用的是
`ES6` 的 `generator`

`generator`通过`yield`和`next`的方法，使得流程清晰易见。

<!-- more -->

## 使用koa

跟 `express` 一样，`koa`也有一个生成器。
我们直接全局安装
```bash
npm install -g koa-generator
```
然后新建一个项目，我习惯使用`ejs`模板引擎。
```bash
koa newKoa -e # 新建一个项目，使用ejs模板引擎（默认使用jade）
cd newKoa
npm install #安装模块
```
目录如图，和`express`项目目录如出一辙
![](http://i4.buimg.com/567571/8d5d1444629f121a.png)

启动
```
npm start
```

在浏览器输入`localhost:3000`访问：

![](http://i4.buimg.com/567571/1263cadf6af16c8b.png)

体验结束

## 结语
`koa` 还有 `2.x` 版本，我这次并没有尝试。
但是在安装中可以感受到，为了减低学习成本，团队在假设`koa`的使用，维持了很多`express`的语法。
学习起来不会很费力。