<template>
	<view class="content">
		<view v-for="item in bookInfo" :key="item.id">
			<bookListItem :deleteType="true" :jumpType="false" :item="item"></bookListItem>
		</view>
		<view class="add iconfont icon-refresh" @click="clickRefresh"></view>
		<!-- <view class="delete" @click="deleteTable">
			
		</view> -->
	</view>
</template>

<script>
	import sqliteDB from '@/sqlite/sqlite.js'
	import bookListItem from '@/components/bookListItem/bookListItem.vue';
	import {deepCopy} from '@/utils/Toos.js'
	import {getBookListInfo} from '@/request/api.js'
	export default {
		data() {
			return {
				bookInfo: [],
				listLoading: false, //判断是否正在加载中
			}
		},
		onShow() {
			this.selectTableData()
		},
		onReady() {
			this.selectTableData()
		},
		onLoad() {
			this.createTable();
		},
		//下拉触底函数
		async onPullDownRefresh() {
			await this.updataDB();
			this.selectTableData();
		},
		methods: {
			//点击刷新
			clickRefresh() {
				this.selectTableData();
				this.updataDB()
			},
			//查询表数据
			async selectTableData() {
				let open = sqliteDB.isOpen();
				if (open) {
					sqliteDB.selectTableData("bookshelf").then(res => {
						this.bookInfo = res
						console.log(res);
					}).catch(error => {
						console.log(error);
					});
				} else {
					console.log('数据库未打开!');
				}
			},
			//创建表
			async createTable() {
				let open = sqliteDB.isOpen();
				if (open) {
					let sql =
						'"id" INTEGER PRIMARY KEY AUTOINCREMENT,"title" text,"author" text,"chapterList" Memo,"cover" text,"descs" Memo,"fictionId" text,"fictionType" text,"updateTime" text,"chapterindex" integer,"chaptertitle" text,"chapterid" text';
					let res = await sqliteDB.createTable("bookshelf", sql)
				} else {
					console.log("数据库未打开!");
				}
			},
			//更新表数据
			async updataDB() {
				let open = sqliteDB.isOpen();
				if (open) {
					let bookArr = deepCopy(this.bookInfo);
					let bookID = bookArr.map(({
						id,
						fictionId
					}) => ({
						id,
						fictionId
					}));
					for (let i = 0; i < bookID.length; i++) {
						let res = await getBookListInfo(bookID[i].fictionId);
						if (res.data.code == 0) {
							for (let i = 0; i < res.data.data.chapterList.length; i++) {
								res.data.data.chapterList[i].index = i
							}
							let chapterList = JSON.stringify(res.data.data.chapterList);
							sqliteDB.updataSQL(chapterList, res.data.data.updateTime, bookID[i].id).then(res => {

							}).catch(error => {
								console.log('更新失败!');
							})
						}
					}
					uni.stopPullDownRefresh();
					uni.showToast({
						title: '更新完成!',
						icon: 'success',
						duration: 2000
					})
				}
			},
			//删除表
			deleteTable(){
				sqliteDB.dropTable("bookshelf").then(res=>{
					console.log('删除成功!');
				}).catch(error=>{
					console.log('删除失败!');
				})
			}
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
		bottom: 120rpx;
		right: 70rpx;
	}
	.delete{
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		box-shadow: #00ACF6 0 0 20rpx;
		background-color: #00ff7f;
		position: fixed;
		text-align: center;
		line-height: 120rpx;
		color: #fff;
		font-size: 42rpx;
		bottom: 250rpx;
		right: 70rpx;
	}
</style>