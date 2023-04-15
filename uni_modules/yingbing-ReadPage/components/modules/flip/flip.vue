<template>
	<view
	class="yingbing-flip"
	ref="yingbingFlip"
	:style="{
		'background-color': options.bgColor
	}"
	:prop="flipProp"
	:change:prop="flip.propWatcher"
	@touchstart="flip.touchstart"
	@touchmove="flip.touchmove"
	@touchend="flip.touchend">
		<template v-if="isShow">
			<view v-if="(item.dataId == currentDataIdSync || item.dataId == prevDataId || item.dataId == nextDataId)"
			class="flip-item"
			:class="'flip-item_' + item.dataId"
			v-for="(item, index) in dataReverse"
			:key="item.dataId"
			:style="{
				'transform': item.dataId < currentDataIdSync ? `translateX(${-viewWidth}px)` : ''
			}">
				<view
				class="flip-item-wrapper"
				:class="'flip-item-wrapper_' + item.dataId"
				:style="{
					'padding-left': options.slide + 'px',
					'padding-right': options.slide + 'px',
					'padding-top': options.topGap + 'px',
					'padding-bottom': options.bottomGap + 'px',
					'background': options.bgColor,
					'transform': item.dataId < currentDataIdSync ? options.pageType == 'real' ? `translateX(${viewWidth}px)` : 'translateX(0)' : ''
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
						<view class="flip-custom flip-item-content" v-html="item.text">
						</view>
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
				:class="'flip-item-bg_' + item.dataId"
				:style="{
					left: viewWidth + 'px',
					width: viewWidth + 'px',
					height: (viewHeight * 1.5) + 'px',
					top: (viewHeight / 2 - (viewHeight * 1.5) / 2) + 'px',
					background: options.bgColor,
				}"></view>
				<view class="flip-item-shadow" :class="'flip-item-shadow_' + item.dataId"></view>
			</view>
		</template>
	</view>
</template>

<script>
	import Util from '../../../js_sdk/util.js'
	import Battery from '../battery.vue'
	export default {
		components: {
			Battery
		},
		props: {
			currentDataId: {
				type: Number,
				default: -1
			},
			data: {
				type: Array,
				default () {
					return new Array
				}
			},
			options: {
				type: Object,
				default () {
					return new Object
				}
			}
		},
		computed: {
			dataReverse () {
				let data = JSON.parse(JSON.stringify(this.data))
				data.reverse()
				return data
			},
			prevDataId () {
				return this.dataReverse[this.current + 1] && this.dataReverse[this.current + 1].dataId
			},
			nextDataId () {
				return this.dataReverse[this.current - 1] && this.dataReverse[this.current - 1].dataId
			},
			flipProp () {
				return {
					current: this.current,
					prevDataId: this.prevDataId,
					nextDataId: this.nextDataId,
					currentDataId: this.currentDataIdSync,
					pageType: this.options.pageType,
					pageTo: this.pageTo
				}
			}
		},
		data () {
			return {
				isShow: false,
				viewWidth: 0,
				viewHeight: 0,
				currentDataIdSync: -1,
				current: -1,
				pageTo: 0
			}
		},
		mounted () {
			this.currentDataIdSync = this.currentDataId
			this.current = this.dataReverse.findIndex(item => item.dataId == this.currentDataIdSync)
			this.$nextTick(function () {
				setTimeout(() => {
					// #ifndef APP-NVUE
					const query = uni.createSelectorQuery().in(this);
					query.select('.yingbing-flip').boundingClientRect(data => {
						this.viewWidth = data.width
						this.viewHeight = data.height
						this.isShow = true
					}).exec();
					// #endif
					// #ifdef APP-NVUE
					uni.requireNativePlugin('dom').getComponentRect(this.$refs.yingbingFlip, res => {
						this.viewWidth = res.size.width
						this.viewHeight = res.size.height
						this.isShow = true
					})
					// #endif
				}, 50)
			})
		},
		methods: {
			onChange (e) {
				this.current = e.current
				this.currentDataIdSync = this.dataReverse[this.current].dataId
				this.$emit('change', this.currentDataIdSync)
			},
			pagePrev () {
				this.pageTo = 0
				this.$nextTick(function(){
					this.pageTo = -1
				})
			},
			pageNext () {
				this.pageTo = 0
				this.$nextTick(function(){
					this.pageTo = 1
				})
			},
			filterPage (pageInfo) {
				const nowChapters = this.data.filter(item => item.chapter == pageInfo.chapter && (item.type == 'text' || item.type == 'custom' || item.type == 'slot'))
				let currentPage = nowChapters.findIndex(item => item.dataId == pageInfo.dataId)
				if ( currentPage > -1 ) {
					return (currentPage + 1) + ' / ' + nowChapters.length
				} else {
					return pageInfo.type == 'top' ? '最前面' : pageInfo.type == 'bottom' ? '最后面' : pageInfo.type.indexOf('Loading') > -1 ? '请等待' : ''
				}
			},
			filterDate () {
				let date = new Date()
				return Util.zeroize(date.getHours()) + ':' + Util.zeroize(date.getMinutes())
			}
		},
		watch: {
			currentDataId (newVal) {
				this.currentDataIdSync = newVal
				this.current = this.dataReverse.findIndex(item => item.dataId == this.currentDataIdSync)
			},
			data (newVal) {
				this.$nextTick(function () {
					this.current = this.dataReverse.findIndex(item => item.dataId == this.currentDataIdSync)
				})
			}
		}
	}
</script>

<!-- #ifdef APP-VUE || H5 || MP-QQ || MP-WEIXIN -->
<script lang="wxs" module="flip">
	function touchstart (event, ins) {
		var state = ins.getState()
		if ( state.isTouch || state.disableTouch ) {
			return
		}
		state.isTouch = true
		state.touchTime = 0
		state.interval = true
		setInterval(ins)
		var touch = event.touches[0]
		state.startX = touch.pageX
		state.startY = touch.pageY
	}
	function touchmove (event, ins) {
		event.preventDefault && event.preventDefault()
		var state = ins.getState()
		if ( state.isTouch && (state.pageType == 'real' || state.pageType == 'cover') && !state.disableTouch ) {
			var touch = event.touches[0]
			if (state.direction) {
				var rect = ins.getBoundingClientRect()
				var height = rect.height / 2;
				var maxDeg = height / 5;
				state.rotate = state.direction == 'next' ? ((touch.pageY - height) / maxDeg) : -((touch.pageY - height) / maxDeg);
				state.offset = touch.pageX - state.startX;
				if ( (state.offset > 0 && state.direction == 'next') || (state.offset < 0 && state.direction == 'prev') ) {
					state.offset = 0
				}
				if ( Math.abs(state.offset) <= rect.width ) {
					animation(state.offset, 0, ins);
				}
			} else {
				if ( touch.pageX < state.startX ) {
					if ( state.nextDataId ) {
						state.direction = 'next'
					}
				} else {
					if ( state.prevDataId ) {
						state.direction = 'prev'
					}
				}
			}
		}
	}
	function touchend (event, ins) {
		var state = ins.getState()
		clearInterval(ins)
		if ( state.isTouch && !state.disableTouch ) {
			var rect = ins.getBoundingClientRect()
			if ( !state.direction && state.touchTime <= 200 ) {
				//获取点击位置，判断向哪里翻页
				if (state.startX > (rect.width / 4) * 3) {
					if ( state.nextDataId ) {
						state.direction = 'next'
					}
				}
				if (state.startX < (rect.width / 4)) {
					if ( state.prevDataId ) {
						state.direction = 'prev'
					}
				}
			}
			if (state.direction) {
				state.disableTouch = true
				if (state.touchTime <= 200) {
					var duration = (state.pageType == 'real' || state.pageType == 'cover') ? 200 : 0
					var value = state.direction == 'next' ? 1 : -1;
					animation(-value * rect.width, duration, ins);
					ins.setTimeout(function () {
						reset(-value * rect.width, ins);
						state.current -= value
						ins.callMethod('onChange', {
							current: state.current
						})
					}, duration)
				} else {
					var duration = (state.pageType == 'real' || state.pageType == 'cover') ? 100 : 0
					if (Math.abs(state.offset) >= rect.width / 4) {
						var value = state.direction == 'next' ? 1 : -1;
						animation(-value * rect.width, duration, ins);
						ins.setTimeout(function () {
							reset(-value * rect.width, ins);
							state.current -= value
							ins.callMethod('onChange', {
								current: state.current
							})
						}, duration)
					} else {
						animation(0, duration, ins);
						ins.setTimeout(function () {
							reset(0, ins);
						}, duration)
					}
				}
			} else {
				reset(0, ins)
			}
		}
	}
	function propWatcher (newVal, oldVal, ins) {
		ins.setTimeout(function () {
			var state = ins.getState()
			state.current = newVal.current
			state.currentDataId = newVal.currentDataId
			state.prevDataId = newVal.prevDataId
			state.nextDataId = newVal.nextDataId
			state.pageType = newVal.pageType
			if (newVal.pageTo != (oldVal && oldVal.pageTo)) {
				if ( !state.disableTouch ) {
					if ( newVal.pageTo == -1 && state.prevDataId ) {
						state.isTouch = true
						state.startX = 1
						state.touchTime = 0
						state.direction = 'prev'
						touchend(null, ins)
					}
					if ( newVal.pageTo == 1 && state.nextDataId ) {
						state.isTouch = true
						var rect = ins.getBoundingClientRect()
						state.startX = rect.width
						state.touchTime = 0
						state.direction = 'next'
						touchend(null, ins)
					}
				}
			}
		}, 50)
	}
	function setInterval (ins) {
		var state = ins.getState()
		state.touchTimer = ins.setTimeout(function () {
			state.touchTime += 10
			if ( state.interval ) {
				setInterval(ins)
			}
		}, 10)
	}
	function clearInterval (ins) {
		var state = ins.getState()
		state.interval = false
		if ( state.touchTimer ) {
			ins.clearTimeout(state.touchTimer)
			state.touchTimer = null
		}
	}
	function reset (offset, ins) {
		var state = ins.getState()
		var rect = ins.getBoundingClientRect()
		if ( state.direction ) {
			var late = state.direction == 'next' ? offset : offset - rect.width;
			var currentDataId = state.direction == 'next' ? state.currentDataId : state.prevDataId
			if ( currentDataId ) {
				ins.selectComponent('.flip-item_' + currentDataId).setStyle({
					transform: 'translateX(' + (-late) + 'px)',
					'box-shadow': '',
					transition: ''
				})
				if ( state.pageType == 'real' ) {
					ins.selectComponent('.flip-item-bg_' + currentDataId).setStyle({
						transform: 'translateX(' + late + 'px) rotateZ(' + state.rotate + 'deg)',
						'box-shadow': '',
						transition: ''
					})
				}
				ins.selectComponent('.flip-item-shadow_' + currentDataId).setStyle({
					'box-shadow': '',
					transition: ''
				})
			}
		}
		state.direction = null
		state.isTouch = false
		state.disableTouch = false
		state.offset = 0
		state.touchTime = 0
		state.startX = 0
		state.startY = 0
	}
	function animation (offset, duration, ins) {
		var state = ins.getState()
		var rect = ins.getBoundingClientRect()
		var late = state.direction == 'next' ? offset : offset - rect.width;
		var currentDataId = state.direction == 'next' ? state.currentDataId : state.prevDataId
		ins.selectComponent('.flip-item_' + currentDataId).setStyle({
			transform: 'translateX(' + late + 'px)',
			'box-shadow': state.pageType == 'real' ? '0 0 30px 20px rgba(0,0,0,0.4)' : state.pageType == 'cover' ? '0 0 10px 5px rgba(0,0,0,0.3)' : '',
			transition: duration > 0 ? 'transform ' + duration + 'ms' : ''
		})
		if ( state.pageType == 'real' ) {
			ins.selectComponent('.flip-item-wrapper_' + currentDataId).setStyle({
				transform: 'translateX(' + (-late) + 'px)',
				transition: duration > 0 ? 'transform ' + duration + 'ms' : ''
			})
			ins.selectComponent('.flip-item-bg_' + currentDataId).setStyle({
				transform: 'translateX(' + late + 'px) rotateZ(' + state.rotate + 'deg)',
				'box-shadow': '-5px 0 20px rgba(0,0,0,0.1)',
				transition: duration > 0 ? 'transform ' + duration + 'ms, ' + 'boxShadow ' + duration + 'ms' : ''
			})
			ins.selectComponent('.flip-item-shadow_' + currentDataId).setStyle({
				'box-shadow': '0 0 60px ' + (Math.abs(late) > 30 ? 30 : Math.abs(late)) + 'px rgba(0,0,0,0.4)',
				transition: duration > 0 ? 'boxShadow ' + duration + 'ms' : ''
			})
		} else {
			ins.selectComponent('.flip-item-wrapper_' + currentDataId).setStyle({
				transform: 'translateX(0px)',
				transition: duration > 0 ? 'transform ' + duration + 'ms' : ''
			})
			ins.selectComponent('.flip-item-shadow_' + currentDataId).setStyle({
				'box-shadow': '0 0 60px 0 rgba(0,0,0,0.5)',
				transition: duration > 0 ? 'boxShadow ' + duration + 'ms' : ''
			})
		}
	}
	module.exports = {
		touchstart: touchstart,
		touchmove: touchmove,
		touchend: touchend,
		propWatcher: propWatcher
	}
</script>
<!-- #endif -->

<style scoped>
	.yingbing-flip {
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow: hidden;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		position: relative;
	}
	.flip-item {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		/* #endif */
	}
	.flip-item-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		/* #endif */
	}
	.flip-item-header {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		/* #endif */
		justify-content: center;
		height: 50rpx;
		overflow: hidden;
	}
	.flip-item-header-text {
		font-size: 24rpx;
		opacity: .4;
		font-weight: bold;
	}
	.flip-item-footer {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
		height: 50rpx;
		overflow: hidden;
	}
	.flip-item-footer-text {
		font-size: 24rpx;
		opacity: .4;
		font-weight: bold;
	}
	.flip-item-content {
		flex: 1;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		/* #endif */
	}
	.flip-item-text {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
	},
	.flip-text {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		white-space: pre-wrap;
		font-family: Microsoft YaHei, 微软雅黑;
		/* #endif */
	}
	.flip-loading {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
	}
	.flip-item-bg {
		position: absolute;
	}
	.flip-item-shadow {
		position: absolute;
		width: 0;
		top: 0;
		bottom: 0;
		right: 0;
	}
</style>