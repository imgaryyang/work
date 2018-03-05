import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import List from './PatientRecordsTemplateList';


class PatientRecordsTemplateMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['SHARE_LEVEL', 'DEPT_TYPE'],
    });
  }

  render() {
    const { spin } = this.props.patientRecordsTemplate;
    return (
      <Spin spinning={spin} >
        <List />
      </Spin>
    );
  }
}
export default connect(
  ({ patientRecordsTemplate }) => ({ patientRecordsTemplate }),
)(PatientRecordsTemplateMain);
