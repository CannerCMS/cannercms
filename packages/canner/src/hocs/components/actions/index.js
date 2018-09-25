// @flow
import React, {Component} from 'react';
import {Button, Icon, Dropdown, Menu} from 'antd';
import {FormattedMessage} from 'react-intl';
import ExportModal from './exportModal';
import ImportModal from './importModal';

type Props = {
  async: boolean,
  filters: Array<Object>,
  addFilter: Function,
  displayedFilters: Array<number>,
  export?: {
    title: string,
    filename: string,
    fields: Array<Object>
  },
  import?: Object,
  filter?: Object,
  value: Array<Object>,
  selectedValue: Array<Object>,
  query: Object,
  keyName: string,
  items: Object
}

type State = {
  exportModalVisible: boolean,
  importModalVisible: boolean
}

export default class Actions extends Component<Props, State> {
  state = {
    exportModalVisible: false,
    importModalVisible: false
  }

  triggerExportModal = () => {
    this.setState({
      exportModalVisible: !this.state.exportModalVisible
    });
  }

  triggerImportModal = () => {
    this.setState({
      importModalVisible: !this.state.importModalVisible
    });
  }


  addFilter = (e: Object) => {
    const {displayedFilters, addFilter} = this.props;
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
      filter
    } = this.props;
    const exp = this.props.export || {};
    const imp = this.props.import || {};
    const exportFields = exp.fields || Object.keys(items).map(keyName => items[keyName]);
    const {exportModalVisible, importModalVisible} = this.state;
    const menu = (
      <Menu onClick={this.addFilter}>
        {
          filters.map((filter, index) => (
            <Menu.Item key={index}>
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
            this.props.export && (
              <Button onClick={this.triggerExportModal}>
                <Icon type="download" />
                <FormattedMessage id="query.actions.export"/>
              </Button>
            )
          }
          {
            this.props.import && (
              <Button onClick={this.triggerImportModal}>
                <Icon type="upload" />
                <FormattedMessage id="query.actions.import"/>
              </Button>
            )
          }
          {
            filter && (
              <Dropdown overlay={menu}>
                <Button>
                  <Icon type="filter" />
                  <FormattedMessage id="query.actions.filter"/>
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
        <ImportModal
          visible={importModalVisible}
          triggerModal={this.triggerImportModal}
          title={imp.title || ''}

          fields={importFields || []}
          fileName={imp.filename || imp.title || 'export'}
          query={query}
          keyName={keyName}
        />
      </React.Fragment>
    )
  }
}
