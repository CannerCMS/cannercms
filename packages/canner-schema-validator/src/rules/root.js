export default {
  type: "object",
  patternProperties: {
    "^\\w+$": {
      type: "object",
      properties: {
        type: {
          enum: ['array', 'object', 'page']
        },
      },
    }
  }
}