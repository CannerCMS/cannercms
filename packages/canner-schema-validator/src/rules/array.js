export default {
  table: {
    type: "object",
    properties: {
      "uiParams": {
        type: "object",
        properties: {
          columns: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: {
                  type: 'string'
                }
              }
            }
          },
          size: {
            type: 'string',
            "enum": ['default', 'small', 'middle']
          }
        },
      }
    }
  },
  tableRoute: {
    type: "object",
    properties: {
      "path": {
        type: "string",
        // can only be first level
        pattern: "([^/]+)"
      },
      "uiParams": {
        type: "object",
        properties: {
          columns: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: {
                  type: 'string'
                }
              }
            }
          },
          size: {
            type: 'string',
            "enum": ['default', 'small', 'middle']
          }
        },
      }
    }
  },
  gallery: {
    type: "object",
    properties: {
      "uiParams": {
        type: "object",
      }
    }
  },
  panel: {
    type: "object",
    properties: {
      "uiParams": {
        type: "object",
      }
    }
  },
  slider: {
    type: "object",
    properties: {
      "uiParams": {
        type: "object",
      }
    }
  },
  tab: {
    type: "object",
    properties: {
      "uiParams": {
        type: "object",
      }
    }
  },
  tree: {
    type: "object",
    required: ['uiParams'],
    properties: {
      "path": {
        type: "string",
        // can only be one level
        pattern: "([^/]+)"
      },
      "uiParams": {
        type: "object",
        required: ['textCol', 'relationField'],
        properties: {
          textCol: {
            type: 'string',
          },
          relationField: {
            type: 'string'
          }
        }
      }
    }
  }
}
