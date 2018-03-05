import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './InStoreDetailSearchBar';
import List from './InStoreDetailList';

class InStoreDetailMain extends Component {
  // componentWillMount() {
  //   this.props.dispatch({
  //     type: 'utils/initDicts',
  //     payload: ['INSTRM_TYPE'],
  //   });
  // }
  render() {
    const { dispatch } = this.props;
    const { data, page, isSpin, searchObjs } = this.props.hrpInStoreDetail;
    const { dicts } = this.props.utils;
    const { wsHeight } = this.props.base;

    const searchBarProps = {
      dicts,
      searchObjs,
      dispatch,
    };

    const listProps = {
      data,
      page,
      dicts,
      wsHeight,
      dispatch,
    };

    return (
      <Spin spinning={isSpin}>
        <SearchBar {...searchBarProps} />
        <List {...listProps} />
      </Spin>
    );
  }
}

export default connect(({ hrpInStoreDetail, utils, base }) => ({ hrpInStoreDetail, utils, base }))(InStoreDetailMain);
