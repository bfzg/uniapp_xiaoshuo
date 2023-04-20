<template>
	<view class="detail">
		<view class="exit" @click="goBack">
			<i class="iconfont icon-back"></i>
		</view>
		<view class="backImg">
			<image :src="bookInfo.cover" mode=""></image>
		</view>
		<view class="bookInfoTop">
			<view class="bookTop">
				<view class="img">
					<image :src="bookInfo.cover" mode=""></image>
				</view>
				<view class="info">
					<view class="title">{{bookInfo.title}}</view>
					<view class="author">
						作者: {{bookInfo.author}}
					</view>
					<view class="Type">
						分类: {{bookInfo.fictionType}}
					</view>
					<view class="time">
						<!-- 最后一次更新时间: <uni-dateformat format="yyyy-MM-dd" :date="bookInfo.updateTime"></uni-dateformat> -->
					</view>
				</view>
			</view>
		</view>
		<view class="content_box">
			<view class="bookInfo">
				<view class="text">
					<u-read-more ref="uReadMore" :toggle="true" :showHeight="100">
						<rich-text :nodes="bookInfo.descs"></rich-text>
					</u-read-more>
					<!-- <span>{{bookInfo.descs}}</span> -->
				</view>
				<view class="catalog" @click="clickPopup">
					<view class="catalog_text">目录</view>
					<view class="catalog_list">
						<span>共 {{count}} 章</span>
						<i class="iconfont icon-sortlight"></i>
					</view>
				</view>
			</view>
			<view class="bookBottom">
				<view class="box">
					<view class="bookshelf" @click="addBookShelf">
						<view class="iconfont icon-file"></view>
						<view class="text">
							加入书架
						</view>
					</view>
					<view class="startRead">
						<u-button @click="startRead" type="primary" shape="circle" text="开始阅读"></u-button>
					</view>
				</view>
			</view>
		</view>
		<!-- 弹出层 目录-->
		<catalog ref="catalog" :sourceData="bookInfo.chapterList"></catalog>
	</view>
</template>

<script>
	import {getBookListInfo} from '@/request/api.js';
	import {store,mutations} from '@/uni_modules/uni-id-pages/common/store.js'
	import {whetherToLogin} from '@/utils/Toos.js'
	import sqliteDB from '@/sqlite/sqlite.js'
	const collectBook = uniCloud.importObject('collect-book', {
		customUI: true
	});
	const db = uniCloud.database();
	export default {
		data() {
			return {
				bookInfo: {},
				count: 0 // 文章长度
			};
		},
		onLoad(e) {
			this.getBookInfo(e.id);
	
		},
		methods: {
			/**
			 * 获取数据
			 * @param {String} id 书籍 id
			 * */
			async getBookInfo(id) {
				let {data: res} = await getBookListInfo(id);
				this.count = res.count;
				//给每个章节对象都加上index
				for (let i = 0; i < res.data.chapterList.length; i++) {
					res.data.chapterList[i].index = i
				}
				this.bookInfo = res.data
				//获取数据后初始化展开更多阅读
				this.$nextTick(() => {
					this.$refs.uReadMore.init();
				})
				//vuex 存储文章id
				this.$store.commit('addArticleID', this.bookInfo.chapterList);
				//vuex 存储文章总长度
				this.$store.commit('getarticleLength', res.count);
			},
			//返回上一页
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			//点击显示弹出框
			clickPopup() {
				this.$refs.catalog.fartherClick()
			},
			//开始阅读
			startRead(){
				uni.navigateTo({
					url:"/pages/textPage/textPage?id=" + this.bookInfo.chapterList[0].chapterId + "&chaptertitle=" + this.bookInfo.chapterList[0].title + "&index=" + this.bookInfo.chapterList[0].index+"&bookId=" + this.bookInfo.fictionId
				})
			},
			//添加到书架
			async addBookShelf() {
				let infoObj = this.deepCopy(this.bookInfo);
				this.createTable();
				this.insertTableData();
				// 保存到云端
				// if(!store.hasLogin) {
				// 	whetherToLogin();
				// 	return;
				// }
				// let res = await db.collection('xiaoshuo-collect').add({
				// 	...infoObj
				// });
			},	
			//创建表
			createTable(){
				let open = sqliteDB.isOpen();
				if(open){
					let sql = '"id" INTEGER PRIMARY KEY AUTOINCREMENT,"title" text,"author" text,"chapterList" Memo,"cover" text,"descs" Memo,"fictionId" text,"fictionType" text,"updateTime" text,"chapterindex" integer,"chaptertitle" text,"chapterid" text';
					sqliteDB.createTable("bookshelf",sql).then(res=>{
						console.log("创建表成功!");
					}).catch(error=>{
						console.log("创建表失败!");
					});
				}else{
					console.log("数据库未打开!");
				}
			},
			
			//新增数据
			insertTableData(){
				let open = sqliteDB.isOpen();
				if(open){
					let presentReadInfo = this.$store.state.article.presentArticle;
					let infoObj = this.deepCopy(this.bookInfo);
					infoObj.chapterList = JSON.stringify(infoObj.chapterList)
					infoObj.chapterindex = presentReadInfo.index ? presentReadInfo.index : this.bookInfo.chapterList[0].index;
					infoObj.chaptertitle=presentReadInfo.title ? presentReadInfo.title : this.bookInfo.chapterList[0].title;
					infoObj.chapterid=presentReadInfo.chapterId ? presentReadInfo.chapterId : this.bookInfo.chapterList[0].chapterId;
					let keys = Object.keys(infoObj);
					let values = Object.values(infoObj);
					let valuesStr = values.map(v=>`'${v}'`).join(",");
					sqliteDB.insertTableData("bookshelf",valuesStr,keys).then(res=>{
						console.log('新增数据成功!');
						uni.showToast({
							title:'添加成功!',
							icon:'success'
						})
					}).catch(error=>{
						console.log('新增数据失败!');
						console.log(error);
					})
				}else{
					console.log("数据未打开!");
				}
			},
			
			delete(){
				sqliteDB.dropTable("bookshelf");
			},
			
			// 实现对象的深拷贝，并且截取文章列表第一项
			deepCopy(obj) {
				let str = JSON.stringify(obj);
				let result = JSON.parse(str);
				
				return result;
			}
		}
	}
</script>

<style lang="scss">
	//退出按钮
	.exit {
		position: fixed;
		top: 80rpx;
		left: 40rpx;
		z-index: 999;
		color: #555;

		i {
			font-size: 50rpx;
		}
	}

	//头部小说介绍背景图
	.backImg {
		width: 100%;
		height: 500rpx;

		image {
			width: 100%;
			height: 100%;
			-webkit-filter: blur(10px);
			filter: blur(10px);
			z-index: -1;
		}
	}


	//头部小说介绍
	.bookInfoTop {
		position: absolute;
		top: 200rpx;
		left: 100rpx;

		.bookTop {
			display: flex;
			align-items: center;
			justify-content: space-evenly;

			.img {
				width: 120rpx;
				height: 160rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.info {
				margin-left: 20rpx;
				color: #eee;
				font-size: 30rpx;
				line-height: 40rpx;

				.title {
					font-size: 34rpx;
					color: #fff;
				}
			}
		}
	}

	//主体区
	.content_box {
		background-color: #fff;
		padding: 50rpx 30rpx;
		height: 100%;
		margin-top: -80rpx;
		z-index: 999;
		border-radius: 50rpx 50rpx 0 0;
	}

	//小说内容
	.bookInfo {
		.text {
			padding: 35rpx 0;
		}

		.catalog {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 10rpx;
			background-color: #eee;
			border-radius: 15rpx;

			.catalog_text {
				font-size: 36rpx;
				font-weight: 600;
			}

			.catalog_list {
				color: #666;
				display: flex;
				align-items: center;

				span {
					font-size: 30rpx;
					margin-right: 20rpx;
				}

				i {
					font-size: 30rpx;
				}
			}
		}
	}

	//开始阅读 加入书架
	.bookBottom {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;

		.box {
			height: 150rpx;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			text-align: center;

			.bookshelf {
				flex: 1;

				.icon-file {
					font-size: 60rpx;
					font-weight: 600;
				}

				.text {
					font-size: 28rpx;
				}
			}

			.startRead {
				flex: 1;

				.u-button {
					width: 280rpx;
				}
			}
		}
	}

	//弹出框
	.bookList {
		width: 60vw;

		.list {
			box-sizing: border-box;
			padding-left: 20rpx;
			text-align: left;
			line-height: 100rpx;
			font-size: 32rpx;
			list-style-type: none;
			width: 100%;
			height: 100rpx;
			// background-color: #0eb0c9;
			border-bottom: 1px solid #eee;
		}
	}
</style>