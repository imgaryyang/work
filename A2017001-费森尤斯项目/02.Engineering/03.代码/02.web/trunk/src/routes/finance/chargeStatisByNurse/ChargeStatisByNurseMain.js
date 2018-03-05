import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './ChargeStatisByNurseSearchBar';
import List from './ChargeStatisByNurseList';

class ChargeStatisByNurseMain extends Component {
  render() {
    const { dispatch } = this.props;
    const { data, page, isSpin, searchObjs } = this.props.chargeStatisByNurse;
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

export default connect(({ chargeStatisByNurse, utils, base }) => ({ chargeStatisByNurse, utils, base }))(ChargeStatisByNurseMain);
