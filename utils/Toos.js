//去除文章的双引号和中括号
export function removeBracketsAndQuotes(article) {
  // 使用 replace () 方法去除中括号和双引号
  var newArticle = article.replace(/[\[\]"]/g, "");
  // 返回新的字符串
  return newArticle;
}
