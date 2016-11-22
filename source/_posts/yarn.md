title: yarn -- 新型包管理器
date: 2016-11-21 19:37:00
category: 前端 #分类
tags:
- nodejs
---

## node 包管理器
随着`nodejs`的出现，另外两个东西也进入了前端大众的视野--`CommonJS规范`、`node 包管理器`。

说到`node 包管理器`，就不得不提`npm`，毕竟是官方标配，安装了`node`就自带了`npm`。
`npm + nodejs`，构成了一个宏伟了前端世界。
当然，出于各种原因，市面上还存在着各种包管理器，比较著名的端资源包管理器 -- 'bower'；
镜像为主的`cnpm`、`tnpm`；
工具提供的`rnpm`、`spm`；
还有很多其他的（我也没用过）：`jamjs`、`component`。

今天，想向大家介绍的是[yarn](https://github.com/yarnpkg/yarn)-- 2016.10.11 Facebook 正式发布的 `javascript 包管理器`， 用来替代`npm`。
我在一次偶然的升级`react native`的时候，接触了`yarn`(`react native`已经将自家的`yarn`融入安装环境中)。
一遍文章[《Yarn: A new package manager for JavaScript》](https://code.facebook.com/posts/1840075619545360)讲述了`yarn`的诞生历程。

<!-- more -->
## 简介

`yarn` 是Facebook与 Exponent、 Google 和 Tilde 进行合作，开源的 JavaScript 包管理器。
旨在针对`npm`使用过程中的一些问题，提供更好的包管理方式，同时兼容 `npm` 与 `bower` 工作流。

## 特点

### npm的问题

+ 安装依赖包不稳定。
  不同平台、不同用户、不同次安装的依赖可能不一样（因为`npm`的依赖安装顺序具有不确定性）。
+ 安装耗时过长。
  `npm`在安装包的时候，采取队列式安装：只有前一个包安装完，才会安装下一个包。一个包失败，安装任务结束。
+ 安全性（这方面认识不是很深刻）


### yarn的亮点

+ 稳定的依赖分析。
  `yarn`会自动生成一个`yarn.lock`文件，记录包版本，把安装的软件包版本锁定在某个特定版本，并保证所有机器安装结果一样；对于不匹配的依赖版本的包创立一个独立的包，避免创建重复的

+ 急速安装。
  `yarn`采用了新的算法来保证速度；同步执行所有任务；一个包安装失败的时候，会自动重试；对于已经安装过的包，会做全局缓存，避免重复下载（可实现离线安装）。

+ 安全性。
下载前会检查签名和包完整性

+ 同时，`yarn`还优化了cli信息输出，命令行简介语义化等。


### 安装过程

借用译文[《Facebook 发布了新的 Node 模块管理器 Yarn，或取代 npm 客户端》](http://blog.zhangjd.me/2016/10/12/yarn-a-new-package-manager-for-javascript/)
> 1、 处理： `Yarn` 通过向代码仓库发送请求，并递归查找每个依赖项，从而解决依赖关系。  
> 2、 抓取： 接下来，`Yarn` 会查找全局的缓存目录，检查所需的软件包是否已被下载。如果没有，Yarn 会抓取对应的压缩包，并放置在全局的缓存目录中，因此 Yarn 支持离线安装，同一个安装包不需要下载多次。依赖也可以通过 tarball 的压缩形式放置在源码控制系统中，以支持完整的离线安装。  
> 3、生成： 最后，`Yarn` 从全局缓存中把需要用到的所有文件复制到本地的 node_modules 目录中。

## 安装使用
`yarn`保持现有的工作流成特性，使用`npm`仓库。
所以基本是无代价兼容现有前端项目的，可以放心使用。

### 安装
```
npm install -g yarn
```
是的，使用`npm`安装哈，简单便捷，和和气气。

可以配置一下国内仓库
常用的淘宝镜像
```
yarn config set registry https://registry.npm.taobao.org
```
厂内的tnpm镜像
```
yarn config set registry http://r.tnpm.oa.com
```

### 命令行
`yarn`的命令行功能基本与`npm`处于对等状态。

常用命令行对比：
#### 初始化
```
yarn init // npm init
```

#### 安装全部依赖
```
yarn // npm install
```

#### 安装某个依赖
```
yarn add react        // npm install react --save
yarn remove react     // npm uninstall react --save
yarn add react --dev  // npm install react --save-dev
yarn global add react // npm install react -g
```

#### 更新依赖
```
yarn upgrade react    // npm update react --save
```

#### 运行
```
yarn run start        //npm run start
```

## end
`yarn`才刚刚起步，截致博文时间的时候，版本是`0.17.6`，github issues也有很多反馈（目前我还不知道有什么bugs）。
但是，`yarn`确实受到很多人的关注和期待。
我也好好好好期待。
