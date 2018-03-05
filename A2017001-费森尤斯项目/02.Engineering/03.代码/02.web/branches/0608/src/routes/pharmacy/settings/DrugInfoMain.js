import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './DrugInfoSearchBar';
import List from './DrugInfoList';
import Editor from './DrugInfoEditor';

class DrugInfoMain extends Component {
  render() {
    const { dispatch } = this.props;
    const {
      data, page, isSpin, visible, formCache, namespace,
      selectedRowKeys, searchObjs, selectedTag, result,
    } = this.props.drugInfo;
    const { dicts, record, shortcuts } = this.props.utils;
    const { wsHeight } = this.props.base;

    const searchBarProps = {
      selectedRowKeys,
      dicts,
      searchObjs,
      selectedTag,
      namespace,
      dispatch,
    };

    const listProps = {
      data,
      page,
      dicts,
      wsHeight,
      dispatch,
    };

    const editorProps = {
      record,
      result,
      visible,
      isSpin,
      formCache,
      namespace,
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

export default connect(({ drugInfo, utils, base }) => ({ drugInfo, utils, base }))(DrugInfoMain);
