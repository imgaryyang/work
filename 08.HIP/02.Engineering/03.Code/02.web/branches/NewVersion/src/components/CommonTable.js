import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Table } from 'antd';

import styles from './CommonTable.css';

class CommonTable extends Component {

  static propTypes = {
    /**
     * 翻页组件样式
     * normal - 全样式
     * mini - 迷你样式
     */
    paginationStyle: PropTypes.string,
  };

  static defaultProps = {
    paginationStyle: 'normal',
  };

  state = {
    selectedRowKeys: [],
  }

  componentWillMount() {
    const onload = this.props.onload;
    if (onload)onload();
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      // console.info('data changed');
      const data = nextProps.data || [];
      const { selectedRowKeys } = this.state;
      const keys = [];
      const map = {};
      for (const d of data) {
        map[d.id] = true;
      }
      for (const key of selectedRowKeys) {
        if (map[key]) { keys.push(key); }
      }
      const onSelectChange = nextProps.onSelectChange;
      this.setState({ selectedRowKeys: keys }, () => {
        if (onSelectChange)onSelectChange(this.state.selectedRowKeys);
      });
    }
  }

  componentDidUpdate() {}

  onSelectChange(selectedRowKeys, selectedRows) {
    // console.info('selectedRowKeys ', selectedRowKeys);
    const onSelectChange = this.props.onSelectChange;
    this.setState({ selectedRowKeys }, () => {
      if (onSelectChange)onSelectChange(this.state.selectedRowKeys, selectedRows);
    });
  }

  onSelect() {
    const onSelect = this.props.onSelect;
    if (onSelect) onSelect();
  }

  onSelectAll() {
    const onSelectAll = this.props.onSelectAll;
    if (onSelectAll) onSelectAll();
  }

  onPageSizeChange(current, pageSize) {
    // console.info(current, pageSize);
    const { onPageSizeChange, onPageChange, page } = this.props;
    if (onPageSizeChange) {
      onPageSizeChange(current, pageSize);
    } else if (onPageChange) {
      onPageChange({ ...page, pageSize, pageNo: 1 });
    }
  }

  onPageChange(pageNo) {
    const { onPageChange, page } = this.props;
    // const { pageSize, total } = page;
    if (onPageChange) onPageChange({ ...page, pageNo });
  }

  render() {
    let { page, columns, data, pagination, rowSelection, paginationStyle, rowKey, scroll, ...others } = this.props;
    let scrollY = false;
    const { onSelectChange, onSelect, onSelectAll, onPageSizeChange, onPageChange } = this;
    page = page || {};
    const pageSize = page.pageSize || 10;
    if (pageSize > 10) scrollY = 360;
    if (!(pagination === false)) {
      if (paginationStyle === 'mini') {
        pagination = {
          size: 'small',
          current: page.pageNo || 1,
          pageSize,
          total: page.total || 0,
          onChange: onPageChange.bind(this),
        };
      } else {
        pagination = {
          total: page.total || 0,
          current: page.pageNo || 1,
          pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal(total, range) {
            return `第${range[0]}-${range[1]}条  共 ${total} 条`;
          },
          onShowSizeChange: onPageSizeChange.bind(this),
          onChange: onPageChange.bind(this),
        };
      }
    }
    // console.log('rowSelection in CommonTable:', rowSelection);
    let realRowSelection = null;
    if (rowSelection !== false) {
      realRowSelection = rowSelection || {};
      realRowSelection = { ...realRowSelection,
        onChange: this.onSelectChange.bind(this),
        // selectedRowKeys: this.state.selectedRowKeys,
      };
    }
    // console.log('realRowSelection in CommonTable:', realRowSelection);
    // const rowClass = function(){return styles.row;} rowClassName={rowClass}
    return (
      <Table
        rowKey={rowKey || 'id'}
        className={styles.common}
        scroll={scroll || { x: false, y: scrollY }}
        dataSource={data}
        rowSelection={realRowSelection}
        columns={columns}
        pagination={pagination}
        {...others}
      />
    );
  }
}

export default CommonTable;

