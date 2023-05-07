<template>
	<view class="set_up">
		<view class="item" @click="importCloudSet">
			<span>从云端导入阅读配置</span>
			<i class="iconfont icon-icon-test5"></i>
		</view>
		<view class="item" @click="checkUpdata">
			<span>检查更新</span>
			<i class="iconfont icon-icon-test5"></i>
		</view>
	</view>
</template>

<script>
	import {goLoginPage} from '@/utils/Toos.js';
	import checkUpdata from "@/uni_modules/uni-upgrade-center-app/utils/check-update.js"
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			//导入云端配置
			importCloudSet(){
				if(goLoginPage()) return;
				uni.showToast({
					title:'开发暂未完成!',
					icon:'error',
					duration:4000
				})
			},
			//检查更新
			checkUpdata(){
				// #ifdef APP-PLUS
				checkUpdata();
				// #endif
				setTimeout(()=>{
					uni.showToast({
						title:'暂时没有更新!',
						icon:'none'
					})
				},3000)
			}
		}
	}
</script>

<style lang="scss">
	.set_up{
		padding: 20rpx;
	}
.item{
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
	height: 100rpx;
	i {
		font-size: 36rpx;
	}
}
</style>
