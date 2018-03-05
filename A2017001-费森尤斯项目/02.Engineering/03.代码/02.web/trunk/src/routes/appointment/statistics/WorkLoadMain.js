import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './WorkLoadSearchBar';
import List from './WorkLoadList';

class WorkLoadMain extends Component {
  render() {
    const { dispatch } = this.props;
    const { data, page, isSpin, invoiceSource, searchObjs } = this.props.workLoad;
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

export default connect(({ workLoad, base, utils }) => (
  { workLoad, base, utils }),
)(WorkLoadMain);
