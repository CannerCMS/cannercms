/** @jsx builder */
import builder from 'canner-script';

const exportFields = [{
  keyName: 'name',
  title: '${customers.name}',
}, {
  keyName: 'phone',
  title: '${customers.phone}',
}, {
  keyName: 'email',
  title: '${customers.email}',
}, {
  keyName: 'consignees',
  title: '${customers.consignees}',
  render: consignees => consignees.reduce((result, consignee) => `${result}${result ? ';' : result}${consignee.name}`, '') || '無',
}];

export default () => (
  <array
    keyName="customers"
    ui="tableRoute"
    uiParams={{
      columns: [{
        title: '${customers.name}',
        key: 'name',
        dataIndex: 'name',
      }, {
        title: '${customers.phone}',
        key: 'phone',
        dataIndex: 'phone',
      }, {
        title: 'Email',
        key: 'email',
        dataIndex: 'email',
      }],
      createKeys: [],
    }}
    title="${customers.title}"
  >
    <toolbar>
      <actions>
        <export
          fields={exportFields}
          title="Customers"
        />
        <filter />
      </actions>
      <filter>
        <textFilter label="搜尋訂購人${customers.name}" field="name" placeholder="輸入訂購人${customers.name}" />
        <textFilter label="搜尋訂購人${customers.phone}" field="phone" placeholder="輸入訂購人${customers.phone}" />
      </filter>
      <pagination />
    </toolbar>
    <string keyName="name" title="${customers.name}" />
    <string keyName="email" title="Email" />
    <string keyName="phone" title="${customers.phone}號碼" />
    <array
      keyName="consignees"
      ui="table"
      uiParams={{
        columns: [{
          title: '${customers.name}',
          key: 'name',
          dataIndex: 'name',
        }, {
          title: '${customers.phone}',
          key: 'phone',
          dataIndex: 'phone',
        }, {
          title: 'Email',
          key: 'email',
          dataIndex: 'email',
        }],
        createKeys: [],
      }}
      title="${customers.consignees}"
    >
      <string keyName="name" title="${customers.name}" />
      <string keyName="email" title="${customers.email}" />
      <string keyName="phone" title="${customers.phone}" />
      <string keyName="address" title="${customers.address}" />
    </array>
  </array>
);
