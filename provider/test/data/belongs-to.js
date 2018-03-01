/* eslint-disable quote-props */
module.exports = {
  bestComment: {
    type: "object",
    description: "comment count",
    items: {
      id: {
        type: "string",
        association: {
          type: "belongsTo",
          path: "comments"
        }
      }
    }
  },
  posts: {
    type: "array",
    description: "Blog article",
    items: {
      type: "object",
      items: {
        body: {
          type: "string",
          ui: "editor",
          description: "文章內容"
        },
        bestComment: {
          type: "array",
          description: "comment count",
          association: {
            type: "belongsTo",
            path: "comments"
          }
        }
      }
    }
  }
};
