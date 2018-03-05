import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './RegFreeSearchBar';
import List from './RegFreeList';

class RegFreeMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['REG_LEVEL', 'FEE_CODE'],
    });

    this.props.dispatch({
      type: 'regFree/loadItemInfo',
    });
  }

  render() {
    const self = this;
    const { dicts } = this.props.utils;
    const { data, page, isSpin, selectedRowKeys, itemInfoData } = this.props.regFree;
    const listProps = {
      data,
      page,
      dicts,
      dispatch: self.props.dispatch,
    };
    const searchBarProps = {
      selectedRowKeys,
      itemInfoData,
      dicts,
      onSearch(values) {
        self.props.dispatch({
          type: 'regFree/load',
          payload: { query: values },
        });
        self.props.dispatch({
          type: 'utils/initDicts',
          payload: ['REG_LEVEL', 'FEE_CODE'],
        });
      },
      setSearchObjs(searchObj) {
        self.props.dispatch({
          type: 'regFree/setSearchObjs',
          payload: searchObj,
        });
      },
    };
    return (
      <Spin spinning={isSpin}>
        <SearchBar {...searchBarProps} />
        <List {...listProps} />
      </Spin>
    );
  }
}

export default connect(({ regFree, utils }) => ({ regFree, utils }))(RegFreeMain);
