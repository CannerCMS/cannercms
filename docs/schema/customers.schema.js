/** @jsx builder */
import builder from 'canner-script';

const exportFields = [{
  keyName: 'name',
  title: '姓名',
}, {
  keyName: 'phone',
  title: '電話',
}, {
  keyName: 'email',
  title: 'Email',
}, {
  keyName: 'consignees',
  title: '收件人歷史紀錄',
  render: consignees => consignees.reduce((result, consignee) => `${result}${result ? ';' : result}${consignee.name}`, '') || '無',
}];

export default () => (
  <array
    keyName="customers"
    ui="tableRoute"
    uiParams={{
      columns: [{
        title: '姓名',
        key: 'name',
        dataIndex: 'name',
      }, {
        title: '電話',
        key: 'phone',
        dataIndex: 'phone',
      }, {
        title: 'Email',
        key: 'email',
        dataIndex: 'email',
      }],
      createKeys: [],
    }}
    title="訂購人管理"
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
        <textFilter label="搜尋訂購人姓名" field="name" placeholder="輸入訂購人姓名" />
        <textFilter label="搜尋訂購人電話" field="phone" placeholder="輸入訂購人電話" />
      </filter>
      <pagination />
    </toolbar>
    <string keyName="name" title="姓名" />
    <string keyName="email" title="Email" />
    <string keyName="phone" title="電話號碼" />
    <array
      keyName="consignees"
      ui="table"
      uiParams={{
        columns: [{
          title: '姓名',
          key: 'name',
          dataIndex: 'name',
        }, {
          title: '電話',
          key: 'phone',
          dataIndex: 'phone',
        }, {
          title: 'Email',
          key: 'email',
          dataIndex: 'email',
        }],
        createKeys: [],
      }}
      title="收件人歷史記錄"
    >
      <string keyName="name" title="姓名" />
      <string keyName="email" title="Email" />
      <string keyName="phone" title="電話號碼" />
      <string keyName="shipAddress" title="地址" />
    </array>
  </array>
);
