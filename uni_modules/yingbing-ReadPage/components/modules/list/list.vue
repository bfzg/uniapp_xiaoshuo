<template>
	<view class="yb-list yb-flex">
		<!-- #ifdef APP-VUE || H5 || MP-WEIXIN || MP-QQ -->
		<view class="yb-refresh yb-flex yb-flex-1"
		:prop="pulldownProp" :change:prop="pulldownwxs.propWatcher"
		@touchstart="pulldownwxs.touchstart"
		@touchmove="pulldownwxs.touchmove"
		@touchend="pulldownwxs.touchend">
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<view class="yb-refresh yb-flex yb-flex-1" ref="ybRefresh">
		<!-- #endif -->
		
			<!-- #ifdef APP-VUE || H5 || MP-WEIXIN || MP-QQ -->
			<view ref="ybListPulldown" class="yb-list-pulldown yb-flex">
				<list-pulldown :status="pulldownStatus" :options="pulldownOptionsSync">
					<template v-slot:pulldown-symbol>
						<slot name="pulldown-symbol"></slot>
					</template>
					<template v-slot:pulldown-loading>
						<slot name="pulldown-loading"></slot>
					</template>
					<template v-slot:pulldown-success>
						<slot name="pulldown-success"></slot>
					</template>
					<template v-slot:pulldown-fail>
						<slot name="pulldown-fail"></slot>
					</template>
					<template v-slot:pulldown-end>
						<slot name="pulldown-end"></slot>
					</template>
				</list-pulldown>
			</view>
			<!-- #endif -->
			
			<scroll-view
			scroll-y
			:render-whole="true"
			@scroll="onScroll"
			:scroll-top="scrollTop"
			:scroll-with-animation="scrollWithAnimation"
			ref="ybPulldownScroller"
			class="yb-pulldown-scroller yb-pulldown-scroll-view"
			@scrolltoupper="onScrolltoupper"
			@scrolltolower="onScrolltolower">
				<!-- #ifdef APP-NVUE -->
				<template v-if="pulldownOptionsSync.show">
					<refresh :display="display" @pullingdown="pullingdown($event.pullingDistance)" @refresh="refresh">
						<view class="yb-flex" style="height: 30rpx;"></view>
						<list-pulldown :status="pulldownStatus" :options="pulldownOptionsSync">
							<template v-slot:pulldown-symbol>
								<slot name="pulldown-symbol"></slot>
							</template>
							<template v-slot:pulldown-loading>
								<slot name="pulldown-loading"></slot>
							</template>
							<template v-slot:pulldown-success>
								<slot name="pulldown-success"></slot>
							</template>
							<template v-slot:pulldown-fail>
								<slot name="pulldown-fail"></slot>
							</template>
							<template v-slot:pulldown-end>
								<slot name="pulldown-end"></slot>
							</template>
						</list-pulldown>
						<view class="yb-flex" style="height: 20rpx;"></view>
					</refresh>
				</template>
				<!-- #endif -->
				<slot></slot>
				<template v-if="loadmoreOptionsSync.show">
					<list-loadmore :status="loadmoreStatus" :options="loadmoreOptionsSync" @reload="reload">
						<template v-slot:loadmore-symbol>
							<slot name="loadmore-symbol"></slot>
						</template>
						<template v-slot:loadmore-loading>
							<slot name="loadmore-loading"></slot>
						</template>
						<template v-slot:loadmore-fail>
							<slot name="loadmore-fail"></slot>
						</template>
						<template v-slot:loadmore-end>
							<slot name="loadmore-end"></slot>
						</template>
					</list-loadmore>
				</template>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import Util from '@/uni_modules/yingbing-ReadPage/js_sdk/util.js'
	import ListPulldown from './modules/pulldown/pulldown.vue'
	import ListLoadmore from './modules/loadmore/loadmore.vue'
	import PulldownMixin from './modules/pulldown/pulldown.js'
	import LoadmoreMixin from './modules/loadmore/loadmore.js'
	export default {
		mixins: [PulldownMixin, LoadmoreMixin],
		options: {
			addGlobalClass: true,
			virtualHost: true,  //  将自定义节点设置成虚拟的，更加接近Vue组件的表现。我们不希望自定义组件的这个节点本身可以设置样式、响应 flex 布局等，而是希望自定义组件内部的第一层节点能够响应 flex 布局或者样式由自定义组件本身完全决定
		},
		components: {
			ListPulldown,
			ListLoadmore
		},
		props: {
			//下拉加载配置
			pulldown: {
				type: [Object,Boolean],
				default () {
					return new Object
				}
			},
			//触底加载更多配置
			loadmore: {
				type: [Object,Boolean],
				default () {
					return new Object
				}
			}
		},
		data () {
			return {
				scrollTop: 0,
				scrollWithAnimation: false
			}
		},
		computed: {
			Util () {
				return Util
			}
		},
		methods: {
			onScrolltoupper () {
				this.$emit('scrolltoupper')
			},
			scrollTo (offset, animated = false) {
				this.scrollWithAnimation = animated
				this.$nextTick(function() {
					this.scrollTop = offset - 1
					this.$nextTick(function () {
						this.scrollTop = offset
					})
				})
			},
			onScroll (e) {
				this.$emit('scroll', {
					scrollTop: e.detail.scrollTop,
					scrollHeight: e.detail.scrollHeight,
					scrollWidth: e.detail.scrollWidth
				})
			}
		}
	}
</script>

<!-- #ifdef APP-VUE || H5 || MP-WEIXIN || MP-QQ -->
<script module="pulldownwxs" lang="wxs" src="./modules/pulldown/pulldown.wxs"></script>
<!-- #endif -->

<style scoped>
	@import url(@/uni_modules/yingbing-ReadPage/css/common.css);
	.yb-list {
		position: relative;
		flex: 1;
		/* #ifndef APP-NVUE */
		overflow: visible;
		/* #endif */
	}
	.yb-list .yb-refresh {
		position: relative;
		/* #ifndef APP-NVUE */
		overflow: visible;
		/* #endif */
	}
	.yb-list .yb-list-pulldown {
		height: 400rpx;
		margin-top: -400rpx;
		justify-content: flex-end;
		padding: 40rpx 0;
	}
	.yb-pulldown-scroller {
		/* #ifndef APP-NVUE */
		overflow: visible;
		/* #endif */
	}
	.yb-list .yb-pulldown-scroll-view {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>
