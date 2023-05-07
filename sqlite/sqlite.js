const {
	title
} = require("process");

module.exports = {
	dbName: 'xiaoshuo',
	dbPath: '_doc/bookshelf.db',

	//判断数据库是否打开
	isOpen() {
		var open = plus.sqlite.isOpenDatabase({
			name: this.dbName,
			path: this.dbPath
		})
		return open;
	},

	//创建 或 打开该数据库
	openSqlite() {
		return new Promise((resolve, reject) => {
			plus.sqlite.openDatabase({
				name: this.dbName,
				path: this.dbPath,
				success(e) {
					resolve(e);
				},
				fail(e) {
					reject(e);
				}
			})
		})
	},

	//关闭数据库
	closeSqlite() {
		return new Promise((resolve, reject) => {
			plus.sqlite.closeDatabase({
				name: this.dbName,
				success(e) {
					resolve(e);
				},
				fail(e) {
					reject(e);
				}
			})
		})
	},

	//数据库建表
	createTable(dbTable, data) {
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: this.dbName,
				sql: `CREATE TABLE IF NOT EXISTS ${dbTable}(${data})`,
				success(e) {
					resolve(e);
				},
				fail(e) {
					reject(e);
				}
			})
		})
	},

	//删除数据表
	dropTable(dbTable) {
		return new Promise((resolve, reject) => {
			plus.sqlite.executeSql({
				name: this.dbName,
				sql: `DROP TABLE ${dbTable}`,
				success(e) {
					resolve(e);
				},
				fail(e) {
					reject(e);
				}
			})
		})
	},

	//向表中插入数据
	insertTableData(dbTable, data, condition) {
		//判断有没有传参
		if (dbTable !== undefined && data !== undefined) {
			//判断传的参是否有值
			let bol = (JSON.stringify(data) == '{}');
			if (!bol) {
				if (condition == undefined) {
					var sql = `INSERT INTO ${dbTable} VALUES('${data}')`;
				} else {
					var sql = `INSERT INTO ${dbTable} (${condition}) VALUES(${data})`;
				}
				return new Promise((resolve, reject) => {
					//添加表格数据
					plus.sqlite.executeSql({
						name: this.dbName,
						sql: sql,
						success(e) {
							resolve(e);
						},
						fail(e) {
							reject(e);
						}
					})
				})
			} else {
				return new Promise((resolve, reject) => {
					reject("错误添加")
				})
			}
		} else {
			return new Promise((resolve, reject) => {
				reject("错误添加")
			})
		}
	},

	// 修改表数据
	insertOrReplaceData(data, id) {
		if (data !== undefined && id !== undefined) {
			var sql =
				`UPDATE bookshelf SET chapterindex = ${data[0]}, chaptertitle = ${data[1]}, chapterid = ${data[2]} WHERE fictionId = ${id}`;
			return new Promise((resolve, reject) => {
				// 表格添加数据
				plus.sqlite.executeSql({
					name: this.dbName,
					sql: sql,
					success(e) {
						resolve(e);
					},
					fail(e) {
						reject(e);
					}
				})
			})
		} else {
			return new Promise((resolve, reject) => {
				reject("错误添加")
			})
		}
	},
	// 查询获取数据库里的数据
	selectTableData(dbTable, title, titleValue) {
		if (dbTable !== undefined) {
			// 第一个是表单名称，后两个参数是列表名，用来检索
			if (title !== undefined) {
				// 三个检索条件
				var sql = `SELECT * FROM ${dbTable} WHERE ${title} = '${titleValue}'`;
			}
			if (title == undefined) {
				var sql = `SELECT * FROM ${dbTable}`;
			}
			return new Promise((resolve, reject) => {
				// 表格查询数据  执行查询的SQL语句
				plus.sqlite.selectSql({
					name: this.dbName,
					sql: sql,
					success(e) {
						resolve(e);
					},
					fail(e) {
						reject(e);
					}
				})
			})
		} else {
			return new Promise((resolve, reject) => {
				reject("错误查询")
			});
		}
	},

	// 删除表里的数据
	deleteTableData(dbTable,value) {
		if (dbTable !== undefined) {
			// 一个检索条件
			var sql = `DELETE FROM ${dbTable} WHERE fictionId = '${value}'`;
			return new Promise((resolve, reject) => {
				// 删除表数据
				plus.sqlite.executeSql({
					name: this.dbName,
					sql: sql,
					success(e) {
						resolve(e);
					},
					fail(e) {
						reject(e);
					}
				})
			})
		} else {
			return new Promise((resolve, reject) => {
				reject("错误删除")
			});
		}
	},

	// 获取指定数据条数
	pullSQL(dbTable, id, num) {
		return new Promise((resolve, reject) => {
			plus.sqlite.selectSql({
				name: this.dbName,
				sql: `SELECT * FROM ${dbTable} ORDER BY '${id}' DESC LIMIT 15 OFFSET '${num}'`,
				success(e) {
					resolve(e);
				},
				fail(e) {
					reject(e);
				}
			})
		})
	},
	
	/**
	* @param data 更新的小说章节数据
	* @param time 更新时间
	* @param id 收藏数据库的id
	*/
	updataSQL(data,time,id){
		if(data != undefined && id != undefined){
			let sql = `UPDATE bookshelf SET chapterList='${data}',updateTime='${time}' WHERE id = ${id}`
			return new Promise((resolve,reject)=>{
				plus.sqlite.executeSql({
					name:this.dbName,
					sql:sql,
					success(e) {
						resolve(e);
					},
					fail(e) {
						reject(e);
					}
				})
			})
		}else{
			return console.log('更新失败!');
		}
		
	}
}

