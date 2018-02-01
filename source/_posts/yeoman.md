title: 使用yeoman快速搭建前端项目结构
date: 2016-05-30 11:07:42
category: javascript #分类
tags:
- react js
- 工具
---
## 接触yeoman
最近在慕课网上观看[@Materliu](http://www.imooc.com/u/102030/courses?sort=publish)老师的课程[React实战--打造画廊应用](http://www.imooc.com/learn/507)，
接触到了新的东西--`yeoman`。前端工程师可以通过`yeoman`快速的搭建好一个项目结构。

## 安装
当然，现在前端大部分工具都在node下运行，yeoman也一样，现在还没有搭建nodejs环境的前端工程师已经out啦。
所以：前提条件，已经安装了node，没有安装的，直接google安装就好。
下面是正式的搭建

<!-- more -->
### 安装yeoman
我们可以直接登录[yeoman的官网](http://yeoman.io/)查看[Get Started](http://yeoman.io/learning/)教程。
1. 首先是安装yeoman工具
```bash
npm install -g yo
```
2. 然后我们需要安装相应的生成器（generator(s)）。

生成器的npm报名普遍是`generator-XYZ`格式。
我们可以到[yeoman的生成器页面](http://yeoman.io/generators/)查看需要的生成器。
比如我现在需要的是生成一个react项目，我是搜索并点击进去，会有相应的安装教程。
![](http://i4.buimg.com/78db63dcbf230428.png)
现在我们安装一个生成器
```
# 无redux版
npm install -g generator-react-webpack
```
或者
```
# 有redux版
npm install -g generator-react-webpack-redux
```

### 使用yeoman
现在我们要使用yeoman搭建一个react项目了。我安装的是无redux版的react-webpack生成器，所以我们如下操作
```
# 创建项目文件夹
mkdir reactExample && cd reactExample
# 生成文件结构
yo react-webpack
```
`yo react-webpack`期间也会询问一下配置，比如是否使用预编译的css之类的。选择完成后，一个完整的react项目出现了。
![](http://i2.buimg.com/fd010043b4267034.png)
里面有项目文件，还有测试文件。

### 运行项目
```
npm start
```
运行了新建的项目后，可以看到如下画面。他们给自己打了广告
![](http://i2.buimg.com/4a0e30c883121375.png)

## 结尾
yeoman还有很多的功能运用，包括测试、生成dist文件、持续插入新模块，使用，大家看看官方文档吧。
这里仅仅简单介绍了利用yeoman生成一个项目的事例。
