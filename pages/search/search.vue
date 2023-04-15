<template>
	<view class="search">
		<view class="search_box">
			<input v-model.trim="value" type="text" maxlength="20" focus placeholder="日照香炉生紫烟">
			<u-button type="primary" text="搜索" @click="goToDetail"></u-button>
		</view>
		<view class="hint">
			<span>使用须知</span><br>
			<span>根据小说标题实现搜索</span>
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
				if(this.value){
					uni.navigateTo({
						url: '/pages/list/list?title=' + this.value
					})
				}
				
			}
		}
	}
</script>

<style lang="scss">
	.search {
		width: 100vw;
		height: 100vh;
		// background: url('../../static/img/back.jpg') no-repeat;
		background-size: cover;
	}

	.search_box {
		position: absolute;
		top: 30%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
		
		input {
			border: 1px solid #999;
			width: 450rpx;
			height: 100rpx;
			box-shadow: #fff 0 0 25rpx;
			border-radius: 50rpx;
			padding-left: 20rpx;
			box-sizing: border-box;
			background-color: #fff;
		}

		.u-button {
			width: 130rpx;
			height: 100rpx;
			margin-left: 20rpx;
			box-shadow: #f26b1f 0 0 20rpx;
			background-color: #f26b1f;
			border: none;
			border-radius: 60rpx;
		}
	}
	.hint{
		padding-top: 20rpx;
		width: 100%;
		text-align: center;
		font-size: 30rpx;
	}
</style>