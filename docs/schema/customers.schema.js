/** @jsx builder */
import builder, {Block} from 'canner-script';

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
      size: 'middle',
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
    }}
    title="${customers.title}"
    description="${customers.description}"
    graphql={`
    query($customersBefore: String, $customersAfter: String, $customersLast: Int, $customersFirst: Int,$customersWhere: CustomerWhereInput) {
      customers: customersConnection(before: $customersBefore, after: $customersAfter, last: $customersLast, first: $customersFirst,where: $customersWhere) {
        edges {
          cursor
          node {
            id
            name
            email
            phone
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
    `}
  >
    <toolbar async>
      <actions>
        <export
          fields={exportFields}
          title="Customers"
        />
        <filter />
      </actions>
      <filter>
        <textFilter label="${customers.filter.name.label}" field="name" placeholder="Enter a name" />
        <textFilter label="${customers.filter.phone.label}" field="phone" placeholder="Enter a phone" />
      </filter>
      <pagination />
    </toolbar>
    <Block keyName="customerInfo" title="Customer Info">
      <string keyName="name" title="${customers.name}" />
      <string keyName="email" title="Email" />
      <string keyName="phone" title="${customers.phone}" />
      <array
        keyName="consignees"
        ui="table"
        disabled={{
          create: true
        }}
        uiParams={{
          size: 'small',
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
          }]
        }}
        title="${customers.consignees}"
      >
        <string keyName="name" title="${customers.name}" />
        <string keyName="email" title="${customers.email}" />
        <string keyName="phone" title="${customers.phone}" />
        <string keyName="address" title="${customers.address}" />
      </array>
    </Block>
    <Block title="Contact Customer">
      {/* using component tag in data will not change the data schema
        so you can use it to add any component you need.
      */}
      <component
        keyName="connectCustomer"
        packageName="../components/wildcards/emailForm"
      />
    </Block>
  </array>
);
