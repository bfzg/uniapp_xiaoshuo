<template>
	<view class="page">
		<view class="top_title" v-show="show">
			<i class="iconfont icon-back" @click="goBack"></i>
		</view>
		<view class="bottom_list" v-show="show">
			<view class="fun_list">
				<view @click="showCatalog">
					<i class="iconfont icon-list-unordered"></i>
					<span>目录</span>
				</view>
				<view @click="showSet">
					<i class="iconfont icon-shezhi"></i>
					<span>设置</span>
				</view>
			</view>
		</view>

		<yingbing-ReadPage style="height: 100%;" ref="page" :page-type="pageType" :font-size="fontsize"
			:line-height="lineHeight" :color="color" :bg-color="bgColor" :slide="slide" :enablePreload="enablePreload"
			:enableClick="enableClick" :clickOption="clickOption" @preload="preloadContent" @clickTo="clickTo"
			@change="currentChange" @loadmore="loadmoreContent">
		</yingbing-ReadPage>
		<!-- 弹出层 设置 -->
		<u-popup :show="setShow" @close="close" :closeable="true" :round="10" mode="bottom">
			<view class="set_box">
				<view class="font">
					<view>
						<span>字体</span>
						<u-number-box v-model="fontsize" name="fontSize"></u-number-box>
					</view>
					<view class="lineHeight">
						<span>行高</span>
						<u-number-box v-model="lineHeight" name="lineHeight"></u-number-box>
					</view>
				</view>
				<view class="backColor">
					<span>背景</span>
					<view class="item default" @click="changeSkin('#413e38','#fcd281')"></view>
					<view class="item gray" @click="changeSkin('#404047','#e6ebef')"></view>
					<view class="item pink" @click="changeSkin('#3a3840','#f7e7e7')"></view>
					<view class="item black" @click="changeSkin('#ffffff','#413d31')"></view>
					<view class="item white" @click="changeSkin('#4d4c53','#f6fbf7')"></view>
					<view class="item yellow" @click="changeSkin('#525055','#f7ebdd')"></view>
				</view>
				<view class="pages">
					<span>翻页</span>
					<view class="item" :class="pageType=='real' ? 'selectColor' : ''" @click="changePageType('real')">
						仿真
					</view>
					<view class="item" :class="pageType=='cover' ? 'selectColor' : ''" @click="changePageType('cover')">
						覆盖
					</view>
					<view class="item" :class="pageType=='scroll' ? 'selectColor' : ''" @click="changePageType('scroll')">
						滚动
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 弹出层 目录-->
		<catalog ref="catalog" :currentBookId="currentBookId" :sourceData="catalog"></catalog>
	</view>
</template>

<script>
	import {
		getBookData
	} from '@/request/api.js'
	import {
		removeBracketsAndQuotes
	} from '@/utils/Toos.js'
	import articleDataPreloading from '@/utils/articleDataFilter.js'
	import sqliteDB from '@/sqlite/sqlite.js'
	export default {
		data() {
			return {
				pageType: 'real',
				scrollTop: 400,
				fontsize: 20,
				lineHeight: 15,
				color: '#333',
				slide: 20,
				bgColor: '#fcd281',
				enablePreload: true,
				totalPage: 0,
				currentPage: 0,
				enableClick: true,
				clickOption: {
					width: uni.upx2px(200),
					height: uni.upx2px(200),
					left: 'auto',
					top: 'auto'
				},
				title: '', //章节标题
				id: '', // 文章id
				index: null, //当前最新文章index
				show: false, //控制设置窗口的显示预隐藏
				oldIndex: null, //点击目录章节，返回上一页改变
				BoolIf: true, //控制只有翻到上一页才请求数据
				articleLength: 0, //小说章节总长度，
				catalog: this.$store.state.article.articleID, // 小说总章节
				currentReadProgress: {
					currentIndex: 0, //当前正在阅读的章节index
					chaptertitle: '' //当前正在阅读的章节title
				},
				currentBookId: null, //当前小说id
				setShow: false //设置弹出层的显示与隐藏
			}
		},
		beforeDestroy() {
			console.log('页面离开');
			this.exitSaveReadProgress(this.currentReadProgress, this.currentBookId);
		},
		async onReady() {
			//初始化页面
			let contents = [{
				chapter: Number(this.index),
				content: await this.getContent(this.id),
				title: this.title,
				isStart: this.index == 0,
				isEnd: this.index == 1000
			}, ]
			const {
				page
			} = this.$refs;
			page.init({
				contents: contents,
				start: 0,
				currentChapter: this.index // currentChapter: '小说定位章节序号'
			})
		},
		onLoad(e) {
			this.readSet();
			this.id = e.id
			this.title = e.chaptertitle
			this.index = e.index
			this.oldIndex = e.index
			this.currentBookId = e.bookId
			// #ifdef APP-PLUS
			plus.navigator.setFullscreen(true) //隐藏状态栏
			// #endif
			
			this.articleLength = this.$store.state.article.articleLength
		},
		methods: {
			//监听翻页事件
			currentChange(e) {
				this.currentPage = e.currentPage
				this.totalPage = e.totalPage
				this.currentReadProgress.currentIndex = e.chapter
				this.currentReadProgress.chaptertitle = e.title
				if (e.currentPage == 0) {
					this.BoolIf = false
				}
			},
			//加载上一章节内容
			//TODO 这里BoolIf会一直开启吗？
			loadmoreContent(chapter, callback) {
				if (this.BoolIf) {
					return;
				}
				let classArticle = new articleDataPreloading(this.catalog);
				chapter = classArticle.findPreviousByindex(this.oldIndex);
				setTimeout(async () => {
					callback('success', {
						chapter: chapter.index,
						content: await this.getContent(chapter.chapterId),
						custom: [],
						title: chapter.title,
						isStart: chapter.index == 0,
						isEnd: chapter.index == this.articleLength
					});
					this.oldIndex = chapter.index;
				}, 2000)
			},
			//页面预加载
			preloadContent(chapters, callback) {
				console.log(this.$store.state.article.articleID);
				let classArticle = new articleDataPreloading(this.catalog);
				chapters = classArticle.filterByIndex(this.index);
				setTimeout(async () => {
					console.log('我触发了');
					let contents = []
					for (let i in chapters) {
						contents.push({
							chapter: chapters[i].index,
							start: 0,
							content: await this.getContent(chapters[i].chapterId),
							custom: [],
							title: chapters[i].title,
							isStart: chapters[i].index == 0,
							isEnd: chapters[i].index == this.articleLength
						})
					}
					this.index = contents[2].chapter;
					callback('success', contents)
				}, 0)
			},
			//请求数据方法
			async getContent(id) {
				const res = await getBookData(id);
				let textData = removeBracketsAndQuotes(JSON.stringify(res.data.data));
				return textData;
			},

			// 页面点击事件
			clickTo() {
				this.show = !this.show;
				if (this.show) {
					setTimeout(() => {
						this.show = false
					}, 2000);
				}
			},
			//点击显示目录
			showCatalog() {
				this.$refs.catalog.fartherClick()
			},
			//返回到详情页
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			//退出保存阅读进度
			exitSaveReadProgress(infoObj, bookId) {
				let open = sqliteDB.isOpen();
				if (open) {
					sqliteDB.selectTableData("bookshelf", "fictionId", bookId).then(res => {
						let classArticle = new articleDataPreloading(this.catalog);
						let chapterid = classArticle.findSameIndex(infoObj.currentIndex);
						sqliteDB.insertOrReplaceData([chapterid.index, "'" + chapterid.title + "'", "'" + chapterid
							.chapterId + "'"
						], "'" + bookId + "'").then(res => {
							console.log('保存进度成功!');
						}).catch(error => {
							console.log('保存进度失败');
							console.log(error);
						})
					})
				} else {
					console.log('数据库未打开');
				}
			},
			//显示设置
			showSet() {
				this.setShow = true;
			},
			close() {
				this.setShow = false;
				this.saveSet();
			},
			//保存设置
			saveSet(){
				uni.setStorage({
					key:'textPageSet',
					data:JSON.stringify({
						fontsize:this.fontsize,
						lineHeight:this.lineHeight,
						pageType:this.pageType,
						color:this.color,
						bgColor:this.bgColor
					}),
					success:()=>{
						console.log('存储设置成功!');
					}
				})
			},
			//读取设置
			readSet(){
				let data = uni.getStorageSync('textPageSet');
				if(!data){
					return;
				}
				let res = JSON.parse(data);
				this.fontsize=res.fontsize;
				this.lineHeight=res.lineHeight;
				this.pageType=res.pageType;
				this.color=res.color;
				this.bgColor=res.bgColor
			},
			//设置翻页方式
			changePageType(type) {
				this.pageType = type;
			},
			//更改背景颜色
			changeSkin(fontColor, bgColog) {
				this.color = fontColor;
				this.bgColor = bgColog;
			},
		}
	}
</script>

<style lang="scss">
	.page {
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		/* #ifndef APP-NVUE */
		height: 100vh;
		/* #endif */
	}

	.btns {
		position: absolute;
		bottom: 50rpx;
		left: 0;
		right: 0;
		z-index: 2;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	/* 设置窗口 */
	.top_title {
		position: absolute;
		z-index: 998;
		height: 150rpx;
		width: 100%;
		line-height: 220rpx;
		background-color: rgba(100, 100, 100, 0.8);
		color: #fff;
		top: 0;
		padding-left: 60rpx;
	}

	.bottom_list {
		position: absolute;
		z-index: 998;
		height: 150rpx;
		width: 100%;
		line-height: 150rpx;
		color: #fff;
		bottom: 0;
		left: 0;
		background-color: rgba(100, 100, 100, 0.8);

		.fun_list {
			display: flex;
			justify-content: space-evenly;
			align-items: center;
		}
	}

	// 设置弹出框
	.set_box {
		height: 400rpx;
		padding: 95rpx 25rpx 0 25rpx;

		.font {
			display: flex;
			align-items: center;
			view {
				display: flex;
				align-items: center;

				span {
					font-weight: 600;
					margin-right: 15rpx;
				}
			}
			.lineHeight{
				margin-left: 30rpx;
			}
		}

		.backColor {
			margin-top: 30rpx;
			display: flex;
			align-items: center;

			span {
				font-weight: 600;
				margin-right: 20rpx;
			}

			.item {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				border: 1px solid #999;
				margin: 10rpx;
			}

			.default {
				background-color: #fcd281;
			}

			.gray {
				background-color: #e6ebef;
			}

			.pink {
				background-color: #f7e7e7;
			}

			.black {
				background-color: #413d31;
			}

			.white {
				background-color: #f6fbf7;
			}

			.yellow {
				background-color: #f7ebdd;
			}
		}
	
		.pages{
			display: flex;
			align-items: center;
			margin-top: 30rpx;
			span{
				font-weight: 600;
			}
			.item{
				width: 80rpx;
				height: 60rpx;
				border-radius: 35rpx;
				line-height: 60rpx;
				text-align: center;
				border: 1px solid #999;
				margin: 10rpx;
				font-size: 28rpx;
				transition: all 0.4s;
			}
		}
	}
	.selectColor{
		background-color: #41a5ee;
		color: #eee;
		border: 1px solid #41a5ee;
	}
</style>