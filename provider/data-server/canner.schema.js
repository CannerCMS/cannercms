const title = CannerTypes.string().description('標題');
const content = CannerTypes.string().description('內容').ui('editor');

const posts = CannerTypes.array({title, content}).description('文章');
// map
const articleTitle = CannerTypes.string()
                  .description('標題');
const articleContent = CannerTypes.string()
                  .description('內容')
                  .ui('editor');
const article = CannerTypes.object({title: articleTitle, content: articleContent})
                  .description('文章');

module.exports = {posts, article};
