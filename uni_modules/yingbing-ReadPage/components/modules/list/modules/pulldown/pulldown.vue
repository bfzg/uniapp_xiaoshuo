<template>
	<view class="yb-pulldown yb-flex yb-align-center yb-justify-center"
	:class="{
		'yb-row': options.row
	}" v-if="options.show">
		<view class="yb-flex yb-align-center yb-justify-center" :style="{'margin-left': options.row ? '-70rpx' : 0}">
			<view class="yb-flex indicator-icon yb-align-center yb-justify-center">
				<template v-if="status == 'ready' || status == ''">
					<view class="yb-flex indicator-symbol"
					:style="{
						'transform': 'rotateZ(' + (status == 'ready' ? '180deg' : 0) + ')'
					}">
						<slot name="pulldown-symbol">
							<list-icon
							name="arrow-down"
							:size="50"
							:color="options.color"></list-icon>
						</slot>
					</view>
				</template>
				<template v-if="status == 'loading'">
					<slot name="pulldown-loading">
						<list-loading :visible="status == 'loading'" :color="options.color"></list-loading>
					</slot>
				</template>
				<template v-if="status == 'success'">
					<slot name="pulldown-success">
						<list-icon
						name="hook-circle"
						:size="50"
						:color="options.color"></list-icon>
					</slot>
				</template>
				<template v-if="status == 'fail'">
					<slot name="pulldown-fail">
						<list-icon
						name="fork-circle"
						:size="50"
						:color="options.color"></list-icon>
					</slot>
				</template>
				<template v-if="status == 'end'">
					<slot name="pulldown-end">
						<list-icon
						name="hook-circle"
						:size="50"
						:color="options.color"></list-icon>
					</slot>
				</template>
			</view>
		</view>
		<view class="yb-flex indicator-text yb-align-center">
			<text class="refresh-text" :style="{color: options.color}">{{pulldownText}}</text>
			<text class="refresh-time" :style="{color: options.color}" v-if="options.enableRefreshTime">上次更新 {{lastTime}}</text>
		</view>
	</view>
</template>

<script>
	import Util from '@/uni_modules/yingbing-ReadPage/js_sdk/util.js'
	import ListIcon from '../common/icon.vue'
	import ListLoading from '../common/loading.vue'
	export default {
		components: {
			ListIcon,
			ListLoading
		},
		props: {
			options: {
				type: Object,
				default () {
					return new Object
				}
			},
			status: {
				type: String,
				default: ''
			}
		},
		data () {
			return {
				lastTime: '刷新时间'
			}
		},
		computed: {
			pulldownText () {
				return this.status == 'ready' ? this.options.readyText : this.status == 'loading' ? this.options.refreshingText : this.status == 'success' ? this.options.successText : this.status == 'fail' ? this.options.failText : this.status == 'end' ? this.options.endText : this.options.defaultText
			}
		},
		mounted() {
			this.lastTime = this.getTime()
		},
		methods: {
			getTime () {
				let d = new Date()
				return (d.getMonth() + 1) + '-' + d.getDate() + ' ' + Util.zeroize(d.getHours()) + ':' + Util.zeroize(d.getMinutes())
			}
		},
		watch: {
			status (newVal) {
				if ( newVal == 'success' || newVal == 'fail' ) {
					this.lastTime = this.getTime()
				}
			}
		}
	}
</script>

<style scoped>
	@import url(@/uni_modules/yingbing-ReadPage/css/common.css);
	.yb-pulldown .indicator-icon {
		width: 70rpx;
		height: 70rpx;
	}
	.yb-pulldown .refresh-text {
		text-align: center;
		font-size: 24rpx;
	}
	.yb-pulldown .indicator-symbol {
		transition: transform .1s;
	}
	.yb-pulldown .refresh-time {
		font-size: 23rpx;
	}
</style>