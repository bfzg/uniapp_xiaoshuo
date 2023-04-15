import Util from '@/uni_modules/yingbing-ReadPage/js_sdk/util.js'
export default {
	data () {
		return {
			pulldownStatus: '',//下拉状态
			pulldownRestore: false,//下拉复位
			display: 'show'
		}
	},
	computed: {
		pulldownOptionsSync () {
			return Object.assign({}, {
				show: false,
				//是否采用row布局
				row: false,
				//是否显示刷新时间
				enableRefreshTime: true,
				//默认文本
				defaultText: '下拉刷新',
				//准备刷新
				readyText: '释放刷新',
				//刷新中的提示文本
				refreshingText: '正在刷新',
				//刷新成功的提示文本
				successText: '刷新成功',
				//刷新失败的提示文本
				failText: '刷新失败',
				//刷新结束的提示文本
				endText: '刷新完毕',
				//文本颜色
				color: '#333333',
				//刷新完成后的隐藏周期
				duration: 300
			}, Util.typeof(this.pulldown) == 'Object' ? this.pulldown : Util.typeof(this.pulldown) == 'Boolean' ? { show: this.pulldown } : {})
		},
		pulldownProp () {
			return {
				pulldownRestore: this.pulldownRestore,
				enablePulldown: this.pulldownOptionsSync.show
			}
		}
	},
	methods: {
		refresh () {
			if ( !this.pulldownOptionsSync.show ) {
				return
			}
			if ( this.pulldownStatus != 'end' ) {
				this.pulldownStatus = 'loading'
				this.$emit('pulldown', (state) => {
					this.pulldownStatus = state
					this.pulldownTimer = setTimeout(() => {
						this.pulldownRestore = true
						clearTimeout(this.pulldownTimer)
						this.pulldownTimer = null
						
						// #ifdef APP-NVUE
						this.display = 'hide';
						this.pulldownTimer = setTimeout(() => {
							this.display = 'show'
							clearTimeout(this.pulldownTimer)
							this.pulldownTimer = null
						}, this.pulldownOptionsSync.duration)
						// #endif
						
					}, this.pulldownOptionsSync.duration)
				})
			} else {
				this.pulldownRestore = true
				// #ifdef APP-NVUE
				this.display = 'hide';
				this.pulldownTimer = setTimeout(() => {
					this.display = 'show'
					clearTimeout(this.pulldownTimer)
					this.pulldownTimer = null
				}, this.pulldownOptionsSync.duration)
				// #endif
			}
		},
		pullingdown (threshold) {
			if ( !this.pulldownOptionsSync.show ) {
				return
			}
			if ( this.pulldownStatus != 'end' ) {
				// #ifndef APP-NVUE
				if ( threshold >= 120 ) {
					this.pulldownStatus = 'ready'
				} else {
					this.pulldownStatus = ''
				}
				// #endif
				// #ifdef APP-NVUE
				if ( threshold >= 195 ) {
					this.pulldownStatus = 'ready'
				} else {
					this.pulldownStatus = ''
				}
				// #endif
			}
			this.$emit('pullingdown', threshold)
		},
		pullingup (threshold) {
			this.$emit('pullingup', threshold)
		},
		resetPulldownIns () {
			this.pulldownTimer = setTimeout(() => {
				if ( this.pulldownStatus != 'end' ) {
					this.pulldownStatus = ''
				}
				this.pulldownRestore = false
				clearTimeout(this.pulldownTimer)
				this.pulldownTimer = null
			}, this.pulldownOptionsSync.duration)
		},
		resetPulldown () {
			this.pulldownStatus = ''
		}
	}
}