import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './StoreInfoSearchBar';
import List from './StoreInfoSearchList';


class StoreInfoSearchMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['MATERIAL_TYPE'],
    });

    const params = this.props.params;
    this.props.dispatch({
      type: 'matStoreInfoQuery/load',
      payload: { query: { chanel: params.chanel } },
    });

    this.props.dispatch({
      type: 'user4Opt/loadHosListData',
    });
  }

  render() {
    const self = this;
    const { data, page, spin, searchObjs } = this.props.matStoreInfoQuery;
    const { dicts, depts, deptsIdx } = this.props.utils;
    const { hosListData } = this.props.user4Opt;

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
      hosListData,
      dicts,
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
  ({ base, matStoreInfoQuery, utils, user4Opt }) => ({ base, matStoreInfoQuery, utils, user4Opt }),
)(StoreInfoSearchMain);
