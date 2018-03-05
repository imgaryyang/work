import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './StoreInfoOperBar';
import List from './StoreInfoList';

class InstrmStoreInfoMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['MATERIAL_TYPE', 'STOP_BOOL'],
    });

    this.props.dispatch({
      type: 'instrmStoreInfo/load',
    });
  }
  render() {
    const self = this;
    const { data, page, spin, searchObjs, updateRow } = this.props.instrmStoreInfo;
    const { dicts, depts, deptsIdx } = this.props.utils;
    const setSearchObjs = (searchObj) => {
      self.props.dispatch({
        type: 'instrmStoreInfo/setSearchObjs',
        payload: searchObj,
      });
    };
    const onSearch = (values) => {
      self.props.dispatch({
        type: 'instrmStoreInfo/load',
        payload: { query: values },
      });
    };
    const resetPage = () => {
      self.props.dispatch({
        type: 'instrmStoreInfo/resetPage',
      });
    };

    const searchProps = {
      dicts,
      depts,
      searchObjs,
      setSearchObjs,
      onSearch,
      resetPage,
      updateRow,
      dispatch: self.props.dispatch,
    };

    const tabProps = {
      dispatch: self.props.dispatch,
      wsHeight: this.props.base.wsHeight,
      searchObjs,
      onSearch,
      setSearchObjs,
      resetPage,
      data,
      page,
      dicts,
      depts,
      deptsIdx,
      utils: this.props.utils,
    };

    return (
      <Spin spinning={spin}>
        <SearchBar {...searchProps} />
        <List {...tabProps} />
      </Spin>
    );
  }
}

export default connect(
  ({ base, instrmStoreInfo, utils }) => ({ base, instrmStoreInfo, utils }),
)(InstrmStoreInfoMain);
