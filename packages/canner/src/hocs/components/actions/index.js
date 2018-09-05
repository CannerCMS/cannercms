// @flow
import React, {Component} from 'react';
import {Button, Icon, Dropdown, Menu} from 'antd';
import {FormattedMessage} from 'react-intl';

type Props = {
  exportButton: boolean,
  importButton: boolean,
  filterButton: boolean,
  async: boolean,
  filters: Array<Object>,
  addFilter: Function,
  displayedFilters: Array<number>
}

type State = {
  order: boolean,
  key: string
}

export default class Sort extends Component<Props, State> {
  addFilter = (e: Object) => {
    const {displayedFilters, addFilter} = this.props;
    const index = Number(e.key);
    if (displayedFilters.indexOf(index) === -1) {
      addFilter(index);
    }
  }

  render() {
    const {exportButton, importButton, filterButton, filters} = this.props;
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
      <Button.Group>
        {exportButton && (
          <Button>
            <Icon type="download" />
            <FormattedMessage id="query.actions.export"/>
          </Button>
        )}
        {
          importButton && (
            <Button>
              <Icon type="upload" />
              <FormattedMessage id="query.actions.import"/>
            </Button>
          )
        }
        {
          filterButton && (
            <Dropdown overlay={menu}>
              <Button>
                <Icon type="filter" />
                <FormattedMessage id="query.actions.filter"/>
              </Button>
            </Dropdown>
          )
        }
      </Button.Group>
    )
  }
}
