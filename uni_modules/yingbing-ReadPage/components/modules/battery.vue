<template>
	<view class="yingbing-battery">
		<view class="yingbing-battery-wrapper" :style="{
			'border-color': color
		}">
			<view class="yingbing-battery-content">
				<view :style="{
					flex: 1,
					'background-color': color,
					width: value + 'rpx'
				}"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			color: {
				type: String,
				default: '#333'
			}
		},
		data () {
			return {
				value: 54
			}
		},
		// #ifdef APP-PLUS
		beforeDestroy() {
			if ( this.recevier ) {
				plus.android.runtimeMainActivity().unregisterReceiver(this.recevier)
			}
		},
		// #endif
		mounted () {
			this.getBattery()
		},
		methods: {
			getBattery () {
				// #ifdef H5
				window.navigator.getBattery().then((res) => {
				    // 电池电量在0到1之间，因此我们将其乘以100得出百分比
				    this.value =  res.level * 54
				});
				// #endif
				// #ifdef MP-WEIXIN
				wx.getBatteryInfo({
					success: (res) => {
						this.value = (res.level / 100) * 54
					}
				})
				// #endif
				// #ifdef APP-PLUS
				uni.getSystemInfo({
					success: (res) => {
						if ( res.osName == 'android' ) {
							const main = plus.android.runtimeMainActivity()
							const Intent = plus.android.importClass('android.content.Intent');
							this.recevier = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', { 
								onReceive: (context, intent) => { 
							       let action = intent.getAction(); 
							       if (action == Intent.ACTION_BATTERY_CHANGED) { 
							           	let level = intent.getIntExtra("level", 0); //电量 B5教程网 
										this.value = (level / 100) * 54
										main.unregisterReceiver(this.recevier)//销毁注册广播
										//let voltage = intent.getIntExtra("voltage", 0); //电池电压 
										//let temperature = intent.getIntExtra("temperature", 0); //电池温度 
							           //如需获取别的，在这里继续写，此代码只提供获取电量 
							       } 
							    } 
							}); 
							const filter = plus.android.newObject('android.content.IntentFilter', Intent.ACTION_BATTERY_CHANGED); 
							main.registerReceiver(this.recevier, filter);
						} else if ( res.osName == 'ios' ) {
							const UIDevice = plus.ios.import("UIDevice");
							const dev = UIDevice.currentDevice(); 
							if (!dev.isBatteryMonitoringEnabled()) { 
							    dev.setBatteryMonitoringEnabled(true); 
							} 
							let level = dev.batteryLevel();
							this.value = (level / 100) * 54
						}
					}
				})
				// #endif
			}
		}
	}
</script>

<style scoped>
	.yingbing-battery-wrapper {
		width: 60rpx;
		height: 24rpx;
		border-width: 1px;
		border-style: solid;
		padding: 2rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		overflow: hidden;
		/* #endif */
	}
	.yingbing-battery-content {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		overflow: hidden;
		/* #endif */
	}
</style>