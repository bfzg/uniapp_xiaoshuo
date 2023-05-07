<template>
	<uni-popup ref="popup" class="popup" :mask-click="true" background-color="#fff" type="left">
		<view>
			<view class="back_btn">
				<i class="iconfont icon-back" @click="close"></i>
			</view>
			<scroll-view ref="scrollView" :scroll-anchoring="true" @scrolltolower="scrolltolower" :lower-threshold="260"
				:scroll-into-view="'tab'+readChapterIndex" class="scroll-container" scroll-y="true">
				<!-- 单条数据渲染区域 -->
				<view :id="'tab'+item.chapterId" v-for="(item, index) in renderingData" :key="index"
					@click="goTextPage(item.chapterId,item.title,item.index)" class="titleStyle"
					:class="item.chapterId == currentChapterId ? 'current_chapter' : ''">
					{{item.title}}
				</view>
			</scroll-view>
		</view>
	</uni-popup>
</template>

<script>
	import {goToReadRouterCatalog} from '@/utils/Toos.js';
	import articleDataPreloading from '@/utils/articleDataFilter.js'
	export default {
		name: "catalog",
		props: {
			//所有章节
			sourceData: {
				type: Array,
				required: true, //是否必填
				default: () => []
			},
			// 当前小说id
			currentBookId: {
				type: String,
				default: () => ''
			},
		},
		data() {
			return {
				currentChapterId:'', //当前正在阅读的id
				size: 200,	//每次截取的个数
				renderingData:[],	//截取后的数据
				index:0,		//控制开始截取位置
				readChapterIndex:null
			};
		},
		methods: {
			//跳转到文章页面
			goTextPage(chapterId, title, index) {
				//存储当前阅读数据
				this.$store.commit("getpresentArticle", {chapterId,title,index})
				goToReadRouterCatalog(chapterId, title, index, this.sourceData.fictionId || this.currentBookId);
			},
			open() {
				this.currentChapterId = this.$store.state.article.presentArticle.chapterId
				this.$refs.popup.open('left');
				this.sliceData();
				this.thisCurrentReadChapter();
			},
			close() {
				this.$refs.popup.close()
			},
			//列表触底触发事件
			scrolltolower(){
				this.sliceData();
			},
			//向下截取数据
			sliceData() {
				if(this.index >= this.sourceData.length){
					uni.showToast({ title: "没有更多数据了", icon: "none", });
					return; 
				}
				console.log('触发了触底事件!');
				let next = this.sourceData.slice(this.index,this.index + this.size);
				this.renderingData=[...this.renderingData,...next];
				console.log(this.renderingData);
				this.index += this.size
			},
			//指向当前正在阅读的章节
			thisCurrentReadChapter(){
			let  classArticle = new articleDataPreloading(this.renderingData);
			let chapter = classArticle.findCurrentReadChapter(this.currentChapterId)
			if(chapter != undefined){
				this.readChapterIndex = chapter.chapterId
			}else{
				this.sliceData();
				this.thisCurrentReadChapter();
			}
			
			}
		}
	}
</script>

<style lang="scss">
	.popup{
		z-index: 9999;
	}
	.titleStyle {
		padding: 20rpx 0;
		color: #444;
		font-size: 34rpx;
		width: 480rpx;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.back_btn {
		width: 100rpx;
		height: 150rpx;
		line-height: 200rpx;
		padding-left: 30rpx;

		i {
			font-size: 46rpx;
		}
	}

	.scroll-container {
		white-space: nowrap;
		height: 100vh;
		margin-top: 10rpx;
		padding-left: 20rpx;
	}

	.current_chapter {
		color: #000;
		font-size: 42rpx;
		font-weight: 700;
	}
</style>