import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './DrugInfoSearchBar';
import List from './DrugInfoList';
import Editor from './DrugInfoEditor';

class DrugInfoMain extends Component {
  componentWillMount() {
    const params = this.props.params;
    this.props.dispatch({
      type: 'drugInfo/setState',
      payload: {
        chanel: params.chanel,
      },
    });
  }

  render() {
    const { dispatch, base } = this.props;
    const {
      data, page, isSpin, visible, formCache, namespace,
      selectedRowKeys, searchObjs, selectedTag, result, chanel,
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
      chanel,
    };

    const listProps = {
      data,
      page,
      dicts,
      base,
      wsHeight,
      dispatch,
      chanel,
    };

    const editorProps = {
      record,
      result,
      visible,
      isSpin,
      base,
      formCache,
      namespace,
      shortcuts,
      dispatch,
      chanel,
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
