const db = uniCloud.database();
module.exports = {
	_before: function () { // 通用预处理器

	},
	/**
	 * 添加小说到书架
	 * @param {Object} data 包含书籍id，书籍图片，作者，最近一次更新时间，阅读章节，阅读到章节第几页 最后更新时间，以及缩略图 文章介绍
	 */
	addBookshelf:async function (data){
		return await db.collection("xiaoshuo-collect").add({
			article_id:data.fictionId,
			chapter_id:data.chapterList,
			read_page:data.numPage,
			author:data.author,
			imgAddress:data.cover,
			lastUpdated:data.updateTime,
			articleIntroduction:data.descs
		})
	}
}
