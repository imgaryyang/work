import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

import SearchBar from './PatientTransferSearchBar';
import PatientTransferTab from './PatientTransferTab';
// import List from './PatientTransferList';
class PatientTransfer extends Component {
  render() {
    const { patientTransferSpin } = this.props.patienttransfer;
    const { wsHeight } = this.props.base;
    return (
      <Spin spinning={patientTransferSpin}>
        <div style={{ height: `${wsHeight - 2}px`, overflow: 'hidden' }} >
          <SearchBar />
          <PatientTransferTab />
        </div>
      </Spin>
    );
  }
}

export default connect(
  ({ patienttransfer, base }) => ({ patienttransfer, base }),
)(PatientTransfer);
