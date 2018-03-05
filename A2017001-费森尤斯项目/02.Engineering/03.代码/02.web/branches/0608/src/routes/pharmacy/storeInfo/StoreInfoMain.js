import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './StoreInfoOperBar';
// import Editor from './StoreInfoEditor';
import Tab from './StoreInfoTab';

class StoreInfoMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['DRUG_TYPE', 'DRUG_QUALITY', 'STOP_BOOL'],
    });

    this.props.dispatch({
      type: 'storeInfo/load',
    });
  }

  render() {
    const self = this;
    const { data, page, spin, activeKey, tabArray, searchObjs, updateRow } = this.props.storeInfo;
    const { dicts, depts, deptsIdx } = this.props.utils;

    const setSearchObjs = (searchObj) => {
      self.props.dispatch({
        type: 'storeInfo/setSearchObjs',
        payload: searchObj,
      });
    };
    const onSearch = (values) => {
      self.props.dispatch({
        type: 'storeInfo/load',
        payload: { query: values },
      });
    };
    const resetPage = () => {
      self.props.dispatch({
        type: 'storeInfo/resetPage',
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

    // const editorProps = {
    //   activeKey,
    //   data: record,
    //   dispatch: self.props.dispatch,
    // };

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

        // <Editor {...editorProps} />
export default connect(
  ({ base, storeInfo, utils }) => ({ base, storeInfo, utils }),
)(StoreInfoMain);
