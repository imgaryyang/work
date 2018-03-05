import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './StoreInfoSearchBar';
import List from './StoreInfoSearchList';

class StoreInfoQueryMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['DRUG_TYPE', 'DRUG_QUALITY'],
    });
    const params = this.props.params;
    this.props.dispatch({
      type: 'storeInfoQuery/load',
      payload: { query: { chanel: params.chanel } },
    });

    this.props.dispatch({
      type: 'user4Opt/loadHosListData',
    });
  }

  render() {
    const self = this;
    const { data, page, spin, searchObjs } = this.props.storeInfoQuery;
    console.log(this.props.storeInfoQuery);
    const { dicts, depts, deptsIdx } = this.props.utils;
    const { hosListData } = this.props.user4Opt;

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
      dicts,
      hosListData,
      depts,
      searchObjs,
      setSearchObjs,
      onSearch,
      resetPage,
      dispatch: self.props.dispatch,
    };

    const listProps = {
      data,
      page,
      dicts,
      depts,
      deptsIdx,
      dispatch: self.props.dispatch,
      wsHeight: this.props.base.wsHeight,
    };

    return (
      <Spin spinning={spin}>
        <SearchBar {...searchProps} />
        <List {...listProps} />
      </Spin>
    );
  }
}

export default connect(
  ({ base, storeInfoQuery, utils, user4Opt }) => ({ base, storeInfoQuery, utils, user4Opt }),
)(StoreInfoQueryMain);
