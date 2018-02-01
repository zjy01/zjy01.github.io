title: xss总结记录
date: 2017-02-17 11:35:57
category: 每周积累计划
tags:
- 前端
- 安全
---

## 认识XSS
最近工作小组上，集中精力提高安全意识。而XSS作为全端安全中最常见的问题之一，我们也做了着重的学习。
`XSS`全称跨站脚本（Cross Site Scripting）攻击，看起来缩写应该是`CSS`，但是`CSS`已经普遍指层叠样式表（Cascading Style Sheets），所以呼作`XSS`。
<!-- more -->

跨站脚本攻击是一种常见的WEB安全漏洞，它指攻击者可以在页面中注入恶意脚本，可被浏览器解析执行，当受害者打开被攻击的页面时，达到窃取用户信息、传播、钓鱼等的效果。

## XSS的生成
XSS的生成，通常依赖于一个注入点，指的是攻击者可控内容的提交位置。
日常最常接触到的就是输入框了，任何人都可以在输入框中输入任意内容，然后提交。
![](http://p1.bqimg.com/567571/c3b31242629b55d6.gif)
但是，还有很多我们平常没有留意到，可能会被使用的注入点：
```vim
1、GET 请求参数
2、POST请求参数
3、UA
4、Referer
5、URI
...

一切可以提交数据到页面的点都称作向量
```

`XSS`漏洞的产生，都是基于<font color="red">对非预期输入的信任</font>。
开发者对用户输入的数据保持了信任态度，无条件或者预防不足地显示了用户输入的内容，就有可能发生安全问题。

## XSS分类
最常见的`XSS`分类

+ 反射型
+ 存储型
+ DOM型

### 反射型
反射型XSS也叫非持久型XSS，最常见在搜索框中（或者是构造在网站的某个GET参数的值中）。
比如：
```
http://example.xss.com/search.php?word="><script>alert(1)</script>
```

如果模拟一个搜索页，假设搜索页如下构造
```PHP
/**
 * 很多搜索页会在搜索框显示搜索值
 */
  <input type="search" value="<?php echo $_GET['word'] ?>"/>
```
对于上面的网址，就会输出html如下
```html
<input type="search" value=""><script>alert(1)</script>"/>
```
一句script就生成了。
这就是**反射型XSS**，通过提交内容，但是不经过数据库存储，直接反射显示在页面上。

### 存储型
存储型XSS也叫持久型XSS，意思是输入值会经过存储，以后每次访问该页面（或者是使用到该输入的某些页面），都会触发`XSS`。
比较常见的就是论坛回复、发帖

1. 输入内容 -> 存入数据库
2. 任意用户访问 -> 从数据库取出
3. 发生攻击

### DOM型

其实DOM型也属于反射型的一种，不过比较特殊，所以一般也当做一种单独类型。
如我上图的那个动图，就是**DOM型**。
即不经过后端渲染，直接由js操作引发的`XSS`。

### 其他类型的XSS
以下XSS涉及内容比较大，需要针对特定环境，没有经过系统学习。
+ mXSS 突变型XSS
+ UXSS 通用型XSS
+ Flash XSS
+ UTF-7 XSS
+ MHTML XSS
+ CSS XSS
+ VBScript XSS

## XSS防御
一般来说，XSS防御就是不信任任何用户数据的数据。
《给开发者的终极XSS防御备忘录》

下面是提供一个XSS游戏
+ http://prompt.ml/ 答案：https://github.com/cure53/xss-challenge-wiki/wiki/prompt.ml

最后，非常感谢我厂`youzuzhang`的文章，带我生动认识了XSS，本文基本沿袭其思路。
