export default {
  "cannerSchema": {
    "info": {
      "type": "object",
      "description": "",
      "items": {
        "name": {
          "type": "string",
          "description": "",
          "title": "Name",
          "qaTitle": "Name",
          "loader": {}
        }
      },
      "title": "Title",
      "qaTitle": "Title",
      "loader": {}
    },
    "popup": {
      "type": "array",
      "description": "",
      "items": {
        "type": "object",
        "items": {
          "name": {
            "type": "string",
            "description": "",
            "title": "Name",
            "qaTitle": "Name",
            "loader": {}
          }
        }
      },
      "ui": "popup",
      "title": "Title",
      "qaTitle": "Title",
      "uiParams": {
        "columns": [
          {
            "title": "name",
            "dataIndex": "name"
          }
        ]
      },
      "filter": [
        {
          "key": "name",
          "label": "姓名",
          "type": "text"
        }
      ],
      "loader": {}
    },
    "breadcrumb": {
      "type": "array",
      "description": "",
      "items": {
        "type": "object",
        "items": {
          "name": {
            "type": "string",
            "description": "",
            "title": "Name",
            "qaTitle": "Name",
            "loader": {}
          }
        }
      },
      "ui": "breadcrumb",
      "title": "Title",
      "qaTitle": "Title",
      "uiParams": {
        "columns": [
          {
            "title": "name",
            "dataIndex": "name",
            "key": "name"
          }
        ]
      },
      "loader": {}
    }
  },
  "componentTree": {
    "info": {
      "nodeType": "layout",
      "component": "body",
      "children": [
        {
          "type": "object",
          "description": "",
          "items": {
            "name": {
              "type": "string",
              "description": "",
              "title": "Name",
              "qaTitle": "Name",
              "loader": {}
            }
          },
          "title": "Title",
          "qaTitle": "Title",
          "loader": {},
          "name": "info",
          "nodeType": "plugins.object.fieldset",
          "children": [
            {
              "nodeType": "layout",
              "component": "block",
              "name": "[block-8wz1e]",
              "children": [
                {
                  "type": "string",
                  "description": "",
                  "title": "Name",
                  "qaTitle": "Name",
                  "loader": {},
                  "name": "name",
                  "nodeType": "plugins.string.input",
                  "pattern": "object.string",
                  "ui": "input",
                  "hocs": [
                    "withTitleAndDescription",
                    "withRequest",
                    "withRoute",
                    "withQuery",
                    "routeMiniApp",
                    "connectId"
                  ]
                }
              ],
              "childrenName": [
                "name"
              ],
              "hocs": [
                "containerRouter"
              ]
            }
          ],
          "pattern": "object",
          "ui": "fieldset",
          "hocs": [
            "validator",
            "withTitleAndDescription",
            "withRequest",
            "withRoute",
            "withQuery",
            "routeMiniApp",
            "connectId"
          ],
          "validateSchema": {
            "type": "object"
          },
          "hideTitle": true
        }
      ],
      "routeMap": {
        "info": {
          "title": "Title",
          "description": ""
        },
        "info/name": {
          "title": "Name",
          "description": ""
        }
      }
    },
    "popup": {
      "nodeType": "layout",
      "component": "body",
      "children": [
        {
          "nodeType": "layout",
          "component": "block",
          "children": [
            {
              "type": "array",
              "description": "",
              "items": {
                "type": "object",
                "items": {
                  "name": {
                    "type": "string",
                    "description": "",
                    "title": "Name",
                    "qaTitle": "Name",
                    "loader": {}
                  }
                }
              },
              "ui": "popup",
              "title": "Title",
              "qaTitle": "Title",
              "uiParams": {
                "columns": [
                  {
                    "title": "name",
                    "dataIndex": "name"
                  }
                ]
              },
              "filter": [
                {
                  "key": "name",
                  "label": "姓名",
                  "type": "text"
                }
              ],
              "loader": {},
              "name": "popup",
              "nodeType": "plugins.array.popup",
              "children": [
                {
                  "type": "string",
                  "description": "",
                  "title": "Name",
                  "qaTitle": "Name",
                  "loader": {},
                  "name": "name",
                  "nodeType": "plugins.string.input",
                  "pattern": "array.string",
                  "ui": "input",
                  "hocs": [
                    "withTitleAndDescription",
                    "withRequest",
                    "withRoute",
                    "withQuery",
                    "routeMiniApp",
                    "connectId"
                  ]
                }
              ],
              "pattern": "array",
              "hocs": [
                "withTitleAndDescription",
                "withRequest",
                "miniApp",
                "withRoute",
                "query",
                "routeMiniApp",
                "connectId"
              ],
              "hideTitle": true
            }
          ]
        }
      ],
      "childrenName": [
        "popup"
      ],
      "hocs": [
        "containerRouter"
      ],
      "routeMap": {
        "popup": {
          "title": "Title",
          "description": ""
        },
        "popup/[^/]*": {
          "title": "編輯",
          "description": ""
        },
        "popup/[^/]*/name": {
          "title": "Name",
          "description": ""
        }
      }
    },
    "breadcrumb": {
      "nodeType": "layout",
      "component": "body",
      "children": [
        {
          "nodeType": "layout",
          "component": "block",
          "children": [
            {
              "type": "array",
              "description": "",
              "items": {
                "type": "object",
                "items": {
                  "name": {
                    "type": "string",
                    "description": "",
                    "title": "Name",
                    "qaTitle": "Name",
                    "loader": {}
                  }
                }
              },
              "ui": "breadcrumb",
              "title": "Title",
              "qaTitle": "Title",
              "uiParams": {
                "columns": [
                  {
                    "title": "name",
                    "dataIndex": "name",
                    "key": "name"
                  }
                ]
              },
              "loader": {},
              "name": "breadcrumb",
              "nodeType": "plugins.array.breadcrumb",
              "children": [
                {
                  "type": "string",
                  "description": "",
                  "title": "Name",
                  "qaTitle": "Name",
                  "loader": {},
                  "name": "name",
                  "nodeType": "plugins.string.input",
                  "pattern": "array.string",
                  "ui": "input",
                  "hocs": [
                    "withTitleAndDescription",
                    "withRequest",
                    "withRoute",
                    "withQuery",
                    "routeMiniApp",
                    "connectId"
                  ]
                }
              ],
              "pattern": "array",
              "hocs": [
                "withTitleAndDescription",
                "withRequest",
                "withRoute",
                "query",
                "routeMiniApp",
                "connectId"
              ],
              "hideTitle": true
            }
          ]
        }
      ],
      "childrenName": [
        "breadcrumb"
      ],
      "hocs": [
        "containerRouter"
      ],
      "routeMap": {
        "breadcrumb": {
          "title": "Title",
          "description": ""
        },
        "breadcrumb/[^/]*": {
          "title": "編輯",
          "description": ""
        },
        "breadcrumb/[^/]*/name": {
          "title": "Name",
          "description": ""
        }
      }
    }
  }
}