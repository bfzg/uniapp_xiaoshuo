
---

# 前言
本项目仅用作学习交流，切勿商用。
介绍一下这是一款基于uniapp生态的app项目，目前仅支持Android，ios，
小说资源api都是免费，本项目也是开源的，由于api是免费的所以会有一些卡顿请见谅。

---


# 一、项目目录介绍
- components  #组件目录
  * bookListItem  //小说选项卡
  * catalog  //目录
    + 项目
 - pages 		#页面视图
 	*  detail	//小说详情页
 	* index	//书架
 	* list		//搜索后列表
 	* my		//我的页面
 	* search		//搜索页
 	* setUp		//设置页
 	* textPage	//阅读页
 	* thank			//感谢页
 - request #网络请求
 - sqlite	#sqlite数据库语句 
 - static	#静态文件
 - store	#vuex
 	* module
 		+ article	//阅读相关vuex
 - utile #工具
	* articleDataFilter	//处理相关目录的类
	* pageBackTextColor	//阅读页面配色
	* Toos	//工具
# 二、使用步骤
## 1.引入库
代码如下（示例）：
 1.首先进入项目目录运行
```javascript
npm i
```
```javascript
注意：uniCloud需要绑定为你自己的阿里云云服务空间
然后进入uniCloud目录下面的两个目录都右击上传所有云函数和schema
```
该项目是需要搭配uniadmin的，创建的话可以自己百度一下。这里不做过多解释
注意uniadmin需要和本项目使用一个云服务器，
## 2.ios支持
该项目支持ios但是，但是上架商店需要充值，所以就没有ios体验放出来，你可以通过appuploader来制作证书并使用HBuilder打自定义基座
教程放在这里了https://www.cnblogs.com/goloving/p/14324524.html
# 三、下载体验
https://static-mp-b6309884-49f6-494d-8b43-712bc66122c5.next.bspapp.com/
# 四、注意事项
如有问题请联系QQ: 1445237848
# 五、截图
在这里插入图片描述
![在这里插入图片描述](https://img-blog.csdnimg.cn/81eb4d1902224a8ba71fd0700b7b5613.jpeg#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/d9c206040ab14600a69df7f6af6730a1.jpeg#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/b749d67c6a3e4f3288b8f82a4b7e8137.jpeg#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/d10cbdfb52374fa68b682c85785f4a2c.jpeg#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2e306f669a7846eabc2f0c52d0cd9c16.jpeg#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/ff6d136c92c445558a809638efead629.jpeg#pic_center)

# 总结
项目介绍写的比较潦草，因为本身代码量就不多，该项目适合毕业设计，学习，现在基本功能已经开发完毕，下一步会怎加云存储，保证用户数据不丢失。会继续优化代码结构。-- 2023-5-7

