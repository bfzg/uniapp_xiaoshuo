//去除文章的双引号和中括号
export function removeBracketsAndQuotes(article) {
	// 你可以使用replace方法来替换英文逗号为换行符，同时删除中括号和双引号
	var result = article.replace(/,/g, "\n     ").replace(/\[|\]|"|“|”/g, ""); // 用\n替换所有的英文逗号.replace(/\[|\]|"/g, ""); // 用空字符串替换所有的中括号和双引号
	return result;
}

//没有登录是否去登录
export function whetherToLogin(){
	uni.showModal({
		title:"你还没有登录是否确定登录!",
		success:res=>{
			if(res.confirm){
				uni.navigateTo({
					url:'/uni_modules/uni-id-pages/pages/login/login-withpwd'
				})
			}
		}
	})
}