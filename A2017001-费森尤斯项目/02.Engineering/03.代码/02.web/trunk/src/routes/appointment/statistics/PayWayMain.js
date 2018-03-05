import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './PayWaySearchBar';
import List from './PayWayList';

class PayWayMain extends Component {
  render() {
    const { dispatch } = this.props;
    const { data, page, isSpin, invoiceSource, searchObjs, title } = this.props.payWay;
    const { dicts } = this.props.utils;
    const { wsHeight } = this.props.base;

    const searchBarProps = {
      invoiceSource,
      searchObjs,
      dispatch,
    };

    const listProps = {
      data,
      page,
      dicts,
      title,
      wsHeight,
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

export default connect(({ payWay, base, utils }) => (
  { payWay, base, utils }),
)(PayWayMain);
