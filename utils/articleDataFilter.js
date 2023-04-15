export default class articleDataPreloading {
	
	constructor(data){
		this.data = data;
	}
	
	//定义 根据index返回后5条数据  向前滑动
	filterByIndex(index){
		//使用filter() 方法返回一个新数组
		this.data = this.data.filter(item=>item.index > index)
		return this.data.slice(0,3); 
	}
	
	//定义 根据index返回前一条书架 向后滑动
	findPreviousByindex(index){
		let currentIndex = this.data.findIndex(item=>{
			return item.index == index
		});
		//没有找到
		if(currentIndex === -1){
			return undefined;
		}
		//第一个没有前一个
		if(currentIndex === 0){
			return undefined;
		}
		return this.data[currentIndex - 1];
	}
}