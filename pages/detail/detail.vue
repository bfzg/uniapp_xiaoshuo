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
						<span>共 {{allChapterListLength}} 章</span>
						<i class="iconfont icon-sortlight"></i>
					</view>
				</view>
			</view>
			<view class="bookBottom">
				<view class="box">
					<view class="bookshelf" @click="addBookShelf(bookInfo.fictionId)">
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
		<catalog ref="catalog"  :sourceData="bookInfo.chapterList"></catalog>
	</view>
</template>

<script>
	import {getBookListInfo} from '@/request/api.js';
	import {store} from '@/uni_modules/uni-id-pages/common/store.js'
	import {whetherToLogin} from '@/utils/Toos.js'
	import sqliteDB from '@/sqlite/sqlite.js'
	import {goToReadRouter,deepCopy} from '@/utils/Toos.js';
	const collectBook = uniCloud.importObject('collect-book', {
		customUI: true
	});
	const db = uniCloud.database();
	export default {
		data() {
			return {
				bookInfo: {},   //书籍信息，包含全部章节，小说相关信息
				allChapterListLength: 0 // 文章长度
			};
		},
		onLoad(e) {
			this.getBookInfo(e.currentBookId);
		},
		methods: {
			//获取数据
			async getBookInfo(currentBookId) {
				let {data:res} = await getBookListInfo(currentBookId);
				this.allChapterListLength = res.count;
				//给每个章节对象都加上index
				for (let i = 0; i < res.data.chapterList.length; i++) {
					res.data.chapterList[i].index = i
				}
				this.bookInfo = res.data
				//获取数据后初始化展开更多阅读
				this.$nextTick(() => {
					this.$refs.uReadMore.init();
				})
				this.$store.commit('getChapterList', this.bookInfo.chapterList);
				this.$store.commit('getChapterListLength', res.count);
				this.$store.commit('getpresentArticle',this.bookInfo.chapterList[0])
			},
			//返回上一页
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			//点击显示弹出框
			clickPopup() {
				console.log(this.bookInfo);
				this.$refs.catalog.open()
				
			},
			//开始阅读
			startRead() {
				goToReadRouter(this.bookInfo.chapterList[0].chapterId,this.bookInfo.chapterList[0].title,this.bookInfo
						.chapterList[0].index,this.bookInfo.fictionId,0)
			},
			//添加到书架
			async addBookShelf(fictionId) {
				let res = await sqliteDB.selectTableData("bookshelf");
				let check = res.some(e=>{
					return e.fictionId == fictionId
				})
				if(check){
					uni.showToast({
						title: '您已经添加过了!',
						icon: 'error',
						duration: 2000
					})  
					return;
				}
				this.insertTableData();
			},
			

			//新增数据
			insertTableData() {
				let open = sqliteDB.isOpen();
				if (open) {
					let infoObj = deepCopy(this.bookInfo);
					infoObj.chapterList = JSON.stringify(infoObj.chapterList)
					infoObj.chapterindex =  this.bookInfo.chapterList[0].index;
					infoObj.chaptertitle =  this.bookInfo.chapterList[0].title;
					infoObj.chapterid =  this.bookInfo.chapterList[0].chapterId;
					let keys = Object.keys(infoObj);
					let values = Object.values(infoObj);
					let valuesStr = values.map(v => `'${v}'`).join(",");
					sqliteDB.insertTableData("bookshelf", valuesStr, keys).then(res => {
						console.log('新增数据成功!');
						uni.showToast({
							title: '添加成功!',
							icon: 'success'
						})
					}).catch(error => {
						console.log('新增数据失败!');
						console.log(error);
					})
				} else {
					console.log("数据未打开!");
				}
			},

			delete() {
				sqliteDB.dropTable("bookshelf");
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
			transform: scale(1.5);		
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