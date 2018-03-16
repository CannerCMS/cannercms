const CannerTypes = require('@canner/canner-types');

CannerTypes.defineUI('object.default', '@canner/cms-plugin-object-fieldset');
CannerTypes.defineUI('string.default', '@canner/cms-plugin-string-input');
CannerTypes.defineUI('array.popup', '@canner/cms-plugin-array-popup');
CannerTypes.defineUI('array.breadcrumb', '@canner/cms-plugin-array-breadcrumb');

module.exports = {
  info: CannerTypes.object({
    name: CannerTypes.string().title('Name')
  }).title('Title'),
  popup: CannerTypes.array({
    name: CannerTypes.string().title('Name')
  }).ui('popup').title('Title').uiParams({
    columns: [{
      title: 'name',
      dataIndex: 'name'
    }]
  }).addFilter('name', '姓名', {
    type: 'text',
  }),
  breadcrumb: CannerTypes.array({
    name: CannerTypes.string().title('Name')
  }).ui('breadcrumb').title('Title').uiParams({
    columns: [{
      title: 'name',
      dataIndex: 'name',
      key: 'name'
    }]
  })
}
