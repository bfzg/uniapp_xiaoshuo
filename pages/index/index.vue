<template>
	<view class="content">
		<view class="book_list">
			<bookListItem></bookListItem>
		</view>
		<view class="add iconfont icon-refresh">
		</view>
	</view>
</template>

<script>
	import bookListItem from '@/components/bookListItem/bookListItem.vue';
	export default {
		data() {
			return {
				title: 'Hello',
			}
		},
		onLoad() {
		},
		methods: {

		},
		components:{
			bookListItem
		}
	}
</script>

<style lang="scss">
	.add{
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		box-shadow: #00ACF6 0 0 20rpx;
		background-color: #00ACF6;
		position: absolute;
		text-align: center;
		line-height: 120rpx;
		color: #fff;
		font-size: 42rpx;
		bottom: 100rpx;
		right: 60rpx;
	}
</style>
