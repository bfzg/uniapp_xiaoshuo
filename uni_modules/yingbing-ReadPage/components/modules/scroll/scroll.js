import Util from '../../../js_sdk/util.js'
export default {
	data () {
		return {
			pageTo: 0,
			scrollTop: 0,
			scrolling: false,
			scrollDate: ''
		}
	},
	beforeDestroy() {
		if ( this.scrollTimer ) {
			clearTimeout(this.scrollTimer)
			this.scrollTimer = null
		}
	},
	mounted () {
		this.scrollDate = this.filterDate()
	},
	methods: {
		scrollNext () {
			if ( this.scrolling ) {
				return
			}
			this.scrolling = true
			this.$refs.list.scrollTo(this.scrollTop + this.options.fontSize + this.options.lineHeight, true)
			this.scrollTimer = setTimeout(() => {
				this.scrolling = false
				clearTimeout(this.scrollTimer)
				this.scrollTimer = null
			}, 300)
		},
		scrollPrev () {
			if ( this.scrolling ) {
				return
			}
			this.scrolling = true
			this.$refs.list.scrollTo(this.scrollTop - (this.options.fontSize + this.options.lineHeight), true)
			this.scrollTimer = setTimeout(() => {
				this.scrolling = false
				clearTimeout(this.scrollTimer)
				this.scrollTimer = null
			}, 300)
		},
		onPulldown (callback) {
			let contentsIndex = this.contents.findIndex(content => content.chapter == this.pages[0].chapter)
			if ( this.contents[contentsIndex].isStart ) {
				callback('end')
			} else {
				this.scroll_loadmore({
					chapter: this.pages[0].chapter - 1,
					type: 'prev'
				}, callback)
				this.$refs.list.resetLoadmore()
			}
		},
		scrolltoupper () {
			let contentsIndex = this.contents.findIndex(content => content.chapter == (this.pages[0].chapter - 1))
			if ( contentsIndex > -1 ) {
				this.scroll_loadmore({
					chapter: this.pages[0].chapter - 1,
					type: 'prev'
				})
				this.$refs.list.resetLoadmore()
			}
		},
		onLoadmore (callback) {
			let contentsIndex = this.contents.findIndex(content => content.chapter == this.pages[this.pages.length - 1].chapter)
			if ( this.contents[contentsIndex].isEnd ) {
				callback('end')
			} else {
				this.scroll_loadmore({
					chapter: this.pages[this.pages.length - 1].chapter + 1,
					type: 'next'
				}, callback)
				this.$refs.list.resetPulldown()
			}
		},
		//加载更多章节
		scroll_loadmore (load, callback) {
			const chapter = load.chapter;
			const type = load.type;
			const contentIndex = this.contents.findIndex(item => item.chapter == chapter);
			if ( contentIndex > -1 ) {
				this.computedPage({
					content: this.contents[contentIndex],
					type: type
				});
				this.preload(chapter)
				callback && callback('success')
			} else {
				this.$emit('loadmore', chapter, (status, content) => {
					if (status == 'success') {
						const index = this.contents.findIndex(item => item.chapter == content.chapter)
						if (index > -1) {
							this.contents[index] = content;
						} else {
							this.contents.push(content);
						}
						this.computedPage({
							content: content,
							type: type
						});
						this.preload(chapter)
					}
					callback && callback('success')
				})
			}
		},
		async scrollEnd(e) {
			let rate = Math.floor(e.scrollTop / this.viewHeight)
			let maybe = this.pages[rate] ? rate : this.pages.length-1
			let top = -1
			let pageInfo = null
			while ( top < 0 ) {
				let rect = await this.getScrollItemRect(this.pages[maybe].dataId)
				top = rect.top
				pageInfo = this.pages[maybe]
				maybe++
			}
			if ( top >= 0 ) {
				const nowChapters = this.pages.filter(item => item.chapter == pageInfo.chapter && (item.type == 'text' || item.type == 'custom' || item.type == 'slot'))
				let contentIndex = this.contents.findIndex(content => content.chapter == pageInfo.chapter)
				pageInfo.totalPage = nowChapters.length
				pageInfo.currentPage = nowChapters.findIndex(item => item.dataId == pageInfo.dataId) + 1
				this.pageInfo = pageInfo
				//刷新当前时间和设备电量
				this.scrollDate = this.filterDate()
				this.$refs.scrollBattery.getBattery()
				this.$emit('change', pageInfo, this.pages)
			}
		},
		getScrollItemRect (dataId) {
			return new Promise(resolve => {
				Util.getRect('#scroll-item_' + dataId, Util.getRefs(this, 'scrollItem_' + dataId, 0), this).then(res => {
					resolve(res)
				})
			})
		},
		onScroll (e) {
			if ( this.options.pageType == 'scroll' ) {
				this.scrollTop = e.scrollTop
				if ( this.scrollTimer ) {
					clearTimeout(this.scrollTimer)
					this.scrollTimer = null
				}
				this.scrollTimer = setTimeout(() => {
					this.scrolling = false
					this.scrollEnd(e)
				}, 300)
			}
		}
	}
}