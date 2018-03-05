import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './ChargeStatisByDocSearchBar';
import List from './ChargeStatisByDocList';

class ChargeStatisByDocMain extends Component {
  render() {
    const { dispatch } = this.props;
    const { data, page, isSpin, searchObjs } = this.props.chargeStatisByDoc;
    const { dicts } = this.props.utils;
    const { wsHeight } = this.props.base;

    const searchBarProps = {
      dicts,
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

export default connect(({ chargeStatisByDoc, utils, base }) => ({ chargeStatisByDoc, utils, base }))(ChargeStatisByDocMain);
