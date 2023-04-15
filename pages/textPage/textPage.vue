<template>
	<view class="page">
		<view class="top_title" v-show="show">
			<i class="iconfont icon-back" @click="goBack"></i>
		</view>
		<view class="bottom_list" v-show="show">
			<view class="fun_list">
				<view>
					<i class="iconfont icon-list-unordered"></i>
					目录
				</view>
				<view>
					<i class="iconfont icon-shezhi"></i>
					设置
				</view>
			</view>
		</view>

		<yingbing-ReadPage style="height: 100%;" ref="page" :page-type="pageType" :font-size="fontsize"
			:line-height="lineHeight" :color="color" :bg-color="bgColor" :slide="slide" :enablePreload="enablePreload"
			:enableClick="enableClick" :clickOption="clickOption" @preload="preloadContent" @clickTo="clickTo"
			@change="currentChange"  @loadmore="loadmoreContent">
		</yingbing-ReadPage>
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
				title: '', //文章标题
				id: '', // 文章id
				index: null, 	//当前最新文章index
				show: true, 	//控制设置窗口的显示预隐藏
				oldIndex:null, 	//点击目录章节，返回上一页改变
				BoolIf:true		//控制只有翻到上一页才请求数据
			}
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
			console.log(contents);
			page.init({
				contents: contents,
				start: 0,
				currentChapter: this.index // currentChapter: '小说定位章节序号'
			})
		},
		onLoad(e) {
			this.id = e.id
			this.title = e.title
			this.index = e.index
			this.oldIndex = e.index
			// this.getContent(e.id);
		},
		methods: {
			//监听翻页事件
			currentChange(e) {
				this.currentPage = e.currentPage
				this.totalPage = e.totalPage
				if(e.currentPage == 0){
					this.BoolIf=false
				}
			},
			setCatalog(e) {
				console.log('页面目录触发了');
				console.log(e);
			},
			//加载上一章节内容
			loadmoreContent(chapter,callback) {
				if(this.BoolIf){
					return;
				}
				let classArticle = new articleDataPreloading(this.$store.state.article.articleID);
				chapter = classArticle.findPreviousByindex(this.oldIndex);
				setTimeout( async () => {
					callback('success', {
						chapter: chapter.index,
						content: await this.getContent(chapter.chapterId),
						custom: [],
						title: chapter.title,
						isStart: chapter.index == 0,
						isEnd: chapter.index == 1000
					});
					this.oldIndex = chapter.index;
				}, 2000)
			},
			//页面预加载
			preloadContent(chapters, callback) {
				let classArticle = new articleDataPreloading(this.$store.state.article.articleID);
				chapters = classArticle.filterByIndex(this.index);
				setTimeout(async () => {
					console.log('我触发了');
					let contents = []
					for (let i in chapters) {
						console.log(i);
						contents.push({
							chapter: chapters[i].index,
							start: 0,
							content: await this.getContent(chapters[i].chapterId),
							custom: [],
							title: chapters[i].title,
							isStart: chapters[i].index == 0,
							isEnd: chapters[i].index == 1000,
							// this.getContent(chapters[i].id)
						})
					}
					console.log(contents);
					this.index = contents[2].chapter;
					callback('success', contents)
				}, 2000)
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
			//返回到详情页
			goBack(){
				uni.navigateBack({
					delta: 1
				})
			},
			//设置字体大小
			addFontsize() {
				this.fontsize += 4;
			},
			//设置翻页方式
			changePageType() {
				this.pageType = this.pageType == 'real' ? 'scroll' : 'real';
			},
			//设置字体大小
			reduceFontSize() {
				this.fontsize -= 4;
			},
			//设置行高
			changeLineHeight() {
				this.lineHeight += 4;
			},
			//更改背景颜色
			changeSkin() {
				this.color = '#f5f5f5';
				this.bgColor = '#999';
			},
		}
	}
</script>

<style>
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
		background-color: black;
		color: #fff;
		bottom: 0;
		background-color: rgba(100, 100, 100, 0.8);

		.fun_list {
			display: flex;
			justify-content: space-evenly;
		}
	}
</style>