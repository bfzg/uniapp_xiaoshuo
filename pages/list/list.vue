<template>
	<view>

		<view v-for="(item,index) in booksInfo" :key="index">
			<view @click="goDetail(item)">
				<bookListItem :item="item"></bookListItem>
			</view>
		</view>

	</view>
</template>

<script>
	import bookListItem from '@/components/bookListItem/bookListItem.vue';
	import {
		searchBook
	} from '@/request/api.js';
	export default {
		data() {
			return {
				params: {
					title: '',
					start: 1,
					end: 10
				},
				booksInfo: [],
				show: true
			};
		},
		onLoad(e) {
			this.params.title = e.title;
			if (this.params.title) {
				this.getBookData();
			}
		},
		onReachBottom() {
			//触底函数

		},
		methods: {
			//获取小说
			async getBookData() {
				let {
					data: res
				} = await searchBook(this.params);
				this.booksInfo = res.data;
				console.log(this.booksInfo);

			},
			//跳转到详情页
			goDetail(item){
				uni.navigateTo({
					url:"/pages/detail/detail?id="+item.fictionId
				})
			}
		},
		components: {
			bookListItem
		}
	}
</script>

<style lang="scss">

</style>