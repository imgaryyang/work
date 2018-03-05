import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './InStoreDetailSearchBar';
import List from './InStoreDetailList';

class InStoreDetailMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['DRUG_TYPE', 'IN_TYPE'],
    });
    this.props.dispatch({
      type: 'inStoreDetail/searchDetail',
    });
  }
  render() {
    const { dispatch } = this.props;
    const { detailData, detailPage, isSpin, detailSearchObjs } = this.props.inStoreDetail;
    const { dicts } = this.props.utils;
    const { wsHeight } = this.props.base;

    const searchBarProps = {
      dicts,
      detailSearchObjs,
      dispatch,
    };

    const listProps = {
      detailData,
      detailPage,
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

export default connect(({ inStoreDetail, utils, base }) => ({ inStoreDetail, utils, base }))(InStoreDetailMain);
