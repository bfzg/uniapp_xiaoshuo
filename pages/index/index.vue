<template>
	<view class="content">
		<view v-for="item in bookInfo" :key="item.id">
			<bookListItem :jumpType="false" :item="item"></bookListItem>
		</view>
		<view class="add iconfont icon-refresh" @click="selectTableData">
		</view>
	</view>
</template>

<script>
	import sqliteDB from '@/sqlite/sqlite.js'
	import bookListItem from '@/components/bookListItem/bookListItem.vue';
	export default {
		data() {
			return {
				bookInfo:[]
			}
		},
		onReady(){
			this.selectTableData()
		},
		onLoad() {
			this.openSQL()
		},
		methods: {
			//打开sqlite数据库
			openSQL(){
				let open = sqliteDB.isOpen();
				console.log("数据库状态",open ? '开启' : '关闭');
				if(!open){
					sqliteDB.openSqlite().then(res=>{
						console.log("数据库已打开");
					}).catch(error=>{
						console.log("数据库开启失败");
					})
				}
			},
			//查询表数据
			selectTableData() {
				let open = sqliteDB.isOpen();
				if (open) {
					sqliteDB.selectTableData("bookshelf").then(res => {
						console.log(res);
						this.bookInfo = res;
					}).catch(error => {
						console.log('查询失败!');
					})
				} else {
					console.log('数据库未打开!');
				}
			},
		},
		components: {
			bookListItem
		}
	}
</script>

<style lang="scss">
	.add {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		box-shadow: #00ACF6 0 0 20rpx;
		background-color: #00ACF6;
		position: fixed;
		text-align: center;
		line-height: 120rpx;
		color: #fff;
		font-size: 42rpx;
		bottom: 100rpx;
		right: 60rpx;
	}
</style>