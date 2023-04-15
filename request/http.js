import {baseURL} from './base.js';

export const myRequest = (options)=>{
	return new Promise((resolve,reject)=>{
		uni.request({
			url:baseURL+options.url,
			method:options.method || 'GET',
			data:options.data,
			success:(res)=>{
				resolve(res);
			},
			fail:(err)=>{
				console.log(err);
				reject(err)
			}
		})
	})
}