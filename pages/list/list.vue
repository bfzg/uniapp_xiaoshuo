<template>
	<view>
		<view v-for="(item,index) in booksInfo" :key="index">
				<bookListItem :item="item"></bookListItem>
		</view>
	</view>
</template>

<script>
	import bookListItem from '@/components/bookListItem/bookListItem.vue';
	import {searchBook} from '@/request/api.js';
	export default {
		data() {
			return {
				booksInfo: [],
				show: true,
				params: {
					title: '',
					start: 1,
					end: 10
				},
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
			},

		},
		components: {
			bookListItem
		}
	}
</script>

<style lang="scss">

</style>