import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './PhaRecipeBackSearchBar';
import List from './PhaRecipeBackList';
// import Editor from './InvoiceMngEditor';

class PhaRecipeBackMain extends Component {
  render() {
    const { dispatch } = this.props;
    const self = this;
    const { dicts } = this.props.utils;
    const { data, page, isSpin, record, notification, searchObjs,
      selectedTag, selectedRowKeys } = this.props.phaRecipe;
    const listProps = {
      data,
      page,
      dicts,
      searchObjs,
      dispatch: self.props.dispatch,
    };
    const searchBarProps = {
      selectedRowKeys,
      dicts,
      searchObjs,
      selectedTag,
      setSearchObjs(searchObj) {
        dispatch({
          type: 'phaRecipe/setSearchObjs',
          payload: searchObj,
        });
      },
      onAdd() {
        dispatch({
          type: 'phaRecipe/setState',
          payload: { record: {} },
        });
      },
      onDeleteAll() {
        if (selectedRowKeys && selectedRowKeys.length > 0) {
          dispatch({ type: 'phaRecipe/deleteSelected' });
        } else {
          notification.info({ message: '提示信息：', description: '您目前没有选择任何数据！' });
        }
      },
      onSearch(values) {
        dispatch({
          type: 'phaRecipe/load',
          payload: { query: values },
        });
      },
      setTag(tag) {
        dispatch({
          type: 'phaRecipe/setState',
          payload: { selectedTag: tag },
        });
      },
    };
    const editorProps = {
      data: record,
      dispatch: self.props.dispatch,
    };
    return (
      <Spin spinning={isSpin}>
        <SearchBar {...searchBarProps} />
        <List {...listProps} />
      </Spin>
    );
  }
}

export default connect(({ phaRecipe, utils }) => ({ phaRecipe, utils }))(PhaRecipeBackMain);
