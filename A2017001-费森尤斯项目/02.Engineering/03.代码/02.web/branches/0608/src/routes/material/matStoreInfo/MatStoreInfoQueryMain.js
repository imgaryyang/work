import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './StoreInfoSearchBar';
import Tab from './StoreInfoQueryTab';

class StoreInfoQueryMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['MATERIAL_TYPE'],
    });

    this.props.dispatch({
      type: 'matStoreInfoQuery/load',
    });
  }

  render() {
    const self = this;
    const { data, page, spin, activeKey, tabArray, record, searchObjs } = this.props.matStoreInfoQuery;
    const { dicts, depts, deptsIdx } = this.props.utils;

    const setSearchObjs = (searchObj) => {
      self.props.dispatch({
        type: 'matStoreInfoQuery/setSearchObjs',
        payload: searchObj,
      });
    };
    const onSearch = (values) => {
      self.props.dispatch({
        type: 'matStoreInfoQuery/load',
        payload: { query: values },
      });
    };
    const resetPage = () => {
      self.props.dispatch({
        type: 'matStoreInfoQuery/resetPage',
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
    };

    const editorProps = {
      activeKey,
      data: record,
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
  ({ base, matStoreInfoQuery, utils }) => ({ base, matStoreInfoQuery, utils }),
)(StoreInfoQueryMain);
