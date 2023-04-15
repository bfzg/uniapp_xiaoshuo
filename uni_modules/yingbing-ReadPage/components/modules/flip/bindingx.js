const Binding = uni.requireNativePlugin('bindingx')
const animation = uni.requireNativePlugin('animation')
import Util from '../../../js_sdk/util.js'
export default {
	data () {
		return {
			disableTouch: false,
			isTouch: false,
			flipTouchTime: 0,
			interval: false,
			direction: ''
		}
	},
	beforeDestroy () {
		if ( this.flip_binding ) {
			Binding.unbind({
				token: this.flip_binding.token,
				eventType: 'pan'
			})
			this.flip_binding = null
		}
		if ( this.flip_animation_binding ) {
			Binding.unbind({
				token: this.flip_animation_binding.token,
				eventType: 'timing'
			})
			this.flip_animation_binding = null
		}
	},
	methods: {
		//翻往上一页
		pagePrevBinding () {
			if ( !this.isTouch && !this.disableTouch ) {
				this.isTouch = true
				this.startX = 0
				this.onFilpTouchend()
			}
		},
		//翻往下一页
		pageNextBinding () {
			if ( !this.isTouch && !this.disableTouch ) {
				this.isTouch = true
				this.startX = this.viewWidth
				this.onFilpTouchend()
			}
		},
		onFilpTouchstart (event) {
			if ( this.isTouch || this.disableTouch ) {
				return
			}
			this.isTouch = true
			this.flipTouchTime = 0
			this.interval = true
			this.setInterval()
			let touch = event.touches[0]
			this.startX = touch.pageX
			this.startY = touch.pageY
		},
		async onFilpTouchmove (event) {
			if ( this.isTouch && (this.pageType == 'real' || this.pageType == 'cover') && !this.disableTouch && this.flipTouchTime > 200 ) {
				if ( !this.direction ) {
					let touch = event.touches[0]
					if ( touch.pageX < this.startX ) {
						if ( this.nextDataId ) {
							this.direction = 'next'
						}
					} else {
						if ( this.prevDataId ) {
							this.direction = 'prev'
						}
					}
				}
				if ( this.direction ) {
					this.disableTouch = true
					let currentDataId = this.direction == 'next' ? this.currentDataId : this.prevDataId
					let props = [{
						element: Util.getEl(this.$refs['flipItem_' + currentDataId][0]),
						property: 'transform.translateX',
						expression: `${this.direction == 'next' ? ('x > 0 ? 0 : (x < -' + this.viewWidth + ' ? -' + this.viewWidth + ' : x + 0)') : ('x < 0 ? -' + this.viewWidth + ' : (x > ' + this.viewWidth + ' ? 0 : x-' + this.viewWidth + ')')}`
					}]
					if ( this.pageType == 'real' ) {
						props.push({
							element: Util.getEl(this.$refs['flipItemWrapper_' + currentDataId][0]),
							property: 'transform.translateX',
							expression: `${this.direction == 'next' ? ('x > 0 ? 0 : (x < -' + this.viewWidth + ' ? ' + this.viewWidth + ' : 0 - x)') : ('x < 0 ? ' + this.viewWidth + ' : (x > ' + this.viewWidth + ' ? 0 : ' + this.viewWidth + '-x)')}`
						})
						props.push({
							element: Util.getEl(this.$refs['flipItemBg_' + currentDataId][0]),
							property: 'transform.translateX',
							expression: `${this.direction == 'next' ? ('x > 0 ? 0 : (x < -' + this.viewWidth + ' ? -' + this.viewWidth + ' : x + 0)') : ('x < 0 ? -' + this.viewWidth + ' : (x > ' + this.viewWidth + ' ? 0 : x-' + this.viewWidth + ')')}`
						})
						let rect = await this.getRect(this.$refs['flipItemBg_' + currentDataId][0])
						let height = rect.height / 2;
						let maxDeg = height / 5;
						props.push({
							element: Util.getEl(this.$refs['flipItemBg_' + currentDataId][0]),
							property: 'transform.rotateZ',
							expression: `${this.direction == 'next' ? 'y/' + maxDeg : '-(y/' + maxDeg + ')'}`
						})
						props.push({
							element: Util.getEl(this.$refs['flipItemShadow_' + currentDataId][0]),
							property: 'width',
							expression: `${this.direction == 'next' ? 'abs(x) / 2 + 0' : this.viewWidth / 2 + '-abs(x) / 2'}`
						})
					}
					this.flip_binding = Binding.bind({
						anchor: Util.getEl(this.$refs.yingbingFlip),
						eventType: 'pan',
						props: props
					}, (e) => {
						if ((e.state == 'end' || e.state == 'cancel') && this.flip_binding) {
							this.clearInterval()
							Binding.unbind({
								token: this.flip_binding.token,
								eventType: 'pan'
							})
							this.flip_binding = null
							let value = this.direction == 'next' ? 1 : -1;
							if (this.flipTouchTime <= 200) {
								let duration = (this.pageType == 'real' || this.pageType == 'cover') ? 200 : 1
								this.pageAnimation(value, -value * this.viewWidth, duration);
							} else {
								let duration = (this.pageType == 'real' || this.pageType == 'cover') ? 200 : 1
								let deltaX = Binding.getComputedStyle(Util.getEl(this.$refs['flipItem_' + currentDataId][0])).translateX
								let late = this.direction == 'next' ? deltaX : this.viewWidth + deltaX
								if (Math.abs(late) >= this.viewWidth / 4) {
									this.pageAnimation(value, -value * this.viewWidth, duration)
								} else {
									let value = this.direction == 'next' ? 1 : -1;
									this.pageAnimation(value, 0, duration);
								}
							}
						}
					})
				} else {
					this.resetPageBinding()
				}
			}
		},
		onFilpTouchend () {
			if ( this.isTouch && !this.disableTouch ) {
				this.disableTouch = true
				this.clearInterval()
				if ( this.flipTouchTime <= 200 ) {
					if ( !this.direction ) {
						if (this.startX > (this.viewWidth / 4) * 3) {
							if ( this.nextDataId ) {
								this.direction = 'next'
							}
						}
						if (this.startX < (this.viewWidth / 4)) {
							if ( this.prevDataId ) {
								this.direction = 'prev'
							}
						}
					}
					if ( this.direction ) {
						let duration = (this.pageType == 'real' || this.pageType == 'cover') ? 200 : 1
						let value = this.direction == 'next' ? 1 : -1;
						this.pageAnimation(value, -value * this.viewWidth, duration);
					} else {
						this.resetPageBinding()
					}
				} else {
					this.resetPageBinding()
				}
			}
		},
		getRect (el) {
			return new Promise(resolve => {
				uni.requireNativePlugin('dom').getComponentRect(el, res => {
					resolve(res.size)
				})
			})
		},
		setInterval () {
			this.flipTouchTimer = setTimeout(() => {
				this.flipTouchTime += 10
				if ( this.interval ) {
					this.setInterval()
				}
			}, 10)
		},
		clearInterval () {
			this.interval = false
			if ( this.flipTouchTimer ) {
				clearTimeout(this.flipTouchTimer)
				this.flipTouchTimer = null
			}
		},
		pageAnimation (value, offset, duration) {
			let currentDataId = this.direction == 'next' ? this.currentDataId : this.prevDataId
			let late = this.direction == 'next' ? offset : offset - this.viewWidth;
			let flipItemTrans = Binding.getComputedStyle(Util.getEl(this.$refs['flipItem_' + currentDataId][0])).translateX
			let props = [{
				element: Util.getEl(this.$refs['flipItem_' + currentDataId][0]),
				property: 'transform.translateX',
				expression: `linear(t, ${flipItemTrans}, ${late - flipItemTrans}, ${duration})`
			}]
			if ( this.pageType == 'real' ) {
				let flipItemWrapperTrans = Binding.getComputedStyle(Util.getEl(this.$refs['flipItemWrapper_' + currentDataId][0])).translateX
				props.push({
					element: Util.getEl(this.$refs['flipItemWrapper_' + currentDataId][0]),
					property: 'transform.translateX',
					expression: `linear(t, ${flipItemWrapperTrans}, ${-late - flipItemWrapperTrans}, ${duration})`
				})
				let flipItemBgTrans = Binding.getComputedStyle(Util.getEl(this.$refs['flipItemBg_' + currentDataId][0])).translateX
				props.push({
					element: Util.getEl(this.$refs['flipItemBg_' + currentDataId][0]),
					property: 'transform.translateX',
					expression: `linear(t, ${flipItemBgTrans}, ${late - flipItemBgTrans}, ${duration})`
				})
				let flipItemShadowWidth = this.flipTouchTime <= 200 && this.direction == 'prev' ? this.viewWidth : Binding.getComputedStyle(Util.getEl(this.$refs['flipItemShadow_' + currentDataId][0])).width
				props.push({
					element: Util.getEl(this.$refs['flipItemShadow_' + currentDataId][0]),
					property: 'width',
					expression: `linear(t, ${flipItemShadowWidth}, ${-late - flipItemShadowWidth}, ${duration})`
				})
			}
			this.flip_animation_binding = Binding.bind({
				eventType: 'timing',
				exitExpression: 't>' + duration,
				props: props
			}, (e) => {
				if (e.state == 'exit' && this.flip_animation_binding && e.t > duration) {
					Binding.unbind({
						token: this.flip_animation_binding.token,
						eventType: 'timing'
					})
					this.flip_animation_binding = null
					if ( Math.abs(offset) > 0 ) {
						this.onChange(value > 0 ? this.nextDataId : this.prevDataId)
					}
					this.resetPageBinding();
				}
			})
		},
		resetPageBinding () {
			this.direction = ''
			this.flipTouchTime = 0
			this.startX = 0
			this.startY = 0
			this.$nextTick(function () {
				this.isTouch = false
				this.disableTouch = false
			})
		}
	}
}
	