<template>
	<view>
		<!-- 顶部用户信息背景 -->
	
		<!-- 顶部用户头像信息 -->
		<view class="userInfo_top">
			<view class="avatar">
				<u-avatar size="100" src="../../static/img/my2.png"></u-avatar>
			</view>
			<view class="info">
				<view class="title" v-if="hasLogin">
					<span>yuan</span>
					<i class="iconfont icon-icon-test5"></i>
				</view>
				<view class="title" v-else>
					<span @click="goLogin">登录或创建用户</span>
					<i class="iconfont icon-icon-test5"></i>
				</view>
				<view class="time">
					注册时间: 2023-4-15
				</view>
			</view>
		</view>
		
		<!-- 功能列表区 -->
		<view class="fun_list">
			<view class="list">
				<view class="item">
					<span>反馈</span>
					<i class="iconfont icon-icon-test5"></i>
				</view>
				<view class="item">
					<span>设置</span>
					<i class="iconfont icon-icon-test5"></i>
				</view>
				<view class="btn" @click="logout">
					<u-button type="error" shape="circle" text="退出登录"></u-button>
				</view>
			</view>
		</view>
		<view class="backImg">
			<image src="../../static/img/my2.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	export default {
		data() {
			return {

			};
		},
		computed: {
			//判断是否登录
			hasLogin() {
				return store.hasLogin;
			}
		},
		methods: {
			//跳转到登录页
			goLogin() {
				console.log(11111);
				uni.navigateTo({
					url: "/uni_modules/uni-id-pages/pages/login/login-withpwd"
				})
			},
			//退出登录
			logout() {
				if (this.goLoginPage()) return;
				uni.showModal({
					title: "是否确定退出登录",
					success: res => {
						if (res.confirm) {
							mutations.logout();
						}
					}
				})
			},
			goLoginPage() {
				if (!this.hasLogin) {
					uni.showToast({
						title: "未登录!",
						icon: 'none'
					})
					return true;
				}
				return false;
			}
		}
	}
</script>

<style lang="scss">
	//头部用户信息背景图
	.backImg {
		width: 100%;
		height: 500rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		image {
			width: 100%;
			height: 100%;
			-webkit-filter: blur(20px);
			filter: blur(20px);
			transform: scale(1.5);			
			opacity: 0.5;
		}
	}

	// <!-- 顶部用户头像信息 -->
	.userInfo_top {
		padding: 100rpx 30rpx;
		display: flex;
		align-items: center;

		.avatar {
			margin-right: 35rpx;

			.u-avatar {
				border: 2rpx solid #eee;
			}
		}

		.info {
			color: #222;

			.title {
				font-size: 46rpx;
				margin-bottom: 10rpx;

				i {
					font-size: 46rpx;
				}
			}

			.time {
				font-size: 26rpx;
				color: #555;
			}
		}
	}

	//功能列表
	.fun_list {
		margin-top: -40rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 30rpx 30rpx 0 0;

		.list {
			height: 100rpx;
			line-height: 100rpx;

			.item {
				margin: 20rpx 0;
				background-color: #eee;
				padding: 0 20rpx;
				border-radius: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 36rpx;
				font-weight: 600;
				color: #222;

				i {
					font-size: 36rpx;
				}
			}

			.btn {				
				margin: 50rpx auto;
				.u-button{
					width: 500rpx;
					height: 80rpx;
				}
			}
		}
	}
</style>