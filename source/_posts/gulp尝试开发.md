title: gulp尝试开发
date: 2016-03-10 11:09:02
category: nodejs
tags:
- nodejs
- gulp
---

### 背景
这是挺久之前的事情了，还是觉得先记录下来，免得自己忘记了。
在实习的公司做web开发，gulp 是经常用到的，可是我做的不仅仅的前端，还包括后台，
所以将前端文件移至后台这种事当然也需要我做啦，用gulp，但是，文件移至后台目录后，资源文件的路径必须修改，
（我做的后台的是用express做的），一时间，没有找到适合的插件，于是我萌生了自己开发一下gulp插件的想法。

<!-- more -->
### 开发流程
参考了几篇博客  
[Gulp插件制作指南](http://www.u396.com/gulp-plugin-guildlines.html)  
[Gulp：插件编写入门](http://www.cnblogs.com/chyingp/p/writting-gulp-plugin.html)  

先来看一下插件的全部代码
```js
'use strict';
var gutil = require('gulp-util');
var through = require('through2');
const PLUGIN_NAME = 'gulp-url-replace';
module.exports = function (options) {
    var pattern = [];
    var testClose = /\/$/;
    var pp;
    for (pp in options) {
        var odir = {};
        if (testClose.test(pp)) {
            odir.o = new RegExp(pp, 'g');
        }
        else {
            odir.o = new RegExp(pp + '/', 'g');
        }

        if (testClose.test(options[pp])) {
            odir.n = options[pp];
        }
        else {
            odir.n = options[pp] + '/';
        }
        pattern.push(odir);
    }

    return through.obj(function (file, enc, cb) { //流/编码/回调

        if (typeof options !== 'object') {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        var content = file.contents.toString();
        pattern.forEach(function (r) {
            content = content.replace(r.o, r.n);
        });
        file.contents = new Buffer(content);


        this.push(file);
        cb();
    });
};
```

省略出主干就是
```js
//引入依赖
var gutil = require('gulp-util');
var through = require('through2');
//暴露主函数
module.exports = function (options) {
    //返回处理流 Node Stream
    return through.obj(function (file, enc, cb) {
        // 主体处理
    });
};
```

下面分步解释：
#### 引入依赖模块
```js
ar gutil = require('gulp-util');
var through = require('through2');
```
> gulp-util： 错误日志打印模块，按照gulp的统一规范打印错误日志  
> through2： Node Stream的简单封装，目的是让链式流操作更加简单  

#### gulp 的 through2 开发标准样例
```js
const PLUGIN_NAME = 'gulp-url-replace';
module.exports = function (options) {
    return through.obj(function (file, enc, cb) {

        // 如果文件为空，不做任何操作，转入下一个操作，即下一个 .pipe()
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        // 插件不支持对 Stream 对直接操作，跑出异常
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        // 将文件内容转成字符串
        var content = file.contents.toString();
        
        //对文件内容处理
        content = dosomething(content);
        
        // 然后将处理后的字符串，再转成Buffer形式
        file.contents = new Buffer(content);

        // 下面这两句基本是标配啦，可以参考下 through2 的API
        this.push(file);

        cb();
    });
};
```

以上两步就是开发gulp插件的步骤了

#### gulp-url-replace 核心逻辑
```js
//正则保存的数组
var pattern = [];
//测试 源路径是否以“/”结尾
    var testClose = /\/$/;
    var pp;
    // odir参数正则话，并统一以“/”结尾
    for (pp in options) {
        var odir = {};
        if (testClose.test(pp)) {
            odir.o = new RegExp(pp, 'g');
        }
        else {
            odir.o = new RegExp(pp + '/', 'g');
        }

        if (testClose.test(options[pp])) {
            odir.n = options[pp];
        }
        else {
            odir.n = options[pp] + '/';
        }
        pattern.push(odir);
    }
    
    //省略
    
    //转化成字符串
    var content = file.contents.toString();
    //循环正则替换
    pattern.forEach(function (r) {
        content = content.replace(r.o, r.n);
    });
    //转化回node stream
    file.contents = new Buffer(content);
    
    //省略
```

如此，就完成了html中资源路径的替换


#### 注意点
gulp的流处理是逐个处理的
例如
```js
gulp.src('./1.txt,./2.txt')
.pipe(replace())
...
```

那么 replace() 就会执行两次，两次传入的 file 分别是 1.txt和2.txt，
而不是两个文件一起传进来

#### 使用

```shell
npm install gulp-url-replace --save-dev
```

```js
var gulp = require('gulp');
var replace = require('gulp-url-replace')
gulp.task('move', function(){
    gulp.src('./*.html')
    .pipe(replace({
                      'lib/': '<%= stHost %>/node/public/lib/',
                      'img/':'<%= stHost %>/node/public/img/',
                      'css/': '<%= stHost %>/node/public/css/',
                      'js/': '<%= stHost %>/node/public/js/',
                  }))
    .pipe(gulp.dest("../production/views/"))
})
```

#### 总结
虽然写法，publish，测试方面都不规范，但是，也是学到了gulp开发的一点知识，
以后可以自己本地做些可能用到的gulp插件
目前源代码已经发布在 github上
[gulp-url-replace](https://github.com/zjy01/gulp-url-replace)


