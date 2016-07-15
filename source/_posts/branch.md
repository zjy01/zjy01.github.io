title: git分支管理
date: 2015-12-04 13:40:37
tags:
- git
---
### git分支管理
git用了挺久，但是对分支管理还是不熟悉。用这篇博客来记录一下常用的分支管理命令
1.首先绑定远程仓库

```bash
git remote add test git@github.com:zjy01/test.git
```
<!-- more -->
2.新建分支并切换

```bash
git branch news #新建分支
git checkout news #切换分支
```

或者

```bash
git checkout -b news #新建分支并切换到它
```
3.远程建立分支
```bash
git push test news #push本地分支到远程，自然就创建了远程的news分支
git push test news:newsBranch #push本地news分支到远程newsBranch分支，会在远程新建newsBranch分支
```
4.删除远程分支
这个有点奇怪
```bash
git push test :news #推送一个空的分支到远程分支，可以达到删除效果
git push --delete test news #git v1.70后
#对tag可以用同样操作
git push test --delete tag <tagname>
#或者
git tag -d <tagname>
git push test :refs/tags/<tagname>
```
5.分支合并
```bash
git merge news #将news分支合并回主分支
```

6.其他
错误操作的还原
```bash
git checkout -- filename #将版本库的文件覆盖本地文件
#如果你错删了东西，并且提交到了缓存区呢(git add)
git reset HEAD filename
git checkout -- filename
```
### 参考网站
>[GIT参考手册](http://gitref.org/zh/index.html)
>[廖雪峰的官方网站--git教程](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)