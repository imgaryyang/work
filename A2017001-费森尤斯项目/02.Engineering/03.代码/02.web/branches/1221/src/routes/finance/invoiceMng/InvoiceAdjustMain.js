import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './InvoiceAdjustSearchBar';
import List from './InvoiceAdjustList';
import Editor from './InvoiceAdjustEditor';

class InvoiceAdjustMain extends Component {
  render() {
    const { dispatch } = this.props;
    const { dicts, record } = this.props.utils;
    const {
      data, page, isSpin, namespace, searchObjs,
      visible, selectedRowKeys, formCache, invoiceType,
    } = this.props.invoiceAdjust;
    const listProps = {
      data,
      page,
      dicts,
      dispatch,
    };
    const searchBarProps = {
      selectedRowKeys,
      dicts,
      searchObjs,
      namespace,
      invoiceType,
      dispatch,
    };
    const editorProps = {
      record,
      isSpin,
      visible,
      namespace,
      formCache,
      dicts,
      dispatch,
    };
    return (
      <Spin spinning={isSpin}>
        <SearchBar {...searchBarProps} />
        <List {...listProps} />
        <Editor {...editorProps} />
      </Spin>
    );
  }
}

export default connect(({ invoiceAdjust, utils }) => ({ invoiceAdjust, utils }))(InvoiceAdjustMain);
