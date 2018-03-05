import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './PrintTemplateSearchBar';
import List from './PrintTemplateList';
import Editor from './PrintTemplateEditor';

class PrintTemplateMain extends Component {
  render() {
    const { dispatch } = this.props;
    const { data, page, isSpin, visible, formCache, namespace,
      selectedRowKeys, searchObjs, result } = this.props.printTemplate;
    const { dicts, record } = this.props.utils;
    const searchBarProps = {
      selectedRowKeys,
      dispatch,
      searchObjs,
    };
    const listProps = {
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
  ({ printTemplate, utils, base }) => ({ printTemplate, utils, base }),
)(PrintTemplateMain);
