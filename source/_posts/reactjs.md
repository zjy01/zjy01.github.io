title: reactjs
date: 2016-01-26 12:59:14
category: javascript #分类
tags:
- react js
---
### react js
最近在学习react js，ReactJS是Facebook开发的用于构建用户界面的JAVASCRIPT库，利用其可以实现组件式开发。

### JSX
虽然JSX不是ReactJS所必须的，但是使用jsx无疑可以加快React的组件开发速度

### 所需文件
我们大概清楚我们开发ReactJS需要的文件的，
首先的官方所需的<code>react.js</code> 和 <code>react-dom.js</code>
然后是解析JSX语法所需要的<code>jsxtransform.js</code>,
后来因为迎接ES6,舍弃了jsx，改用babel，也是需要引入一个文件。

加上自己写的各种组件，如此看来，网页的js引入将相当多，不利于管理。
而且像解析jsx或者ES6->ES5这样的工作，完全可以在开发时完成，而不用在使用时由客户端转译，影响效率。

基于种种原因，我们需要用到一些其他工具。而我挑选赖webpack

<!-- more -->
### webpack
<pre>
Webpack 是当下最热门的前端资源模块化管理和打包工具。
它可以将许多松散的模块按照依赖和规则打包成符合生产环境部署的前端资源。
还可以将按需加载的模块进行代码分隔，等到实际需要的时候再异步加载。
通过 loader 的转换，任何形式的资源都可以视作模块，
比如 CommonJs 模块、 AMD 模块、 ES6 模块、CSS、图片、 JSON、Coffeescript、 LESS 等。
</pre>

我因为一直在使用gulp，而选择了 webpack-stream 这样一款 gulp 模块。

#### 安装

首先保证安装了nodeJs，然后可以开始下面的教程

1. 首先需要安装 gulp工具
```bash
sudo npm install -g gulp 
```

2. 然后在自己的项目文件夹中安装gulp模块依赖
```bash
npm install --save-dev gulp
```

3. 在项目根目录下创建一个名为 gulpfile.js 的文件：
```bash 
var gulp = require('gulp');
gulp.task('default', function() {
  // 将你的默认的任务代码放在这
});
```
 gulp安装完成

4. 安装webpack-stream
```bash
npm install --save-dev webpack-stream
```

5. 填写配置文件 webpack.config.js,具体请了解官网
```js
module.exports = {
    entry: './public/javascripts/main/app.jsx',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'jsx-loader?harmony'
            },
        ]
    },
    watch:true
};
```

6. 建立gulp任务
```js
var gulp = require("gulp"),
    webpack = require("webpack-stream"),
    webpackConfig = require("./webpack.config.js");
gulp.task("webpack", function () {
    gulp.src("./public/javascripts/")
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest("./public/javascripts/build/"));
});
```

7. 使用

建立一个banner.jsx文件

```js
var banner;
banner = React.createClass({
    render: function () {
        var $li = this.props.items.map(function (v, i) {
            return(
                <li>
                    <a href="javascript:;">
                        <img src={v.img} />
                        <p>
                            {v.icon?<span className="gathering-icon">{v.icon}</span>:''}
                            <span className="title-msg">{v.title}</span>
                        </p>
                    </a>
                </li>
            );
        }, this);
        var style={
            width:this.props.items.length*10 + 'rem'
        };
        return(
            <div className="collect-banner">
                <ul style={style}>
                    {$li}
                </ul>
            </div>
        );
    }
});
module.exports = banner;
```

再在content.jsx文件中引用它

```js
    var content,
         Banner = require("./banner");
     
     content = React.createClass({
         render: function () {
             var $ban=[
                 {
                     img:'http://7xiu2h.com2.z0.glb.qiniucdn.com/FlKKdfH1XlzAW0bgZ4bfTS-5abNS',
                     icon:'派对',
                     title:'全能天王古惑仔-“包皮哥”强势登陆'
                 },
                 {
                     img:'http://7xiu2h.com2.z0.glb.qiniucdn.com/FlKKdfH1XlzAW0bgZ4bfTS-5abNS',
                     icon:'红包',
                     title:'全能天王古惑仔-“包皮哥”强势登陆'
                 },
             ];
             return(
                 <div>
                     <Banner items={$ban}/>
                 </div>
             );
         }
     });
     module.exports = content;
```

### 结果
我们运行 webpack任务，会生成我们配置的<code>bundle.js</code>文件。
我们在项目中引用官方所需的<code>react.js</code> 和 <code>react-dom.js</code>和生成的<code>bundle.js</code>文件即可