<template>
	<view class="thank">
		<view class="title">
			<h1>开发本软件离不开以下的技术支持</h1>
		</view>
		<view class="content">
			<i class="iconfont icon-Bing"></i>
			<view class="xx">
				<image src="https://i0.hdslb.com/bfs/face/16dc840169e14af3feca5f4eb316beb698b75a5e.jpg@240w_240h_1c_1s.webp"></image>
			</view>
			<view class="hb">
				<image src="https://web-assets.dcloud.net.cn/unidoc/zh/logo.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.thank{
		width: 100vw;
		height: 100vh;
		background-image:url(https://img.cdn.aliyun.dcloud.net.cn/hbuilderx/website/en/hx_bg@1x.png) ;
		background-size: cover;
		background-repeat: no-repeat;
	}
.title{
	font-size: 20rpx;
	padding: 20rpx;
	text-align: center;
	color: #666;
}

.content{
	padding: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.xx{
		width: 280rpx;
		height: 280rpx;
		margin-bottom: 70rpx;
		
		image{
			width: 100%;
			height: 100%;
			border-radius: 30rpx;
		}
	}
	.hb{
		width: 298rpx;
		height: 109rpx;
		margin-top: 70rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
	i{
		font-size: 100rpx;
		line-height: 280rpx;
	}
}
</style>
