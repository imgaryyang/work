import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import moment from 'moment';

import SearchBar from './FeeTypeSearchBar';
import List from './FeeTypeList';

class FeeType extends Component {
  componentWillMount() {
    const params = this.props.params;
    this.props.dispatch({
      type: 'financeStatistics/loadFeeType',
      payload: {
        query: { dateRange: [moment(), moment()], chanel: params.chanel },
      },
    });
    this.props.dispatch({
      type: 'financeStatistics/loadHospitalList',
    });
  }
  render() {
    const { feeTypeSpin } = this.props.financeStatistics;
    const { wsHeight } = this.props.base;
    return (
      <Spin spinning={feeTypeSpin}>
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
)(FeeType);
