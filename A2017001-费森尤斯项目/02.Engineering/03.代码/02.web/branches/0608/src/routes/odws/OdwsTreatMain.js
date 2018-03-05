/**
 * 当前就诊
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { notification, Modal, Spin, Layout, Menu, Icon } from 'antd';
import moment from 'moment';

import styles from './Odws.less';

import MedicalRecord from './medicalRecord/MedicalRecord';
import History from './history/History';
import Diagnose from './diagnose/Diagnose';
import Order from './order/Order';
/* import LIS from './lis/LIS';
import Exam from './exam/Exam';
import Fee from './fee/Fee';*/
import AllergicHistory from './allergicHistory/AllergicHistory';

const { Sider, Content } = Layout;
const confirm = Modal.confirm;

/**
 * 判断日期是否当天
 */
function isToday(date) {
  return moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
}

class OdwsTreatMain extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.treatDone = this.treatDone.bind(this);
    this.treatCancel = this.treatCancel.bind(this);
  }

  componentWillMount() {
    // 载入医嘱信息
    this.props.dispatch({
      type: 'odwsOrder/loadOrders',
      payload: this.props.odws.currentReg.id,
    });
  }

  componentWillReceiveProps(props) {
    // 当前就诊人发生改变且就诊状态为“正在就诊”
    if (this.props.odws.currentReg.id !== props.odws.currentReg.id &&
      props.odws.currentReg.regState === '30' &&
      isToday(props.odws.currentReg.regTime)) {
      // 重置就诊步骤到诊断
      this.props.dispatch({
        type: 'odws/setState',
        payload: {
          treatStep: 'diagnose',
        },
      });
    }
  }

  handleClick({ key }) {
    if (key === 'treatDone') {
      this.treatDone();
      return;
    }
    if (key === 'treatCancel') {
      this.treatCancel();
      return;
    }
    // console.log(key);
    this.props.dispatch({
      type: 'odws/setState',
      payload: {
        treatStep: key,
      },
    });
  }

  /**
   * 结束就诊
   */
  treatDone() {
    // 未下诊断，不允许结束诊疗活动
    if (this.props.odwsDiagnose.diagnosis.length === 0) {
      notification.error({
        message: '警告',
        description: '您未对患者下诊断，不允许结束就诊！',
      });
      return;
    }

    this.props.dispatch({
      type: 'odws/treatDone',
    });
  }

  /**
   * 取消就诊
   */
  treatCancel() {
    // 已下诊断，不允许取消诊疗活动
    if (this.props.odwsDiagnose.diagnosis.length > 0) {
      notification.error({
        message: '警告',
        description: '您已对患者下诊断，不允许取消就诊！',
      });
      return;
    }

    confirm({
      title: '确认',
      content: '您确认要终止本次就诊吗？',
      onOk: () => {
        this.props.dispatch({
          type: 'odws/treatCancel',
        });
      },
    });
  }

  comps = {
    medicalRecord: MedicalRecord,
    history: History,
    diagnose: Diagnose,
    order: Order,
    /* lis: LIS,
    exam: Exam,
    fee: Fee,*/
    allergicHistory: AllergicHistory,
  };

  render() {
    const { odws, odwsDiagnose } = this.props;
    const { spin, odwsWsHeight, treatStep, currentReg } = odws;
    const { diagnosis } = odwsDiagnose;

    const currentComp = this.comps[odws.treatStep];
    let node = (<div />);
    try {
      node = React.createElement(currentComp);
    } catch (e) {
      node = (<div />);
      console.log(e);
    }

    // 就诊时间为当天且就诊状态为30（正在就诊）时，诊断按钮可用
    const diagnoseDisabled = !(isToday(currentReg.regTime) && currentReg.regState === '30');

    // 就诊时间为当天、就诊状态为30（正在就诊）且已开诊断时，医嘱、病历按钮可用
    const disabled = !(isToday(currentReg.regTime) && currentReg.regState === '30' && diagnosis.length > 0);

    // 就诊时间为当天且就诊状态为30（正在就诊）时，“结束就诊”和“取消就诊”按钮可用
    const showOptBtn = isToday(currentReg.regTime) && currentReg.regState === '30';

    return (
      <Spin spinning={spin} style={{ width: '100%', height: '100%' }} >
        <Layout className={styles.mainLayout} style={{ overflow: 'visible' }} >
          <Sider width={150} >
            <Menu
              onClick={this.handleClick}
              style={{ width: '100%', height: `${odwsWsHeight}px` }}
              defaultSelectedKeys={['diagnose']}
              selectedKeys={[treatStep]}
              mode="inline"
              className={`${styles.menu} treat-nav-menu`}
            >
              <Menu.Item key="diagnose" disabled={diagnoseDisabled} ><Icon type="code-o" />诊断</Menu.Item>
              <Menu.Item key="order" disabled={disabled} ><Icon type="paper-clip" />医嘱开立</Menu.Item>
              <Menu.Item key="medicalRecord" disabled={disabled} ><Icon type="edit" />门诊病历</Menu.Item>
              {/* <Menu.Item key="lis" disabled={disabled} ><Icon type="filter" />检验申请</Menu.Item>
              <Menu.Item key="exam" disabled={disabled} ><Icon type="picture" />检查申请</Menu.Item>
              <Menu.Item key="fee" disabled={disabled} ><Icon type="credit-card" />费用汇总</Menu.Item>*/}
              <Menu.Item key="history"><Icon type="bars" />就诊记录</Menu.Item>
              <Menu.Item key="allergicHistory" ><Icon type="exception" />过敏史</Menu.Item>
              {
                showOptBtn ? (
                  <Menu.Item key="treatDone" className="treatDoneBtn" ><Icon type="logout" />结束就诊</Menu.Item>
                ) : null
              }
              {
                showOptBtn ? (
                  <Menu.Item key="treatCancel" className="treatCancelBtn" ><Icon type="close-circle-o" />取消就诊</Menu.Item>
                ) : null
              }
            </Menu>
          </Sider>
          <Content >
            {node}
          </Content>
        </Layout>
      </Spin>
    );
  }
}

export default connect(
  ({ odws, odwsDiagnose, base }) => ({ odws, odwsDiagnose, base }),
)(OdwsTreatMain);

