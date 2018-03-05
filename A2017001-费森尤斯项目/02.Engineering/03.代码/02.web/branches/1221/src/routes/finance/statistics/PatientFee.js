import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

import SearchBar from './PatientFeeSearchBar';
import List from './PatientFeeList';

class PatientFee extends Component {
  render() {
    const { patientFeeSpin } = this.props.financeStatistics;
    const { wsHeight } = this.props.base;
    return (
      <Spin spinning={patientFeeSpin}>
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
)(PatientFee);
