// @flow
import React, { Component } from 'react';
import {
  Button, Icon, Dropdown, Menu,
} from 'antd';
import { FormattedMessage } from 'react-intl';
import ExportModal from './exportModal';
import ImportModal from './importModal';

type Props = {
  async: boolean,
  filters: Array<Object>,
  addFilter: Function,
  displayedFilters: Array<number>,
  export?: {
    title?: string,
    filename?: string,
    fields?: Array<Object>
  },
  import?: Object,
  filter?: Object,
  value: Array<Object>,
  selectedValue?: Array<Object>,
  query: Object,
  keyName: string,
  items: Object,
  request: Function,
  deploy: Function
}

type State = {
  exportModalVisible: boolean,
  importModalVisible: boolean
}

export default class Actions extends Component<Props, State> {
  static defaultProps = {
    export: {},
    filter: {},
    import: {},
    selectedValue: []
  }

  state = {
    exportModalVisible: false,
    importModalVisible: false,
  }

  triggerExportModal = () => {
    const { exportModalVisible } = this.state;
    this.setState({
      exportModalVisible: !exportModalVisible,
    });
  }

  triggerImportModal = () => {
    const { importModalVisible } = this.state;
    this.setState({
      importModalVisible: !importModalVisible,
    });
  }


  addFilter = (e: Object) => {
    const { displayedFilters, addFilter } = this.props;
    const index = Number(e.key);
    if (displayedFilters.indexOf(index) === -1) {
      addFilter(index);
    }
  }

  render() {
    const {
      filters,
      value,
      selectedValue,
      query,
      keyName,
      items,
      filter,
      request,
      deploy,
      export: exportFile,
      import: importFile,
    } = this.props;
    const exp = exportFile || {};
    const imp = importFile || {};
    const exportFields = exp.fields || Object.keys(items).map(keyName => items[keyName]);
    let importFields = exp.fields || Object.keys(items).map(keyName => items[keyName]);
    // in csv format, it's difficult to write array or object type
    importFields = importFields.filter(item => ['string', 'number', 'boolean'].indexOf(item.type) >= 0);
    const { exportModalVisible, importModalVisible } = this.state;
    const menu = (
      <Menu onClick={this.addFilter}>
        {
          filters.map(filter => (
            <Menu.Item
              key={filter.label}
              data-testid={`actions-filter-dropdown-menu-${filter.label}`}
            >
              {filter.label}
            </Menu.Item>
          ))
        }
      </Menu>
    );
    return (
      <React.Fragment>
        <Button.Group>
          {
            exportFile && (
              <Button onClick={this.triggerExportModal} data-testid="actions-export-button">
                <Icon type="download" />
                <FormattedMessage id="query.actions.export" />
              </Button>
            )
          }
          {
            importFile && (
              <Button onClick={this.triggerImportModal} data-testid="actions-import-button">
                <Icon type="upload" />
                <FormattedMessage id="query.actions.import" />
              </Button>
            )
          }
          {
            filter && (
              <Dropdown overlay={menu} data-testid="actions-filter-dropdown">
                <Button data-testid="actions-filter-button">
                  <Icon type="filter" />
                  <FormattedMessage id="query.actions.filter" />
                </Button>
              </Dropdown>
            )
          }
        </Button.Group>
        {/* $FlowFixMe */}
        <ExportModal
          visible={exportModalVisible}
          triggerModal={this.triggerExportModal}
          title={exp.title || ''}
          value={value || []}
          selectedValue={selectedValue || []}
          fields={exportFields || []}
          fileName={exp.filename || exp.title || 'export'}
          query={query}
          keyName={keyName}
        />
        {/* $FlowFixMe */}
        <ImportModal
          visible={importModalVisible}
          triggerModal={this.triggerImportModal}
          title={imp.title || ''}
          request={request}
          deploy={deploy}
          fields={importFields || []}
          fileName={imp.filename || imp.title || 'import'}
          query={query}
          items={items}
          keyName={keyName}
        />
      </React.Fragment>
    );
  }
}
