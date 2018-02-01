title: 基于nodejs+socket.io搭建的即时聊天系统
date: 2015-10-05 19:32:01
category: nodejs
tags:
- nodejs
- socket
---
#### 前言
　　这个学期以来一直在学习nodejs，发现真的很便利，也萌生了利用nodejs搭建即时聊天系统的念头。
　　之前已经尝试过利用webSocket来搭建了，也很成功，相比PHP方便太多。我以为使用socket也差不多。
　　后来才发现自己的念头太简单了。**使用socket更方便**。
　　socket.io与单纯的webSocket不同，socket利用`on`和`emit`不断在客户端监听和触发各种自定义事件，自定义操作性很强

#### 开始
　　这一次的聊天系统基于 nodejs+express+socket.io+bootstrap.
下面是我开发时的相应版本：
> socket.io __v1.3.7__
> nodejs __v4.1.1__
> express __v4.13.1__
> bootstrap __v3.3.5__
* 实例地址 ： http://chat.carvenzhang.cn
* 源码地址 ： https://github.com/zjy01/socketChat/
* 参考源码 ： https://github.com/coofly/qx-chat （博主是参考这个源码写的）

<!-- more -->
观看源码前需要了解 `nodejs` 和 `express`
##### 教程开始
我讲得并不详细，如果基础比较差的建议结合其他博文教程学习。我的主要版本是比较新，能对你们提供帮助。
1. 首先要安装nodejs，没有安装的先到官网安装。

2. 安装express
 ```js
 npm install -g express-generator //安装express命令行工具
 ```
3. 建立express项目，我这里建的是ejs版
```
express ejs miniChat //建立miniChat项目
cd miniChat //进入项目文件夹
npm install //安装需求模块
```
    <img src="http://i11.tietuku.com/f4b06a2a31172c7f.png" height='600' width='600'>
    <img src="http://i11.tietuku.com/8e90fa55bd72b846.png"  height='600' width='600'>

4. 安装nodejs 的 socket.io模块
```
npm install socket.io
```

5. 使用socket.io建立服务端,我把socket的服务端文件专门放一个文件夹chat里
<img src="http://i13.tietuku.com/b03bb9f2db0efdc7.png">
内容：
```javascript
//chat_server.js
var io=require('socket.io')();//建立io
exports.listen= function (_server) { // 将io的监听事件暴露出去，待会在www里面调用，这样io就和www项目监听同一个端口了。
    return io.listen(_server);
};
···
```
    ```javascript
    //这是www项目启动文件
    var app = require('../app');
    var io=require('../chat/chat-server');//添加这一句引入chat_server.js
    var debug = require('debug')('minichat:server');
    var http = require('http');
    ···
    server.listen(port);
    io.listen(server);//添加这一句，socket.io监听webServer，使用同一个端口
    ···
    ```

6. 去下载jquery.js , bootstrap , 客户端的 socket.io.js ，建议使用CDN
  ```html
  <!--放<head>里面 -->
  <link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css">

 <!-- ···省略-->

  <!--放<body>底部 -->
      <!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
      <script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
      <!-- 预防cdn网址文件失效，还准备了本地jq文件 -->
      <script>
          window.jQuery || document.write('<script src="/javascripts/jquery-1.11.1.min.js" type="application/javascript"><\/script>');
      </script>
      <!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
      <script src="//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
      <!--socket.io-->
      <script src="//cdn.socket.io/socket.io-1.3.7.js"></script>
      <script>
          window.io || document.write('<script src="/javascripts/socket.io.js" type="application/javascript"><\/script>');
      </script>
  </body>
  </html>
  ```
7. 如果对bootstrap不熟悉可以参照源码写前端，我对bootstrap也很生疏，也是参照前人代码写的。
下面贴出部分后台和前端socket部分的代码，有兴趣的请到我的[github](https://github.com/zjy01/socketChat/)上fork过去
```
//chat_server.js
var io=require('socket.io')();
exports.listen= function (_server) {
    return io.listen(_server);
};
var chat={
  //省略代码，这个存放了用户数据，还有对用户的操作
};
io.on('connection', function (_socket) {
    console.log(_socket.id+': connection');
    //触发客户端请求用户列表
    _socket.emit('user-list',chat.users);
    //触发客户端提示起聊天昵称
    _socket.emit('set-name');
    //发送服务器信息
    _socket.emit('server-msg',"欢迎来到Quanta聊天室");
    //断开连接
    _socket.on('disconnect', function () {
        console.log(_socket.id+': disconnect');
        if(_socket.nickname != null && _socket.nickname!=''){
            //通知所有_socket触发user-quit
            _socket.broadcast.emit('user-quit',_socket.nickname);
            chat.deleteUser(_socket.nickname);
        }
    });
    //用户加入
    _socket.on('join', function (nickname) {
        var re=chat.addUser(_socket,nickname);
        if(re){
            //通知自己
            _socket.emit('join-done',nickname);
            //通知所有人
            _socket.broadcast.emit('user-join',nickname);
        }
    });
    //修改昵称
    _socket.on('change-name',function(newName){
        var oldName=_socket.nickname;
        var re=chat.changeName(_socket,oldName,newName);
        if(re){
            //通知所有人
            _socket.emit('change-name-done',oldName,newName);
            //通知所有人
            _socket.broadcast.emit('user-change-name',oldName,newName);
        }
    });

    _socket.on('say', function (content) {
        if(!_socket.nickname){
            return _socket.emit('set-name');
        }
        content=content.trim();
        //发送给所有人
        _socket.broadcast.emit('user-say',_socket.nickname,content);
        //通知自己
        return _socket.emit('say-done', _socket.nickname,content);
    });
});
```
    ```
    //客户端chat对象，存放在chat.js里
    var chat={
        _socket:null,
        nickname:null,
        users:[],
        init: function (callback) {
            var self=this;
            var server='http://'+window.location.host;
            self._socket=io(server);
            callback(self._socket);
        },
        setName: function (nickname) {
            var self=this;
            self._socket.emit('join',nickname);
        },
        disconnect: function (nickname) {
            var self=this;
            self._socket.emit('disconnect',nickname);
        },
        changeName: function (nickname) {
            var self=this;
            self._socket.emit('change-name',nickname);
        },
        say: function (content) {
            var self=this;
            self._socket.emit('say',content);
        }
    }
    //省略对对象操作的代码，存放在一个js（controller.js）里，这里就不展示了。
    ```
8. 重申，教程很不详细，[请戳这里找源码](https://github.com/zjy01/socketChat/)，[戳这里看成品]( http://chat.carvenzhang.cn)

#### 结尾
自己尝试做这个的时候，对express的应用更加熟练了。
但其实相比 https://github.com/coofly/qx-chat 里面的源码，虽然我觉得我做出来的结构更加清晰。但同时我也偷懒省略了很多东西。
比如原博主的服务端有加入xss攻击过滤，ie json兼容，我都没有加进去，有意的也可以去看看原来的。
