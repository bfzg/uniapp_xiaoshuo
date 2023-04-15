
export default {
	/**
	 * 补零
	 * @param {Number} val 数字
	 **/
	zeroize (val) {
		return zeroize(val);
	},
	/**
	 * 时间格式化
	 * @param {String} time 时间戳or时间
	 **/
	dateFormat (time, formats = 'yyyy-mm-dd hh:mm:ss') {
		let arr = formats.split(' ')
		let dateFormats = ''
		let timeFormats = ''
		arr.forEach(item => {
			if ( item.indexOf('yy') > -1 ) {
				dateFormats = item
			} else {
				timeFormats = item
			}
		})
		const d = new Date(time);
		let result = ''
		if ( dateFormats.indexOf('yyyy') > -1 ) {
			result += d.getFullYear() + '-'
		}
		if ( dateFormats.indexOf('mm') > -1 ) {
			result += zeroize(d.getMonth() + 1) + '-'
		}
		if ( dateFormats.indexOf('dd') > -1 ) {
			result += zeroize(d.getDate()) + ' '
		}
		if ( timeFormats.indexOf('hh') > -1 ) {
			result += zeroize(d.getHours()) + ':'
		}
		if ( timeFormats.indexOf('mm') > -1 ) {
			result += zeroize(d.getMinutes()) + ':'
		}
		if ( timeFormats.indexOf('ss') > -1 ) {
			result += zeroize(d.getSeconds()) + ':'
		}
		return result.substring(0, result.length - 1)
	},
	/**
	 * 秒数转化为分秒
	 * @param {String} value 秒数
	 **/
	minutesFormat (value) {
		let minutes = Math.floor(value / 60 % 60) >= 10 ? Math.floor(value / 60 % 60) : '0' + Math.floor(value / 60 % 60);
		let seconds = Math.floor(value % 60) >= 10 ? Math.floor(value % 60) : '0' + Math.floor(value % 60);
		return minutes + ':' + seconds;
	},
	/**
	 * 时间转化为秒数
	 * @param {String} time 时间（HH:mm:ss）
	 **/
	time2seconds (time){
		const seconds = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1].split('.')[0]) + parseInt(time.split(':')[1].split('.')[1]) / 1000;
		return seconds; 
	},
	/**
	 * 移除url地址域名
	 * @param {String} str http地址
	 **/
	removeUrl (url) {
	  	let str = url.replace(/^http:\/\/[^/]+/, '');
		return str.substr(1);
	},
	/**
	 * 获取文件后缀
	 * @param {String} name 带后缀的文件名称
	 **/
	suffix (name) {
	  	//获取图片后缀
	  	let fileName = name.lastIndexOf(".");
	  	let fileNameLength = name.length;
	  	let fileFormat = name.substring(fileName + 1, fileNameLength);
	  	return fileFormat;
	},
	
	/**
	 * 清除文件后缀
	 * @param {String} name 带后缀的文件名称
	*/
	removeSuffix (name) {
	  	//获取图片后缀
	  	let fileName = name.lastIndexOf(".");
		if ( fileName > -1 ) {
			let fileNameFormat = name.substring(0, fileName);
			return fileNameFormat;
		} else {
			return name
		}
	},
	
	/**
	 * 数组查找符合条件元素并返回下标
	 * @param {Array} arr 传入数组
	 * @param {String} value 条件元素
	 * @param {String} query 对比key值
	*/
	indexOf (arr, query, value) {
		let len = arr.length;
		for ( let i = 0; i < len; i++ ) {
			if ( arr[i][query] == value ) {
				return parseInt(i);
			}
		}
		return -1;
	},
	
	/**
	 * 正则匹配
	 * @param {String} type 匹配类型
	 * @param {String} value 匹配值
	*/
	reg (type, value) {
		const regs = {
			//身份证证则
			idcard: new RegExp(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/),
			//手机正则
			mobile: new RegExp(/^1[3456789]\d{9}$/),
			//固定电话正则
			phone: new RegExp(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/),
			//金额验证
			price: new RegExp(/^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0.\d{1,2}$/),
			//邮箱验证
			email: new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/),
			//银行卡
			bankcard: new RegExp(/^([1-9]{1})(\d{15}|\d{18})$/)
		}
		return regs[type].test(value);
	},
	/**
	 * 计算2个时间差的分钟数或者秒钟数或时钟数
	 * @param {datetime} time1 开始时间
	 * @param {datetime} time2 结束时间
	*/
	timeMinuse (time1, time2, type = 'minutes') {
		//判断开始时间是否大于结束日期
		let date1 = new Date(time1);
		let date2 = new Date(time2);
		if	( date1 > date2 ) {
		  console.log("开始时间不能大于结束时间！");
		  return false;
		}
		let seconds = date2.getTime() / 1000 - date1.getTime() / 1000;
		return type == 'minutes' ? (seconds / 60) : type == 'hours' ? (seconds / 60 / 60) : seconds;
	},
	/**
	 * 判断值类型返回字符
	 * @param {datetime} value 需要判断类型的值
	*/
	typeof (value) {
		let type = Object.prototype.toString.call(value);
		return type.slice(8, type.length - 1)
	},
	/**
	 * 生成随机字符串
	 * @param {Number} len 长度
	*/
	randomString (len) {
		len = len || 32;
		var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
		var maxPos = $chars.length;
		var pwd = '';
		for (let i = 0; i < len; i++) {
		　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd;
	},
	
	/**
	 * 生成随机ID
	*/
	randomID () {
		let mydate = new Date();
		return mydate.getMinutes() + mydate.getSeconds() + mydate.getMilliseconds() + Math.round(Math.random() * 10000);
	},
	
	/**
	 * 生成随机不重复整数
	 * @param {Number} len 长度
	*/
	randomSoleNumber (len) {
		let min = 0;
		let max = len - 1;
		let arr = [];
		while ( arr.length < len ) {
			let value = Math.floor(Math.random() * (max - min + 1)) + min;
			if ( arr.indexOf(value) == -1 ) {
				arr.push( value )
			}
		}
		return arr;
	},
	
	/**
	 * 16进制颜色转化为rgb
	 * @param {String} hex 16进制颜色
	*/
	hex2rgb (hex) {
		hex = hex.length == 7 ? hex : '#' + hex.slice(1, 4) + hex.slice(1, 4)
		let str="rgb("
		const r = parseInt(hex.slice(1,3),16).toString();   //ff  slice不包括end
		const g = parseInt(hex.slice(3,5),16).toString();   //00
		const b = parseInt(hex.slice(5,7),16).toString();   //ff
		str += r+","+g+","+b+")";
		return str
	},
	
	/**
	 * 16进制颜色转化为rgba
	 * @param {String} hex 16进制颜色
	*/
	hex2rgba (hex, opacity) {
		hex = hex.length == 7 ? hex : '#' + hex.slice(1, 4) + hex.slice(1, 4)
		let str="rgba("
		const r = parseInt(hex.slice(1,3),16).toString();   //ff  slice不包括end
		const g = parseInt(hex.slice(3,5),16).toString();   //00
		const b = parseInt(hex.slice(5,7),16).toString();   //ff
		str += r+","+g+","+b+","+opacity+")";
		return str
	},
	
	/**
	 * byte转化为文件大小
	 * @param {Number} byte 位
	*/
	byte2Size (byte) {
		let sizeString = ''
		if(byte == 0){
			sizeString = "0B";
		}else if(byte < 1024){
			sizeString = byte + "B";
		}else if(byte < 1048576){
			sizeString = (byte/1024).toFixed(2) + "KB";
		}else if (byte < 1073741824){
			sizeString = (byte/1048576).toFixed(2) + "MB";
		}else{
			sizeString = (byte/1073741824).toFixed(2) + "GB";
		}
		return sizeString;
	},
	
	// 深度克隆
	deepClone (obj) {  
	    if(typeof obj !== "object" && typeof obj !== 'function') {
			//原始类型直接返回
	        return obj;
	    }
	    var o = isArray(obj) ? [] : {}; 
	    for(let i in obj) {  
	        if(obj.hasOwnProperty(i)){ 
	            o[i] = typeof obj[i] === "object" ? this.deepClone(obj[i]) : obj[i]; 
	        } 
	    } 
	    return o;
	},
	
	/**
	 * 将数字转为带中文单位的字符串
	 * @param {Number} num 数字
	*/
	numtounit (num) {
		let units = [{
			label: '万',
			value: 10000,
			min: 1000
		},{
			label: '亿',
			value: 100000000,
			min: 100000000
		},{
			label: '兆',
			value: 10000000000000000,
			min: 100000000000000000
		}]
		let value = num
		units.forEach(unit => {
			if ( num >= unit.min ) {
				value = (num / unit.value).toFixed(2) + unit.label
			}
		})
		return value
	},
	/**
	 * 判断像素单位，没有则加上rpx
	 * @param {String} value 像素
	*/
	pixelunit (value) {
		if ( value.toString().indexOf('px') > -1 || value.toString().indexOf('em') > -1 || value.toString().indexOf('auto') > -1 || value.toString().indexOf('%') > -1 ) {
			return value
		} else {
			return value + 'rpx'
		}
	},
	/**
	 * 判断像素单位，全部转为px
	 * @param {String} value 像素
	*/
	unitpixel (value) {
		if ( value.toString().indexOf('rpx') > -1 ) {
			return uni.upx2px(value.replace('rpx', ''))
		} else if ( value.toString().indexOf('px') > -1 ) {
			return parseFloat(value.replace('px', ''))
		} else if ( value.toString().indexOf('em') > -1 || value.toString().indexOf('auto') > -1 || value.toString().indexOf('%') > -1 ) {
			return value
		} else {
			return parseFloat(uni.upx2px(value))
		}
	},
	/**
	 * 判断像素单位，转化为rpx
	 * @param {String} value 值
	 * @param {String} unit 返回结果是否带上单位
	*/
	anytorpx (value, unit = true) {
		if ( value.toString().indexOf('rpx') > -1 ) {
			return unit ? value : parseFloat(value.replace('rpx', ''))
		} else if ( value.toString().indexOf('px') > -1 ) {
			return parseFloat(value.replace('px', '') * (750 / uni.getSystemInfoSync().windowWidth)) + (unit ? 'rpx' : 0)
		} else if ( value.toString().indexOf('auto') > -1 ) {
			return 'auto'
		} else if ( value.toString().indexOf('%') > -1 ) {
			return parseFloat((value.replace('%', '') / 100) * 750) + (unit ? 'rpx' : 0)
		} else if (value.toString().indexOf('em') > -1 || value.toString().indexOf('rem') > -1 ) {
			return parseFloat(value.replace('em', '').replace('rem', '') * 32) + (unit ? 'rpx' : 0)
		} else if ( /^\d+$/.test(value) ) {
			return parseFloat(value) + (unit ? 'rpx' : 0)
		}
	},
	/**
	 * 判断像素单位，转化为px
	 * @param {String} value 值
	 * @param {String} unit 返回结果是否带上单位
	*/
	anytopx (value, unit = false) {
		if ( value.toString().indexOf('rpx') > -1 ) {
			return uni.upx2px(value.replace('rpx', '')) + (unit ? 'px' : 0)
		} else if ( value.toString().indexOf('px') > -1 ) {
			return parseFloat(value.replace('px', '')) + (unit ? 'px' : 0)
		} else if ( value.toString().indexOf('auto') > -1 ) {
			return 'auto'
		} else if ( value.toString().indexOf('%') > -1 ) {
			return parseFloat((value.replace('%', '') / 100) * uni.getSystemInfoSync().windowWidth) + (unit ? 'px' : 0)
		} else if (value.toString().indexOf('em') > -1 || value.toString().indexOf('rem') > -1 ) {
			return parseFloat(value.replace('em', '').replace('rem', '') * uni.getSystemInfoSync().windowWidth) + (unit ? 'px' : 0)
		} else if ( /^\d+$/.test(value) ) {
			return parseFloat(value) + (unit ? 'px' : 0)
		}
	},
	getRefs (components, name, current) {
		// #ifndef MP
		return current >= 0 ? components.$refs[name][current] : components.$refs[name]
		// #endif
		// #ifdef MP
		return {}
		// #endif
	},
	//获取节点
	getEl (el) {
	    if (typeof el === 'string' || typeof el === 'number') return el;
		if (WXEnvironment) {
		    return el.ref;
		} else {
		    return el instanceof HTMLElement ? el : el.$el;
		}
	},
	/**
	 * 获取指定父节点
	 * @param {String} components 当前实例
	 * @param {String} name 父节点名称
	*/
	getParent(name, components) {
		let parent = components.$parent
		if (parent) {
			let parentName = parent.$options.name
			while (parentName !== name) {
				parent = parent.$parent
				if (parent) {
					parentName = parent.$options.name
				} else {
					return null
				}
			}
			return parent
		}
		return null
	},
	/**
	 * 获取指定子节点
	 * @param {String} components 当前实例
	 * @param {String} name 父节点名称
	*/
	getChildrens(names, components) {
		let arr = []
		let childs = names.split(',')
		const dowhile = (children) => {
			if ( this.typeof(children) == 'Array' ) {
				children.forEach(child => {
					if ( childs.indexOf(child.$options.name) > -1 ) {
						arr.push(child)
					}
					if ( child.$children && child.$children.length > 0 ) {
						dowhile(child.$children)
					}
				})
			}
		}
		dowhile(components.$children)
		return arr;
	},
	/**
	 * 获取指定子节点
	 * @param {String} selector 节点class或者id
	 * @param {String} el 节点
	 * @param {String} components 当前实例
	*/
	getRect (selector, el, components) {
		return new Promise(resolve => {
			// #ifdef APP-NVUE
			uni.requireNativePlugin('dom').getComponentRect(el, res => {
				resolve(res.size)
			})
			// #endif
			// #ifndef APP-NVUE
			uni.createSelectorQuery().in(components).select(selector).boundingClientRect(data => {
				resolve(data)
			}).exec();
			// #endif
		})
	}
}

// 判断arr是否为一个数组，返回一个bool值
function isArray (arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';  
}

function zeroize (val) {
	return val >= 10 ? val : '0' + val;
}
