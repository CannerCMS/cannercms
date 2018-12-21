export default {
  editor: {
    type: "object",
    properties: {
      "uiParams": {
        type: "object",
      }
    }
  },
  options: {
    type: "object",
    required: ["uiParams"],
    properties: {
      "uiParams": {
        type: "object",
        required: ['options'],
        properties: {
          selectKey: {
            type: 'string'
          },
          options: {
            type: "array",
            minItems: 2,
            items: {
              type: 'object',
              required: ['title', 'key'],
              properties: {
                title: {
                  type: 'string'
                },
                key: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  }
}
