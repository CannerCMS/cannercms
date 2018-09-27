/** @jsx c */
import c, { Block } from "canner-script";
import { galleryValidation } from "./utils";

const Products = () => (
  <array
    keyName="products"
    title="產品 - 列表"
    ui="tableRoute"
    uiParams={{
      columns: [
        {
          title: "圖片",
          dataIndex: "photos"
        },
        {
          title: "編號",
          dataIndex: "no"
        },
        {
          title: "品牌",
          dataIndex: "brand",
          filters: [
            { text: "Hanata", value: "HANATA" },
            { text: "Suss", value: "SUSS" }
          ],
          onFilter: (value, record) => {
            return record.brand === value;
          }
        },
        {
          title: "名稱",
          dataIndex: "name"
        },
        {
          title: "價格",
          dataIndex: "price"
        },
        {
          title: "優惠價",
          dataIndex: "promo"
        }
      ]
    }}
  >
    <toolbar>
      <actions filterButton />
      <filter>
        <textFilter label="產品編號" field="no" placeholder="輸入產品編號" />
        <textFilter label="產品名稱" field="name" placeholder="輸入產品名稱" />
        <selectFilter
          label="品牌"
          options={[
            {
              text: "Hanata",
              condition: {
                brand: {
                  eq: "HANATA"
                }
              }
            },
            {
              text: "SUSS",
              condition: {
                brand: {
                  eq: "SUSS"
                }
              }
            }
          ]}
        />
      </filter>
      <pagination />
    </toolbar>
    <Block title="基本設定">
      <string
        keyName="brand"
        ui="select"
        uiParams={{
          options: [
            {
              text: "SUSS",
              value: "SUSS"
            },
            {
              text: "HANATA",
              value: "HANATA"
            }
          ]
        }}
        title="品牌"
        required
      />
      <string keyName="no" title="商品編號" required />
      <string keyName="name" title="商品名稱" required />
      <object keyName="description" ui="editor" title="產品內容描述" />
      <number keyName="price" title="價格" uiParams={{ unit: "元" }} required />
      <number keyName="promo" title="優惠價" uiParams={{ unit: "元" }} />
      <relation
        ui="multipleSelect"
        keyName="addBuy"
        relation={{
          type: "toMany",
          to: "products"
        }}
        uiParams={{
          textCol: "name",
          columns: [
            {
              title: "No",
              dataIndex: "no"
            },
            {
              title: "名稱",
              dataIndex: "name"
            }
          ]
        }}
        title="加購商品"
      >
        <toolbar>
          <actions filterButton />
          <filter>
            <textFilter
              label="搜尋訂單編號"
              field="no"
              placeholder="搜尋訂單編號"
            />
          </filter>
          <pagination />
        </toolbar>
      </relation>
      <relation
        ui="multipleSelect"
        keyName="unSupportShipment"
        uiParams={{
          textCol: "name",
          columns: [
            {
              title: "名稱",
              dataIndex: "name"
            }
          ]
        }}
        relation={{
          type: "toMany",
          to: "shipments"
        }}
        title="不支援的運送方式"
      />
      <relation
        keyName="category"
        ui="singleSelectTree"
        relation={{
          type: "toOne",
          to: "categories"
        }}
        title="類別"
        uiParams={{
          textCol: "name",
          columns: [
            {
              title: "類別名稱",
              dataIndex: "name"
            }
          ],
          relationField: "category"
        }}
      />
    </Block>
    <Block title="存貨設定">
      <object keyName="storage">
        <number keyName="count" title="數量" />
        <boolean keyName="limited" title="是否開啟存貨設定" />
      </object>
    </Block>
    <Block>
      <array
        keyName="photos"
        title="產品照片集"
        ui="gallery"
        required
        validation={galleryValidation}
      />
    </Block>
  </array>
);

export default Products
