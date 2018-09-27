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
    title="訂單 - 列表"
    uiParams={{
      columns: [
        {
          title: "訂單編號",
          dataIndex: "no"
        },
        {
          title: "訂單狀態",
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
          title: "訂單日期",
          dataIndex: "createDate"
        },
        {
          title: "卡片",
          dataIndex: "orderInfo.cardStyle",
          render: text => {
            if (!text || !text.id) {
              return "🚫";
            }
            return "✔";
          }
        },
        {
          title: "付款狀態",
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
          title: "運送狀態",
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
          title: "購買人",
          dataIndex: "orderInfo.buyerName"
        },
        {
          title: "購買人電話",
          dataIndex: "orderInfo.buyerPhone"
        },
        {
          title: "email",
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
          label="搜尋訂單編號"
          field="no"
          placeholder="搜尋訂單編號"
        />
      </filter>
      <pagination />
    </toolbar>
    <Block title="訂購資訊">
      <string
        keyName="no"
        title="訂單編號"
        disabled
        defaultValue={() => shortId.generate()}
      />
      <dateTime
        keyName="createDate"
        title="訂單成立時間"
        defaultValue={() => moment().toISOString()}
        disabled
        required
      />
      <object keyName="orderInfo">
        <string keyName="buyerName" title="購買人姓名" required />
        <string keyName="buyerPhone" title="購買人電話" required />
        <string keyName="buyerEmail" title="購買人 Email" />
        <string keyName="receiverName" title="收件人姓名" required />
        <string keyName="receiverPhone" title="收件人電話" required />
        <dateTime keyName="receiveDate" title="收件日期" required />
        <Condition match={data => data.shipmentWay !== "person"}>
          <string keyName="receiverAddress" title="收件人地址" />
          <boolean keyName="haveAdmin" title="是否有櫃檯或管理員可以幫忙代收" />
        </Condition>
        <string
          keyName="shipmentWay"
          ui="select"
          title="運送方式"
          uiParams={{
            options: [
              { value: "person", text: "自取" },
              { value: "car", text: "雙北市 專人配送" },
              { value: "blackCat", text: "宅配" }
            ]
          }}
        />
        <string
          title="收件時間"
          keyName="receiveTime"
          ui="select"
          uiParams={{
            blackCatOptions: [
              {
                text: "不指定時間",
                value: "不指定時間"
              },
              {
                text: "13:00 以前",
                value: "13:00 以前"
              },
              {
                text: "13:00 - 18:00",
                value: "13:00 - 18:00"
              }
            ],
            otherOptions: [
              {
                text: "不指定時間",
                value: "不指定時間"
              },
              {
                text: "12:30 - 17:00",
                value: "12:30 - 17:00"
              },
              {
                text: "17:00 - 21:30",
                value: "17:00 - 21:30"
              }
            ]
          }}
        />
        <Block title="卡片資訊">
          <string keyName="cardReceiverName" title="卡片收件人姓名" />
          <string ui="textarea" keyName="cardContext" title="卡片內容" />
          <string keyName="senderName" title="寄送人姓名" />
          <string ui="textarea" keyName="comment" title="備註" />
        </Block>
      </object>

    </Block>
    <array
      keyName="detail"
      title="購買清單"
      uiParams={{
        columns: [
          {
            title: "商品編號",
            dataIndex: "no"
          },
          {
            title: "圖",
            dataIndex: "photos"
          },
          {
            title: "商品名稱",
            dataIndex: "name"
          },
          {
            title: "原價",
            dataIndex: "price"
          },
          {
            title: "優惠價",
            dataIndex: "promo"
          },
          {
            title: "數量",
            dataIndex: "count"
          }
        ],
        relationColumns: [
          {
            title: "商品編號",
            dataIndex: "no"
          },
          {
            title: "圖",
            dataIndex: "photos"
          },
          {
            title: "名稱",
            dataIndex: "name"
          },
          {
            title: "原價",
            dataIndex: "price"
          },
          {
            title: "優惠價",
            dataIndex: "promo"
          }
        ],
        relationField: "products",
        copyFields: ["no", "name", "price", "promo", "count", "photos"]
      }}
    >
      <string keyName="no" title="商品編號" />
      <string keyName="name" title="名稱" />
      <array
        keyName="photos"
        ui="gallery"
        title="圖"
        uiParams={galleryUIParams}
      />
      <number keyName="price" title="原價" />
      <number keyName="promo" title="優惠價" />
      <number keyName="count" title="數量" />
    </array>
    <Block title="訂單狀態">
      <string
        keyName="orderStatus"
        title="訂單狀態"
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
        title="付款方式"
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
        title="付款狀態"
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
        title="運送狀態"
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
    <Block title="其他資訊">
      <boolean keyName="isHightPrice" title="是否達到滿額優惠" />
      <number keyName="discount" title="總折扣" />
      <number keyName="shipFee" title="運費" />
      <number keyName="result" title="結算金額" />
    </Block>
  </array>
);

export default orders
