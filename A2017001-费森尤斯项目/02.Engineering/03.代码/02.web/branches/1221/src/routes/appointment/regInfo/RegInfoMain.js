import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './RegInfoSearchBar';
import List from './RegInfoList';
import Editor from './RegInfoEditor';

class RegInfoMain extends Component {
  render() {
    const { dispatch } = this.props;
    const { dicts } = this.props.utils;
    const { printTemplate, printData } = this.props.print;
    const {
      data, page, isSpin, selectedRowKeys, searchObjs, record, result,
      patient, payWays, visible, formCache, namespace, isModalSpin,
    } = this.props.regInfo;
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
    const editorProps = {
      result,
      record,
      isModalSpin,
      visible,
      formCache,
      namespace,
      payWays,
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

export default connect(({ regInfo, utils, print }) => ({ regInfo, utils, print }))(RegInfoMain);
