import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SearchBar from './MonthCheckOperBar';
import List from './MonthCheckList';

class MatMonthCheckMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['MATERIAL_TYPE', 'STOP_BOOL'],
    });

    this.props.dispatch({
      type: 'matMonthCheck/findTimeList',
    });

    this.props.dispatch({
      type: 'matMonthCheck/load',
    });
  }

  render() {
    const self = this;
    const { data, page, spin, searchObjs, checkTimeList } = this.props.matMonthCheck;
    const { dicts, depts, deptsIdx } = this.props.utils;

    const setSearchObjs = (searchObj) => {
      self.props.dispatch({
        type: 'matMonthCheck/setSearchObjs',
        payload: searchObj,
      });
    };
    const onSearch = (values) => {
      self.props.dispatch({
        type: 'matMonthCheck/load',
        payload: { query: values },
      });
    };
    const resetPage = () => {
      self.props.dispatch({
        type: 'matMonthCheck/resetPage',
      });
    };

    const searchProps = {
      checkTimeList,
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
  ({ base, matMonthCheck, utils }) => ({ base, matMonthCheck, utils }),
)(MatMonthCheckMain);
