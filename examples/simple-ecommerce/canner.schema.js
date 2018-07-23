/** @jsx c */
import c, {Block, Tabs, Default} from 'canner-script';
import utils from './utils';

const {connector, storage} = utils;

const Gallery = ({attributes}) => (
  <array {...attributes} ui="gallery">
    <image keyName="image"/>
  </array>
)

export default (
  <root connector={connector}>
    <array keyName="product" ui="tableRoute" storage={storage} title="Product" uiParams={{
      columns: [{
        title: 'Name',
        dataIndex: 'name'
      }, {
        title: 'Description',
        dataIndex: 'description'
      }, {
        title: 'Price',
        dataIndex: 'price'
      }]
    }}>
      <toolbar>
        <pagination />
      </toolbar>
      <Tabs>
        <Default title="Basic settings"  keyName="basic">
          <string keyName="name" title="Product name"/>
          <string keyName="description" ui="textarea" title="Product description" />
          <image keyName="featureImage" title="Thumb" />
          <number keyName="price" title="Price" />
          <number keyName="promo" title="Promo price" />
          <relation keyName="category"
            title="Category"
            packageName="./customize/custom-relation-tree_toOne"
            relation={{
              type: 'toOne',
              to: 'category'
            }}
            uiParams={{
              textCol: "name",
              columns: [{
                title: 'Title',
                dataIndex: 'name'
              }]
            }}/>
        </Default>
        <Default title="Storage settings" keyName="storage">
          <number keyName="count" title="Stock"/>
          <boolean keyName="limited" title="Enable limited amount" />
        </Default>
        <array keyName="detail" title="Other details" ui="table"
          uiParams={{
            columns: [{
              title: 'Name',
              dataIndex: 'name'
            }]
          }}
        >
          <string keyName="name" title="Name"/>
          <object keyName="content" ui="editor" title="Content"/>
        </array>
        <Gallery keyName="photos" title="Product Gallery"/>
      </Tabs>
    </array>
    <array keyName="category" title="Category" hide={true} uiParams={{
      columns: [{
        title: 'Name',
        dataIndex: 'name'
      }, {
        title: 'Parent Category',
        dataIndex: 'parent.name'
      }]
    }}>
      <toolbar>
        <pagination />
      </toolbar>
      <string keyName="name" title="Name"/>
      <relation keyName="parent"
        title="Parent category"
        packageName="./customize/custom-relation-tree_toOne"
        relation={{
          type: 'toOne',
          to: 'category'
        }}
        uiParams={{
          textCol: "name",
          columns: [{
            title: 'Title',
            dataIndex: 'name'
          }]
        }}/>
    </array>
    <array keyName="shipments" storage={storage} title="Shipment settings" uiParams={{
      columns: [{
        title: 'Name',
        dataIndex: 'name'
      }, {
        title: 'Shipment method',
        dataIndex: 'way'
      }]
    }}>
      <toolbar>
        <pagination />
      </toolbar>
      <string keyName="way" title="Method" uiParams={{
        options: [{
          text: 'FedEx',
          value: 'FedEx'
        }, {
          text: 'Mailing',
          value: 'Mailing'
        }, {
          text: 'In person',
          value: 'In person'
        }]
      }} ui="select"/>
      <string keyName="name" title="Name" />
      <object keyName="description" ui="editor" title="Description"/>
    </array>
    <array ui="tableRoute" storage={storage} keyName="orders" title="Order" uiParams={{
      columns: [{
        title: 'Create date',
        dataIndex: 'createDate'
      }, {
        title: 'Buyer name',
        dataIndex: 'orderInfo.buyerName'
      }, {
        title: 'Email',
        dataIndex: 'orderInfo.buyerEmail'
      }]
    }}>
      <toolbar>
        <pagination />
      </toolbar>
      <Block title="Order NO">
        <string keyName="no" />
      </Block>
      <Tabs>
        <Default title="Purchase information" keyName="purchase">
          <dateTime keyName="createDate" title="Create date" />
          <object keyName="orderInfo">
            <string keyName="buyerName" title="Buyer name" />
            <string keyName="buyerPhone" title="Buyer phone" />
            <string keyName="buyerEmail" title="Buyer Email" />
            <string keyName="shipmentWay" title="Shipment method" />
            <string keyName="receiverName" title="Receiver name" />
            <string keyName="receiverPhone" title="Receiver phone" />
            <string keyName="receiverAddress" title="Receiver address" />
            <dateTime keyName="receiveDate" title="Arrival date" />
            <string ui="time" keyName="receiveTime" title="Arrival time" />
          </object>
        </Default>
        <array keyName="detail" title="Purchase Items" uiParams={{
          columns: [{
            title: 'Product No',
            dataIndex: 'no'
          }, {
            title: 'Product name',
            dataIndex: 'name'
          }, {
            title: 'Price',
            dataIndex: 'price'
          }, {
            title: 'Promo price',
            dataIndex: 'promo'
          }, {
            title: 'Amount',
            dataIndex: 'count'
          }]
        }}>
          <string keyName="no" title="Product No" />
          <string keyName="name" title="Product name"/>
          <number keyName="price" title="Price"/>
          <number keyName="promo" title="Promo price" />
          <number keyName="count" title="Amount" />
        </array>
        <Default title="Order Status" keyName="orderStatus">
          <string keyName="orderStatus" title="status" ui="select" uiParams={{
            options: [{
              text: 'New Order',
              value: 'new'
            }, {
              text: 'Old Order',
              value: 'old'
            }]
          }}/>
          <string keyName="paymentType" title="Pay method" />
          <string keyName="payStatus" title="Pay status" ui="select" uiParams={{
            options: [{
              text: 'Unpaid',
              value: 'not'
            }, {
              text: 'Paid',
              value: 'paid'
            }]
          }}/>
          <string keyName="shipStatus" title="Shipment status" ui="select" uiParams={{
            options: [{
              text: 'In stock',
              value: 'not'
            }, {
              text: 'shipping',
              value: 'shipping'
            }, {
              text: 'Arrival',
              value: 'shipped'
            }]
          }}/>
        </Default>
        <Default title="Other information" keyName="otherInfomation">
          <number keyName="shipFee" title="Shipment fee" />
          <number keyName="result" title="Total fee" />
        </Default>
      </Tabs>
    </array>
  </root>
)