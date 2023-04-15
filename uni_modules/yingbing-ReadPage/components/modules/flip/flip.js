import Util from '../../../js_sdk/util.js'
// #ifdef APP-NVUE
import FlipBindingx from './bindingx.js'
// #endif
export default {
	// #ifdef APP-NVUE
	mixins: [FlipBindingx],
	// #endif
	computed: {
		dataReverse () {
			let data = JSON.parse(JSON.stringify(this.pages))
			return data.reverse()
		},
		current () {
			return this.dataReverse.findIndex(item => item.dataId == this.currentDataId)
		},
		prevDataId () {
			return this.dataReverse[this.current + 1] && this.dataReverse[this.current + 1].dataId
		},
		nextDataId () {
			return this.dataReverse[this.current - 1] && this.dataReverse[this.current - 1].dataId
		},
		flipProp () {
			return {
				prevDataId: this.prevDataId,
				nextDataId: this.nextDataId,
				currentDataId: this.currentDataId,
				pageType: this.options.pageType,
				pageTo: this.pageTo
			}
		}
	},
	data() {
		return {
			currentDataId: -1,
			isShow: false,
			viewWidth: 0,
			viewHeight: 0,
			pageTo: 0,
			moreLoading: false,
			initLoading: true,
			loadingText: '正在加载内容',
			loadStatus: 'none',
			loadChapter: -1,
			loadValue: 0
		}
	},
	mounted () {
		if ( this.pageType != 'scroll' ) {
			this.$nextTick(function () {
				setTimeout(() => {
					this.getViewRect()
				}, 50)
			})
		}
	},
	methods: {
		//翻往上一页
		pagePrevWxs () {
			this.pageTo = 0
			this.$nextTick(function(){
				this.pageTo = -1
			})
		},
		//翻往下一页
		pageNextWxs () {
			this.pageTo = 0
			this.$nextTick(function(){
				this.pageTo = 1
			})
		},
		reload () {
			if ( this.loadStatus == 'fail' || this.loadStatus == 'timeout' ) {
				this.initLoading = false
				this.loadingText = '正在加载内容'
				this.loadStatus = 'none';
				this.loadmore(this.loadChapter, this.loadValue);
				this.loadChapter = -1;
				this.loadValue = 0;
			}
		},
		loadmore (chapter, value) {
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
						type: value > 0 ? 'next' : 'prev'
					});
					this.preload(chapter)
					this.moreLoading = false;
				} else if ( status == 'fail' ) {
					this.loadStatus = status;
					this.loadingText = '请求失败，点击重试'
					this.initLoading = true
					this.loadChapter = chapter;
					this.loadValue = value;
				} else {
					this.loadStatus = status;
					this.loadingText = '请求超时，点击重试'
					this.initLoading = true
					this.loadChapter = chapter;
					this.loadValue = value;
				}
			})
		},
		getViewRect () {
			return new Promise(resolve => {
				Util.getRect('.yingbing-flip', this.$refs.yingbingFlip, this).then(res => {
					this.viewWidth = res.width
					this.viewHeight = res.height
					this.isShow = true
					resolve(true)
				})
			})
		},
		onChange(dataId) {
			const value = dataId < this.currentDataId ? -1 : 1
			this.currentDataId = dataId
			const index = this.pages.findIndex(page => page.dataId == dataId);
			const type = this.pages[index].type;
			let pageInfo = this.pages[index]
			const nowChapters = this.pages.filter(item => item.chapter == pageInfo.chapter && (item.type == 'text' || item.type == 'custom' || item.type == 'slot'))
			let contentIndex = this.contents.findIndex(content => content.chapter == pageInfo.chapter)
			pageInfo.totalPage = nowChapters.length
			pageInfo.currentPage = nowChapters.findIndex(item => item.dataId == pageInfo.dataId) + 1
			if ( this.contents[contentIndex].title ) pageInfo.title = this.contents[contentIndex].title
			this.pageInfo = pageInfo
			this.$emit('change', pageInfo, this.pages)
			const nextType = this.pages[index + value] && this.pages[index + value].type
			const loadings = ['nextLoading', 'prevLoading']
			if ( loadings.indexOf(this.pages[index].type) >-1 || loadings.indexOf(nextType) >-1) {
				if (this.moreLoading) return
				this.moreLoading = true;
				const loadChapter = this.pages[index].chapter + value;
				contentIndex = this.contents.findIndex(content => content.chapter == loadChapter)
				if (contentIndex > -1) {
					this.computedPage({
						content: this.contents[contentIndex],
						type: value > 0 ? 'next' : 'prev'
					});
					this.preload(loadChapter)
					this.moreLoading = false;
				} else {
					this.loadmore(loadChapter, value)
				}
			}
		}
	}
}