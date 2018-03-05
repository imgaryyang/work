/**
 * 诊疗历史
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import ShadowDiv from '../../../components/ShadowDiv';

import TreatList from './TreatList';
import TreatDetail from './TreatDetail';

import styles from './History.less';

const { Sider, Content } = Layout;

class History extends Component {

  componentWillMount() {
    // 载入诊疗历史信息
    if (this.props.odws.currentReg.patient) {
      this.props.dispatch({
        type: 'odwsHistory/loadHistory',
        payload: {
          query: {
            patientCode: this.props.odws.currentReg.patient.patientId,
            regState: '31',
          },
        },
      });
    }
  }

  componentWillReceiveProps(props) {
    // 当前就诊人发生改变
    if (this.props.odws.currentReg.id !== props.odws.currentReg.id) {
      // 载入诊疗历史信息
      this.props.dispatch({
        type: 'odwsHistory/loadHistory',
        payload: {
          query: {
            patientCode: props.odws.currentReg.patient.patientId,
            regState: '31',
          },
        },
      });
    }
  }

  render() {
    const { odwsHistory } = this.props;
    const { spin } = odwsHistory;
    return (
      <Spin spinning={spin} style={{ width: '100%', height: '100%' }} >
        <Layout className={styles.mainLayout} >
          <Sider width={350} >
            <TreatList />
          </Sider>
          <Content >
            <ShadowDiv >
              <TreatDetail />
            </ShadowDiv>
          </Content>
        </Layout>
      </Spin>
    );
  }
}

export default connect(
  ({ odws, odwsHistory, base }) => ({ odws, odwsHistory, base }),
)(History);

