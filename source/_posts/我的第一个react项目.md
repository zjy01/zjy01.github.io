title: 我的第一个react native项目
date: 2016-06-15 17:01:31
category: javascript #分类
tags:
- javascript
- react native
---
## 前言
当实习生还是很忙的，而且还要准备期末考试，很久没有记下自己的博客。前阵子因为大作业需要，用到了`react native`，现在才想起来一定要记下来给自己。

## 学习react native
`react`因为日常开发有用到，所以也算是比较熟悉了，但是一直没有正式开始接触`react native`。所以这里不讲react了，单单是说在了解了react之后如何学习react native开发。
寒假还没学习react，找实习的时候，一家公司一直跟我说，用了react就可以写多端应用。所以我脑子里一直有react `write one, use anywhere`的概念，知道真正学习了react，并且接触了`react native`之后，
才会了解到react官网所说的`learn one, write anywhere`，react在不同端实现东西，仅仅是语法相同，要用到的组件之类的基本是完全不同的，所以写一套代码想在多端运行，基本是不可能的。



环境搭建就不说了。。自行谷歌。
我学习react native的时候，所写的程序是一个电影列表，react native 中文网有相应的[教程](http://reactnative.cn/docs/0.27/tutorial.html)。
通过这个教程，就可以大致了解到react-native所用到的各种基础组件（View, Text之类的），对flex布局有大致了解。同时，极客学院也有关于实现这个代码的[教程](http://www.jikexueyuan.com/course/1504.html)

## 我的react native 程序
由于学校的手机软件大作业需要，我要亲手做一个app，我对安卓开发并不熟悉，而且时间非常有限。于是我打算选择 react-native。
事实证明我的选择非常正确。。我开发这个app只用了5天时间，包括后台和客户端。。后台是nodejs 的 express框架写的接口， 客户端是react native 写的安卓程序，可以说，我这一整套应用都是用
js来实现的。

### 后台
我拟定的一个应用是广外教务查询（广外是我的学校--广东外语外贸大学），产品功能是可以通过这一款app快速的查询到 学期课表、期末考试成绩、等级考试成绩。这些都是学校教务系统的功能，我只是做了移动版。我并没有
学校方的后台接口，这意味着我要自己搭建一个后台，用作模拟登陆教务系统，并爬取相应的信息。我第一时间想到的就是nodejs，因为jquery的选择器简单好用，最适合提取信息，而nodejs刚好有一个包是[cheerio](https://github.com/cheeriojs/cheerio),
可以在nodejs运行，省去了写正则的时间。对后台代码有兴趣的可以联系我哦。

### 客户端

首先，客户端代码在这里--[gwjw](https://github.com/zjy01/gwjw)，
只要是看了上面那个电影列表的教程，并且对react理解不差的话，一定可以看懂我的程序的，初学者应该也能有所收获。
主要讲一下编写客户端用到的东西。
> react-native-tabbar---一个网友写的通过按底部按钮切换视图界面的组件,需要install
> ScrollView------------可滚动的view，当ScrollView超过高度是，可滚动（是的，View会把超出的部分隐藏）
> ListView--------------展示一些列的子元素
> ToastAndroid----------弹出系统的提示框（黑底在偏底部水平居中的那种），android原生的也叫toast，一般做一些小消息提示
> Picker----------------相当于html的select吧
> TouchableOpacity------普通的可点击按钮
看图
可见，react native 提供了相对丰富的组件。此外同`fetch`做网络请求。
这里可以下载到我写的app[广外教务查询.apk](https://pan.baidu.com/s/1qYvhu6C)
。。（需要数字广外的帐号密码登录）

下见图：

<img src="http://7xrn7f.com1.z0.glb.clouddn.com/16-6-15/72574623.jpg" width="300" />
<img src="http://7xrn7f.com1.z0.glb.clouddn.com/16-6-15/74893793.jpg" width="300" />
<img src="http://7xrn7f.com1.z0.glb.clouddn.com/16-6-15/56652045.jpg" width="300" />
<img src="http://7xrn7f.com1.z0.glb.clouddn.com/16-6-15/81527796.jpg" width="300" />
