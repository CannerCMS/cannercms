const CannerTypes = require('@canner/canner-types');

module.exports = {
  info: CannerTypes.object({
    name: CannerTypes.string().title('Name')
  }).title('Title')
}
