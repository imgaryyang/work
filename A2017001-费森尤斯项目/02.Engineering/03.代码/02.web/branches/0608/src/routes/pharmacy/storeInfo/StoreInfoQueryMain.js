import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './StoreInfoSearchBar';
import Tab from './StoreInfoQueryTab';

class StoreInfoQueryMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['DRUG_TYPE', 'DRUG_QUALITY'],
    });

    this.props.dispatch({
      type: 'storeInfoQuery/load',
    });
  }

  render() {
    const self = this;
    const { data, page, spin, activeKey, tabArray, record, searchObjs } = this.props.storeInfoQuery;
    const { dicts, depts, deptsIdx } = this.props.utils;

    const setSearchObjs = (searchObj) => {
      self.props.dispatch({
        type: 'storeInfoQuery/setSearchObjs',
        payload: searchObj,
      });
    };
    const onSearch = (values) => {
      self.props.dispatch({
        type: 'storeInfoQuery/load',
        payload: { query: values },
      });
    };
    const resetPage = () => {
      self.props.dispatch({
        type: 'storeInfoQuery/resetPage',
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
  ({ base, storeInfoQuery, utils }) => ({ base, storeInfoQuery, utils }),
)(StoreInfoQueryMain);
