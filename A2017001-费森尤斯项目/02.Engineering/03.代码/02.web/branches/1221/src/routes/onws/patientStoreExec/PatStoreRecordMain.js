import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import PatientStoreRecordList from './PatientStoreRecordList';
import PatStoreRecordDetail from './PatStoreRecordDetail';

class PatientStoreRecordMain extends React.Component {

  onCancel() {
    this.props.dispatch({
      type: 'patientStoreExec/setState',
      payload: { visible: '' },
    });
    this.props.dispatch({
      type: 'patientStoreExec/load',
    });
  }
  render() {
    const { visible, record } = this.props.patientStoreExec;
    let flag = '';
    if (record && record.itemInfo && !record.itemInfo.isgather) {
      flag = 'none';
    }
    return (
      <Modal
        title="执行单明细" visible={visible === '2'}
        footer={null}
        width={'85%'}
        height={'475px'}
        onCancel={this.onCancel.bind(this)}
      >
        <PatientStoreRecordList />
        <div style={{ display: flag }}>
          <PatStoreRecordDetail />
        </div>
      </Modal>
    );
  }
}
export default connect(({ patientStoreExec, base, utils }) => ({ patientStoreExec, base, utils }))(PatientStoreRecordMain);
