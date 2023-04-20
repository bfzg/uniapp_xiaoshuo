export default {
	state:{
		articleID:null,					//文章id
		currentArticleIndex:null,		//当前文章index
		articleLength:0,				//文章总长度
		presentArticle:[]						//当前阅读小说章节
	},
	mutations:{
		//添加文章内容
		addArticleID(state,value){
			state.articleID = value;
		},
		//删除文章内容
		removeArticleID(state,id){
			
		},
		//获取当前文章index
		getCurrentArticleIndex(state,index){
			state.currentArticleIndex = index
		},
		//获取文章总长度
		getarticleLength(state,artLength){
			state.articleLength = artLength
		},
		//获取当前阅读小说数据
		getpresentArticle(state,data){
			state.presentArticle = data
		}
	},
	actions:{
		
	}
}