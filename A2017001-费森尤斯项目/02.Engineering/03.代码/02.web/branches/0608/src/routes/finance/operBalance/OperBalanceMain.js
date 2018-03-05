import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import List from './OperBalanceList';
import SearchBar from './OperBalanceSearchBar';

class OperBalanceMain extends Component {
  render() {
    const { dispatch } = this.props;
    const { dicts } = this.props.utils;
    const { data, page, isSpin, selectedTag, namespace, result, selectedRowKeys, searchObjs }
      = this.props.operBalance;

    const searchBarProps = {
      dicts,
      searchObjs,
      selectedTag,
      namespace,
      selectedRowKeys,
      result,
      dispatch,
    };
    const listProps = {
      data,
      page,
      dicts,
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

export default connect(({ operBalance, utils }) => ({ operBalance, utils }))(OperBalanceMain);
