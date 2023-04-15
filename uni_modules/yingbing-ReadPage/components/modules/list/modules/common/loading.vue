<template>
	<view class="yb-flex">
		<view class="yb-loading yb-flex yb-align-center">
			<view v-if="visible" class="circle yb-flex" ref="loading" :style="{
				width: pixelSize + 'px',
				height: pixelSize + 'px',
				'border-radius': pixelSize + 'px'
			}">
				<view
				class="line yb-flex"
				:style="{
					'border-top-width': (pixelSize / 4) + 'px',
					'border-bottom-width': (pixelSize / 4) + 'px',
					'border-top-color': item.top,
					'border-bottom-color': item.bottom,
					width: (pixelSize / 12) + 'px',
					left: ((pixelSize / 2) - (pixelSize / 24)) + 'px',
				}"
				:class="'line_' + index"
				v-for="(item, index) in rgbs" :key="index"></view>
			</view>
			<text class="loading-text" :style="{color: color}" v-if="text && visible">{{text}}</text>
		</view>
	</view>
</template>

<script>
	import Util from '@/uni_modules/yingbing-ReadPage/js_sdk/util.js'
	// #ifdef APP-NVUE
	const Binding = uni.requireNativePlugin('bindingx')
	// #endif
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			size: {
				type: [Number, String],
				default: 40
			},
			color: {
				type: String,
				default: '#333333'
			},
			text: {
				type: String,
				default: ''
			}
		},
		computed: {
			rgbs () {
				let rgb = Util.hex2rgb(this.color).replace('rgb(', '').replace(')', '')
				return [{
					top: `rgba(${rgb}, 1)`,
					bottom: `rgba(${rgb}, .4)`
				},{
					top: `rgba(${rgb}, .4)`,
					bottom: `rgba(${rgb}, .5)`
				},{
					top: `rgba(${rgb}, .4)`,
					bottom: `rgba(${rgb}, .6)`
				},{
					top: `rgba(${rgb}, .4)`,
					bottom: `rgba(${rgb}, .7)`
				},{
					top: `rgba(${rgb}, .4)`,
					bottom: `rgba(${rgb}, .8)`
				},{
					top: `rgba(${rgb}, .4)`,
					bottom: `rgba(${rgb}, .9)`
				}]
			},
			pixelSize () {
				return Util.unitpixel(this.size)
			}
		},
		data () {
			return {
				loading_binding: null
			}
		},
		mounted() {
			// #ifdef APP-NVUE
			this.$nextTick(() => {
				if ( this.visible ) {
					this.start()
				}
			})
			// #endif
		},
		beforeDestroy() {
			// #ifdef APP-NVUE
			if ( this.loading_binding ) {
				Binding.unbind({
					token: this.loading_binding.token,
					eventType: 'timing'
				})
				this.loading_binding = null
			}
			// #endif
		},
		methods: {
			start () {
				let loading = Util.getEl(this.$refs.loading);
				this.loading_binding = Binding.bind({
				    eventType: 'timing',
				    props: [{
				        element: loading,
				        property: 'transform.rotateZ',
				        expression: 'floor(t/100)*30'
				    }]
				});
			}
		},
		watch: {
			visible (newVal) {
				// #ifdef APP-NVUE
				this.$nextTick(() => {
					if ( newVal ) {
						this.start()
					} else {
						if ( this.loading_binding ) {
							Binding.unbind({
								token: this.loading_binding.token,
								eventType: 'timing'
							})
							this.loading_binding = null
						}
					}
				})
				// #endif
			}
		}
	}
</script>

<style scoped>
	@import url(@/uni_modules/yingbing-ReadPage/css/common.css);
	/* #ifndef APP-NVUE */
	@keyframes loading{
		0% {
			transform: rotateZ(30deg);
		}
		9.33333%{
			transform: rotateZ(60deg);
		}
		18.66666%{
			transform: rotateZ(90deg);
		}
		27.99999%{
			transform: rotateZ(120deg);
		}
		37.33332%{
			transform: rotateZ(150deg);
		}
		46.66665%{
			transform: rotateZ(180deg);
		}
		55.99998%{
			transform: rotateZ(210deg);
		}
		65.33331%{
			transform: rotateZ(240deg);
		}
		74.66664%{
			transform: rotateZ(270deg);
		}
		83.99997%{
			transform: rotateZ(300deg);
		}
		93.33333%{
			transform: rotateZ(330deg);
		}
		100%{
			transform: rotateZ(360deg);
		}
	}
	/* #endif */
	.yb-loading .loading-text {
		margin-top: 15rpx;
		font-size: 28rpx;
	}
	.circle {
		position: relative;
		/* #ifndef APP-NVUE */
		animation: loading 1200ms step-start infinite;
		/* #endif */
	}
	.circle .line {
		position: absolute;
		border-top-style: solid;
		border-bottom-style: solid;
		top: 0;
		bottom: 0;
	}
	.circle .line_0 {
	}
	.circle .line_1 {
		transform: rotateZ(30deg);
	}
	.circle .line_2 {
		transform: rotateZ(60deg);
	}
	.circle .line_3 {
		transform: rotateZ(90deg);
	}
	.circle .line_4 {
		transform: rotateZ(120deg);
	}
	.circle .line_5 {
		transform: rotateZ(150deg);
	}
</style>
