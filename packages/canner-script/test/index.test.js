/** @jsx builder */

// eslint-disable-next-line
import builder, {configure} from '../src'
import path from 'path';
import Sorter from './toolbar/sorter';
import Pagination from './toolbar/pagination';
import Filter from './toolbar/filter';

configure({
  visitorManager: {
    defaultVisitors: []
  }
});

describe('builder', () => {
  it('throw error', () => {
    expect(() => <myType />).toThrow(/unsupported type/);
  });

  describe('string', () => {
    it('should work', () => {
      expect(<string />).toMatchObject({
        type: 'string',
        ui: 'input',
        packageName: '@canner/antd-string-input'
      });
    });
  });

  describe('boolean', () => {
    it('should work', () => {
      expect(<boolean />).toMatchObject({
        type: 'boolean',
        ui: 'switch'
      });
    });
  });

  describe('number', () => {
    it('should work', () => {
      expect(<number />).toMatchObject({
        type: 'number',
        ui: 'input'
      });
    });
  });

  describe('relation', () => {
    it('should work', () => {
      expect(<relation relation={{
        type: 'toOne',
        to: 'users'
      }} />).toMatchObject({
        type: 'relation',
        ui: 'singleSelect',
        relation: {
          type: 'toOne',
          to: 'users'
        }
      });
    });

    it('should have toolbar attrs', () => {
      expect(<relation relation={{
        type: 'toOne',
        to: 'users'
      }}>
        <toolbar>
          <pagination />
        </toolbar>
      </relation>).toMatchObject({
        type: 'relation',
        ui: 'singleSelect',
        relation: {
          type: 'toOne',
          to: 'users'
        },
        toolbar: {
          pagination: {
            type: 'pagination'
          }
        }
      });
    });
  });

  describe('array', () => {
    it('array of string without keyName', () => {
      const array = (<array>
        <string />
      </array>);
      expect(array).toMatchObject({
        type: 'array',
        ui: 'table',
        items: {
          type: 'string'
        }
      });
    });

    it('array of string with keyName', () => {
      const array = (<array>
        <string keyName="test"/>
      </array>);
      expect(array).toMatchObject({
        type: 'array',
        ui: 'table',
        items: {
          type: 'object',
          items: {
            test: {
              type: 'string',
              keyName: 'test'
            }
          }
        }
      });
    });

    it('auto object in array', () => {
      const array = (<array>
        <string keyName="test" />
        <string keyName="test2" />
      </array>);
      expect(array).toMatchObject({
        type: 'array',
        ui: 'table',
        items: {
          type: 'object',
          items: {
            test: {
              type: 'string',
              keyName: 'test'
            },
            test2: {
              type: 'string',
              keyName: 'test2'
            }
          }
        }
      });
    });

    it('manual object without keyName in array', () => {
      const array = (<array>
        <object>
          <string keyName="test" />
        </object>
      </array>);
      expect(array).toMatchObject({
        type: 'array',
        ui: 'table',
        items: {
          type: 'object',
          items: {
            test: {
              type: 'string',
              keyName: 'test'
            }
          }
        }
      });
    });

    it('manual object with keyName in array', () => {
      const array = (<array>
        <object keyName="obj">
          <string keyName="test" />
        </object>
      </array>);
      expect(array).toMatchObject({
        type: 'array',
        ui: 'table',
        items: {
          type: 'object',
          items: {
            obj: {
              keyName: 'obj',
              type: 'object',
              items: {
                test: {
                  type: 'string',
                  keyName: 'test'
                }
              }
            }
          }
        }
      });
    });
  });

  describe('object', () => {
    it('should work', () => {
      const object = <object>
        <string keyName="title"/>
      </object>
      expect(object).toMatchObject({
        type: 'object',
        ui: 'fieldset',
        items: {
          title: {
            type: 'string',
            keyName: 'title'
          }
        }
      });
    });
  });

  describe('toolbar', () => {
    it('should work', () => {
      expect(<array>
        <toolbar>
          <sorter component={Sorter} />
          <pagination component={Pagination} />
          <filter component={Filter} />
        </toolbar>
      </array>).toMatchObject({
        type: 'array',
        toolbar: {
          sorter: {
            component: Sorter,
            type: 'sorter'
          },
          pagination: {
            component: Pagination,
            type: 'pagination'
          },
          filter: {
            component: Filter,
            type: 'filter'
          }
        }
      });
    });
  });

  describe('filter', () => {
    it('should work', () => {
      expect(
        <toolbar>
          <filter>
            <textFilter label="Title" field="title"/>
            <numberFilter label="Clicks" field="clicks"/>
            <dateFilter label="CreatedDate" field="createdDate"/>
            <relationSelectFilter label="Author" field="author" textCol="name"/>
            <selectFilter
              label="Status"
              options={[{
                  text: 'Draft',
                  condition: {
                    draft_eq: true,
                    trash_eq: false
                  }
              }, {
                text: 'All',
                condition: {}
              }]}
            />
          </filter>
        </toolbar>).toMatchObject({
            filter: {
              filters: [{
              type: 'text',
              label: 'Title',
              field: 'title' 
            }, {
              type: 'number',
              label: 'Clicks',
              field: 'clicks'
            }, {
              type: 'date',
              label: 'CreatedDate',
              field: 'createdDate'
            }, {
              type: 'relation',
              label: 'Author',
              field: 'author',
              textCol: 'name'
            }, {
              type: 'select',
              label: 'Status',
              options: [{
                text: 'Draft',
                condition: {
                  draft_eq: true,
                  trash_eq: false
                }
            }, {
              text: 'All',
              condition: {}
            }]
            }]}
        });
    });
  });

  describe('actions', () => {
    it('should work', () => {
      expect(<toolbar>
        <actions exportButton importButton filterButton />
      </toolbar>).toMatchObject({actions: {
        exportButton: true,
        importButton: true,
        filterButton: true
      }});
    });
  });

  describe('geoPoint', () => {
    it('should work', () => {
      expect(<geoPoint keyName="map"/>).toMatchObject({
        type: 'geoPoint',
        ui: 'default',
        keyName: 'map'
      });
    });
  });

  describe('dateTime', () => {
    it('should work', () => {
      expect(<dateTime keyName="date"/>).toMatchObject({
        type: 'dateTime',
        ui: 'dateTime',
        keyName: 'date'
      });
    });
  });

  describe('file', () => {
    it('should work', () => {
      expect(<file keyName="file"/>).toMatchObject({
        type: 'file',
        ui: 'file',
        keyName: 'file'
      });
    });
  });

  describe('image', () => {
    it('should work', () => {
      expect(<image keyName="image"/>).toMatchObject({
        type: 'image',
        ui: 'image',
        keyName: 'image'
      });
    });
  });

  describe('chart', () => {
    it('should work', () => {
      expect(<chart keyName="chart"/>).toMatchObject({
        type: 'chart',
        ui: 'line',
        keyName: 'chart'
      });
    });

    it('should work with children', () => {
      expect(
        <chart keyName="chart">
           <toolbar>
              <filter />
          </toolbar>
        </chart>
      ).toMatchObject({
        type: 'chart',
        ui: 'line',
        keyName: 'chart',
        toolbar: {
          filter: {
            "type": "filter"
          }
        }
      });
    });

    it('should have keyName', () => {
      expect(<chart />).toHaveProperty('keyName');
    });
  });

  describe('indicator', () => {
    it('should work', () => {
      expect(<indicator keyName="indicator"/>).toMatchObject({
        type: 'indicator',
        ui: 'amount',
        keyName: 'indicator'
      });
    });

    it('should work with children', () => {
      expect(
        <indicator keyName="amount">
           <toolbar>
              <filter />
          </toolbar>
        </indicator>
      ).toMatchObject({
        type: 'indicator',
        ui: 'amount',
        keyName: 'amount',
        toolbar: {
          filter: {
            "type": "filter"
          }
        }
      });
    });

    it('should have keyName', () => {
      expect(<indicator />).toHaveProperty('keyName');
    });
  });

  describe('enum', () => {
    it('should work', () => {
      expect(<enum keyName="enum" values={['A', 'B', 'C']}/>).toMatchObject({
        type: 'enum',
        ui: 'select',
        keyName: 'enum',
        values: ['A', 'B', 'C']
      });
    });
  });

  describe('root', () => {
    it('should work', () => {
      const root = <root dict={{en: {title: 'title'}}} storage="storage">
        <object keyName="info" >
          <string keyName="name"/>
        </object>
      </root>
      expect(root.storages).toMatchObject({
        info: 'storage'
      });
      expect(root.schema).toMatchObject({
        info: {
          type: 'object',
          ui: 'fieldset',
          items: {
            name: {
              keyName: 'name',
              ui: 'input',
              type: 'string'
            }
          }
        }
      });
      expect(root.dict).toMatchObject({en: {title: 'title'}});
    });

    it('should work with <page>child', () => {
      const root = <root>
        <page keyName="overview">
          <chart keyName="line" ui="line" />
        </page>
      </root>
      expect(root.pageSchema).toMatchObject({
        keyName: 'overview',
        type: 'page',
        items: {
            line: {
                type: 'chart',
                ui: 'line',
                keyName: 'line'
            }
        }
      });
    });
  });


  describe('page', () => {
    it('should work', () => {
      const page = <page keyName="overview">
        <indicator ui="amount" keyName="key1"/>
        <indicator ui="list" keyName="key2"/>
        <chart ui="bar" keyName="key3"/>
      </page>
      expect(page).toMatchObject({
        keyName: 'overview',
        type: 'page',
        items: {
          key1: {
              type: 'indicator',
              ui: 'amount',
              keyName: 'key1'
          },
          key2: {
              type: 'indicator',
              ui: 'list',
              keyName: 'key2'
          },
          key3: {
              type: 'chart',
              ui: 'bar',
              keyName: 'key3'
          }
        }
      });
    });
  });

  describe('children with map', () => {
    it('should work', () => {
      const schema = <root>
        {['info', 'info2'].map(name => <object key={name} keyName={name}>
          <string keyName={`${name}-string`}></string>
        </object>)}
      </root>;

      expect(schema.schema).toMatchObject({
        info: {
          type: 'object',
          items: {
            'info-string': {
              type: 'string',
              keyName: 'info-string'
            }
          }
        },
        info2: {
          type: 'object',
          items: {
            'info2-string': {
              type: 'string',
              keyName: 'info2-string'
            }
          }
        }
      });
    });
  });

  it('blog schema', () => {
    const blog = require('./blog');
    expect(blog).toMatchSnapshot();
  });

  it('function', () => {
    // eslint-disable-next-line
    const Variants = ({attributes, children}) => (
      <object {...attributes}>
        <string keyName="title" /> 
        {children}
      </object>
    )
    expect(<Variants keyName="variants">
      <string keyName="desc" />
    </Variants>).toMatchSnapshot();
  });

  describe('canner.def.js', () => {
    it('function builder', () => {
      const packageName = path.resolve(__dirname, 'fake-object-variants');
      // eslint-disable-next-line
      expect(<object keyName="variants" packageName={packageName} builder={require(`${packageName}/canner.def.js`)}>
        <string keyName="desc" />
      </object>).toMatchObject({
        "description": "",
        "items": {
          "a": {
            "keyName": "a",
            "packageName": "@canner/antd-string-input",
          },
          "d": {
            "keyName": "d",
            "packageName": "@canner/antd-string-input",
          },
          "desc": {
            "keyName": "desc",
            "packageName": "@canner/antd-string-input",
          },
        },
        "keyName": "variants",
        "packageName": packageName,
        "type": "object",
        "ui": "fieldset",
      });
    });

    it('require builder', () => {
      const packageName = path.resolve(__dirname, 'fake-object-variants');
      // eslint-disable-next-line
      expect(<object keyName="variants" packageName={packageName} builder={require(`${packageName}/canner.def.js`)}>
        <string keyName="desc" />
      </object>).toMatchObject({
        "items": {
          "a": {
            "description": "",
            "keyName": "a",
            "packageName": "@canner/antd-string-input",
            "title": "",
            "type": "string",
            "ui": "input",
          },
          "d": {
            "description": "",
            "keyName": "d",
            "packageName": "@canner/antd-string-input",
            "title": "",
            "type": "string",
            "ui": "input",
          },
          "desc": {
            "description": "",
            "keyName": "desc",
            "packageName": "@canner/antd-string-input",
            "title": "",
            "type": "string",
            "ui": "input",
            
          },
        },
        "keyName": "variants",
        "packageName": packageName,
        "title": "",
        "type": "object",
        "ui": "fieldset",
        
      });
    });
  })

  it('map chilren', () => {
    const list = ['a', 'b', 'c'];
    expect(<object keyName="variants">
      <string keyName="desc" />
      {list.map(name => <string key={name} keyName={name}/>)}
    </object>).toMatchSnapshot();
  });

  it('null', () => {
    expect(<object keyName="info">
      {null}
    </object>).toMatchSnapshot();
  });

  it('should throw error, if cannerDataType is invalid', () => {
    expect(() => <object keyName="info" type="error-type" />).toThrow('there is no type error-type');
  });
});
