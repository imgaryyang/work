import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './StoreInfoSearchBar';
import List from './StoreInfoQueryList';

class InstrmStoreInfoQueryMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDictTrees',
      payload: ['ASSETS_TYPE'],
    });

    this.props.dispatch({
      type: 'instrmStoreInfoQuery/load',
    });
  }

  onChange(key) {
    this.props.dispatch({
      type: 'instrmStoreInfoQuery/setState',
      payload: { activeKey: key },
    });
    this.props.resetPage();
    this.props.onSearch(this.props.searchObjs);
  }
  render() {
    const self = this;
    const { data, page, spin, searchObjs } = this.props.instrmStoreInfoQuery;
    const { dicts, depts, deptsIdx } = this.props.utils;

    const setSearchObjs = (searchObj) => {
      self.props.dispatch({
        type: 'instrmStoreInfoQuery/setSearchObjs',
        payload: searchObj,
      });
    };
    const onSearch = (values) => {
      self.props.dispatch({
        type: 'instrmStoreInfoQuery/load',
        payload: { query: values },
      });
    };
    const resetPage = () => {
      self.props.dispatch({
        type: 'instrmStoreInfoQuery/resetPage',
      });
    };

    const searchProps = {
      dicts,
      depts,
      searchObjs,
      setSearchObjs,
      onSearch,
      resetPage,
    };

    const tabProps = {
      data,
      page,
      dicts,
      depts,
      deptsIdx,
      dispatch: self.props.dispatch,
      wsHeight: this.props.base.wsHeight,
      searchObjs,
      onSearch,
      setSearchObjs,
      resetPage,
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
  ({ base, instrmStoreInfoQuery, utils }) => ({ base, instrmStoreInfoQuery, utils }),
)(InstrmStoreInfoQueryMain);
