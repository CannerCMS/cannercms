const CannerTypes = require('@canner/canner-types');

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
