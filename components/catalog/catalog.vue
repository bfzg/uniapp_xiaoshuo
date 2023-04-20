<template>
	<view>
		<u-popup :show="show" mode="left" @close="close">
			<view>
				<scroll-view :scroll-anchoring="true" class="scroll-container" scroll-y="true" @scroll="scrollEvent"
					:style="{ height: containerHeight}">
					<!--可视区域里所有数据的渲染区域-->
					<view class="list" :style="{ top: top + 'px', ...customStyle }">
						<view class="back_btn">
							<i class="iconfont icon-back" @click="fartherClick"></i>
						</view>
						<!--单条数据渲染区域-->
						<view class="content_box">
							<view v-for="(item, index) in sourceData" :key="index"
								@click="goTextPage(item.chapterId,item.title,item.index)">
								<view class="titleStyle">
									{{item.title}}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: "catalog",
		props: {
			sourceData: {
				type: Array,
				required: true, //是否必填
				default: () => []
			},
			// 当前小说id
			currentBookId:{
				type:String,
				default:()=>''
			},
			// 滚动容器总高度
			containerHeight: {
				type: String,
				default: '100vh',
			},
			//每条数据所占高度
			itemHeight: {
				type: Number,
				default: 200,
				required: false
			},
			//每次加载到可视区域的数量，itemHeight X showNum 要大于可视区域高度 ，否则页面滚动不了
			showNum: {
				type: Number,
				default: 500,
				required: false
			},
			// 自定义列表样式
			customStyle: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				showList: [], //可视区域显示的数据				
				top: 0, //偏移量
				scrollTop: 0, //卷起的高度
				startIndex: 0, //可视区域第一条数据的索引
				endIndex: 0, //可视区域最后一条数据后面那条数据的的索引，因为后面要用slice(start,end)方法取需要的数据，但是slice规定end对应数据不包含在里面
				show: false
			};
		},
		created() {
			//计算可视区域数据
			this.getShowList()
		},
		methods: {
			//计算可视区域数据
			getShowList() {
				this.startIndex = Math.floor(this.scrollTop / this.itemHeight) //可视区域第一条数据的索引
				this.endIndex = this.startIndex + this.showNum //可视区域最后一条数据的后面那条数据的索引
				this.showList = this.sourceData.slice(this.startIndex, this
					.endIndex) //可视区域显示的数据，即最后要渲染的数据。实际的数据索引是从this.startIndex到this.endIndex-1
				this.top = this.scrollTop - (this.scrollTop % this
					.itemHeight) //在这需要获得一个可以被itemHeight整除的数来作为item的偏移量，这样随机滑动时第一条数据都是完整显示的
			},
			//区域滚动事件
			scrollEvent(e) {
				this.scrollTop = e.detail.scrollTop
				this.getShowList()
			},
			// 刷新组件
			refresh() {
				setTimeout(() => {
					this.getShowList()
					this.scrollTop = 0
				})
			},
			//点击显示弹出框
			fartherClick() {
				this.show = !this.show
			},
			close() {
				this.show = false
			},
			//跳转到文章页面
			goTextPage(id, title, index) {
				//存储当前阅读数据
				this.$store.commit("getCurrentArticleIndex", index);
				this.$store.commit("getpresentArticle",{id,title,index})
				uni.redirectTo({
					url: "/pages/textPage/textPage?id=" + id + "&chaptertitle=" + title + "&index=" + index+"&bookId=" + this.currentBookId
				})
			},
		}
	}
</script>

<style lang="scss">
	.titleStyle {
		height: 100rpx;
		padding-left: 20rpx;
	}

	.back_btn {
		width: 100%;
		height: 180rpx;
		position: sticky;
		top: 0;
		line-height: 200rpx;
		padding-left: 30rpx;
		background-color: #fff;

		i {
			font-size: 46rpx;
		}
	}

	.content_box {
		margin-top: 10rpx;
	}
</style>