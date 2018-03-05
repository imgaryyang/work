import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './AdviceSearchBar';
import List from './AdviceList';
// import Editor from './AdviceEditor';

class AdviceMain extends Component {

  render() {
    const { dispatch } = this.props;
    const { dicts } = this.props.utils;
    const { printTemplate, printData } = this.props.print;
    const { data, page, isSpin, selectedRowKeys, searchObjs, patient } = this.props.advice;
    const listProps = {
      data,
      page,
      dicts,
      dispatch,
    };
    const searchBarProps = {
      selectedRowKeys,
      searchObjs,
      patient,
      dispatch,
      printTemplate,
      printData,
    };
    return (
      <Spin spinning={isSpin}>
        <SearchBar {...searchBarProps} />
        <List {...listProps} />
      </Spin>
    );
  }
}

export default connect(({ advice, utils, print }) => ({ advice, utils, print }))(AdviceMain);
