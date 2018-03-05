import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './InvoiceMngSearchBar';
import List from './InvoiceMngList';

class InvoiceMngMain extends Component {
  render() {
    const { dispatch } = this.props;
    const { dicts } = this.props.utils;
    const { data, page, isSpin, searchObjs, invoiceStart, invoiceAmount,
      selectedTag, selectedRowKeys, namespace, result } = this.props.invoiceMng;
    const listProps = {
      data,
      page,
      dicts,
      dispatch,
      wsHeight: this.props.base.wsHeight,
    };
    const searchBarProps = {
      dicts,
      invoiceStart,
      invoiceAmount,
      searchObjs,
      selectedTag,
      namespace,
      selectedRowKeys,
      result,
      dispatch,
    };
    return (
      <Spin spinning={isSpin}>
        <SearchBar {...searchBarProps} />
        <List {...listProps} />
      </Spin>
    );
  }
}

export default connect(({ invoiceMng, utils, base }) => (
  { invoiceMng, utils, base }
))(InvoiceMngMain);
