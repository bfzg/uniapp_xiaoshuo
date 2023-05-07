<template>
	<view>
		<view v-for="(item,index) in booksInfo" :key="index">
			<bookListItem :item="item"></bookListItem>
		</view>
		<view>
			<uni-load-more :status="uniload"></uni-load-more>
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
				booksInfo: [],
				show: true,
				params: {
					title: '',
					start: 1,
					end: 10
				},
				uniload: 'more',
				noMore: false
			};
		},
		onLoad(e) {
			this.params.title = e.title;
			if (this.params.title) {
				this.getBookData();
			}
		},
		//触底事件
		onReachBottom() {
			this.uniload = 'loading';
			if (this.noMore) return;
			this.getBookData();
		},
		methods: {
			//获取小说
			async getBookData() {
				let {data: res} = await searchBook(this.params);
				this.params.start++;
				if (res.code == 1) {
					this.uniload='noMore';
					this.noMore = true;
					this.params.start--;
					return;
				}
				this.booksInfo = this.booksInfo.concat(res.data);
			},

		},
		components: {
			bookListItem
		}
	}
</script>

<style lang="scss">

</style>