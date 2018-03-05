import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './CompanyInfoSearchBar';
import List from './CompanyInfoList';
import Editor from './CompanyInfoEditor';

class CompanyInfoMain extends Component {
  render() {
    const { dispatch } = this.props;
    const {
      data, page, isSpin, visible, formCache,
      namespace, selectedRowKeys, result,
    } = this.props.companyInfo;
    const { dicts, record, shortcuts } = this.props.utils;
    const { wsHeight } = this.props.base;

    const searchBarProps = {
      selectedRowKeys,
      dispatch,
    };

    const listProps = {
      data,
      page,
      dicts,
      dispatch,
      wsHeight,
    };

    const editorProps = {
      record,
      result,
      isSpin,
      visible,
      formCache,
      namespace,
      dicts,
      shortcuts,
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

export default connect(
  ({ companyInfo, base, utils }) => ({ companyInfo, base, utils }),
)(CompanyInfoMain);
