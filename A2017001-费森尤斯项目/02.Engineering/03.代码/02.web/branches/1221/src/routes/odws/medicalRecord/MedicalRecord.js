/**
 * 门诊电子病历
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import MedicalRecordTemplate from './MedicalRecordTemplate';
import MedicalRecordEdit from './MedicalRecordEdit';

import styles from './MedicalRecord.less';

const { Sider, Content } = Layout;

class MedicalRecord extends Component {

  componentWillMount() {
    // 载入病历信息
    this.props.dispatch({
      type: 'odwsMedicalRecord/loadMedicalRecord',
      payload: this.props.odws.currentReg.id,
    });
  }

  componentWillReceiveProps(props) {
    // 当前就诊人发生改变
    if (this.props.odws.currentReg.id !== props.odws.currentReg.id) {
      // 载入病历信息
      this.props.dispatch({
        type: 'odwsMedicalRecord/loadMedicalRecord',
        payload: props.odws.currentReg.id,
      });
    }
  }

  render() {
    const { odwsMedicalRecord } = this.props;
    const { spin } = odwsMedicalRecord;
    return (
      <Spin spinning={spin} style={{ width: '100%', height: '100%' }} >
        <Layout className={styles.mainLayout} >
          <Sider >
            <MedicalRecordTemplate />
          </Sider>
          <Content >
            <MedicalRecordEdit />
          </Content>
        </Layout>
      </Spin>
    );
  }
}

export default connect(
  ({ odws, odwsMedicalRecord, base }) => ({ odws, odwsMedicalRecord, base }),
)(MedicalRecord);

