title: gulp流程控制
date: 2016-08-29 20:10:00
category: nodejs
tags:
- gulp
---

# 烂笔头
  很久没有写博客了。
  记得最近的实习生活都颇有收获，一直想着记下什么，当真正想写的时候，才发现什么都不记得了。
  所有，上周刚刚有了一点小收获，赶紧得记下来。

# 情况

   周一在打包一个文件的时候，打包引入后，发现文件报错了。
   大致是因为我打算将关于`webpack`的部分整合到`gulp`里面的(用的是`webpack-stream`，我也是最近才知道，`webpack-stream`是`gulp-webpack`的进阶版)，整合完成后，进行打包。
   原来的打包文件是这样写的：
   ```js
   gulp.task('dev',function(){
   //希望'webpack_test','devconcatcss','devsass'顺序执行
        gulp.run('webpack_test','devconcatcss','devsass'/*,...*/);
   });
   ```
   ![](http://i4.buimg.com/567571/e0e122ad0dbfa518.png)
   我是将`webpack`打包放在打包列表的首位的，结果看`cmd`里面的打包流程序列，`webpack`任务最先开始，然后其他任务很快跟上（毫秒级），所有任务都完成后，
   `webpack`打包结果才出来，我意识到是控制流程有问题。而且系统提示`gulp.run`过旧了。于是打算修改控制流程。

   <!-- more -->
# gulp流程控制

我们期待的结果是

  ```
  //webpack_test先执行，任务彻底结束后，执行devconcatcss，任务彻底结束后，执行devsass...
  ```
## 利用 gulp.task 依赖
  一开始是打算使用依赖关系
  ```
  gulp.task('dev',['webpack_test','devconcatcss','devsass'/*,...*/]function(){
          console.log('dev finish')
     });
  ```
  ![](http://i4.buimg.com/567571/a4b5dd8ac4b82d61.png)
  结果发现，虽然`dev`在最后才执行,但是依然是`dev finish`后，webpack打包结果才出现，所以控制失败。

## gulp.task 添加 return

  查阅资料后发现，我们之前的任务编写有问题
  ```
  //之前我们是这样编写的
  gulp.task('webpack_test', ()=>{
       gulp.src('')
       //...
  })

  //而别人是这样子写的
  gulp.task('webpack_test', ()=>{
       return gulp.src('')
          //...
  })
  ```
  <b style="color: red">划重点</b>,一个`return`有什么用呢？ 原来 `return gulp.src...`是通过返回一个`stream`，来让控制程序知道当前任务的进行情况。
  这样就可以知道当前依赖任务是否完成，执行下一任务。

  于是我就给所有任务加上了`return`
  ![](http://i4.buimg.com/567571/038967d7cd92eb0a.png)
  流程中发生了好的情况。

  `webpack_test`任务在 dev任务之前结束了，<span style="color: red">但是[数组]中的任务没有先后依赖关系</span>。
  如果我通过
  ```
  gulp.task('before1', 'before2')
  gulp.task('before2', 'before3')
  ...
  ```
  这样的方式一个个加控制，就太麻烦了。

## 引入插件 gulp-sequence
  于是我 引入了新的组件`gulp-sequence`。
  ```
  gulp.task('dev',['clean', 'webpack_test'],function(cb){
      /*
      流程说明：
      clean,webpack_test 同时执行，执行完成后，执行 gulpSequence
       gulpSequence： devconcatcss->devsass->...->images顺序执行
      */
      gulpSequence(
          'devconcatcss',
          'devsass'
          /*, ... */
      )(cb);
  });
  ```
  ![](http://i4.buimg.com/567571/ac94312c284c10ea.png)
  流程终于成功了，一切都按照自己预想的进行了。

## 结尾

遇到问题，就有收获