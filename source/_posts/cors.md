title: cors跨域探讨
date: 2016-11-08 19:37:00
category: 前端 #分类
tags:
- javascript
---

## 前端跨域
前端跨域方案很多，`jsonp`、`iframe`等等，但是个人觉得，最正宗，最无损的跨域方式还是`CORS`。
`CORS`(`Cross-origin resource sharing`)是一个W3C标准，翻译过来是*跨域资源共享*。
它允许浏览器向跨域（协议、域名、端口任一不相同）服务器发送`XMLHttpRequest`请求。
目前支持所有现代浏览器（>IE10）
借阅了**阮一峰**大神的[《跨域资源共享 CORS 详解》](http://www.ruanyifeng.com/blog/2016/04/cors.html)，结合自己的理解，说一说自己的`CORS`的领会。

## 简介
`CORS`协议本身，可以说，完全是由浏览器执行的。
对前端开发者而言，`CORS`是在浏览器检查到跨域请求的时候，自动发起的。
对后台开发者而言，只要在`headers`中返回特定的信息（相当于白名单）--具体的`CORS`步骤，浏览器会根据`headers`中返回的信息做出具体的行为。


## 请求
浏览器会自动将请求分为两类：简单请求、非简单请求。
只要同时满足以下条件，就属于简单请求。
<pre>
 (1) 请求方法是以下三种方法之一：
· HEAD
· GET
· POST
（2）HTTP的头信息不超出以下几种字段：
· Accept
· Accept-Language
· Content-Language
· Last-Event-ID
· Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain
</pre>
凡是不同时满足上面两个条件，就属于非简单请求。
浏览器对这两种请求的处理，是不一样的。
<!-- more -->
### 简单请求
当浏览器发起简单请求的时候，会自动在请求头加上`origin`，标识请求来源。
这时候，服务器需要携带`Access-Control-Allow-Origin`返回，并且里面的值包含`origin`，浏览器才会允许`xhr`获取返回的内容。
一条简单的跨域请求就完成了：
前端不需要写任何东西。
后台也可以不做任何逻辑处理，一律返回`Access-Control-Allow-Origin`。
全部的`CORS`把关工作都在浏览器端正式执行。

同时，发起跨域请求的时候，默认是不带`cookie`的，需要手动开启，后台也需要权限允许。

一个简单的跨域样例如下：
![](http://i1.piimg.com/567571/8e1dc61836f71770.png)

### 非简单请求
当浏览器判定是非简单请求的时候，会在发正式请求前，想同一地址发起一个`options`的预请求。
预请求携带了正式请求的方法（method）和特殊头（headers）。
```text
Access-Control-Request-Method: POST,
Access-Control-Request-Headers: CARVEN
```
然后服务器返回自己允许的方法（method）和特殊头（headers），当然还有允许域

```txt
Access-Control-Allow-Method: POST, PUT
Access-Control-Allow-Headers: CARVEN, ZJY
Access-Control-Allow-Origin: http://localhost:63342
```

然后浏览器会比较，如果请求发起内容--`origin`,`method`,`headers`，都在服务器响应的名单里，正式请求就可以发起了，流程再次回归到**简单请求**.

*******************
#### 为什么会有非简单请求？

对于非简单（偏激理解为 危险）的请求，做到询问与逻辑代码的隔离。

比如：PUT、DELETE等method，从规范来说，会使目标地址发生增、删等行为，使目标服务器资源发生改变。

所以，浏览器会发起正式请求前，先向发起一次预请求，等到允许后再发正式请求。

*****************
请求如图：
![](http://p1.bpimg.com/567571/f7da324c07160e48.png)
![](http://p1.bpimg.com/567571/e781b1a4f442c2ed.png)

## 控制CORS
在ES6的fetch中，已经可以控制`cors`开关了。
```js
fetch(url,{ mode: mode})
```
> + mode=same-origin，不支持跨域，直接在浏览器端拦截跨域请求
> + mode=no-cors，不执行跨域协议，即不存在跨域问题，即使有特殊header，也不发options。
但是只支持HEAD、GET、POST，且代码不能接收到响应信息。

> + mode=cors，默认，执行cors协议。

## 结尾
前面举的实行例子，只是最简单的`cors`规则演示，但其实，前后台手动通过获取`headers`上携带的各种信息，可以很灵活的做其他的逻辑处理。
