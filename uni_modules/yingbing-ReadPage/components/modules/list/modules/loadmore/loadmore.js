import Util from '@/uni_modules/yingbing-ReadPage/js_sdk/util.js'
export default {
	data () {
		return {
			isLoadmore: false,//是否触底
			loadmoreStatus: '',//触底状态
			isPageFirst: false//判断页面滚动时是否首次加载
		}
	},
	computed: {
		loadmoreOptionsSync () {
			return Object.assign({}, {
				//是否展示加载更多
				show: false,
				//是否采用row布局
				row: false,
				//默认文本
				defaultText: '上拉或点击加载',
				//刷新中的提示文本
				refreshingText: '正在加载',
				//刷新成功的文本
				successText: '加载成功，点击继续',
				//刷新失败的提示文本
				failText: '加载失败，点击重试',
				//数据全部加载完毕的提示文本
				endText: '数据加载完毕',
				//文本颜色
				color: '#333333',
				//距底部的距离
				bottom: 0
			}, Util.typeof(this.loadmore) == 'Object' ? this.loadmore : Util.typeof(this.loadmore) == 'Boolean' ? { show: this.loadmore } : {})
		}
	},
	mounted () {
		//页面滚动通过判断上拉加载组件是否出现在屏幕内来触发触发触底事件，组件初始化时不触发触底事件,延迟一秒后才能触发
		this.$nextTick(function () {
			setTimeout(() => {
				this.isPageFirst = true
			}, 1000)
		})
	},
	methods: {
		onScrolltolower () {
			if ( !this.isPageFirst && this.typeSync == 'page' ) {
				return
			}
			if ( this.isLoadmore ) {
				return
			}
			this.isLoadmore = true
			this.loadmoreStatus = 'loading'
			this.$emit('loadmore', (state) => {
				this.loadmoreStatus = state
				if ( state != 'fail' && state != 'end') {
					this.isLoadmore = false
					// #ifdef APP-NVUE
					this.$refs.ybPulldownScroller.resetLoadmore()
					// #endif
				}
			})
		},
		//重置加载更多状态
		resetLoadmore () {
			this.loadmoreStatus = ''
			this.isLoadmore = false
			// #ifdef APP-NVUE
			this.$refs.ybPulldownScroller.resetLoadmore()
			// #endif
		},
		//设置加载更多为完毕状态
		setLoadmoreEnd () {
			this.loadmoreStatus = 'end'
			this.isLoadmore = true
		},
		//设置加载更多为成功状态
		setLoadmoreSuccess () {
			this.loadmoreStatus = 'success'
			this.isLoadmore = false
		},
		//设置加载更多为失败状态
		setLoadmoreFail () {
			this.loadmoreStatus = 'fail'
			this.isLoadmore = false
		},
		//重加载更多
		reload () {
			this.isLoadmore = false
			this.onScrolltolower()
		}
	}
}