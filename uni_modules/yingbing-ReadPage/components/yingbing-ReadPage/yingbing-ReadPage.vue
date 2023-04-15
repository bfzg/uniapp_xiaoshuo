<template>
	<view class="yingbing-read-page" ref="yingbingReadPage" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
		<!-- <computed ref="computedPage" :options="options"></computed> -->
		<!-- 翻页模式 -->
		<view class="yingbing-read-page-flip" :style="{
			'visibility': pageType != 'scroll' ? 'visible' : 'hidden'
		}">
			<template v-if="pageType != 'scroll'">
				<!-- #ifndef APP-NVUE -->
				<view
				class="yingbing-flip"
				ref="yingbingFlip"
				:style="{
					'background': options.bgColor
				}"
				:prop="flipProp"
				:change:prop="flip.propWatcher"
				@touchstart="flip.touchstart"
				@touchmove="flip.touchmove"
				@touchend="flip.touchend">
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
				<view
				class="yingbing-flip"
				ref="yingbingFlip"
				:style="{
					'background': options.bgColor
				}"
				@touchstart="onFilpTouchstart"
				@touchmove="onFilpTouchmove"
				@touchend="onFilpTouchend">
				<!-- #endif -->
					<template v-if="isShow">
						<view
						class="flip-item"
						v-for="(item, index) in dataReverse"
						:key="item.dataId + '_flip'"
						:style="{
							'visibility': item.dataId == currentDataId || item.dataId == prevDataId || item.dataId == nextDataId ? 'visible' : 'hidden'
						}">
							<view
							v-if="item.dataId == currentDataId || item.dataId == prevDataId || item.dataId == nextDataId"
							class="flip-item"
							:ref="'flipItem_' + item.dataId"
							:class="'flip-item_' + item.dataId"
							:style="{
								'transform': item.dataId < currentDataId ? `translateX(${-viewWidth}px)` : '',
							}">
								<view
								class="flip-item-wrapper"
								:ref="'flipItemWrapper_' + item.dataId"
								:class="'flip-item-wrapper_' + item.dataId"
								:style="{
									'padding-left': options.slide + 'px',
									'padding-right': options.slide + 'px',
									'padding-top': options.topGap + 'px',
									'padding-bottom': options.bottomGap + 'px',
									'background': options.bgColor,
									'transform': item.dataId < currentDataId ? options.pageType == 'real' ? `translateX(${viewWidth}px)` : 'translateX(0)' : ''
								}">
									<view class="flip-item-header" v-if="options.headerShow">
										<text class="flip-item-header-text" :style="{
											color: options.color
										}">{{item.title}}</text>
									</view>
									<template v-if="item.type == 'text'">
										<view class="flip-item-text flip-item-content"
										>
											<text class="flip-text"
											v-for="(text, i) in item.text" :key="i"
											:style="{
												'margin-top': options.lineHeight + 'px',
												'height': options.fontSize + 'px',
												'font-size': options.fontSize + 'px',
												'color': options.color
											}">{{text}}</text>
										</view>
									</template>
									<template v-else-if="item.type == 'custom'">
										<read-rich-text :richtext="item.text" :pageType="pageType" @customClick="customClick"></read-rich-text>
									</template>
									<template v-else-if="item.type == 'slot'">
										<view class="flip-slot flip-item-content">
											<slot :name="item.text"></slot>
										</view>
									</template>
									<template v-else-if="item.type == 'nextLoading' || item.type == 'prevLoading' ">
										<view class="flip-loading flip-item-content">
											<text :style="{
												'color': options.color,
												'font-size': options.fontSize + 'px'
											}">正在加载内容</text>
										</view>
									</template>
									<template v-else-if="item.type == 'top' || item.type == 'bottom' ">
										<view class="flip-loading flip-item-content">
											<text :style="{
												'color': options.color,
												'font-size': options.fontSize + 'px'
											}">{{item.type == 'top' ? '前面已经没有了' : '后面已经没有了'}}</text>
										</view>
									</template>
									<template v-else>
										<view class="flip-loading flip-item-content">
											<text :style="{
												'color': options.color,
												'font-size': options.fontSize + 'px'
											}">未知类型页面</text>
										</view>
									</template>
									<view class="flip-item-footer" v-if="options.footerShow">
										<text class="flip-item-footer-text" :style="{
											color: options.color
										}">{{filterDate()}}</text>
										<text class="flip-item-footer-text" :style="{
											color: options.color
										}">{{filterPage(item)}}</text>
										<battery :color="options.color" style="opacity: 0.5"></battery>
									</view>
								</view>
								<view
								class="flip-item-bg"
								:ref="'flipItemBg_' + item.dataId"
								:class="'flip-item-bg_' + item.dataId"
								:style="{
									left: viewWidth + 'px',
									width: viewWidth + 'px',
									height: (viewHeight * 1.5) + 'px',
									transform: item.dataId < currentDataId && options.pageType == 'real' ? 'translateX(' + viewWidth + 'px)' : '',
									top: (viewHeight / 2 - (viewHeight * 1.5) / 2) + 'px',
									background: options.bgColor,
								}"></view>
								<view
								class="flip-item-shadow"
								:ref="'flipItemShadow_' + item.dataId"
								:class="'flip-item-shadow_' + item.dataId">
								</view>
							</view>
						</view>
					</template>
				</view>
			</template>
		</view>
		<!-- 翻页模式 -->
		
		<!-- 滚动模式 -->
		<view
		class="yingbing-scroll"
		:style="{
			'background': options.bgColor,
			'visibility': pageType == 'scroll' ? 'visible' : 'hidden'
		}">
			<template v-if="pageType == 'scroll'">
				<scroll-list
				ref="list"
				@scroll="onScroll"
				:pulldown="{show: true, endText: '已经到最前面了'}"
				:loadmore="{show: true, endText: '已经到最后面了'}"
				@pulldown="onPulldown"
				@loadmore="onLoadmore"
				@scrolltoupper="scrolltoupper">
					<view :style="{height: (options.topGap + Util.unitpixel(50)) + 'px'}"></view>
					<view class="scroll-item-wrapper" ref="scrollItemWrapper">
						<view
						:id="'scroll-item_' + item.dataId"
						v-for="(item, index) in pages"
						:key="item.dataId + '_scroll'"
						class="scroll-item"
						:ref="'scrollItem_' + item.dataId"
						:style="{
							'padding-left': options.slide + 'px',
							'padding-right': options.slide + 'px'
						}">
							<template v-if="item.type == 'text'">
								<view class="scroll-item-text scroll-item-content"
								>
									<text class="scroll-text"
									v-for="(text, i) in item.text" :key="i"
									:style="{
										'margin-top': options.lineHeight + 'px',
										'height': options.fontSize + 'px',
										'font-size': options.fontSize + 'px',
										'color': options.color
									}">{{text}}</text>
								</view>
							</template>
							<template v-else-if="item.type == 'custom'">
								<read-rich-text :richtext="item.text" :pageType="pageType" @customClick="customClick"></read-rich-text>
							</template>
							<template v-else-if="item.type == 'slot'">
								<view class="scroll-slot scroll-item-content">
									<slot :name="item.text"></slot>
								</view>
							</template>
						</view>
					</view>
					<view :style="{height: options.bottomGap + 'px'}"></view>
				</scroll-list>
				<view class="scroll-item-header" :style="{
					'top': options.topGap + 'px'
				}" v-if="options.headerShow">
					<text class="scroll-item-header-text">{{(pageInfo.title || '加载中')}}</text>
				</view>
				<view class="scroll-item-footer" :style="{
					'bottom': options.bottomGap + 'px'
				}" v-if="options.footerShow">
					<text class="scroll-item-footer-text">{{scrollDate}}</text>
					<text class="scroll-item-footer-text">{{filterPage(pageInfo)}}</text>
					<battery ref="scrollBattery" color="#fff"></battery>
				</view>
			</template>
		</view>
		<view class="yingbing-loading" v-if="initLoading" :style="{background: options.bgColor}" @tap="reload">
			<list-loading :size="40":visible="initLoading" :color="options.color" :text="loadingText"></list-loading>
		</view>
	</view>
</template>

<script>
	import NochapterMixin from '../modules/nochapter/nochater.js'
	import Battery from '../modules/battery.vue'
	import ReadRichText from '../modules/richtext.vue'
	import FlipMixin from '../modules/flip/flip.js'
	import ScrollMixin from '../modules/scroll/scroll.js'
	import ComputedMixin from '../modules/computed/computed.js'
	// import Computed from '../modules/computed/computed.vue'
	import ScrollList from '../modules/list/list.vue'
	import ListLoading from '../modules/list/modules/common/loading.vue'
	import Util from '../../js_sdk/util.js'
	export default {
		mixins: [FlipMixin, ScrollMixin, ComputedMixin, NochapterMixin],
		components: {
			// Computed,
			Battery,
			ReadRichText,
			ScrollList,
			ListLoading
		},
		props: {
			//字体颜色
			color: {
				type: String,
				default: '#333333'
			},
			//字体大小（单位px）
			fontSize: {
				type: [String, Number],
				default: 15
			},
			//背景颜色
			bgColor: {
				type: String,
				default: '#fcd281'
			},
			//翻页方式
			pageType: {
				type: String,
				default: 'real'
			},
			//行间距（单位px）
			lineHeight: {
				type: [Number, String],
				default: 15
			},
			//页面左右边距（单位px）
			slide: {
				type: [Number, String],
				default: 20
			},
			//页面上边距（单位px）
			topGap: {
				type: [Number, String],
				default: 10
			},
			//页面下边距（单位px）
			bottomGap: {
				type: [Number, String],
				default: 10
			},
			//开启预加载
			enablePreload: {
				type: Boolean,
				default: false
			},
			//是否开启整书模式
			noChapter: {
				type: Boolean,
				default: false
			},
			//开启点击事件
			enableClick: {
				type: Boolean,
				default: false
			},
			//展示顶部信息
			headerShow: {
				type: Boolean,
				default: true
			},
			//展示底部信息
			footerShow: {
				type: Boolean,
				default: true
			},
			//点击事件位置设置
			clickOption: {
				type: Object,
				default () {
					return {
						width: uni.upx2px(200),
						height: uni.upx2px(200),
						left: 'auto',
						top: 'auto'
					}
				}
			}
		},
		data () {
			return {
				pageInfo: {
					dataId: -1
				},
				pages: [],
				contents: [],
				isClickToTouch: false,
				touchstartX: 0,
				touchstartY: 0,
				touchmoveX: 0,
				touchmoveY: 0,
				touchTime: 0,
				windowWidth: 0,
				windowHeight: 0
			}
		},
		computed: {
			Util () {
				return Util
			},
			options () {
				return {
					pageType: this.pageType,
					color: this.color,
					bgColor: this.bgColor,
					enablePreload: this.enablePreload,
					headerShow: this.headerShow,
					footerShow: this.footerShow,
					slide: this.slide > 0 ? parseInt(this.slide) : 0,
					topGap: this.topGap > 0 ? parseInt(this.topGap) : 0,
					bottomGap: this.bottomGap > 0 ? parseInt(this.bottomGap) : 0,
					fontSize: this.fontSize >= 12 ? parseInt(this.fontSize) : 12,//字体大小最小只能到12px，因为谷歌浏览器最小只支持12px
					lineHeight: this.lineHeight >= 5 ? parseInt(this.lineHeight) : 5
				}
			}
		},
		beforeDestroy () {
			if ( this.refreshTimer ) {
				clearTimeout(this.refreshTimer)
				this.refreshTimer = null
			}
		},
		mounted () {
			this.$nextTick(function () {
				setTimeout(() => {
					Util.getRect('.yingbing-read-page', this.$refs.yingbingReadPage, this).then(res => {
						this.windowWidth = res.width
						this.windowHeight = res.height
					})
				}, 20)
			})
		},
		methods: {
			touchstart (e) {
				if ( !this.enableClick ) {
					return
				}
				if ( this.isClickToTouch ) {
					return
				}
				this.resetTouch();
				this.touchInter = setTimeout(() => {
					this.touchTime = 300
				}, 300)
				let touch = e.touches[0]
				this.touchstartX = touch.pageX;
				this.touchstartY = touch.pageY;
			},
			touchmove (e) {
				if ( !this.enableClick ) {
					return
				}
				if ( this.isClickToTouch ) {
					return
				}
				let touch = e.touches[0]
				this.touchmoveX = touch.pageX;
				this.touchmoveY = touch.pageY;
			},
			touchend (e) {
				if ( this.touchInter ) {
					clearTimeout(this.touchInter);
					this.touchInter = null
				}
				if ( !this.enableClick ) {
					return
				}
				if ( this.isClickToTouch ) {
					return
				}
				this.isClickToTouch = true
				if ( this.touchTime < 300 && (Math.abs(this.touchmoveX - this.touchmoveX) <= 50 || Math.abs(this.touchmoveY - this.touchmoveY) <= 50) ) {
					let left = 0
					let top = 0
					if ( this.clickOption.left == 'auto' ) {
						left = (this.windowWidth / 2) - (this.clickOption.width / 2)
					} else if ( typeof this.clickOption.left == 'number' ) {
						left = this.clickOption.left
					} else {
						return
					}
					if ( this.clickOption.top == 'auto' ) {
						top =  (this.windowHeight / 2) - (this.clickOption.height / 2)
					} else if ( typeof this.clickOption.top == 'number' ) {
						top = this.clickOption.top
					} else {
						return
					}
					let right = left + this.clickOption.width
					let bottom = top + this.clickOption.height
					if ( this.touchstartX >= left && this.touchstartX <= right && this.touchstartY >= top && this.touchstartY <= bottom ) {
						this.$emit('clickTo')
					}
				}
				setTimeout(() => {
					this.isClickToTouch = false
				}, 50)
			},
			resetTouch () {
				this.touchstartX = 0
				this.touchstartY = 0
				this.touchmoveX = 0
				this.touchmoveY = 0
				this.touchTime = 0
			},
			customClick (e) {
				this.$emit(e.name, ...e.args)
			},
			setCatalog (e) {
				this.$emit('setCatalog', e);
			},
			//初始化
			init (data) {
				if ( this.refreshTimer ) {
					clearTimeout(this.refreshTimer)
					this.refreshTimer = null
				}
				if ( !this.noChapter ) {
					this.contents = data.contents;
					this.initLoading = true;
					this.resetPage({
						start: parseInt(data.start || 0),
						currentChapter: parseInt(data.currentChapter || 1)
					})
				} else {
					this.computedNochapter(data);
				}
			},
			//重计算
			refresh () {
				if ( this.refreshTimer ) {
					clearTimeout(this.refreshTimer)
					this.refreshTimer = null
				}
				this.resetPage({
					start: this.pageInfo.start,
					currentChapter: this.pageInfo.chapter
				})
			},
			//跳转
			change (data) {
				if ( this.refreshTimer ) {
					clearTimeout(this.refreshTimer)
					this.refreshTimer = null
				}
				if ( data.contents && data.contents.length > 0 ) {
					data.contents.forEach(item => {
						let index = this.contents.findIndex(content => content.chapter == item.chapter)
						if (index > -1) {
							this.contents[index] = item;
						} else {
							this.contents.push(item);
						}
					})
				}
				let index = this.contents.findIndex(content => content.chapter == data.currentChapter)
				if ( index > -1 ) {
					this.initLoading = true;
					this.resetPage({
						start: parseInt(data.start || 0),
						currentChapter: parseInt(data.currentChapter || 1)
					})
				} else {
					uni.showToast({
						title: '未找到该章节内容',
						icon: 'none'
					})
				}
			}
		},
		watch: {
			pageType (newVal, oldVal) {
				this.$nextTick(function () {
					if ( this.refreshTimer ) {
						clearTimeout(this.refreshTimer)
						this.refreshTimer = null
					}
					this.refreshTimer = setTimeout(() => {
						if ( newVal != 'scroll' ) {
							this.getViewRect().then(res => {
								this.refresh()
							})
						} else {
							this.refresh()
						}
					}, 100)
				})
			},
			fontSize () {
				this.$nextTick(function () {
					if ( this.refreshTimer ) {
						clearTimeout(this.refreshTimer)
						this.refreshTimer = null
					}
					this.refreshTimer = setTimeout(() => {
						this.refresh()
					}, 100)
				})
			},
			lineHeight () {
				this.$nextTick(function () {
					if ( this.refreshTimer ) {
						clearTimeout(this.refreshTimer)
						this.refreshTimer = null
					}
					this.refreshTimer = setTimeout(() => {
						this.refresh()
					}, 100)
				})
			},
			slide () {
				this.$nextTick(function () {
					if ( this.refreshTimer ) {
						clearTimeout(this.refreshTimer)
						this.refreshTimer = null
					}
					this.refreshTimer = setTimeout(() => {
						this.refresh()
					}, 100)
				})
			},
			topGap () {
				this.$nextTick(function () {
					if ( this.refreshTimer ) {
						clearTimeout(this.refreshTimer)
						this.refreshTimer = null
					}
					this.refreshTimer = setTimeout(() => {
						this.refresh()
					}, 100)
				})
			},
			bottomGap () {
				this.$nextTick(function () {
					if ( this.refreshTimer ) {
						clearTimeout(this.refreshTimer)
						this.refreshTimer = null
					}
					this.refreshTimer = setTimeout(() => {
						this.refresh()
					}, 100)
				})
			}
		}
	}
</script>

<!-- #ifdef H5 || APP-VUE -->
<script lang="renderjs" type="module" module="flipPage">
	export default {
		mounted() {
			window.triggerCustomClick = (name, args) => {
				// #ifndef H5
				this.$ownerInstance.callMethod('customClick', {
					name: name,
					args: args
				});
				// #endif
				// #ifdef H5
				this.customClick({
					name: name,
					args: args
				});
				// #endif
			}
		}
	}
</script>
<!-- #endif -->
<!-- #ifdef APP-VUE || H5 || MP-QQ || MP-WEIXIN -->
<script lang="wxs" module="flip" src="../modules/flip/flip.wxs"></script>
<!-- #endif -->

<style scoped>
	@import url(../modules/flip/flip.css);
	@import url(../modules/scroll/scroll.css);
	.yingbing-read-page {
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		position: relative;
	}
	.yingbing-loading {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		overflow: hidden;
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.yingbing-slot {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		overflow: hidden;
		/* #endif */
		flex: 1;
	}
</style>