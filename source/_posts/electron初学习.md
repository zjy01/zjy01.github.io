title: electron初学习
date: 2016-07-21 11:17:59
category: 前端
tags:
- nodejs
- electron
---
## 什么是electron
Electron 可以让你使用纯 JavaScript 调用丰富的原生 APIs 来创造桌面应用。
Electron 集合了 nodejs + Chromium 浏览器浏览器；这意味着前端开发者可以通过web的方式构建视图，通过nodejs去进行io操作，甚至可以在html文档中直接调用nodejs功能；
这可以使前端开发者以一种非常熟悉的方式去开发一款桌面应用。

当electron启动一个应用的时候，最创建一个主进程（就是启动的入口文件）。这个主进程负责与你系统的GUI交互，并为你的应用创建GUI（就是新建窗口）；
借用[Get社区](http://get.ftqq.com/)的一个图片进行流程展示，一定要看哦；
<img src="http://newsget-cache.stor.sinaapp.com/0b998dc2ebd3441852e5423fc8e723c1.png" width="500"/>
继续向下看：
<!-- more -->
## 入手electron
一开始认识electron的时候，因为我一直在写react的缘故，我以为electron也会需要一大堆的辅助组件、复杂的构建流程，但是不是的，electron的使用出奇简单；
electron只需要一个核心组件`electron-prebuilt`就能运行，当然，你一定是已经安装了`nodejs`的；
习惯来说，我会全局安装一个`electron-prebuilt`
```bash
npm install -g electron-prebuilt
```
并在electron项目的文件夹中安装一个本地组件
```
npm install --save-dev electron-prebuilt
```
我们先驾起一个最简单的应用试一试:
新建 main.js
```
'use strict';
const { app, BrowserWindow } = require('electron');
let mainWindow;
app.on('ready', () => {
	mainWindow = new BrowserWindow({
	    width: 600,
	    height: 400
	});
	//引入视图文件
	mainWindow.loadURL("https://www.baidu.com");
});
```
在项目文件夹，运行
```
electron main.js
```
就可以看到一个桌面应用色生成，并加载了百度首页作为视图；

我是通过Get社区的[用Electron开发桌面应用](http://get.ftqq.com/7870.get)的教程来初步学习electron的，大家也可去过去膜拜，过程还是很详细的；
但是因为教程较老，很多语法已经不适用了。
比如
```
var app = require('app');
var BrowserWindow = require('browser-window');
```
应该改为
```
const { app, BrowserWindow } = require('electron');
```
等等。
我在github上写了一个新版的，不过没有tag步骤，大家可以参考我的，使用教程里的一步步深入。
[https://github.com/zjy01/electron-sound](https://github.com/zjy01/electron-sound)

当然，我自己也一步步搭建了一个小应用，大家也可以透过这个应用的搭建步骤去初步了解到electron。
我们会接触到：
> Yeoman 生成器
> 在静态js资源中直接使用node模块
> 添加任务栏上的图标和菜单（Tray，Menu）
> ipc通讯
> 右键菜单、粘贴板clipboard、弹窗dialog
> 按钮监听


## electron -- 二维码生成器
### Yeoman
一般接触一个新的应用，我们还可以通过Yeoman去快速搭建一个项目结构。
关于Yeoman的介绍我在之前的博客里面写过：[使用yeoman快速搭建前端项目结构](/2016/05/30/yeoman)
如果你还没有安装`Yeoman`,我们可以通过下面的命令安装
```
npm install -g yo
```
接着我们安装electron项目的生成器
```
npm install -g generator-electron
```
这样，我们就可以用yeoman去搭建一个electron项目了；
```
# 创建项目文件夹并进入（也可以右键创建）
mkdir electron-qr && cd electron-qr
# 生成文件结构
yo electron
# 耐心等待 npm install 完成
```
得到以下结构图
![](http://ww4.sinaimg.cn/large/0060lm7Tgw1f61j3vybl6j305w05z74y.jpg)
改一改目录结构，新建一个js，成以下模样
![](http://ww3.sinaimg.cn/large/0060lm7Tgw1f61j71r4o5j306z07kgmf.jpg)
当然，要记得在html中引入index.js
```
<script src="index.js"></script>
```
并在主进程文件中修改视图文件地址
```
win.loadURL(`file://${__dirname}/app/index.html`);
```
可以打开看看啦
```
# 项目根目录执行
electron .
```


### 在静态js资源中直接使用node模块（添加生成二维码功能）
*****************
通过修改
`index.html` 和 `index.css`，使得视图如下所示
![](http://ww4.sinaimg.cn/large/0060lm7Tgw1f61jd63ecnj30go0dbjsb.jpg)

nodejs有一个模块`qr-image`可用于快速生成二维码，我们先安装
```
npm install --save qr-image
```
接着，我们编写`app/index.js`
```
const qr = require('qr-image'),//二维码模块
	qrInput = document.getElementById('msg'),//信息输入框
	qrBtn = document.getElementById('qr-btn'),//生成二维码按钮
	qrImg = document.getElementById('qr');//二维码图片区

let imgOfQr;
qrBtn.addEventListener('click', function () {
	let msg = qrInput.value;
	imgOfQr = qr.imageSync(msg, {//生成png
		'margin':1,
		'size':10,
		'ec_level':'Q'
	});

	qrImg.src = 'data:image/png;base64,'+imgOfQr.toString('base64')
});
```
如此，我们的主体功能就完成了，已经可以输入文字，生成二维码了，如此简单
![](http://ww3.sinaimg.cn/large/0060lm7Tgw1f61jmk3ip8j30gl0d6q46.jpg)

下面我们来添加一下桌面应用特有的功能


### 添加任务栏上的图标和菜单（Tray，Menu）
**********************
`remote.Tray`可以为窗口建立一个任务栏的小图标；
`remote.Menu`可以编写一个菜单；
我们利用这两个组件做一个小图标出来。
首先选用一张小图片，我就用我博客的icon啦；
然后在`app/index.js`继续添加代码
```
   const path = require('path');
   const { remote } = require('electron');
   const { Tray, Menu } = remote;
   const trayIcon = new Tray(path.join(__dirname,'logo.ico'));
   const trayMenuTemplate = [
   	{
   		label: "版本",
   		submenu:[
   			{
   				label: "electron: " + process.versions.electron
   			},
   			{
   				label: "chrome: " + process.versions.chrome
   			},
   			{
   				label: "nodejs: " + process.versions.node
   			},
   		]
   	},
   	{
   		label: "退出"
   	}
   ];

   const TrayMenu = Menu.buildFromTemplate(trayMenuTemplate);
   trayIcon.setToolTip("右键查看信息");//小图标hover提示
   trayIcon.setContextMenu(TrayMenu);//设置小图标菜单
   Menu.setApplicationMenu(TrayMenu);//顺便可以设置一个应用顶部的菜单
```
如图
![](http://ww1.sinaimg.cn/large/0060lm7Tgw1f61l5pznvoj308003c3yn.jpg)
——————————————————————
![](http://ww2.sinaimg.cn/large/0060lm7Tgw1f61l5q73j1j30fk05it98.jpg)



### ipc通讯
***********************
为了安全，也为了方便管理，很多东西需要在主进程处理（比如关闭、新建窗口），
那么，如果在渲染进程（应用窗口）中，与主进程进行通讯，使主进程在适当的时候处理事务呢？
那就是通过ipc（信息处理中心）啦；
在主进程中，使用`ipcMain`，在渲染进程中，使用`ipcRenderer`；
比如，
> 我们在上一步的“退出”添加功能，使其关闭窗口；
> 当点击任务小图标的时候，窗口能得到焦点

在`app/index.js`中修改
```
...
const { remote, ipcRenderer } = require('electron');
...
    {
        label: "退出",
        //click在ApplicationMenu中是不适用的，只能在任务小图标中使用
        click: () => ipcRenderer.send('main-render-quit') //发送信息
    }
...
trayIcon.on('click', () => ipcRenderer.send('main-render-focus'));

```
在主进程文件`index.js`中修改：
```
const { app, BrowserWindow, ipcMain } = require('electron');
...
ipcMain.on('main-render-quit', () => app.quit() );//监听信息，如果有'main-render-quit' send 过来，就执行后面的函数
ipcMain.on('main-render-focus', () => mainWindow.focus() );
```

### 复制、保存二维码（右键菜单、粘贴板clipboard、弹窗dialog）
现在我们已经可以生成二维码了，但是如果我们想把二维码发给别人呢？我们需要使用复制功能；

首先引入右键菜单所需的`MenuItem`， 还有粘贴板`clipboard`，图片元素 `nativeImage`，系统文件弹窗`dialog`，文件系统模块`fs`
在`app/index.js`中修改
```
...
const { remote, ipcRenderer, clipboard, nativeImage } = require('electron');
const { Tray, Menu, MenuItem, dialog } = remote; //render进程的dialog需要在remote调用
const fs = require('fs');
...
```
继续在`app/index.js`中实现逻辑
```
//新建一个菜单
var menu = new Menu();
menu.append(new MenuItem({
	label: '复制',
	click: () => {//复制逻辑
		clipboard.writeImage(
			nativeImage.createFromBuffer(imgOfQr)
		);
	}
}));
menu.append(new MenuItem({
	label: '保存',
	click: () => {
		dialog.showSaveDialog({//复制逻辑
			title: '请选择保存路径',
			filters: [
				{name: 'Images', extensions: ['jpg', 'png', 'gif']},
			]
		}, (win) => {
			fs.writeFile(win, nativeImage.createFromBuffer(imgOfQr).toPng(), (err) => {
				if(err) {
					console.warn(err);
				}
			});
		});
	}
}));

qrImg.addEventListener('contextmenu', function (e) {
	e.preventDefault();
	menu.popup(remote.getCurrentWindow());//添加菜单
}, false);
```
![](http://ww2.sinaimg.cn/large/0060lm7Tgw1f61o40pmjqj30bc09faaf.jpg)
——————————————————————
![](http://ww2.sinaimg.cn/large/0060lm7Tgw1f61o4229kzj30jv0h741r.jpg)
### 输入框聚焦（按钮监听）
*******************
这是一个可有无的小功能，但是为了展示快捷键，还是多一个小功能吧
我现在预想这样一个功能：
按下`ctrl+alt+i`的时候，输入框获得焦点
为了实现这个功能，我们需要用到按钮监听组件`globalShortcut`，这个是在主进程监听，所以我们也需要用到`ipc`

在主进程文件`index.js`中修改
```
const {app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
...
app.on('ready', function() {
...
setGlobalShortcuts();
});
function setGlobalShortcuts() {
	globalShortcut.unregisterAll();
	globalShortcut.register('ctrl+alt+i', function () {//j监听按钮
		mainWindow.webContents.send('global-shortcut', 0);//向某个窗口发送信息
	});
}
...
```

在渲染窗口的文件`app/index.js`中修改
```
ipcRenderer.on('global-shortcut', (event, arg) => {
	switch (arg){
		case 0: qrInput.focus();
	}
});
```
成功！！

## 结尾
上[electron官网](http://electron.atom.io/docs/)查看文档，凭着前端经验，就可以做很多事情啦！！
