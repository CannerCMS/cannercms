/** @jsx c */
import c, { Default, Tabs } from "canner-script";
import TextFilter from "../components/columns/textFilter";
import { galleryValidation } from "./utils";

const noFilter = new TextFilter('no');
const nameFilter = new TextFilter('name');
const Products = () => (
  <array
    keyName="products"
    title="${products.title}"
    description="${products.description}"
    ui="tableRoute"
    uiParams={{
      size: 'small',
      columns: [
        {
          title: "${products.photos}",
          dataIndex: "photos",
          fixed: 'left'
        },
        {
          title: "${products.no}",
          dataIndex: "no",
          filterDropdown: noFilter.renderFilter,
          onFilter: noFilter.onFilter,
          render: noFilter.render
        },
        {
          title: "${products.name}",
          dataIndex: "name",
          filterDropdown: nameFilter.renderFilter,
          onFilter: nameFilter.onFilter,
          render: nameFilter.render
        },
        {
          title: "${products.price}",
          dataIndex: "price",
          sorter: (a, b) => a.price - b.price,
        },
        {
          title: "${products.promo}",
          dataIndex: "promo",
          sorter: (a, b) => a.promo - b.promo,
        }
      ]
    }}
    refetch
    graphql={`
      query($productsWhere: ProductWhereInput) {
        products: productsConnection(where: $productsWhere) {
          edges {
            cursor
            node {
              product
              id
              name
              no
              photos {
                image {
                  url
                }
              }
              price
              promo
            }
          }
        }
      }
    `}
  >
    <toolbar>
      <pagination />
    </toolbar>
    <Tabs>
      <Default keyName="basicSetting" title="${products.basicSetting}" type="inner" injectValue={{layout: 'horizontal'}} >
        <string keyName="no" title="${products.no}" description="Unique Number of the Product" required/>
        <string keyName="name" title="${products.name}" required />
        <object keyName="description" ui="editor" title="${products.prod.description}" />
        <number keyName="price" title="${products.price}" required />
        <number keyName="promo" title="${products.promo}" />
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
      </Default>
      <Default keyName="storage" title="${products.storage.layoutTitle}">
        <object keyName="storage">
          <number keyName="count" title="${products.storage.count}" />
          <boolean keyName="enabled" title="${products.storage.enabled}" />
        </object>
      </Default>
      <Default keyName="photos" title="${products.photos}">
        <array
          keyName="photos"
          ui="gallery"
          required
          validation={galleryValidation}
        />
      </Default>
    </Tabs>
  </array>
);

export default Products
