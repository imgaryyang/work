/**
 * 诊疗历史
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import ShadowDiv from '../../../components/ShadowDiv';

import TreatList from './VisitingRecordList';
import TreatDetail from './VisitingRecordDetail';

import styles from './VisitingRecord.less';

const { Sider, Content } = Layout;

class VisitingRecordMain extends Component {

  constructor(props) {
    super(props);
  }
  componentWillMount() {
    // 载入诊疗历史信息
    if (this.props.odws.currentReg.patient) {
      this.props.dispatch({
        type: 'visitingRecord/loadHistory',
        payload: {
          query: {
            patientCode: this.props.odws.currentReg.patient.patientId,
            regState: '31',
          },
        },
      });
    }
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['REG_LEVEL', 'FEE_CODE'],
    });
    this.props.dispatch({
      type: 'odws/setState',
      payload: { odwsWsHeight: this.props.base.wsHeight - 37 - 17 - 6 },
    });
  }

  componentWillReceiveProps(props) {
    // 当前就诊人发生改变
    if (this.props.odws.currentReg.id !== props.odws.currentReg.id) {
      // 载入诊疗历史信息
      this.props.dispatch({
        type: 'visitingRecord/loadHistory',
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
    const { odwsHistory, odwsWsHeight, visitRecord } = this.props;
    const { spin } = visitRecord;
    const visitingData = {
      odwsHistory,
      page:this.props.odwsHistory.page,
      odwsWsHeight,
    };
    const VisitingDetail = {
      odwsHistory,
      odwsWsHeight,
    };
    return (
      <Spin spinning={spin} style={{ width: '100%', height: this.props.odwsWsHeight+`px` }} >
        <Layout className={styles.mainLayout} >
          <Sider width={350} >
            <TreatList {...visitingData} />
          </Sider>
          <Content >
            <ShadowDiv >
              <TreatDetail {...VisitingDetail}/>
            </ShadowDiv>
          </Content>
        </Layout>
      </Spin>
    );
  }
}

export default connect(
  ({ odws, odwsHistory, base, visitRecord }) => ({ odws, odwsHistory, base, visitRecord }),
)(VisitingRecordMain);

