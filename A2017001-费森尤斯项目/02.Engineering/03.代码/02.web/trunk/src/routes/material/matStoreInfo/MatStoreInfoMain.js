import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './StoreInfoOperBar';
import Tab from './StoreInfoTab';

class MatStoreInfoMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['MATERIAL_TYPE', 'STOP_BOOL'],
    });

    this.props.dispatch({
      type: 'matStoreInfo/load',
    });
  }

  render() {
    const self = this;
    const { data, page, spin, activeKey, tabArray, searchObjs, updateRow } = this.props.matStoreInfo;
    const { dicts, depts, deptsIdx } = this.props.utils;

    const setSearchObjs = (searchObj) => {
      self.props.dispatch({
        type: 'matStoreInfo/setSearchObjs',
        payload: searchObj,
      });
    };
    const onSearch = (values) => {
      self.props.dispatch({
        type: 'matStoreInfo/load',
        payload: { query: values },
      });
    };
    const resetPage = () => {
      self.props.dispatch({
        type: 'matStoreInfo/resetPage',
      });
    };

    const searchProps = {
      activeKey,
      dicts,
      depts,
      searchObjs,
      setSearchObjs,
      onSearch,
      resetPage,
      updateRow,
      dispatch: self.props.dispatch,
    };

    const listProps = {
      data,
      page,
      dicts,
      depts,
      deptsIdx,
      activeKey,
      dispatch: self.props.dispatch,
      wsHeight: this.props.base.wsHeight,
    };

    const tabProps = {
      tabArray,
      dispatch: self.props.dispatch,
      searchObjs,
      onSearch,
      setSearchObjs,
      listProps,
      resetPage,
    };

    return (
      <Spin spinning={spin}>
        <SearchBar {...searchProps} />
        <Tab {...tabProps} />
      </Spin>
    );
  }
}

export default connect(
  ({ base, matStoreInfo, utils }) => ({ base, matStoreInfo, utils }),
)(MatStoreInfoMain);
