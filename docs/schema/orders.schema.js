/** @jsx c */
import c, { Block, Condition, Row, Col } from "canner-script";
import moment from "moment";
import shortId from "shortid";
import { galleryUIParams, renderBuyer, renderOrderSelect, renderPaySelect, renderShipSelect } from "./utils";
import { Inline } from './utils.schema';

const exportFields = [{
  keyName: 'no',
  title: 'NO.',
}, {
  keyName: 'createDate',
  title: 'Create Date',
  render: createDate => moment(createDate).format('YYYY/MM/DD HH:mm')
}, {
  keyName: 'buyerName',
  title: 'Buyer Name',
}, {
  keyName: 'buyerPhone',
  title: 'Buyer Phone',
}, {
  keyName: 'buyerEmail',
  title: 'Buyer Email',
}, {
  keyName: 'receiverName',
  title: 'Receiver Name',
}, {
  keyName: 'receiverPhone',
  title: 'Receiver Phone',
}, {
  keyName: 'receiveTime',
  title: 'Receive Time',
  render: time => moment(time).format('YYYY/MM/DD HH:mm')
}, {
  keyName: 'receiverAddress',
  title: 'Receiver Address'
}];

const orders = () => (
  <array
    keyName="orders"
    ui="tableRoute"
    title="${orders.title}"
    description="${orders.description}"
    uiParams={{
      size: 'middle',
      columns: [
        {
          title: "${orders.no}",
          dataIndex: "no"
        },
        {
          title: "${orders.orderStatus}",
          dataIndex: "orderStatus",
          filters: [
            { text: "${orders.newOrder}", value: "new" },
            { text: "${orders.oldOrder}", value: "old" }
          ],
          onFilter: (value, record) => record.orderStatus === value,
          render: renderOrderSelect
        },
        {
          title: "${orders.createDate}",
          dataIndex: "createDate"
        },
        {
          title: "${orders.payStatus}",
          dataIndex: "payStatus",
          filters: [
            { text: "${orders.notPaid}", value: "not" },
            { text: "${orders.paid}", value: "paid" }
          ],
          onFilter: (value, record) => record.payStatus === value,
          render: renderPaySelect
        },
        {
          title: "${orders.shipStatus}",
          dataIndex: "shipStatus",
          filters: [
            { text: "${orders.unshipped}", value: "not" },
            { text: "${orders.shipping}", value: "shipping" },
            { text: "${orders.delivered}", value: "delivered" }
          ],
          onFilter: (value, record) => record.shipStatus === value,
          render: renderShipSelect
        },
        {
          title: "${orders.orderInfo.buyerName}",
          dataIndex: "buyerName",
          render: renderBuyer
        }
      ]
    }}
  >
    <toolbar>
      <actions>
        <export
          fields={exportFields}
          title="Orders"
        />
        <filter />
      </actions>
      <filter>
        <textFilter
          label="${orders.filter.buyerName.label}"
          field="orderInfo.buyerName"
          placeholder="Enter a buyer name"
        />
        <textFilter
          label="${orders.filter.no.label}"
          field="no"
          placeholder="Enter a order number"
        />
      </filter>
      <pagination />
    </toolbar>
    <Block title="${orders.orderInfo.layoutTitle}" >
      <Inline>
        <string
          keyName="no"
          title="${orders.no}"
          disabled
          defaultValue={() => shortId.generate()}
        />
        <dateTime
          keyName="createDate"
          title="${orders.createDate}"
          defaultValue={() => moment().toISOString()}
          disabled
          required
        />
        <string keyName="buyerName" title="${orders.orderInfo.buyerName}" required />
        <string keyName="buyerPhone" title="${orders.orderInfo.buyerPhone}" required />
      </Inline>
      <Inline>
        <string keyName="buyerEmail" title="${orders.orderInfo.buyerEmail}" />
        <string keyName="receiverName" title="${orders.orderInfo.receiverName}" required />
        <string keyName="receiverPhone" title="${orders.orderInfo.receiverPhone}" required />
        <dateTime keyName="receiveTime" title="${orders.orderInfo.receiveTime}" required />
      </Inline>
      <Inline>
        <Condition match={data => data.shipmentWay !== "PERSON"}>
          <string keyName="receiverAddress" title="${orders.orderInfo.receiverAddress}" />
        </Condition>
        <string
          keyName="shipmentWay"
          ui="select"
          title="${orders.orderInfo.shipmentWay}"
          uiParams={{
            options: [
              { value: "PERSON", text: "${orders.orderInfo.shipmentWay.person}" },
              { value: "HOME", text: "${orders.orderInfo.shipmentWay.home}" }
            ]
          }}
        />
      </Inline>
      <Block title="${orders.orderInfo.card.title}" type="inner">
        <string keyName="cardReceiverName" title="${orders.orderInfo.card.receiverName}" />
        <string ui="textarea" keyName="cardContent" title="${orders.orderInfo.card.content}" />
        <string keyName="senderName" title="${orders.orderInfo.card.senderName}" />
        <string ui="textarea" keyName="comment" title="${orders.orderInfo.card.comment}" />
      </Block>
    </Block>
    <Block title="${orders.detail.title}">
      <array
        keyName="detail"
        uiParams={{
          columns: [
            {
              title: "${products.no}",
              dataIndex: "no"
            },
            {
              title: "${products.photos}",
              dataIndex: "photos"
            },
            {
              title: "${products.name}",
              dataIndex: "name"
            },
            {
              title: "${products.price}",
              dataIndex: "price"
            },
            {
              title: "${products.promo}",
              dataIndex: "promo"
            },
            {
              title: "${orders.detail.count}",
              dataIndex: "count"
            }
          ],
          relationColumns: [
            {
              title: "${products.no}",
              dataIndex: "no"
            },
            {
              title: "${products.photos}",
              dataIndex: "photos"
            },
            {
              title: "${products.name}",
              dataIndex: "name"
            },
            {
              title: "${products.price}",
              dataIndex: "price"
            },
            {
              title: "${products.promo}",
              dataIndex: "promo"
            }
          ],
          relationField: "products",
          copyFields: ["no", "name", "price", "promo", "count", "photos"]
        }}
      >
        <string keyName="no" title="${products.no}" />
        <string keyName="name" title="${products.name}" />
        <array
          keyName="photos"
          ui="gallery"
          title="${products.photos}"
          uiParams={galleryUIParams}
        />
        <number keyName="price" title="${products.price}" />
        <number keyName="promo" title="${products.promo}" />
        <number keyName="count" title="${orders.detail.count}" />
      </array>
    </Block>
    <Row type="flex" gutter={16}>
      <Col xs={24} sm={12} md={12}>
        <Block title="${orders.orderStatus}">
          <enum
            values={['new', 'old']}
            keyName="orderStatus"
            title="${orders.orderStatus}"
            ui="select"
            uiParams={{
              options: [
                {
                  text: "${orders.newOrder}",
                  value: "new"
                },
                {
                  text: "${orders.oldOrder}",
                  value: "old"
                }
              ]
            }}
          />
          <enum
            values={['ATM', 'CREDIT']}
            keyName="paymentType"
            title="${orders.paymentType}"
            ui="select"
            uiParams={{
              options: [
                {
                  text: "ATM",
                  value: "ATM"
                },
                {
                  text: "${orders.paymentType.credit}",
                  value: "CREDIT"
                }
              ]
            }}
          />
          <enum
            keyName="payStatus"
            values={['not', 'paid']}
            title="${orders.payStatus}"
            ui="select"
            uiParams={{
              options: [
                {
                  text: "${orders.notPaid}",
                  value: "not"
                },
                {
                  text: "${orders.paid}",
                  value: "paid"
                }
              ]
            }}
          />
          <enum
            keyName="shipStatus"
            values={['not', 'shipping', 'delivered']}
            title="${orders.shipStatus}"
            ui="select"
            uiParams={{
              options: [
                {
                  text: "${orders.unshipped}",
                  value: "not"
                },
                {
                  text: "${orders.shipping}",
                  value: "shipping"
                },
                {
                  text: "${orders.delivered}",
                  value: "delivered"
                }
              ]
            }}
          />
        </Block>
      </Col>
      <Col xs={24} sm={12} md={12}>
        <Block title="${orders.otherInfo}">
          <boolean keyName="isHighPrice" title="${orders.isHighPrice}" />
          <number keyName="discount" title="${orders.discount}" />
          <number keyName="shipFee" title="${orders.shipFee}" />
          <number keyName="amount" title="${orders.amount}" />
        </Block>
      </Col>
    </Row>
  </array>
);

export default orders
