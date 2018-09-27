/** @jsx c */
import c from "canner-script";

const categories = () => (
  <array
    keyName="categories"
    ui="tree"
    title="產品 - 類別"
    uiParams={{
      relationField: "category",
      columns: [
        {
          title: "類別名稱",
          dataIndex: "name"
        },
        {
          title: "品牌",
          dataIndex: "brand"
        }
      ]
    }}
  >
    <toolbar>
      <filter>
        <selectFilter
          alwaysDisplay
          defaultOptionIndex={1}
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
    </toolbar>
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
    <string keyName="name" title="名稱" required />
    <relation
      keyName="category"
      ui="singleSelectTree"
      relation={{
        type: "toOne",
        to: "categories"
      }}
      title="母類別"
      uiParams={{
        disabled: (data, treeKey) => {
          return treeKey.indexOf("-") !== -1;
        },
        textCol: data => `${data.name} - (${data.brand})`,
        columns: [
          {
            title: "類別名稱",
            dataIndex: "name"
          }
        ],
        relationField: "category"
      }}
    >
      <toolbar>
        <filter permanentFilter={record => ({ brand: { eq: record.brand } })} />
      </toolbar>
    </relation>
  </array>
);

export default categories;
