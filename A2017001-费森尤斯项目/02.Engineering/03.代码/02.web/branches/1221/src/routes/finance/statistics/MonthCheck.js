
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

import SearchBar from './MonthCheckSearchBar';
import List from './MonthCheckList';

class MonthCheckMain extends Component {

  componentWillMount() {
    const params = this.props.params;
    this.props.dispatch({
      type: 'financeStatistics/loadMonthCheck',
      payload: {
        query: { dateRange: [moment(), moment()], chanel: params ? params.chanel : '' },
      },
    });

    this.props.dispatch({
      type: 'financeStatistics/findTimeList',
    });
  }

  render() {
    const { monthCheckSpin } = this.props.financeStatistics;
    const { wsHeight } = this.props.base;
    return (
      <Spin spinning={monthCheckSpin}>
        <div style={{ height: `${wsHeight - 2}px`, overflow: 'hidden' }} >
          <SearchBar />
          <List />
        </div>
      </Spin>
    );
  }
}

export default connect(
  ({ financeStatistics, base }) => ({ financeStatistics, base }),
)(MonthCheckMain);
