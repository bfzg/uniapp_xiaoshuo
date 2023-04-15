<template>
	<!-- #ifdef APP-VUE || H5 -->
	<div class="yingbing-computed-page" :prop="computedPageProp" :change:prop="computedPage.propWatcher" :style="{
		'padding-left': options.slide + 'px',
		'padding-right': options.slide + 'px',
		'padding-top': options.topGap + 'px',
		'padding-bottom': options.bottomGap + 'px'
	}">
		<view class="yingbing-computed-page-header" v-if="options.headerShow"></view>
		<view class="yingbing-computed-page-content"></view>
		<view class="yingbing-computed-page-footer" v-if="options.footerShow"></view>
	</div>
	<!-- #endif -->
	<!-- #ifndef APP-VUE || H5 -->
	<div class="yingbing-computed-page" :style="{
		'padding-left': options.slide + 'px',
		'padding-right': options.slide + 'px',
		'padding-top': options.topGap + 'px',
		'padding-bottom': options.bottomGap + 'px'
	}">
		<view class="yingbing-computed-page-header" v-if="options.headerShow"></view>
		<view class="yingbing-computed-page-content" ref="yingbingComputedPageContent"></view>
		<view class="yingbing-computed-page-footer" v-if="options.footerShow"></view>
	</div>
	<!-- #endif -->
</template>

<script>
	export default {
		props: {
			options: {
				type: Object,
				default () {
					return new Object
				}
			}
		},
		data () {
			return {
				content: '',
				custom: [],
				isStart: false,
				chapter: null,
				title: '',
				resolve: null
			}
		},
		computed: {
			computedPageProp () {
				return {
					isStart: this.isStart,
					fontSize: this.options.fontSize,
					lineHeight: this.options.lineHeight,
					pageType: this.options.pageType,
					content: this.content,
					chapter: this.chapter,
					title: this.title
				}
			}
		},
		methods: {
			computed ({content, chapter, custom, title}) {
				return new Promise((resolve) => {
					this.content = content || '';
					this.custom = custom || [];
					this.chapter = chapter || null;
					this.title = title || '';
					this.resolve = resolve;
					// #ifdef APP-VUE || H5
					content ? this.isStart = true : this.reset();
					// #endif
					// #ifndef APP-VUE || H5
					content ? this.getPages() : this.reset();
					// #endif
				})
			},
			reset (pages = []) {
				if ( this.custom.length > 0 ) {
					pages.length > 0 ? pages[pages.length - 1].isLastPage = false : null
					this.custom.forEach(custom => {
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
							chapter: this.chapter,
							title: this.title,
							type: type,
							dataId: this.chapter * 100000 + end,
							start: end,
							end: end + 10,
							isLastPage: false,
							text: custom
						})
					})
					pages[pages.length - 1].isLastPage = true
				}
				this.resolve(pages);
				this.resolve = null
				this.isStart = false
				this.content = ''
				this.title = ''
				this.chapter = null
				this.start = null
				this.end = null
			},
			// #ifndef APP-VUE || H5
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
			async computedText (start) {
				let rect = await this.getRect()
				let viewWidth = rect.width;
				let viewHeight = rect.height;
				let pageHeight = this.options.fontSize + this.options.lineHeight;
				let strs = [];
				let page = {
					title: this.title,
					chapter: this.chapter,
					type: 'text',
					dataId: this.chapter * 100000 + start,
					start: start,
					end: 0,
					isLastPage: false,
					text: []
				}
				let length = 0;
				let contentSync = this.content.substr(start);
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
					if ( page.end >= this.content.length - 1 ) {
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
					query.select('.yingbing-computed-page-content').boundingClientRect(data => {
					  resolve(data)
					}).exec();
					// #endif
					// #ifdef APP-NVUE
					uni.requireNativePlugin('dom').getComponentRect(this.$refs.yingbingComputedPageContent, res => {
						resolve(res.size)
					})
					// #endif
				})
			},
			getPages () {
				let pages = [];
				const doWhile = (start = 0) => {
					this.computedText(start).then(page => {
						pages.push(page);
						if ( page.isLastPage ) {
							this.reset(pages)
						} else {
							doWhile(page.end);
						}
					});
				}
				doWhile();
			}
			// #endif
		}
	}
</script>

<!-- #ifdef H5 || APP-VUE -->
<script lang="renderjs" type="module" module="computedPage">
	let myComputedPageDom;
	export default {
		data () {
			return {
				viewWidth: 0,
				viewHeight: 0
			}
		},
		mounted () {
			this.initDom.bind(this);
		},
		methods: {
			initDom () {
				myComputedPageDom = computedPage.init(document.getElementsByClassName('yingbing-computed-page')[0]);
				// 观测更新的数据在 view 层可以直接访问到
				myComputedPageDom.setOption(this.computedPageProp);
			},
			//计算页面显示文字
			computedText (start) {
				let parent = document.getElementsByClassName('yingbing-computed-page-content')[0];
				this.viewWidth = parent.offsetWidth;
				this.viewHeight = parent.offsetHeight;
				let computedCanvas = this.createComputedCanvas(parent);
				let context = computedCanvas.getContext('2d');
				context.font = this.computedPageProp.fontSize + 'px 微软雅黑';
				context.lineWidth = 1;
				let pageHeight = this.computedPageProp.fontSize + this.computedPageProp.lineHeight;
				let strs = [];
				let page = {
					title: this.computedPageProp.title,
					chapter: this.computedPageProp.chapter,
					type: 'text',
					dataId: this.computedPageProp.chapter * 100000 + start,
					start: start,
					end: 0,
					isLastPage: false,
					text: []
				}
				let length = 0;
				let contentSync = this.computedPageProp.content.substr(start);
				let lastIndex = 0;
				while ( (pageHeight + this.computedPageProp.fontSize + this.computedPageProp.lineHeight) <= this.viewHeight ) {
					strs.push('');
					let lineWidth = 0;
					for ( let i = lastIndex; i < contentSync.length; i++ ) {
						if ( JSON.stringify(contentSync[i]) == JSON.stringify('\r') || JSON.stringify(contentSync[i]) == JSON.stringify('\n') ) {
							length += 1
							page.end = page.start + length;
							lastIndex = i + 1;
							break;
						}
						lineWidth += (JSON.stringify(contentSync[i]) == JSON.stringify('\t') ? 0 : context.measureText(contentSync[i]).width);
						if ( lineWidth >= this.viewWidth ) {
							lastIndex = i;
							break;
						} else {
							if ( JSON.stringify(contentSync[i]) != JSON.stringify('\t') ) {
								strs[strs.length - 1] += contentSync[i];
								length += 1;
								page.end = page.start + length;
							}
						}
					}
					pageHeight += (this.computedPageProp.fontSize + this.computedPageProp.lineHeight);
					if ( page.end >= this.computedPageProp.content.length - 1 ) {
						page.isLastPage = true;
						break;
					}
				}
				page.text = strs;
				return page;
			},
			//创建一个独立的canvas画板，用于计算文字布局
			createComputedCanvas (el) {
				if ( el.getElementsByClassName('computedCanvas')[0] ) return el.getElementsByClassName('computedCanvas')[0];
				let canvasDom = document.createElement('canvas');
				canvasDom.width = this.viewWidth;
				canvasDom.height = this.viewHeight;
				canvasDom.style.position = 'absolute';
				canvasDom.style.top = 0;
				canvasDom.style.left = 0;
				canvasDom.setAttribute('class', 'computedCanvas');
				el.appendChild(canvasDom);
				return el.getElementsByClassName('computedCanvas')[0];
			},
			//参数改变
			propWatcher (newValue, oldValue) {
				if ( newValue.isStart != (oldValue ? oldValue.isStart : false) ) {
					if ( newValue.isStart ) {
						this.getPages();
					}
				}
			},
			getPages () {
				let pages = [];
				const doWhile = (start = 0) => {
					let page = this.computedText(start);
					pages.push(page);
					if ( page.isLastPage ) {
						this.triggerReset(pages)
					} else {
						doWhile(page.end);
					}
				}
				doWhile();
			},
			triggerReset (pages) {
				// #ifndef H5
				this.$ownerInstance.callMethod('reset', pages);
				// #endif
				// #ifdef H5
				this.reset(pages);
				// #endif
			}
		}
	}
</script>
<!-- #endif -->

<style scoped>
	.yingbing-computed-page {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		overflow: hidden;
		/* #endif */
	}
	.yingbing-computed-page-header {
		height: 50rpx;
	}
	.yingbing-computed-page-footer {
		height: 50rpx;
	}
	.yingbing-computed-page-content {
		flex: 1;
	}
</style>
