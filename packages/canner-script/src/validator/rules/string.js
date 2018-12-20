export default {
  input: {
    type: "object",
    properties: {
      "uiParams": {
        type: "object",
        properties: {
          size: {
            type: 'string',
            enum: ['small', 'default', 'large']
          }
        }
      }
    }
  },
  card: {
    type: "object",
    required: ["uiParams"],
    properties: {
      "uiParams": {
        type: "object",
        required: ['options'],
        properties: {
          options: {
            type: 'array',
            items: {
              type: 'object',
              required: ['text', 'value'],
              properties: {
                text: {
                  type: 'string'
                },
                value: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  },
  link: {
    type: "object",
    properties: {
      "uiParams": {
        type: "object",
      }
    }
  },
  radio: {
    type: "object",
    required: ["uiParams"],
    properties: {
      uiParams: {
        type: "object",
        required: ['options'],
        properties: {
          options: {
            type: 'array',
            items: {
              type: 'object',
              required: ['text', 'value'],
              properties: {
                text: {
                  type: 'string'
                },
                value: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  },
  select: {
    type: "object",
    required: ["uiParams"],
    properties: {
      uiParams: {
        type: "object",
        required: ['options'],
        properties: {
          options: {
            type: 'array',
            items: {
              type: 'object',
              required: ['text', 'value'],
              properties: {
                text: {
                  type: 'string'
                },
                value: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  },
  textarea: {
    type: "object",
  },
  time: {
    type: "object",
  }
}
