<template>
	<!-- #ifndef APP-NVUE -->
	<view class="read-rich-text" :style="richTextStyle" v-html="richtext">
	</view>
	<!-- #endif -->
	<!-- #ifdef APP-NVUE -->
	<view class="read-rich-text" :style="richTextStyle">
		<web-view
		@onPostMessage="onPostMessage"
		:style="webviewStyle"
		:src="'/uni_modules/yingbing-ReadPage/hybrid/html/richtext.html?rich=' + encodeURIComponent(JSON.stringify(richtext)) + '&pageType=' + pageType"></web-view>
	</view>
	<!-- #endif -->
</template>

<script>
	export default {
		props: {
			richtext: {
				type: String,
				default: ''
			},
			pageType: {
				type: String,
				default: ''
			}
		},
		computed: {
			webviewStyle () {
				return this.pageType == 'scroll' ? {
					height: this.customWebviewHeight + 'px'
				} : {
					flex: 1
				}
			},
			richTextStyle () {
				return this.pageType == 'scroll' ? {
					'padding-bottom': '20rpx'
				} : {
					flex: 1
				}
			}
		},
		data () {
			return {
				customWebviewHeight: 0
			}
		},
		methods: {
			onPostMessage (e) {
				e.detail.data.forEach(item => {
					if ( item.customClick ) {
						this.$emit('customClick', item.customClick)
					}
					if ( item.height ) {
						this.customWebviewHeight = item.height
					}
				})
			}
		}
	}
</script>

<style scoped>
	.read-rich-text {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		/* #endif */
	}
</style>