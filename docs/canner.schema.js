const CannerTypes = require('@canner/canner-types');

module.exports = {
  info: CannerTypes.object({
    name: CannerTypes.string().title('Name')
  }).title('Title'),
  popup: CannerTypes.array({
    name: CannerTypes.string().title('Name'),
    breadcrumb: CannerTypes.relation({
      relationship: 'manyToOne',
      relationTo: 'breadcrumb'
    }).ui('one').uiParams({
      columns: [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      }],
      textCol: 'name'
    })
  }).ui('popup').title('Title').uiParams({
    columns: [{
      title: 'name',
      dataIndex: 'name'
    }, {
      title: 'breadcrumb',
      dataIndex: 'breadcrumb.0.name',
      ket: 'breadcrumb.0.name'
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
