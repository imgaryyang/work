import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './RegReportSearchBar';
import List from './RegReportList';

class RegReportMain extends Component {
  render() {
    const { dispatch } = this.props;
    const { data, page, isSpin, searchObjs } = this.props.regReport;
    const { dicts } = this.props.utils;
    const { wsHeight } = this.props.base;

    const searchBarProps = {
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

export default connect(({ regReport, base, utils }) => (
  { regReport, base, utils }),
)(RegReportMain);
