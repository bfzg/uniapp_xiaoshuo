<template>
	<view class="yb-loadmore yb-flex yb-align-center yb-justify-center"
	:class="{
		'yb-row': options.row
	}"
	@tap="onTap" v-if="options.show">
		<view class="yb-flex" style="height: 20rpx;"></view>
		<view class="yb-flex yb-align-center yb-justify-center" :style="{'margin-left': options.row ? '-70rpx' : 0}">
			<view class="yb-flex indicator-icon yb-align-center yb-justify-center">
				<template v-if="status == ''">
					<slot name="loadmore-symbol">
						<slot name="loadmore-symbol">
							<list-icon
							name="arrow-up"
							:size="50"
							:color="options.color"></list-icon>
						</slot>
					</slot>
				</template>
				<template v-if="status == 'loading'">
					<slot name="loadmore-loading">
						<list-loading :visible="status == 'loading'" :color="options.color"></list-loading>
					</slot>
				</template>
				<template v-if="status == 'fail'">
					<slot name="loadmore-fail">
						<list-icon
						name="fork-circle"
						:size="50"
						:color="options.color"></list-icon>
					</slot>
				</template>
				<template v-if="status == 'success'">
					<slot name="loadmore-success">
						<list-icon
						name="hook-circle"
						:size="50"
						:color="options.color"></list-icon>
					</slot>
				</template>
				<template v-if="status == 'end'">
					<slot name="loadmore-end">
						<list-icon
						name="hook-circle"
						:size="50"
						:color="options.color"></list-icon>
					</slot>
				</template>
			</view>
		</view>
		<view class="yb-flex indicator-text yb-align-center">
			<text class="refresh-text" :style="{color: options.color}">{{refreshText}}</text>
		</view>
		<view class="yb-flex" style="height: 20rpx;"></view>
		<view class="yb-flex" :style="{
			height: Util.pixelunit(options.bottom)
		}"></view>
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
		computed: {
			refreshText () {
				return this.status == 'loading' ? this.options.refreshingText : this.status == 'success' ? this.options.successText : this.status == 'fail' ? this.options.failText : this.status == 'end' ? this.options.endText : this.options.defaultText
			},
			Util () {
				return Util
			}
		},
		methods: {
			onTap () {
				if ( this.status != 'end' && this.status != 'loading' ) {
					this.$emit('reload')
				}
			}
		}
	}
</script>

<style scoped>
	@import url(@/uni_modules/yingbing-ReadPage/css/common.css);
	.yb-loadmore .indicator-icon {
		width: 70rpx;
		height: 70rpx;
	}
	.yb-loadmore .refresh-text {
		text-align: center;
		font-size: 24rpx;
	}
	.yb-loadmore .indicator-symbol {
		transition: transform .1s;
	}
	.yb-loadmore .refresh-time {
		font-size: 23rpx;
	}
</style>