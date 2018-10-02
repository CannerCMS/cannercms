/** @jsx c */
import c, { Block } from "canner-script";
import { galleryValidation } from "./utils";

const Products = () => (
  <array
    keyName="products"
    title="${products.title}"
    ui="tableRoute"
    uiParams={{
      columns: [
        {
          title: "${products.photos}",
          dataIndex: "photos"
        },
        {
          title: "${products.no}",
          dataIndex: "no"
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
      ]
    }}
  >
    <toolbar>
      <actions filterButton />
      <filter>
        <textFilter label="${products.filter.no.label}" field="no" placeholder="products.filter.no.label" />
        <textFilter label="${products.filter.no.placeholder}" field="name" placeholder="products.filter.no.placeholder" />
      </filter>
      <pagination />
    </toolbar>
    <Block title="${products.basicSetting}">
      <string keyName="no" title="${products.no}" required />
      <string keyName="name" title="${products.name}" required />
      <object keyName="description" ui="editor" title="${products.description}" />
      <number keyName="price" title="${products.price}" required />
      <number keyName="promo" title="${products.promo}" />
      <relation
        ui="multipleSelect"
        keyName="addPurchase"
        relation={{
          type: "toMany",
          to: "products"
        }}
        uiParams={{
          textCol: "name",
          columns: [
            {
              title: "${products.no}",
              dataIndex: "no"
            },
            {
              title: "${products.name}",
              dataIndex: "name"
            }
          ]
        }}
        title="${products.addPurchase}"
      >
        <toolbar>
          <actions filterButton />
          <filter>
            <textFilter
              label="${products.filter.no.label}"
              field="no"
              placeholder="${products.filter.no.placeholder}"
            />
          </filter>
          <pagination />
        </toolbar>
      </relation>
      <relation
        keyName="category"
        ui="singleSelectTree"
        relation={{
          type: "toOne",
          to: "categories"
        }}
        title="${categories.title}"
        uiParams={{
          textCol: "name",
          columns: [
            {
              title: "${categories.name}",
              dataIndex: "name"
            }
          ],
          relationField: "category"
        }}
      />
    </Block>
    <Block title="${products.storage.layoutTitle}">
      <object keyName="storage">
        <number keyName="count" title="${products.storage.count}" />
        <boolean keyName="enabled" title="${products.storage.enabled}" />
      </object>
    </Block>
    <Block>
      <array
        keyName="photos"
        title="${products.photos}"
        ui="gallery"
        required
        validation={galleryValidation}
      />
    </Block>
  </array>
);

export default Products
