title: react-native使用cookie
date: 2016-07-03 19:05:39
category: javascript #分类
tags:
- javascript
- react native

---

## 前言
不久前，因为课程需要，我使用`react native`搭建了人生第一个完整的app－－一个广外的教务查询系统。
祥见[我的第一个react native项目](/2016/06/15/我的第一个react项目/)
总体上,那个项目可以分成三个部分
> 1、手机端app，负责展示数据
> 2、爬虫服务器，负责爬取教务系统的信息，返回给手机端app
> 3、广外的教务系统，显示学生信息
![](http://i1.piimg.com/567571/55e033a5832a747d.png)
在这一个系统中，爬虫服务器担当大任。当客户端传输登录的帐号密码的时候，爬虫服务器进行模拟登录，并保存`cookie`在缓存中，生成一个token返回给app；
app此后凭借token向爬虫服务器请求信息，爬虫服务器根据token选取cookie，向教务系统爬取信息，处理后返回给客户端。
毫无疑问，这是可行的，我也做成功了，凭借app获得了不错的分数。
但是，后来想一想，这并不是最好的解决方案。我依赖于以前写的爬虫程序，运行在服务器上，做成了这一个系统。
<b>但是，手机客户端本来就是一个具有很强处理能力的终端，为什么要把这个工作屈身在一个服务器上呢。应该让每一个客户端做处理，拜托爬虫服务器才对啊</b>
<!-- more -->
## 尝试cookie
于是我在手机程序上开始做尝试。一开始的想法和在服务端上差不多，毕竟都是`js`写的，改动不需要很多。也是想模拟登录，然后获取到`cookie`，进行全局保存。
写到一般的时候，我突然想到，app作为一个客户端，会不会自动保存cookie呢？我对原生`android`了解不多，之前听`quanta`里面的安卓师兄们讨论是说，安卓是不支持保存cookie的。
但是`react native`毕竟是`js`转`android`(或`iOS`)，谁知道在转化过程有没有做处理了。google一番得到模棱两可的说法。看来还是得试验一番。
于是用`php`写了一个简单的设置和获取cookie的程序（这时候还是php简单好用）。一试，好家伙，`react native`直接支持`cookie`的自动保存，不需要添加任何模块。
于是，改写计划就在脑子里生成了。

## 改写程序
`react native`进行网络请求的函数是`fetch`，会自动保存网络请求的cookie，不需要自己做任何的程序处理，就像平时用浏览器上网一样简单。
我针对常用的网络请求--`GET`和`POST`，分别写了一个接口函数。
<b>GET</b>
```js
fetchGet($url, $filed){
        if ($filed) {
            $url += "?" + querystring.stringify($filed);
        }
        return fetch($url)
            .then(res => {
                if (res.ok) {
                    return res.text()
                }
                else {
                    throw res.status + ": 访问目标网络发生错误";
                }
            })
            .then(text => {
                return cheerio.load(text);
            })
    }
```
<b>POST</b>
```
fetchPost: function ($url, $filed) {
        var params=querystring.stringify($filed),
            url=urls.parse($url),
            origin='http://'+url.host,
            headers={
            'Proxy-Connection': 'keep-alive',
            'Content-Length':params.length,
            'Cache-Control': 'max-age=0',
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Origin': origin,
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.12 Safari/537.31',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'gzip,deflate,sdch',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Accept-Charset': 'GBK,utf-8;q=0.7,*;q=0.3'
        };
        const option = {
            method:'POST',
            headers,
            body:params
        };

        return fetch($url, option)
            .then(res => {
                if(res.ok){
                    return res.text()
                }
                else{
                    throw res.status + ": 访问目标网络发生错误";
                }
            })
            .then(text => {
                return cheerio.load(text);
            })
    }
```
然后我们可以在其他接口函数里面调用。
```
//获取课程信息
    getCourse($data){
        let $url=this.getUrl('course');
        if($data){
            var $files={
                "xnxq01id":$data.xq,
                "sfFD":1
            };
            return this.fetchPost($url, $files)
                .then($ => this.dealCourse($))
        }
        else{
            return this.fetchGet($url)
                .then($ => this.dealCourse($))
        }
    }
```
可以看到，一点的cookie处理过程都没有，但是程序是可以完美运行的。

## react-native使用cheerio
说起js端的爬虫，`cheerio`就不得不提了。cheerio模仿jquery的dom操作链式写法，可以是程序很方便地对爬取过来的网页信息进行处理。
上面的post和get接口函数里面，我也使用了cheerio哦。

下面展示一下写法。
```
var cheerio = require("cheerio");
var html="<html><head></head><body><p id='msg'>hello world</p></body></html>";//模拟一个网页信息。
var $ = cheerio.load(html);
console.log($("#msg").text());//hello world
```
但是，只是在`nodejs`端的写法，cheerio里面使用了nodejs的`events`底层模块做事件处理，所以`react native`是不可能直接使用`cheerio`的。
但是，如果不使用`cheerio`，那么在react native 端写爬虫就没有优势了。
于是，上网一查，找到了一个新的模块`cheerio-without-node-native`;
很显然，这个是脱离`node`直接给`react native`用的`cheerio`;
用法也跟上面的一样，只要改变引用的模块就行了。
```
var cheerio = require("cheerio-without-node-native");
var html="<html><head></head><body><p id='msg'>hello world</p></body></html>";//模拟一个网页信息。
var $ = cheerio.load(html);
console.log($("#msg").text());//hello world
```

具体代码见github [gwjw](https://github.com/zjy01/gwjw/tree/v1.1.0)
## 结尾
于此，新的app的架构就发生了翻天覆地的变化了。
![](http://i1.piimg.com/567571/c6a5a4eabdf21fb9.png)
爬虫服务器正式从这一应用中退役了。
一来，减少了网络请求的传播次数，加快了响应速度。
二来，提高了计算速率，有效利用客户端计算能力。
三来，减少服务器的负担。

还有一件事就是，原本我打算让我们应用上线的，可惜申请的时候被驳回了。。毕竟是一个依赖于爬虫的程序，上线就侵我母校（GDUFS）的权啦。