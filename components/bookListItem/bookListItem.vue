<template>
	<view class="box">
		<view class="item">
			<view class="img">
				<image :src="item.cover">
				</image>
			</view>
			<view class="text">
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
			<view class="btn" @click="show = true">
				<i class="iconfont icon-sortlight"></i>
			</view>

		</view>
		<!-- 弹出框 -->
		<u-popup :show="show" @close="close" @open="open">
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
					<view class="bookInfo_detail">
						<u-button type="primary" :plain="true" text="详情"></u-button>
					</view>
				</view>
				<view class="btn_list">
					<view class="top">
						<span>置顶</span>
						<u-switch v-model="switchs" @change="change"></u-switch>
					</view>
					<view class="like">
						<span>加入书架</span>
						<!-- <span>移除书架</span> -->
						<!-- <i class="iconfont icon-favor_light"></i> -->
						<i class="iconfont icon-favor_fill_light"></i>
						
					</view>
					<view class="catalog">
						<span>目录</span>
						<i class="iconfont icon-sortlight"></i>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
				show: false,
				switchs:false
			}
		},
		methods: {
			open() {
				console.log('open');
			},
			close() {
				this.show = false
				console.log('close');
			},
			change(e) {
				console.log('change', e);
			},
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
			i{
				color: #6cccff;
			}
		}
	}
	
	
//详情样式
.bookInfo{
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 10px;
	box-sizing: border-box;
	.bookInfo_img{
		width: 200rpx;
		height: 240rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.bookInfo_text{
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

.btn_list{
	padding: 30rpx 30rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	view{
		width: 180rpx;
		height: 80rpx;
		// background-color: #6cccff;
		line-height: 80rpx;
		color: #999;
		text-align: center;
	}
	.top{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.like{
		i{
			font-size: 38rpx;
			color: #6cccff;
		}
	}
	.catalog{
		i{
			font-size: 36rpx;
			color: #6cccff;
		}
	}
}
</style>