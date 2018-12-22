export default {
  singleSelect: {
    type: "object",
    required: ['relation', 'uiParams'],
    properties: {
      "path": {
        type: "string",
        // can only be second level
        pattern: "^([^/]+/[^/]+)$"
      },
      "uiParams": {
        type: "object",
        required: ['textCol', 'columns'],
      },
      "relation": {
        type: 'object',
        required: ['to', 'type'],
        properties: {
          to: {
            type: 'string',
          },
          type: {
            type: 'string',
            pattern: "^toOne$"
          }
        }
      }
    }
  },
  multipleSelect: {
    type: "object",
    required: ['relation', 'uiParams'],
    properties: {
      "path": {
        type: "string",
        // can only be second level
        pattern: "^([^/]+/[^/]+)$"
      },
      "uiParams": {
        type: "object",
        required: ['columns'],
      },
      "relation": {
        type: 'object',
        required: ['to', 'type'],
        properties: {
          to: {
            type: 'string'
          },
          type: {
            type: 'string',
            pattern: "^toMany$"
          }
        }
      }
    }
  },
  singleSelectTree: {
    type: "object",
    required: ['relation', 'uiParams'],
    properties: {
      "path": {
        type: "string",
        // can only be second level
        pattern: "^([^/]+/[^/]+)$"
      },
      "uiParams": {
        type: "object",
        required: ['textCol', 'relationField'],
      },
      "relation": {
        type: 'object',
        required: ['to', 'type'],
        properties: {
          to: {
            type: 'string',
          },
          type: {
            type: 'string',
            pattern: "^toOne$"
          }
        }
      }
    }
  },
  multipleSelectTree: {
    type: "object",
    required: ['relation', 'uiParams'],
    properties: {
      "path": {
        type: "string",
        // can only be second level
        pattern: "^([^/]+/[^/]+)$"
      },
      "uiParams": {
        type: "object",
        required: ['textCol', 'relationField'],
      },
      "relation": {
        type: 'object',
        required: ['to', 'type'],
        properties: {
          to: {
            type: 'string'
          },
          type: {
            type: 'string',
            pattern: "^toMany$"
          }
        }
      }
    }
  },
}
