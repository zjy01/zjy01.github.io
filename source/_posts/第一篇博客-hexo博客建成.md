title: 第一篇博客---hexo博客建成
date: 2015-10-05 16:36:54
category: 博客 #分类
tags:
- hexo
description: 零星记录自己使用hexo建成博客网站的过程
---
## 动机
**********************
<p>　　在国庆期间，时间很充裕，刚好阿里云有一个云翼计划，大学生9.9一个月就可以拥有一台自己的服务器。我趁自己有点闲钱就入手了一个。</p><p>　　入手服务器后，不能一直用ip登陆吧，我便又在阿里云买了一个域名，8块钱一年（首年）。
刚有社团ios方向的一个伙伴说自己在github上建了一个博客，我没有试过，而且早就有建博客的念头了。
于是便打算也在个github建一个。</p>

## 行动
**********************
上网一查，原来有工具可以直接做一个静态博客的。心里想太简单了，也把工具定位在hexo。
然而构建其中却麻烦不断。我查了很多网站，这里提供一个对我帮助很大的网站。

* http://cnfeat.com/2014/05/10/2014-05-11-how-to-build-a-blog/

虽然这个网站的博主如今已经改用`keyll`做博客了，但是下面介绍的步骤依然对用`hexo`做博客帮助很大。

但是时代在进步，我依照上面的教程依然遇到了问题。
下面我仅指出不一样的地方供参考。

1. hexo 的安装使用最好直接参照[hexo官网](https://hexo.io/)，现在hexo分离出命令行工具 hexo-cli了。

2. 由于我的电脑安装不了github for windows,只安装了git bash.而hexo的deploy操作真是需要ssh key,
所以ssh key的操作一定要按照教程来。

3. windows 用户的 hexo deploy 操作一定要在git bash上面进行，因为本地命令好没有git，如果安装了github for windows另当别论

4. 提供一下我的deploy设置，我被这个坑了好久
```css
# Deployment
## Docs: http://hexo.io/docs/deployment.html
deploy:
type: git
repo: git@github.com:zjy01/zjy01.github.io.git
branch: master
```
    其中要注意冒号后都是留一个空格的，`type:`是git，仓库地址用`repo:`表示。
    如果设置错误了会有`Not a git repository (or any of the parent directories): .git`之类的报错，网上有教程提议git init，
    别相信，我试了，结果提交到github的完全不是生成的静态文件。

5. 还有DNS我是直接用二级域名表示的，所以直接只设了一个，没有教程那么麻烦，看图
 <img src="http://i11.tietuku.com/87d8fb36ba1a79f1.png">

6. hexo说到底该是基于nodejs,博客中文乱码的时候记得把博客的.md文件转成utf-8格式，还有如果是使用webstorm的，还要在webstorm转码一次，
否则它还是默认用anci编码打开,否则你编辑完保存，md编码又变了

7. github只提供300m的博客空间，所以为了节省空间，图片都使用[图床](http://tuchuang.org/)保存然后接网址过来。

## 结尾
*******************
总之最后还是做成了，成就感不免还是有的。也是一个有博客的男人啦。