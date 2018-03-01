/* eslint-disable quote-props */
module.exports = {
  "schema": {
    "article": {
      "type": "object",
      "items": {
        "title": {
          "type": "string",
          "description": "文章標題"
        },
        "body": {
          "type": "string",
          "ui": "editor",
          "description": "文章內容"
        }
      }
    },
    "posts": {
      "type": "array",
      "description": "Blog article",
      "items": {
        "type": "object",
        "items": {
          "title": {
            "type": "string",
            "description": "文章標題"
          },
          "body": {
            "type": "string",
            "ui": "editor",
            "description": "文章內容"
          }
          // "comments": {
          //   "type": "",
          //   "description": "comment count",
          //   "association": {
          //     "type": "hasMany",
          //     "path": "comments"
          //   }
          // }
        }
      }
    },
    "comments": {
      "type": "array",
      "description": "your comments",
      "items": {
        "type": "object",
        "items": {
          "name": {
            "type": "string",
            "description": "name"
          },
          "body": {
            "type": "string",
            "ui": "editor",
            "description": "comment content"
          }
        }
      }
    }
  }
};
