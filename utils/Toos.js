import {store} from '@/uni_modules/uni-id-pages/common/store.js'
//去除文章的双引号和中括号
export function removeBracketsAndQuotes(article) {
	// 你可以使用replace方法来替换英文逗号为换行符，同时删除中括号和双引号
	var result = article.replace(/,/g, "\n     ").replace(/\[|\]|"|“|”/g,""); // 用\n替换所有的英文逗号.replace(/\[|\]|"/g, ""); // 用空字符串替换所有的中括号和双引号
	return result;
}

//判断是否登录
export function goLoginPage() {
	if (!store.hasLogin) {
		uni.showToast({
			title: "未登录!",
			icon: 'none'
		})
		return true;
	}
	return false;
}

/**
 * 跳转到阅读页面
 * @param chapterId 章节id
 * @param chaptertitle 章节title
 * @param index 章节索引index
 * @param fictionId	小说id
 */
export function goToReadRouter(chapterId, chaptertitle, index, fictionId) {
	uni.navigateTo({
		url: "/pages/textPage/textPage?currentChapterId=" + chapterId + "&currentChapterTitle=" + chaptertitle + "&currentChapterIndex=" + index +
			"&currentBookId=" + fictionId
	})
}
export function goToReadRouterCatalog(chapterId, chaptertitle, index, fictionId) {
	uni.redirectTo({
		url: "/pages/textPage/textPage?currentChapterId=" + chapterId + "&currentChapterTitle=" + chaptertitle + "&currentChapterIndex=" + index +
			"&currentBookId=" + fictionId
	})
}

//实现深拷贝
export function deepCopy(obj) {
	let str = JSON.stringify(obj);
	let result = JSON.parse(str);
	return result;
}