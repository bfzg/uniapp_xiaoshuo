#使用须知

* 1、这是一个小说分页插件，包含翻页功能，但不包含设置窗口
* 2、这个插件支持APP-NVUE、APP-VUE、H5、微信小程序
* 3、小说分页有2种模式，章节模式和整书模式，章节模式就是需要分章节加载的小说，整书模式就是不分章节直接传入整本小说的模式
* 4、小说内容只支持纯文本格式 ，例如（内容内容内容内容内容/r/n内容内容内容内容内容）
* 5、章节模式建议初始化内容和跳转章节时一次传3个章节的内容
* 6、自定义页面有图片的，最好将图片高度固定，避免滚动模式下定位异常，且自定义页面只能放入章节后面展示
* 7、不同平台下的体验是不同的，功能也有些许差别

#props属性
| 属性名 | 类型 | 默认值 | 可选值 | 说明 |
| :----- | :----: | :----: | :----: | :---- |
| pageType | String | real | real/cover/scroll/none | 翻页模式 |
| color | String | #333333 | 自定义 | 字体颜色 |
| fontSize | String/Number | 15 | 自定义 | 字体大小 |
| bgColor | String | #fcd281 | 自定义 | 背景颜色（支持css渐变） |
| lineHeight | String/Number | 15 | 自定义 | 行间距（行与行之间的间距） |
| slide | String/Number | 40 | 自定义 | 页面左右边距 |
| topGap | String/Number | 10 | 自定义 | 页面上边距 |
| bottomGap | String/Number | 10 | 自定义 | 页面下边距 |
| headerShow | Boolean | true | true/false | 显示顶部内容 |
| footerShow | Boolean | true | true/false | 显示底部内容 |
| noChapter | Boolean | false | true/false | 是否开启整书模式（无章节模式） |
| enablePreload | Boolean | false | true/false | 是否开启预加载章节功能（noChapter为false时有效） |
| enableClick | Boolean | false | true/false | 是否开启点击区域（用于唤出设置窗口之类） |
| clickOption | Object | { width: uni.upx2px(200),height: uni.upx2px(200),left:'auto',top:'auto'} | 自定义 | 点击区域配置（点击哪个区域有效 enableClick为true时有效） |

#clickOption介绍
| 键名 | 类型 | 说明 |
| :----- | :----: | :---- |
| width | Number | 点击区域宽度 |
| height | Number | 点击区域高度 |
| left | String/Number | 左右定位（默认auto为居中，可传入数字） |
| top | String/Number | 上下定位（默认auto为居中，可传入数字） |

#event事件
| 事件名 | 参数 | 说明 |
| :----- | :----: | :---- |
| loadmore | chapter,callback | 加载章节内容（chapter为需要加载的章节序号，callback为加载回调 此方法在noChapter为false有效）|
| preload | chapters,callback | 预加载章节内容（chapters为需要预加载的章节序号集合，callback为加载回调 此方法在noChapter为false有效）|
| currentChange | currentInfo | 阅读页面改变触发事件（返回当前阅读页面信息）|
| setCatalog | catalog | 获取章节目录事件（此事件在noChapter为true时有效）|
| clickTo | 无 | 点击事件（此事件在enableClick为true时有效）|
| 自定义 | 自定义 | 自定义页面中的点击事件回馈（你写了多少个点击事件，就有多少个event事件） |

#内置方法
| 方法名 | 参数 | 说明 |
| :--- | :------ | :---- |
| init | { contents: '章节模式下是小说内容集合，整书模式下是小说文本内容', currentChapter: '小说定位章节序号', start: '定位章节的开始阅读开始位置' } | 初始化小说内容 |
| change | { contents: '小说内容集合（整书模式下可以不传）', currentChapter: '小说定位章节序号', start: '定位章节的开始阅读开始位置' } | 跳转小说位置 |
| refresh | 无 | 刷新阅读页面 |
| pageNext | 无 | 翻到下一页 （滚动模式下表现为向下滚动一段距离） |
| pagePrev | 无 | 翻到上一页 （滚动模式下表现为向上滚动一段距离） |

#content对象介绍
| 键名 | 类型 | 说明 |
| :----- | :----: | :---- |
| chapter | Number | 章节序号 |
| content | String | 章节内容 |
| custom | Array | 自定义内容（具体用法见下面） |
| isEnd | Boolean | 是否是最后一个章节 |
| isStart | Boolean | 是否是第一章节 |
| title | String | 章节名称（非必传）如果传了得话，会在currentChange中返回 |

#loadmore和preload事件回调callback介绍
| 参数 | 类型 | 是否必传 | 可选值 | 说明 |
| :----- | :----: | :---- |
| status | String | 是 | success/fail/timeout | 请求回调状态 |
| content/contents | Object | 是 | loadmore方法需要传入content对象, preload方法需要传入content对象集合contents | 请求回调内容 |

#currentChange事件参数currentInfo介绍
| 键名 | 类型  | 说明 |
| :----- | :----: | :---- |
| chapter | String | 当前页面所在章节 |
| start | Number | 当前页面所在章节的阅读开始位置 |
| end | Number | 当前页面所在章节的阅读结束位置 |
| dataId | Number | 插件内部使用参数不用处理 |
| type | String | 插件内部使用参数（可以通过此属性判断当前页面是自定义页面还是文本页面） |
| text | Array | 当前页面文字集合 |
| totalPage | Number | 当前章节的全部分页数量 |
| currentPage | Number | 当前章节第几页 |
| title | String | 章节名称（如果content对象中带有title才会返回这个参数） |

#自定义页面
* 自定义页面可用于
	- 广告展示
	- 插图展示
	- 付费章节
	- ...
* 自定义页面只能放入章节最后展示
* 自定义页面有图片或者不定宽高的元素时，最好将高度定好，避免滚动模式下定位异常
* 自定义页面只能使用html的标签，不能使用uni-app的标签，不然app端会有问题
* 自定义页面的支持自定义点击事件有 APP-VUE 、H5、APP-NVUE
* 自定义页面在微信小程序 使用rich-text实现，所以部分html元素并不支持
* APP-NVUE因为css支持较少，翻页效果不如其它端
```javascript
	//如何添加自定义页面：
	let content = {
		chapter: 4,
		content: '',//如果该章节只展示自定义页面，则文本内容可为空或不填,适用于付费章节展示
		custom: [
			`<div>自定义页面第一页</div>`
			`<div>自定义页面第二页</div>`
		],//自定义页面
		title: '第四章',
		isStart: false,
		isEnd: false,
	}
	//如何添加点击事件：（微信小程序不支持）
	let content = {
		chapter: 4,
		custom: [
			`<div onclick="clickme">自定义页面第一页</div>`
			`<div onclick="clickher(123)">自定义页面第二页</div>`
		],//自定义页面
		title: '第四章',
		isStart: false,
		isEnd: false,
	}
```
```html
	<!-- ·添加的点击事件如何获取点击反馈（微信小程序不支持） -->
	<yingbing-ReadPage
	ref="page"
	@clickme="clickme"
	@clickher="clickher"
	></yingbing-ReadPage>
```

#自定义插槽 （如果想实现多平台，建议使用自定义插槽替代自定义页面）
* 对于自定义页面不支持的uni-app的组件，可以使用自定义插槽实现
* 自定义插槽的功能和自定义页面类似
```javascript
	//如何添加自定义插槽：（微信小程序不支持这种写法）
	let contents = [{
		chapter: 4,
		custom: [
			`slot:test`
		],//自定义页面
		title: '第四章',
		isStart: false,
		isEnd: false,
	},{
		chapter: 5,
		custom: [
			`slot:test`
		],//自定义页面
		title: '第五章',
		isStart: false,
		isEnd: false,
	}]
```
```html
	<!-- 如何使用自定义插槽（微信小程序不支持这种写法） -->
	<yingbing-ReadPage
	ref="page"
	>
		<template #test>
			<text>测试插槽</text>
		</template>
	</yingbing-ReadPage>
```
```javascript
	//如何添加自定义插槽：（兼容多端的写法）
	let contents = [{
		chapter: 4,
		custom: [
			`slot:test4`
		],//自定义页面
		title: '第四章',
		isStart: false,
		isEnd: false,
	},{
		chapter: 5,
		custom: [
			`slot:test5`
		],//自定义页面
		title: '第五章',
		isStart: false,
		isEnd: false,
	}]
```
```html
	<!-- 如何使用自定义插槽（兼容多端的写法） -->
	<yingbing-ReadPage
	ref="page"
	>
		<template v-for="(item, index) in contents" :slot="'test'+item.chapter">
			<text>测试插槽</text>
		</template>
	</yingbing-ReadPage>
```


#使用方法

```html
	<yingbing-ReadPage
	ref="page"
	:page-type="pageType"
	:font-size="fontsize"
	:line-height="lineHeight"
	:color="color"
	:bg-color="bgColor"
	:slide="slide"
	:enablePreload="enablePreload"
	:noChapter="noChapter"
	enableClick
	@clickTo="clickTo"
	@loadmore="loadmoreContent"
	@preload="preloadContent"
	@currentChange="currentChange"
	@setCatalog="setCatalog"
	@clickme="clickme"
	@clickher="clickher"
	></yingbing-ReadPage>
```

```javascript
	export default {
			data() {
				return {
					pageType: 'scroll',
					scrollTop: 400,
					fontsize: 20,
					lineHeight: 15,
					color: '#333',
					slide: 40,
					bgColor: '#fcd281',
					enablePreload: true,
					noChapter: false,
					totalPage: 0,
					currentPage: 0,
					custom: [//自定义页面
						`<div style="width: 100%;height: 100%;text-align: center;">
							<p style="margin-top: 50px">这是一个自定义的页面可以用于:</p>
							<p>广告展示</p>
							<p>付费章节</p>
							<p>插图展示</p>
							<p>...</p>
							<p style="margin-top: 50px">自定义页面上的元素可以添加点击事件:</p>
							<button onclick="clickme(123, 124)">点击我</button>
							<button onclick="clickher(123, 124)">点击她</button>
							<p>尽量不要将有点击事件的元素定位到中间，否则会和clikTo事件重合</p>
							<p>如果一定要定位到中间，也可以将clikTo事件定位到其它位置</p>
							<p style="margin-top: 50px">需要注意的是:</p>
							<p>图片最好将高度定好</p>
							<p>避免滚动模式下定位异常</p>
							<p>自定义页面只能放入页面章节最后展示</p>
						</div>`,
						`<div style="width: 100%;height: 100px;text-align: center;line-height: 100px;">这是一个自定义页面的第二页</div>`,
						`<div style="width: 100%;height: 100px;text-align: center;line-height: 100px;">这是一个自定义页面的第三页</div>`
					]
				}
			},
			onReady() {
				let contents = [{
					chapter: 3,
					content: this.getContent(3),
					title: '第三章',
					isStart: false,
					isEnd: false,
				},{
					chapter: 4,
					custom: this.custom,//自定义页面
					title: '第四章',
					isStart: false,
					isEnd: false,
				},{
					chapter: 5,
					content: this.getContent(5),
					title: '第五章',
					isStart: false,
					isEnd: false,
				}]
				const { page } = this.$refs;
				if ( this.noChapter ) {
					page.init({
						content: this.getContent(2),
						start: 0
					})
				} else {
					page.init({
						contents: contents,
						start: 0,
						currentChapter: 4
					})
				}
			},
			methods: {
				clickTo () {
					console.log('点击')
				},
				currentChange (e) {
					this.currentPage = e.currentPage
					this.totalPage = e.totalPage
					console.log(e);
				},
				setCatalog (e) {
					console.log(e);
				},
				//自定义页面内的点击事件
				clickme (num, num2) {
					uni.showToast({
						icon: 'none',
						title: '你点击了我'
					})
				},
				//自定义页面内的点击事件
				clickher (num, num2) {
					uni.showToast({
						icon: 'none',
						title: '你点击了她'
					})
				},
				addFontsize () {
					this.fontsize += 4;
				},
				changePageType () {
					this.pageType = this.pageType == 'real' ? 'scroll' : 'real';
				},
				reduceFontSize () {
					this.fontsize -= 4;
				},
				changeLineHeight () {
					this.lineHeight += 4;
				},
				changeSkin () {
					this.color = '#f5f5f5';
					this.bgColor = '#999';
				},
				changeChapter () {
					if ( this.noChapter ) {
						page.change({
							start: 100
						})
					} else {
						setTimeout(() => {
							let contents = [{
								chapter: 3,
								content: this.getContent(3),
								title: '第三章',
								isStart: false,
								isEnd: false
							},{
								chapter: 4,
								custom: this.custom,
								title: '第四章',
								isStart: false,
								isEnd: false
							},{
								chapter: 5,
								content: this.getContent(5),
								title: '第五章',
								isStart: false,
								isEnd: false
							}]
							const { page } = this.$refs;
							page.change({
								contents: contents,
								start: 0,
								currentChapter: 5
							})
						}, 2000)
					}
				},
				loadmoreContent (chapter, callback) {
					setTimeout(() => {
						callback('success', {
							chapter: chapter,
							content: chapter == 4 ? '' : this.getContent(chapter),
							custom: chapter == 4 ? this.custom : [],
							title: '第' + chapter + '章',
							isStart: chapter == 1,
							isEnd: chapter == 7
						});
						// callback('fail');
						// callback('timeout');
					}, 2000)
				},
				preloadContent (chapters, callback) {
					setTimeout(() => {
						let contents = []
						for ( let i in chapters ) {
							contents.push({
								chapter: chapters[i],
								start: 0,
								content: chapters[i] == 4 ? '' : this.getContent(chapters[i]),
								custom: chapters[i] == 4 ? this.custom : [],
								title: '第' + chapters[i] + '章',
								isStart: chapters[i] == 1,
								isEnd: chapters[i] == 7
							})
						}
						callback('success', contents);
						// callback('fail');
						// callback('timeout');
					}, 2000)
				},
				getContent (chapter = 1) {
	return `第${chapter}章
	                你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊
	你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊
	你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊
	你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊
	你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊
	你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊
	你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊
	你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊
	你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊
	你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊
	你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊
	你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊
	你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊
	你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊
	你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊你们好啊
	
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊神经病啊
	
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊疯子啊啊
	
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊傻子啊啊
	`
				}
			}
		}
```