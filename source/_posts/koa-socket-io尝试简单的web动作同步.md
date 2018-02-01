title: koa+socket.io尝试简单的web动作同步
date: 2016-10-10 15:13:18
category: 前端
tags:
- nodejs
- socket
- 前端
---

## 动作同步

尝试用过`browser-sync`辅助开发的前端同学，大概都会感到神奇：**在多个端打开网页，网页的动作却是完全同步的**。
![](http://www.browsersync.cn/img/scroll-demo.gif)
当然我还没有看过源码，大概也知道是通过'websocket'实现信息同步。
今天在看书籍《跨终端Web》--*徐凯* 的时候，里面有一部分 `web动作同步`的代码演示。于是做了demo做练习。

## 准备工具

> koa : @1.1.2
> socket.io : @1.5.0

其中`koa`并没有什么特别意思，只是作为一个服务器存在，用`express`或者其他什么都可以。
`socket.io`是我们需要的通讯库

## 原理

1、 前端捕获正在发生的动作`action`，和触发动作的元素`target`，通过`客户端socket`传输到`服务器socket`;
2、 `服务器socket`接收到信息，再将信息广播到其他所有`客户端socket`;
3、 其他`客户端socket`接收到广播信息，使特定的元素`target`触发特定的动作`action`
<!-- more -->

## 服务端准备

服务器的准备很简单：搭起服务器，接入`socket.io`。

1、
首先利用`koa-generator`搭起一个`koa`程序.
```bash
koa -e web-transcribe
cd web-transcribe && npm install
```
2、
接入`socket.io`
```bash
npm install --save socket.io
```
接着在`./bin/`下，新建一个js文件`io-server.js`
```js
//io-server.js
var io=require('socket.io')();
exports.listen= function (_server) {
    return io.listen(_server);
};
io.on('connection', function (_socket) {
    console.log('connection:\t' + _socket.id );
    //接收客户端信息
    _socket.on('send', function (json) {
        //广播到其他客户端
        _socket.broadcast.emit('get',json);
    })
});
```

在'./bin/www'中加入`io-server.js`的引用
```js
var app = require('../app');
var debug = require('debug')('demo:server');
var http = require('http');
//加下面这一句，接入io-server.js
var io = require('./io-server');

var port = normalizePort(process.env.PORT || '3000');

var server = http.createServer(app.callback());

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
//加下面这一句,使socket.io监听在server上
io.listen(server);
//...
```

## 客户端的准备
客户端的准备要比较多。
> 1、 准确捕获发生的动作和目标元素
> 2、 通过`socket`发送出去
> 3、 接受`socket`，并使目标元素促发动作。

#### 1、 准确捕获发生的动作和目标元素
正在发生的动作相对比较好捕获，因为只是简单的实验，我只做了`click`动作的捕获。
如何确定正在发生动作的元素呢。
编写如下代码
```js
//transcribe.js
//确定正在发生动作的元素
function getSelector (element) {
    var tagName = element.tagName.toLowerCase();
    //去空格
    function trim(string) {
        return string && string.replace(/^\s+|\s+$/g,"") || string;
    }

    //id绑定的，直接返回。
    if (element.id){
        return '#' + element.id;
    }
    //html
    if (element == document || element == document.documentElement ){
        return 'html';
    }
    //body
    if (element == document.body) {
        return 'html>' + tagName;
    }
    //无父级元素，则返回自己
    if (!element.parentNode) {
        return tagName;
    }

    //最后是有父类元素的情况下，确定target是同种兄弟元素的第几个，返回 parentNode > childNode 的精确形式
    var ix = 0,
        siblings = element.parentNode.childNodes,
        elementTagLength = 0,
        className = trim(element.className);

    //统计同种兄弟元素
    for (var i = 0, l = siblings.length; i < l; i++){
        if (className) {
            if(trim(siblings[i].className) === className){
                ++elementTagLength;
            }
        }
        else {
            if ( (siblings[i].nodeType == 1) && (siblings[i].tagName === element.tagName) ) {
                ++elementTagLength;
            }
        }
    }
    //确定target是父类元素下的第几个兄弟元素
    for (i = 0, l = siblings.length; i < l; i++){
        var sibling = siblings[i];
        if (element === sibling) {
            return arguments.callee(element.parentNode) + '>'
                + ( className
                    ? '.' + className.replace(/\s+/g,',')
                    : tagName)
                + ( (!ix && elementTagLength === 1)
                    ? ''
                    : ':nth-child(' + (ix + 1) + ')');
        }
        else if (sibling.nodeType == 1) {
            ix++;
        }
    }

};
```
最终返回的是`id || class || targetName`

我们需要做一些优化，筛选掉无用的事件，减少`socket`传输量。
在一个html的`<head>`内写入以下代码，改造`addEventListener`,为调用过`addEventListener`的元素加入标识。
```js
<script>
  var __addEventListener = Element.prototype.addEventListener;
  Element.prototype.addEventListener = function (type, handler, capture) {
    if(!this['events']){
      this['events'] = {};
    }
    this['events'][type] = 1;
    return __addEventListener.apply(this, [type, handler, capture]);
  }
</script>
```
并且编写一个函数做辨识
```js
//transcribe.js
var findHashEventsElements = function (ele, eventType) {
    if (!ele.tagName) return null;
    // 有events标识的 或者 html标签内绑定的 或者 js直接绑定的
    if ( (ele['events'] && ele['events'][eventType]) || ele.hasAttribute("on" + eventType) || ele['on' + eventType] ) {
        return ele;
    }
    else {
        if (ele.parentNode != null) {
        //可能有事件委托，追溯上一层
            return findHashEventsElements(ele.parentNode, eventType);
        }
        else {
            return null;
        }
    }
};
```
#### 2、 通过`socket`发送正在发生的动作和目标元素

正式做`click`动作的全局时间监听
```js
//transcribe.js
//启动socket连接
var socket = io();
document.addEventListener('click', function (e) {
    if (e.button === 0) {
        var target = e.target,
            enable = findHashEventsElements(target, 'click');

        if(enable){
        //发送socket信息哦
            socket.emit('send', {
                action: 'click',
                target: getSelector(target),
                time: +new Date()
            })
        }
    }
},true);
```

#### 3、 接受`socket`，并使目标元素促发目标动作。
新建一个文件`trigger.js`，写入促发代码
```js
//trigger.js
socket.on('connect', function () {
    console.log('connect');
    socket.on('get', function (data) {
        console.log("trigger\t"+data.target+"\t"+data.action);
        document.querySelector(data.target).dispatchEvent(new Event(data.action));
    })
});
```
之前这里，我使用了`JQuery`的`trigger`:
```js
$(data.target).trigger(data.action)
```
但是这样会造成页面间的重复触发。
就比如
`a.html`触发了 click;
`b.html`页面收到指令，也触发 click，结果这个click又重新发送socket到`b.html`;
`b.html`收到指令，又触发click，结果这个click又重新发送socket到`a.html`;
这样反复，永不停歇。
看来`JQuery`的`trigger`是直接操作元素触发的，于是改用原生的`dispatchEvent`。完成

## 效果图
合并源代码到`io.js`.
编写简单的html，完成一个demo
```html
<!DOCTYPE html>
<html>
  <head>
    <script>
      var __addEventListener = Element.prototype.addEventListener;
      Element.prototype.addEventListener = function (type, handler, capture) {
        if(!this['events']){
          this['events'] = {};
        }
        this['events'][type] = 1;
        return __addEventListener.apply(this, [type, handler, capture]);
      }
    </script>
    <title><%= title %></title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1><%= title %></h1>
    <p>Welcome to <%= title %></p>
    <button id="btn1">blue</button>
    <button onClick="body_color('red')">red</button>
    <button class="reset_btn">reset</button>
    <script>
      document.getElementById('btn1').addEventListener('click', function () {
        body_color('blue')
      })
      document.querySelector(".reset_btn").onclick= function () {
        body_color('none');
      }
      function body_color(color) {
          document.body.style['background'] = color;
      }
    </script>
    <script src="/javascripts/io.js"></script>
  </body>
</html>

```

[源代码](https://github.com/zjy01/web-transcribe)

看效果图哟
![](http://p1.bpimg.com/567571/ee184984bded2120.gif)

## 结尾
现在只是最简单的`click`传输。
之后完善代码，就可以捕获其他动作。
完善服务器，做成代码植入的形式。
玩起来还是乐趣无穷的。

