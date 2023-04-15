<template>
	<view class="search">
		<view class="search_box">
			<input v-model="value" type="text" maxlength="20" focus placeholder="日照香炉生紫烟">
			<u-button type="primary" text="搜索" @click="goToDetail"></u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: ''
			};
		},
		methods: {
			// 跳转搜索详情
			goToDetail() {
				console.log(this.value);
				uni.navigateTo({
					url: '/pages/list/list?title=' + this.value
				})
			}
		}
	}
</script>

<style lang="scss">
	.search {
		width: 100vw;
		height: 100vh;
		background: url('../../static/img/back.jpg') no-repeat;
		background-size: cover;
	}

	.search_box {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
		
		input {
			border: 1px solid #999;
			width: 450rpx;
			height: 100rpx;
			box-shadow: #fff 0 0 25rpx;
			border-radius: 20rpx;
			padding-left: 10rpx;
			box-sizing: border-box;
			background-color: #fff;
		}

		.u-button {
			width: 120rpx;
			height: 100rpx;
			margin-left: 20rpx;
			box-shadow: #f26b1f 0 0 20rpx;
			background-color: #f26b1f;
			border: none;
		}
	}
</style>