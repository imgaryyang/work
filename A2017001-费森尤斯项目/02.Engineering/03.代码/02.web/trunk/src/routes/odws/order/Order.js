/**
 * 医嘱
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout, Card } from 'antd';

import OrderTemplate from './OrderTemplate';
import OrderInput from './OrderInput';
import OrderList from './OrderList';

import styles from './Order.less';

const { Sider, Content } = Layout;

class Order extends Component {

  componentWillMount() {
    // 载入医嘱信息
    this.props.dispatch({
      type: 'odwsOrder/loadOrders',
      payload: this.props.odws.currentReg.id,
    });
  }

  componentWillReceiveProps(props) {
    // 当前就诊人发生改变
    if (this.props.odws.currentReg.id !== props.odws.currentReg.id) {
      // 载入医嘱信息
      this.props.dispatch({
        type: 'odwsOrder/loadOrders',
        payload: props.odws.currentReg.id,
      });
    }
  }

  render() {
    const { odwsOrder, odws } = this.props;
    const { spin, order } = odwsOrder;

    const { odwsWsHeight } = odws;
    // drugFlag === ‘3’ 时选择的是收费项，否则选择的是药品
    const bottomCardHeight = order.drugFlag !== '3' ?
      (odwsWsHeight - 147 - 10 - 6) :
      (odwsWsHeight - 106 - 10 - 6);

    return (
      <Spin spinning={spin} style={{ width: '100%', height: '100%' }} className={styles.spin} >
        <Layout className={styles.mainLayout} style={{ overflow: 'visible' }} >
          <Sider width={150} >
            <OrderTemplate />
          </Sider>
          <Content style={{ position: 'relative' }} >
            <Card className={styles.inputCard} >
              <OrderInput />
            </Card>
            <Card style={{ height: `${bottomCardHeight}px` }} className={styles.listCard} >
              <OrderList />
            </Card>
            <div className={styles.optFlagContainer} >
              <span className={order.id ? '' : styles.selectedOpt} >新增</span>
              <span className={order.id ? styles.selectedOpt : ''}>修改</span>
            </div>
          </Content>
        </Layout>
      </Spin>
    );
  }
}

export default connect(
  ({ odws, odwsOrder, base }) => ({ odws, odwsOrder, base }),
)(Order);

