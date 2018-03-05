import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './style/pagination.scss';
import {Pagination, Button} from 'antd';

@CSSModules(styles)
export default class PaginationPlugin extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    paginationRes: PropTypes.object,
  }

  onChange = (page) => {
    const {goTo} = this.props.paginationRes;
    const {start, limit} = goTo(page);
    this.props.onChange(start, limit);
  }

  onSizeChange = (page, limit) => {
    const {start} = this.props.pagination;
    this.props.onChange(start, limit);
  }

  goNext = () => {
    const {next} = this.props.paginationRes;
    const {start, limit} = next();
    this.props.onChange(start, limit);
  }

  goPrev = () => {
    const {prev} = this.props.paginationRes;
    const {start, limit} = prev();
    this.props.onChange(start, limit);
  }

  render() {
    const {page, totalPage} = this.props.paginationRes;
    const {limit} = this.props.pagination;
    if (page) {
      return (
        <div styleName="pagination">
          <Pagination onChange={this.onChange}
            onShowSizeChange={this.onSizeChange}
            showSizeChanger pageSize={limit}
            current={page}
            total={Math.ceil(totalPage * limit)}
            pageSizeOptions={['5', '10', '20', '30', '40']}
          />
        </div>
      );
    }
    return <div styleName="buttons">
      <Button onClick={this.goPrev} type="primary">Prev</Button>
      <Button onClick={this.goNext} type="primary">Next</Button>
    </div>;
  }
}
