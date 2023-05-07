export default {
	state:{
		currentBookId:null,				//当前正在阅读小说的id
		allChapterList:null,			//文章所有章节
		allChapterListLength:0,			//当前章节总长度
		presentArticle:{}				//当前阅读小说章节信息（index，title，id)
	},
	mutations:{
		//获取文章所有章节
		getChapterList(state,value){
			state.allChapterList = value;
		},
		//获取文章总长度
		getChapterListLength(state,value){
			state.allChapterListLength = value
		},
		//获取当前阅读小说数据
		getpresentArticle(state,data){
			state.presentArticle = data
		},
		//获取当前正在阅读小说id
		getCurrentBookId(state,value){
			state.currentBookId = value
		}
	},
	actions:{
		
	}
}