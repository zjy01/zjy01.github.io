title: 浅谈js的date对象对时间字符串的解析
date: 2016-04-15 17:11:54
category: 前端 #分类
tags:
- js
- date
---

## 遇见问题
最近的时间都在开发社团内部的应用--隧道口，虽然只有简单的几个页面，但是依然是遇到了不少坑。
其中 date 的时间处理就是一个。

简单说一下需求。。现在在做一个活动列表，后台传一个json，里面包含活动的列表数组。
我遍历数组并创建对应的视图显示，并且以月份作为分类标准。
展示一下后台拿来的数据
![](http://i2.piimg.com/2daef4b7237ba3bf.jpg)

<!-- more -->
做起来并不难，我开始写了如下版本
```js
data.forEach(function (value, index) {
                var ct = new Date();

                var st = new Date(value.activity_start_time);//活动开始时间
                var et = new Date(value.activity_end_time);//活动结束时间

                var sm = st.getMonth() + 1; //月份

                var sd = st.getDate();
                sd = sd < 9 ? '0' + sd: sd; //日

                var sh = st.getHours();
                sh = sh < 9 ? '0' + sh: sh; //时

                var sn = st.getMinutes();
                sn = sn < 9 ? '0' + sn: sn; //分

                //...省略

                var params = {
                    id: value.id,
                    poster: value.activity_pic_url,
                    title: value.activity_name,
                    association: value.association_name,
                    location: value.activity_location,
                    like: value.like,
                    comment: value.comment,
                    status: status,
                    sclass: sclass,
                    day: sd,
                    clock: sh + ':' + sn
                };
                //渲染
                tpl += Mustache.render(self.item_tlp, params);
                tpl += '</div>';

            });
```

当然，这段代码成功运行了，至少我觉得成功运行了。
且看效果图

![](http://i2.piimg.com/1aef8e66bcbeafc1.jpg)

很完美的成功了。

可是在ios下运行的结果就很不理想了

![](http://i2.piimg.com/3e5ade8766af3057.jpg)

全是 NAN 有没有。
一开始以为是 数字与字符串相加造成的问题（尽管js是可以数字与字符串相加的）
用parseInt改了一遍发现不行，后台调试发现在ios下显示 Invalid Date，看来是不同平台的Date对字符串的解析能力不同啊。

## 解决问题
之后我在ie上测试发现了同样的问题（想不到ios和ie居然有同样坑的一天）。
查阅资料发现了问题所在，new Date(str) 对传进入的字符串有一定的格式要求，不同平台不一样，像我们后台传过来的时间格式是
``
20xx-xx-xx 00:00:00
``
```
new Date("20xx-xx-xx 00:00:00")
```
这种格式在人看来是很容易理解了，然后，部分浏览器却解析不了，而所有浏览器都能解析的格式是
```
new Date("20xx/xx/xx 00:00:00")
```
于是对后台传过来的数据修改成 ``year/month/day`` 的格式

```js
var st = new Date(Date.parse(value.activity_start_time.replace(/-/g,"/")));
var et = new Date(Date.parse(value.activity_end_time.replace(/-/g,"/")));
```

大功告成。

##
总之呢，以后解析时间用  ``year/month/day`` 就好