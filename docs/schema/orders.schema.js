/** @jsx c */
import * as React from "react";
import c, { Block, Condition } from "canner-script";
import moment from "moment";
import shortId from "shortid";
import TableSelectColumn from "./customize-components/table-select-column";
import { galleryUIParams } from "./utils";

const orders = () => (
  <array
    keyName="orders"
    ui="tableRoute"
    title="${orders.title}"
    uiParams={{
      columns: [
        {
          title: "${orders.no}",
          dataIndex: "no"
        },
        {
          title: "${orders.orderStatus}",
          dataIndex: "orderStatus",
          filters: [
            { text: "新訂單", value: "new" },
            { text: "已處理", value: "old" }
          ],
          onFilter: (value, record) => record.orderStatus === value,
          render: (text, data, props) => {
            return React.createElement(TableSelectColumn, {
              value: text,
              options: [
                {
                  value: "new",
                  title: "新訂單",
                  color: "red"
                },
                {
                  value: "old",
                  title: "已處理",
                  color: "green"
                }
              ],
              dataKeyRefId: props.refId.child(`${data.__index}/orderStatus`),
              cannerProps: props
            });
          }
        },
        {
          title: "${orders.createDate}",
          dataIndex: "createDate"
        },
        {
          title: "${orders.payStatus}",
          dataIndex: "payStatus",
          filters: [
            { text: "未付款", value: "not" },
            { text: "已付款", value: "paid" }
          ],
          onFilter: (value, record) => record.payStatus === value,
          render: (text, data, props) => {
            return React.createElement(TableSelectColumn, {
              value: text,
              options: [
                {
                  value: "not",
                  title: "未付款",
                  color: "red"
                },
                {
                  value: "paid",
                  title: "已付款",
                  color: "green"
                }
              ],
              dataKeyRefId: props.refId.child(`${data.__index}/payStatus`),
              cannerProps: props
            });
          }
        },
        {
          title: "${orders.shipStatus}",
          dataIndex: "shipStatus",
          filters: [
            { text: "未運送", value: "not" },
            { text: "運送中", value: "shipping" },
            { text: "已送達", value: "shipped" }
          ],
          onFilter: (value, record) => record.shipStatus === value,
          render: (text, data, props) => {
            return React.createElement(TableSelectColumn, {
              value: text,
              options: [
                {
                  value: "not",
                  title: "未運送",
                  color: "red"
                },
                {
                  value: "shipping",
                  title: "運送中",
                  color: "orange"
                },
                {
                  value: "shipped",
                  title: "已送達",
                  color: "green"
                }
              ],
              dataKeyRefId: props.refId.child(`${data.__index}/shipStatus`),
              cannerProps: props
            });
          }
        },
        {
          title: "${orders.orderInfo.buyerName}",
          dataIndex: "orderInfo.buyerName"
        },
        {
          title: "${orders.orderInfo.buyerPhone}",
          dataIndex: "orderInfo.buyerPhone"
        },
        {
          title: "${orders.orderInfo.buyerEmail}",
          dataIndex: "orderInfo.buyerEmail"
        }
      ]
    }}
  >
    <toolbar>
      <actions filterButton />
      <sorter
        defaultField="createDate"
        options={[
          { label: "創立時間", field: "createDate", defaultOrder: "desc" }
        ]}
      />
      <filter>
        <textFilter
          label="搜尋訂購人"
          field="orderInfo.buyerName"
          placeholder="輸入訂購人"
        />
        <textFilter
          label="搜尋${orders.no}"
          field="no"
          placeholder="搜尋${orders.no}"
        />
      </filter>
      <pagination />
    </toolbar>
    <Block title="${orders.orderInfo.layoutTitle}">
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
      <object keyName="orderInfo">
        <string keyName="buyerName" title="${orders.orderInfo.buyerName}" required />
        <string keyName="buyerPhone" title="${orders.orderInfo.buyerPhone}" required />
        <string keyName="buyerEmail" title="${orders.orderInfo.buyerEmail}" />
        <string keyName="receiverName" title="${orders.orderInfo.receiverName}" required />
        <string keyName="receiverPhone" title="${orders.orderInfo.receiverPhone}" required />
        <dateTime keyName="receiveTime" title="${orders.orderInfo.receiveTime}" required />
        <Condition match={data => data.shipmentWay !== "person"}>
          <string keyName="receiverAddress" title="${orders.orderInfo.receiverAddress}" />
        </Condition>
        <string
          keyName="shipmentWay"
          ui="select"
          title="${orders.orderInfo.shipmentWay}"
          uiParams={{
            options: [
              { value: "person", text: "自取" },
              { value: "car", text: "雙北市 專人配送" },
              { value: "blackCat", text: "宅配" }
            ]
          }}
        />
        <Block title="${orders.orderInfo.card.title}">
          <string keyName="cardReceiverName" title="${orders.orderInfo.card.receiverName}" />
          <string ui="textarea" keyName="cardContent" title="${orders.orderInfo.card.content}" />
          <string keyName="senderName" title="${orders.orderInfo.card.senderName}" />
          <string ui="textarea" keyName="comment" title="${orders.orderInfo.card.comment}" />
        </Block>
      </object>

    </Block>
    <array
      keyName="detail"
      title="${orders.detail.title}"
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
      <number keyName="count" title="${products.count}" />
    </array>
    <Block title="${orders.orderStatus}">
      <string
        keyName="orderStatus"
        title="${orders.orderStatus}"
        ui="select"
        uiParams={{
          options: [
            {
              text: "新訂單",
              value: "new"
            },
            {
              text: "已處理",
              value: "old"
            }
          ]
        }}
      />
      <string
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
              text: "信用卡付款",
              value: "CREDIT"
            }
          ]
        }}
      />
      <string
        keyName="payStatus"
        title="${orders.payStatus}"
        ui="select"
        uiParams={{
          options: [
            {
              text: "未付款",
              value: "not"
            },
            {
              text: "已付款",
              value: "paid"
            }
          ]
        }}
      />
      <string
        keyName="shipStatus"
        title="${orders.shipStatus}"
        ui="select"
        uiParams={{
          options: [
            {
              text: "未運送",
              value: "not"
            },
            {
              text: "運送中",
              value: "shipping"
            },
            {
              text: "已送達",
              value: "shipped"
            }
          ]
        }}
      />
    </Block>
    <Block title="${orders.otherInfo}">
      <boolean keyName="isHighPrice" title="${orders.isHighPrice}" />
      <number keyName="discount" title="${orders.discount}" />
      <number keyName="shipFee" title="${orders.shipFee}" />
      <number keyName="amount" title="${orders.amount}" />
    </Block>
  </array>
);

export default orders
