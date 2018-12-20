export default {
  dateTime: {
    type: "object",
    properties: {
      "uiParams": {
        type: "object",
        properties: {
          format: {
            type: 'string'
          },
          output: {
            "enum": ['ISO_8601', 'timestamp.milliseconds', 'timestamp.seconds', 'epoch']
          }
        },
      }
    }
  }
}
