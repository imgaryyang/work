import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import moment from 'moment';

import SearchBar from './TotalFeeSearchBar';
import List from './TotalFeeList';

class TotalFee extends Component {

  componentWillMount() {
    const params = this.props.params;
    console.log(params);
    this.props.dispatch({
      type: 'financeStatistics/loadTotalFee',
      payload: {
        query: { dateRange: [moment(), moment()], chanel: params.chanel },
      },
    });
    this.props.dispatch({
      type: 'financeStatistics/loadHospitalList',
    });
  }

  render() {
    const { totalFeeSpin } = this.props.financeStatistics;
    const { wsHeight } = this.props.base;
    return (
      <Spin spinning={totalFeeSpin}>
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
)(TotalFee);
