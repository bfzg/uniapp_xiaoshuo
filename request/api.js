import {myRequest} from './http.js';

//搜索小说
export function searchBook(value){
	console.log(value);
	return myRequest({
		url:`fiction/search/title/${value.title}/${value.start}/${value.end}`
	})
	
}

//获取小说 列表 详情
export function getBookListInfo(id){
	return myRequest({
		url:`fictionChapter/search/${id}`
	})
}

//获取小说 内容
export function getBookData(id){
	return myRequest({
		url:`/fictionContent/search/${id}`
	})
}