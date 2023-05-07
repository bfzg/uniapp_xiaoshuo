<script>
	import sqliteDB from '@/sqlite/sqlite.js'
	import checkUpdata from "@/uni_modules/uni-upgrade-center-app/utils/check-update.js"
	export default {
		onLaunch: async function() {
			this.openSQL()
			// #ifdef APP-PLUS
			//设置2.4秒后主动关闭，最多设置6秒
			setTimeout(() => {
				plus.navigator.closeSplashscreen();
			}, 2400);
			// #endif
			// #ifdef APP-PLUS
			//检查更新
			checkUpdata();
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			//打开sqlite数据库
			openSQL() {
				let open = sqliteDB.isOpen();
				console.log("数据库状态", open ? '开启' : '关闭');
				if (!open) {
					sqliteDB.openSqlite().then(res => {
						console.log('开启成功!');
					}).catch(error => {
						console.log('开启失败!');
					});
				}
			},
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "@/static/font/iconfont.css";
</style>