<template>
	<view class="page">
		<view class="top_title" v-show="setWinShow">
			<i class="iconfont icon-back" @click="goBack"></i>
		</view>
		<view class="bottom_list" v-show="setWinShow">
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
			:line-height="lineHeight" :color="color" :topGap="topGap" :bg-color="bgColor" :slide="slide" :enablePreload="enablePreload"
			:enableClick="enableClick" :clickOption="clickOption" @preload="preloadContent" @clickTo="clickTo"
			@change="currentChange" @loadmore="loadmoreContent">
		</yingbing-ReadPage>
		<!-- 弹出层 设置 -->
		<u-popup :show="setWinListShow" @close="close" :closeable="true" :round="10" mode="bottom">
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
					<view v-for="(item,index) in pageColor" :key="index" class="item" :style="{backgroundColor:item.backColor}" @click="changeSkin(item.textColor,item.backColor)"></view>
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
		<catalog ref="catalog" :currentBookId="currentBookId" :sourceData="allChapterList"></catalog>
	</view>
</template>

<script>
	import {getBookData} from '@/request/api.js'
	import {removeBracketsAndQuotes} from '@/utils/Toos.js'
	import articleDataPreloading from '@/utils/articleDataFilter.js'
	import sqliteDB from '@/sqlite/sqlite.js'
	import pageColor from '@/utils/pageBackTextColor.js'
	export default {
		data() {
			return {
				pageType: 'real',
				scrollTop: 400,
				fontsize: 20,
				lineHeight: 15,
				color: '#333',
				slide: 20,
				topGap:30,
				bgColor: '#fcd281',
				enablePreload: true,
				totalPage: 0,
				currentPage: 0,
				enableClick: true,
				clickOption: {
					width: uni.upx2px(100),
					height: uni.upx2px(400),
					left: 'auto',
					top: 'auto'
				},
				currentBookId:this.$store.state.article.currentBookId,//当前小说id
				allChapterList:this.$store.state.article.allChapterList,   //所有章节，目录
				allChapterListLength:this.$store.state.article.allChapterList.length,   	//章节总长度
				currentChapterIndex:null,   //正在阅读的章节index
				currentChapterTitle:'',		//正在阅读章节标题
				currentChapterId:'',		//正在阅读章节id
				setWinShow:false,			//控制设置窗口的显示与隐藏
				setWinListShow:false,		//控制设置列表的显示与隐藏
				oldChapterindex:null,		//点击目录章节，返回上一页改变
				BoolIf:false,				//是否加载上一章节
				pageColor
			}
		},
		onHide() {
			this.exitSaveReadProgress(this.currentBookId);
		},
		beforeDestroy() {
			this.exitSaveReadProgress(this.currentBookId);
		},
		async onReady() {
			//初始化页面
			let contents = [{
				chapter: Number(this.currentChapterIndex),
				content: await this.getContent(this.currentChapterId),
				title: this.currentChapterTitle,
				isStart: this.currentChapterIndex == 0,
				isEnd: this.currentChapterIndex == this.allChapterListLength
			}, ]
			const {page} = this.$refs;
			page.init({
				contents: contents,
				start: 0,
				currentChapter: this.currentChapterIndex // currentChapter: '小说定位章节序号'
			})
		},
		onLoad(e) {
			this.currentChapterIndex = e.currentChapterIndex;
			this.oldChapterindex=e.currentChapterIndex;
			this.currentChapterTitle = e.currentChapterTitle;
			this.currentChapterId = e.currentChapterId;
			this.readSet();				//加载用户页面个性化设置
			// #ifdef APP-PLUS
			plus.navigator.setFullscreen(true) //隐藏状态栏
			// #endif
		},
		methods: {
			//监听翻页事件
			currentChange(e) {
				this.currentPage = e.currentPage
				this.totalPage = e.totalPage
				if(e.chapter != this.currentChapterIndex){
					let chapterid = this.allChapterList[e.chapter]
					this.currentChapterIndex = chapterid.index;
					this.currentChapterTitle = chapterid.title;
					this.currentChapterId = chapterid.chapterId;
					this.$store.commit("getpresentArticle",chapterid);
				}
				if (e.currentPage == 0) {
					this.BoolIf = false;
				}
			},
			//加载上一章节内容
			//TODO 这里BoolIf会一直开启吗？
			loadmoreContent(chapter, callback) {
				if (this.BoolIf) {
					return;
				}
				let classArticle = new articleDataPreloading(this.allChapterList);
				chapter = classArticle.findPreviousByindex(this.oldChapterindex);
				setTimeout(async () => {
					callback('success', {
						chapter: chapter.index,
						content: await this.getContent(chapter.chapterId),
						custom: [],
						title: chapter.title,
						isStart: chapter.index == 0,
						isEnd: chapter.index == this.allChapterListLength
					});
					this.oldChapterindex = chapter.index;
				}, 2000)
			},
			//页面预加载
			preloadContent(chapters, callback) {
				let classArticle = new articleDataPreloading(this.allChapterList);
				chapters = classArticle.filterByIndex(this.currentChapterIndex);
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
							isEnd: chapters[i].index == this.allChapterListLength
						})
					}
					this.currentChapterIndex = contents[2].chapter;
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
			  this.setWinShow = !this.setWinShow;
			  // 清除之前的定时器
			  clearTimeout(this.timer);
			  if (this.setWinShow) {
			    // 保存当前的定时器
			    this.timer = setTimeout(() => {
			      this.setWinShow = false
			    }, 4000);
			  }
			},
			//点击显示目录
			showCatalog() {
				this.$refs.catalog.open()
			},
			//返回到详情页
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			//退出保存阅读进度
			async exitSaveReadProgress(bookId) {
				let open = sqliteDB.isOpen();
				if (open) {
					let ret = await sqliteDB.insertOrReplaceData([this.currentChapterIndex, "'" + this.currentChapterTitle + "'", "'" + this.currentChapterId + "'"], "'" + bookId + "'");
				} else {
					console.log('数据库未打开');
				}
			},
			//显示设置
			showSet() {
				this.setWinListShow = true;
			},
			close() {
				this.setWinListShow = false;
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