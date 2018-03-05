import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './InterfaceConfigSearchBar';
import List from './InterfaceConfigList';
import Editor from './InterfaceConfigEditor';

class InterfaceConfigMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['INTERFACE_TYPE'],
    });
    // 查询医院列表数据
    this.props.dispatch({ 
      type: 'interfaceconfig/loadHosListData',
      payload: {
        query: {},
      },
    });
  }

  render() {
    const { dispatch } = this.props;
    const { data, page, isSpin, visible, formCache, namespace,
      selectedRowKeys, searchObjs, result } = this.props.interfaceconfig;
    const { dicts, record } = this.props.utils;
    const searchBarProps = {
      selectedRowKeys,
      dispatch,
      searchObjs,
    };
    const listProps = {
      dicts,
      data,
      page,
      dispatch,
      wsHeight: this.props.base.wsHeight,
    };
    const editorProps = {
      record,
      result,
      isSpin,
      visible,
      formCache,
      namespace,
      dicts,
      dispatch,
      wsHeight: this.props.base.wsHeight,
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

export default connect(
  ({ interfaceconfig, utils, base }) => ({ interfaceconfig, utils, base }),
)(InterfaceConfigMain);
