title: 好用的分屏tab react-native-scrollable-tab-view
date: 2016-09-02 22:15:07
category: javascript #分类
tags:
- javascript
- react native
---

## 我们需要导航栏

如果一个人每天都有惊喜的话，我今天的最大惊喜就是找到了一个`react-native-scrollable-tab-view`。
我们在写一个应用的时候，总是会有需要，将多个页面放在一屏，通过导航栏切换，如`微信`、`淘宝`
![](http://i2.buimg.com/567571/a3171197d0762fcd.jpg)
这时候我们需要一个组件来帮我们快速实现这个功能。
<!-- more -->

## react-native-tabbar
之前我找到的是[react-native-tabbar](https://github.com/alinz/react-native-tabbar)，也是一个实现这个场景的模块。但是有一些不适合我的使用。
 1、 样式有点搓
 2、 只能通过点击导航栏`tab`直接切换
 3、 分在不同屏的组件（及页面）是一起`mount`的，而不是切换过去后才`mount`的

 特别是因为第三点，我几乎想自己重写一个组件去处理了。

## 遇见 react-native-scrollable-tab-view
遇见`react-native-scrollable-tab-view`，是因为我在[React Native 中文网](http://reactnative.cn/) 学习 [动画](http://reactnative.cn/docs/0.31/animations.html#content)的使用，里面介绍`Rebound`的时候有举例到。
于是点了进去。 [react-native-scrollable-tab-view](https://github.com/skv-headless/react-native-scrollable-tab-view)
![](http://reactnative.cn/static/docs/0.31/img/Rebound.gif)

这个组件几乎完全符合了我的预想。
+ 样式好看，且可配置
+ 导航tab位置可配
+ 页面切换有动画
+ 可通过滑动页面实现切换
+ 页面是第一次切换获取的时候`mount`

唯一不太喜欢的是，当 导航tab 移至底部的时候，tab的指示线 依然实在 tab下方，而不是 tab上方，为此，我还专门`fork`了代码，做了修改，添加了配置项，并发起了`pull request`。
后来才看到，这一项功能，已经有人做了修改，并提交了`pull request`,几乎下一个版本就可以用上了。

完美。

## 结尾

真的是小收获呀，写`react native`怎么做这样的导航栏，一直困扰了我很久，甚至失去了编写新应用的热情，很高兴遇见它