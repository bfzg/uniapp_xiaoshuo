import Util from '../../../js_sdk/util.js'
export default {
	data () {
		return {
			computedResolve: null
		}
	},
	methods: {
		reset (data, pages = []) {
			if ( data.custom && data.custom.length > 0 ) {
				pages.length > 0 ? pages[pages.length - 1].isLastPage = false : null
				data.custom.forEach(custom => {
					let type = ''
					if ( custom.indexOf('slot:') > -1 ) {
						type = 'slot'
						custom = custom.split(':')[1]
					} else {
						type = 'custom'
						let clicks = custom.match(/onclick=\"*([\s\S]*?)\"/ig);
						if ( clicks ) {
							clicks.forEach(click => {
								let name = click.match(/onclick=\"*([\s\S]*?)(\(|\")/)[1]
								let func = click.match(/onclick=\"*([\s\S]*?)\"/)
								let args = func[1].replace(name, '')
								args = args ? args.slice(1, args.length - 1).replace(/\s/g, '') : ''
								custom = custom.replace(func[0], `onclick="triggerCustomClick('${name}', [${args}])"`)
							})
						}
						
					}
					let end = pages.length > 0 ? pages[pages.length - 1].end : 0
					pages.push({
						chapter: data.chapter,
						title: data.title || '',
						type: type,
						dataId: data.chapter * 100000 + end,
						start: end,
						end: end + 10,
						isLastPage: false,
						text: custom
					})
				})
				pages[pages.length - 1].isLastPage = true
			}
			this.computedResolve(pages)
			this.computedResolve = null
		},
		measureText (text, fontSize=10) {
		  text = new String(text);
		  text = text.split('');
		  let width = 0;
		  text.forEach(function(item) {
		    if (/[a-zA-Z]/.test(item)) {
		      width += 7;
		    } else if (/[0-9]/.test(item)) {
		      width += 5.5;
		    } else if (/\./.test(item)) {
		      width += 2.7;
		    } else if (/-/.test(item)) {
		      width += 3.25;
		    } else if (/[\u4e00-\u9fa5]/.test(item)) { //中文匹配
		      width += 10;
		    } else if (/\(|\)/.test(item)) {
		      width += 3.73;
		    } else if (/\s/.test(item)) {
		      width += 2.5;
		    } else if (/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(item)) {
		      width += 8;
		    } else {
		      width += 10;
		    }
		  });
		  return width * fontSize / 10;
		},
		async computedText (data, start) {
			let rect = await this.getRect()
			let viewWidth = rect.width - (this.options.slide * 2)
			let viewHeight = rect.height - this.options.topGap - this.options.bottomGap
			if ( this.options.headerShow ) viewHeight = viewHeight - uni.upx2px(50)
			if ( this.options.footerShow ) viewHeight = viewHeight - uni.upx2px(50)
			let pageHeight = this.options.fontSize + this.options.lineHeight;
			let strs = [];
			let page = {
				title: data.title || '',
				chapter: data.chapter,
				type: 'text',
				dataId: data.chapter * 100000 + start,
				start: start,
				end: 0,
				isLastPage: false,
				text: []
			}
			let length = 0;
			let contentSync = data.content.substr(start);
			let lastIndex = 0;
			while ( (pageHeight + this.options.fontSize + this.options.lineHeight) <= viewHeight ) {
				strs.push('');
				let lineWidth = 0;
				for ( let i = lastIndex; i < contentSync.length; i++ ) {
					if ( JSON.stringify(contentSync[i]) == JSON.stringify('\r') || JSON.stringify(contentSync[i]) == JSON.stringify('\n') ) {
						length += 1
						page.end = page.start + length;
						lastIndex = i + 1;
						break;
					}
					lineWidth += JSON.stringify(contentSync[i]) == JSON.stringify('\t') ? 0 : this.measureText(contentSync[i], this.options.fontSize);
					if ( lineWidth >= viewWidth ) {
						lastIndex = i;
						break;
					} else {
						if ( JSON.stringify(contentSync[i]) != JSON.stringify('\t') ) {
							strs[strs.length - 1] += contentSync[i].replace('　', ' ')
							length += 1
							page.end = page.start + length
						}
					}
				}
				pageHeight += this.options.fontSize + this.options.lineHeight;
				if ( page.end >= data.content.length - 1 ) {
					page.isLastPage = true;
					break;
				}
			}
			page.text = strs;
			return page;
		},
		getRect () {
			return new Promise (resolve => {
				// #ifndef APP-NVUE
				const query = uni.createSelectorQuery().in(this);
				query.select('.yingbing-read-page').boundingClientRect(data => {
				  resolve(data)
				}).exec();
				// #endif
				// #ifdef APP-NVUE
				uni.requireNativePlugin('dom').getComponentRect(this.$refs.yingbingReadPage, res => {
					resolve(res.size)
				})
				// #endif
			})
		},
		getPages (data) {
			let pages = [];
			const doWhile = (start = 0) => {
				this.computedText(data, start).then(page => {
					pages.push(page);
					if ( page.isLastPage ) {
						this.reset(data, pages)
					} else {
						doWhile(page.end);
					}
				});
			}
			doWhile();
		},
		computedChapter(data) {
			return new Promise(resolve => {
				this.computedResolve = resolve
				data.content ? this.getPages(data) : this.reset(data)
			})
		},
		//绘制页面
		resetPage(data) {
			setTimeout(() => {
				//一次最多渲染3章的内容，根据定位的章节剪切出3章内容渲染
				let currentChapter = data.currentChapter || this.contents[0].chapter
				let nowIndex = this.contents.findIndex(item => item.chapter == currentChapter);
				let prevIndex = -1;
				let nextIndex = -1;
				let contents = [];
				if (!this.contents[nowIndex].isStart) prevIndex = this.contents.findIndex(item => item.chapter == currentChapter - 1);
				if (!this.contents[nowIndex].isEnd) nextIndex = this.contents.findIndex(item => item.chapter == currentChapter + 1);
				if (prevIndex > -1) {
					contents.push(this.contents[prevIndex])
				}
				contents.push(this.contents[nowIndex])
				if (nextIndex > -1) {
					contents.push(this.contents[nextIndex])
				}
				let arr = [];
				const dowhile = (i) => {
					let item = contents[i];
					this.computedChapter(item).then(pages => {
						if (currentChapter == item.chapter) {
							let index = Object.keys(pages).findIndex(key => data.start >= pages[key].start && data.start < pages[key].end)
							this.currentDataId = pages[index > -1 ? index : 0].dataId;
						}
						arr = arr.concat(pages)
						if (i == contents.length - 1) {
							if ( this.options.pageType != 'scroll' ) {
								arr.unshift({
									title: contents[0].title || '',
									chapter: contents[0].chapter,
									type: contents[0].isStart ? 'top' : 'prevLoading',
									dataId: arr[0].dataId - 1,
									start: 0,
									end: 0
								})
								arr.push({
									title: item.title || '',
									chapter: item.chapter,
									type: item.isEnd ? 'bottom' : 'nextLoading',
									dataId: arr[arr.length - 1].dataId + 1,
									start: 0,
									end: 0
								})
							}
							this.pages = arr
							if ( this.options.pageType == 'scroll' ) {
								this.$refs.list.scrollTo(0)
							}
							this.$nextTick(() => {
								if ( this.options.pageType != 'scroll' ) {
									this.onChange(this.currentDataId);
								} else {
									setTimeout(() => {
										Util.getRect('#scroll-item_' + this.currentDataId, Util.getRefs(this, 'scrollItem_' + this.currentDataId, 0), this).then(rect => {
											this.$refs.list.scrollTo(rect.top)
										})
									}, 50)
								}
								this.initLoading = false;
								this.preload(currentChapter);
							})
						} else {
							setTimeout(() => {
								dowhile(i + 1)
							}, 100)
						}
					})
				}
				dowhile(0)
			}, 50)
		},
		computedPage(e) {
			this.computedChapter(e.content).then((pages) => {
				let arr = [];
				let newPages = [];
				const pagesSync = e.type == 'prev' ? pages.concat(this.pages) : this.pages.concat(pages);
				pagesSync.forEach(item => {
					if (arr.indexOf(item.chapter) == -1) arr.push(item.chapter)
				})
				if (arr.length > 3) {
					let reChapter = e.type == 'prev' ? pagesSync[pagesSync.length - 1].chapter : pagesSync[0].chapter;
					newPages = pagesSync.filter(item => item.chapter != reChapter && (item.type == 'text' || item.type == 'custom' || item.type == 'slot'));
				} else {
					newPages = pagesSync.filter(item => (item.type == 'text' || item.type == 'custom' || item.type == 'slot'));
				}
				if ( this.options.pageType != 'scroll' ) {
					const prevIndex = this.contents.findIndex(content => content.chapter == newPages[0].chapter);
					const nextIndex = this.contents.findIndex(content => content.chapter == newPages[newPages.length - 1].chapter);
					newPages.unshift({
						title: this.contents[prevIndex].title || '',
						chapter: this.contents[prevIndex].chapter,
						type: this.contents[prevIndex].isStart ? 'top' : 'prevLoading',
						dataId: newPages[0].dataId - 1,
						start: 0,
						end: 0
					})
					newPages.push({
						title: this.contents[nextIndex].title || '',
						chapter: this.contents[nextIndex].chapter,
						type: this.contents[nextIndex].isEnd ? 'bottom' : 'nextLoading',
						dataId: newPages[newPages.length - 1].dataId + 1,
						start: 0,
						end: 0
					})
					this.pages = newPages
					const nowIndex = newPages.findIndex(page => page.dataId == this.currentDataId);
					if ( nowIndex == -1 ) {
						this.currentDataId = e.type == 'next' ? pages[0].dataId : pages[pages.length - 1].dataId;
						this.onChange(this.currentDataId)
					}
				} else {
					let dataId = e.type == 'prev' ? this.pages[0].dataId : this.pages[this.pages.length-1].dataId
					Util.getRect('.scroll-item-wrapper', this.$refs.scrollItemWrapper, this).then(rect => {
						let lastHeight = rect.height
						this.pages = e.type == 'prev' ? pages.concat(this.pages) : this.pages.concat(pages)
						if ( e.type == 'prev' ) {
							this.$nextTick(function () {
								setTimeout(() => {
									Util.getRect('.scroll-item-wrapper', this.$refs.scrollItemWrapper, this).then(rect => {
										this.$refs.list.scrollTo(rect.height - lastHeight)
									})
								}, 50)
							})
						}
					})
				}
			})
		},
		//预加载章节
		preload (chapter) {
			if ( !this.enablePreload ) return false
			const nowIndex = this.contents.findIndex(item => item.chapter == chapter);
			let prevIndex = -2;
			let nextIndex = -2;
			let chapters = [];
			if ( !this.contents[nowIndex].isStart ) prevIndex = this.contents.findIndex(item => item.chapter == chapter - 1);
			if ( !this.contents[nowIndex].isEnd ) nextIndex = this.contents.findIndex(item => item.chapter == chapter + 1);
			if ( prevIndex == -1 ) {
				chapters.push(chapter - 1);
			}
			if ( nextIndex == -1 ) {
				chapters.push(chapter + 1);
			}
			if ( chapters.length > 0 ) {
				this.$emit('preload', chapters, (status, contents) => {
					if (status == 'success') {
						contents.forEach(item => {
							const index = this.contents.findIndex(content => content.chapter == item.chapter)
							if (index > -1) {
								this.contents[index] = item;
							} else {
								this.contents.push(item);
							}
						})
					}
				})
			}
		},
		filterPage (pageInfo) {
			if ( pageInfo && pageInfo.dataId > -1 ) {
				const nowChapters = this.pages.filter(item => item.chapter == pageInfo.chapter && (item.type == 'text' || item.type == 'custom' || item.type == 'slot'))
				let currentPage = nowChapters.findIndex(item => item.dataId == pageInfo.dataId)
				if ( currentPage > -1 ) {
					return (currentPage + 1) + ' / ' + nowChapters.length
				} else {
					return pageInfo.type == 'top' ? '最前面' : pageInfo.type == 'bottom' ? '最后面' : pageInfo.type.indexOf('Loading') > -1 ? '请等待' : ''
				}
			} else {
				return '加载中'
			}
		},
		filterDate () {
			let date = new Date()
			return Util.zeroize(date.getHours()) + ':' + Util.zeroize(date.getMinutes())
		},
		//翻往上一页
		pagePrev () {
			if ( this.options.pageType != 'scroll' ) {
				// #ifndef APP-NVUE
				this.pagePrevWxs()
				// #endif
				// #ifdef APP-NVUE
				this.pagePrevBinding()
				// #endif
			} else {
				this.scrollPrev()
			}
		},
		//翻往下一页
		pageNext () {
			if ( this.options.pageType != 'scroll' ) {
				// #ifndef APP-NVUE
				this.pageNextWxs()
				// #endif
				// #ifdef APP-NVUE
				this.pageNextBinding()
				// #endif
			} else {
				this.scrollNext()
			}
		},
	}
}