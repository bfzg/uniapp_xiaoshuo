<template>
	<view class="box">
		<view class="item">
			<view class="img" @click="goDetail(item)">
				<image :src="item.cover">
				</image>
			</view>
			<view class="text" @click="goDetail(item)">
				<view class="title">
					{{item.title}}
				</view>
				<view class="center">
					{{item.descs}}
				</view>
				<view class="upTime">
					<i class="iconfont icon-light"></i>
					<span>
						<uni-dateformat format="yyyy-MM-dd" :date="item.updateTime"></uni-dateformat>
					</span>
				</view>
			</view>
			<view class="btn" @click.stop="show = true">
				<i class="iconfont icon-sortlight"></i>
			</view>

		</view>
		<!-- 弹出框 -->
		<u-popup :closeable="true" :show="show" @close="close">
			<view>
				<view class="bookInfo">
					<view class="bookInfo_img">
						<image :src="item.cover" mode=""></image>
					</view>
					<view class="bookInfo_text">
						<view class="title">
							{{item.title}}
						</view>
						<view class="center">
							{{item.descs}}
						</view>
					</view>
					<view class="bookInfo_detail" @click="goBtnDetail(item.fictionId)">
						<u-button type="primary" :plain="true" text="详情"></u-button>
					</view>
				</view>
				<view class="btn_list">
					<view class="top" v-if="deleteType">
						<span>置顶</span>
						<u-switch v-model="switchs"></u-switch>
					</view>
					<view v-if="deleteType">
						<u-button @click="deleteBook(item.fictionId)" type="error" shape="circle" text="删除"></u-button>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import sqliteDB from '@/sqlite/sqlite.js'
	export default {
		props: {
			item: {
				type: Object,
				default () {
					return {}
				}
			},
			jumpType: {
				type: Boolean,
				default () {
					return true
				}
			},
			deleteType:{
				type:Boolean,
				default (){
					return false
				}
			}
		},
		data() {
			return {
				show: false,
				switchs: false,  //是否置顶
			}
		},
		methods: {
			close() {
				this.show = false
			},

			//跳转到详情页
			goDetail(item) {
				if (this.jumpType) {
					uni.navigateTo({
						url: "/pages/detail/detail?id=" + item.fictionId
					})
				} else {
					this.$store.commit("addArticleID", JSON.parse(item.chapterList));
					uni.navigateTo({
						url: "/pages/textPage/textPage?id=" + item.chapterid + "&chaptertitle=" + item
							.chaptertitle + "&index=" + item.chapterindex + "&bookId=" + item.fictionId
					})
				}
			},
			//点击跳转到详情页
			goBtnDetail(fictionId) {
				uni.navigateTo({
					url: "/pages/detail/detail?id=" + fictionId
				})
			},
			//删除书籍
			async deleteBook(fictionId) {
				let open = sqliteDB.isOpen();
				if (open) {
					let res = await sqliteDB.deleteTableData("bookshelf",fictionId);
					uni.showToast({
						title: '请刷新!',
						icon: 'none',
						duration: 2000
					})  
				} else {
					console.log('数据库未打开!');
				}
			}
		}
	}
</script>

<style lang="less">
	.item {
		width: 100%;
		height: 200rpx;
		padding: 10rpx;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		box-sizing: border-box;
		border-bottom: 2px solid #eee;
		overflow: hidden;
	}

	.img {
		width: 120rpx;
		height: 160rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.text {
		line-height: 50rpx;
		width: 420rpx;

		.title {
			font-size: 32rpx;
			font-weight: 600;

		}

		.center {
			font-size: 30rpx;
			color: #666;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.upTime {
			color: #666;

			i {
				color: #6cccff;
			}
		}
	}


	//详情样式
	.bookInfo {
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 10px;
		box-sizing: border-box;

		.bookInfo_img {
			width: 200rpx;
			height: 240rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.bookInfo_text {
			line-height: 50rpx;
			width: 420rpx;
			margin-left: 10rpx;

			.title {
				font-size: 32rpx;
				font-weight: 600;

			}

			.center {
				font-size: 30rpx;
				color: #666;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

		}
	}

	.btn_list {
		padding: 30rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-evenly;

		view {
			width: 180rpx;
			height: 80rpx;
			// background-color: #6cccff;
			line-height: 80rpx;
			color: #999;
			text-align: center;
		}

		.top {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
</style>