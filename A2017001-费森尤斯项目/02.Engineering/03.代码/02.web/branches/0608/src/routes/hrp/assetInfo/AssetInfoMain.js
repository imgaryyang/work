import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

import SearchBar from './AssetInfoSearchBar';
import List from './AssetInfoList';
import Editor from './AssetInfoEditor';

class AssetInfoMain extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'asset/load',
    });
    this.props.dispatch({
      type: 'utils/initDictTrees',
      payload: ['ASSETS_TYPE'],
    });
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['STOP_FLAG', 'ASSET_UNIT'],
    });
  }

  render() {
    const { dispatch } = this.props;
    const { isSpin, namespace, selectedRowKeys, searchObjs, selectedTag } = this.props.asset;
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
      utils: this.props.utils,
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
  ({ asset, utils, base }) => ({ asset, utils, base }),
)(AssetInfoMain);
