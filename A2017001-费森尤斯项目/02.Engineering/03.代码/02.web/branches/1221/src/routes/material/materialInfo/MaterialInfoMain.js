import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

import SearchBar from './MaterialInfoSearchBar';
import List from './MaterialInfoList';
import Editor from './MaterialInfoEditor';

class MaterialInfoMain extends Component {
  componentWillMount() {

    const params = this.props.params;
    this.props.dispatch({
      type: 'material/setState',
      payload: {
        chanel: params.chanel,
      },
    });
  }
  
  render() {
    const { dispatch } = this.props;
    const { isSpin, namespace, selectedRowKeys, searchObjs, selectedTag } = this.props.material;
    const { dicts } = this.props.utils;
    // const { wsHeight } = this.props.base;

    const searchBarProps = {
      selectedRowKeys,
      dicts,
      searchObjs,
      selectedTag,
      namespace,
      dispatch,
    };

    /* const listProps = {
      data,
      page,
      dicts,
      wsHeight,
      dispatch,
      query,
    };*/

    /* const editorProps = {
      record,
      visible,
      editorSpin,
      formCache,
      namespace,
      dispatch,
    };*/

    return (
      <Spin spinning={isSpin}>
        <SearchBar {...searchBarProps} />
        <List />
        <Editor />
      </Spin>
    ); 
  }
}

export default connect(
  ({ material, utils, base }) => ({ material, utils, base }),
)(MaterialInfoMain);
