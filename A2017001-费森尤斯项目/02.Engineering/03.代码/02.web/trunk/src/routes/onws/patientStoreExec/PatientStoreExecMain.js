import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import List from './PatientStoreExecList';
import PatStoreRecordMain from './PatStoreRecordMain';
import PatStoreConfirm from './PatStoreConfirm';
import MatRecordDetail from './MatRecordDetail';
import SearchBar from './PatientStoreExecSearchBar';

class PatientStoreExecMain extends React.Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'patientStoreExec/load',
    });
  }

  render() {
    const { isSpin, patient, data, page } = this.props.patientStoreExec;
    const { dispatch } = this.props;
    const searchProps = {
      dispatch,
      patient,
      data,
      page,
    };
    return (
      <Spin spinning={isSpin} >
        <SearchBar {...searchProps} />
        <List {...searchProps} />
        <PatStoreRecordMain />
        <PatStoreConfirm />
        <MatRecordDetail />
      </Spin>
    );
  }
}
export default connect(({ patientStoreExec }) => ({ patientStoreExec }))(PatientStoreExecMain);
