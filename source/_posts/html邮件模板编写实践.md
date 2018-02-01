title: html邮件模板编写实践
date: 2016-09-01 11:12:59
category: 前端 #分类
tags:
- gulp
- css
---

## 编写邮件模板
最近在写业务开发的时候，需要去写邮件通知的模板。
积累了一些邮箱编写经验呀呀。

## 邮件html编写要求

邮件编写参照的是 阮一峰大神的[HTML Email 编写指南](http://www.ruanyifeng.com/blog/2013/06/html_email.html)

里面大致提了
> 使用table 布局
> 外链除了图片全部失效
> css使用行内样式为佳

[各邮件对css的支持](http://www.campaignmonitor.com/css/)

<!-- more -->

## 实验

行内样式写起来很痛苦，所以，一开始我打算写的是`<style></style>`标签。
写完后，我向各个主邮箱发送了测试
> gmail.com
> 163.com
> qq.com
> tencent.com

结果如图
<img src="http://i4.buimg.com/567571/499d93d9763eb2d0.gif" width="600" />
图上可见，`QQ`、`tencent`、`163`对`<style>`的支持尚可，但是`gmail`已经完全把`<style>`过滤掉了。

所以需要改用 行内样式 做实验
<img src="http://i4.buimg.com/567571/ecfa68a317a3a1b6.gif" width="600" />

可以看到，样式完全支持了

## 如何写行内样式

如果让自己手动写行内样式，那么就是太痛苦了。
那么，有没有办法自动将自己的样式转成行内样式呢？

一开始，我的想法是，使用js遍历所有dom，获取css值，然后写在dom的style属性里。
可是这个办法我探索了一晚上，没有找到一个函数，只获取css声明过的样式，只能获得所有样式的值。

后台直接google了一下`gulp-inline`，结果搜索出一个`gulp-inline-css`插件，可以将css转成 inline-css，即行内样式，
用法如下
```js
var gulp = require('gulp'),
    inlineCss = require('gulp-inline-css');

gulp.task('default', function() {
    return gulp.src('./*.html')
        .pipe(inlineCss({
            	applyStyleTags: true,
            	applyLinkTags: true,
            	removeStyleTags: true,
            	removeLinkTags: true
        }))
        .pipe(gulp.dest('build/'));
});
```
完美。

顺便提一下，gmail不支持 `position`样式，我发现各个邮箱，就gmail的限制比较多。

## 结尾
有了合适的插件，编写邮件就方便多了。
