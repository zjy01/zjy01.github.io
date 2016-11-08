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
对后台开发者而言，只要在`headers`中返回特定的信息--具体的`CORS`步骤，浏览器会根据`headers`中返回的信息做出具体的行为。

## 请求
浏览器会自动将请求分为两类：简单请求、非简单请求。
只要同时满足一下条件，就属于简单请求。
<pre>
1) 请求方法是以下三种方法之一：
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
