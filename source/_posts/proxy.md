title: ubuntu下的apache端口反向代理
date: 2015-10-05 22:59:24
category: 后端 #分类
tags:
- linux
---
### 前言
　　在国庆期间，在阿里云上买了服务器和域名，自己这用node.js做了一个即时聊天系统，挂在2000端口上。
可是每次都在网址后面加一个`:2000`显得有点奇怪，也很麻烦，于是就想到了反向代理。
之前在管理社团服务器的时候，有过在nginx上捣鼓虚拟主机的经验，但是对于apache，我没有太多配置经验。
<!-- more -->
### 行动
　　一开始当然是百度啦。好吧，我很少上谷歌，虽然我有师兄借我的代理服务器账号。
又是因为各种版本问题，我吃尽了苦头。
>ubuntu **14.04** 阿里云版
>apache **Apache/2.4.7 (Ubuntu)**

直接说一下我完成的过程的。
1. 一股脑为apache开启一大堆模块先。其实我也不知道那个模块是干什么的。但是我之所以弄了很久都没有弄好。
就是因为我之前挑了一个教程里面值需要加载3个模块，结果访问网址一直提示服务器没有提供正确路径。
后来一次性加载这些模块就成功了。
```bash
a2enmod proxy proxy_ajp proxy_balancer proxy_connect proxy_ftp proxy_http
```
2. 找到服务器配置文件的文件夹。ubuntu的都在`/etc/apache2/`下面
```bash
cd /etc/apache2/sites-available/
ls -all
```
    这时候应该可以看到*.conf文件，可能是`000-default.conf`，他就是默认的配置文件。
    我们可以新建一个配置文件，用来配置我们的反向代理端口
    ```bash
    vi chat.zjy.space.conf
    ```
    其实文件名可以随便起，后缀保留.conf就好，但我为了好识别，直接把我要代理到端口的网址作为文件名
    然后在这个`hat.zjy.space.conf`里写入一下代码。
    ```txt
    <VirtualHost *:80>
    ServerName chat.zjy.space
    ServerAlias chat.zjy.space

    ProxyPreserveHost On
    ProxyRequests Off

    <Proxy *>
    Order deny,allow
    Allow from all
    </Proxy>

    ProxyPass / http://42.96.203.150:2000/
    ProxyPassReverse / http://42.96.203.150:2000/
    </VirtualHost>
    ```
    其中，chat.zjy.space 是我要代理的网站，42.96.203.150是我服务器的ip，2000是我要指向的端口。
    这样，配置文件就写好了。

3. 接下在退出vim后，仍然是在/etc/apache2/sites-available/文件夹里,运行a2ensite指令挂载这个配置文件，
然后重启服务器。
```bash
a2ensite chat.zjy.space.conf  #挂载配置
service apache2 reload  #重启服务器
```

4. 这时候已经可以通过http://chat.zjy.space 访问到 2000端口的网页。
如果想要卸载这个代理，可以运行 a2dissite指令
```
a2dissite chat.zjy.space.conf
service apache2 reload
```

### 结尾
自己管理一个服务器的感觉还是很棒的，可以为所欲为。
现在阿里云正在搞云翼计划，买一个月的服务器只要9.9元，买一年的只要99元。
而域名首年便宜的只要5元