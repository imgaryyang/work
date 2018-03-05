import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Tabs } from 'antd';
import Styles from './RegCheckout.less';
import CheckoutEditor from './RegCheckoutEditor';
import UnCheckoutEditor from './RegUnCheckoutEditor';
import FeeType from './RegCheckoutFeeType';
import PayWay from './RegCheckoutPayWay';

const TabPane = Tabs.TabPane;

class RegCheckoutMain extends Component {
  render() {
    const { dispatch } = this.props;
    const {
      data, feeType, payWay, isSpin,
      record, checkResult, unCheckResult, activeTab, invoiceSource,
    } = this.props.regCheckout;
    const utils = this.props.utils;
    const { wsHeight } = this.props.base;

    const editorProps = {
      data,
      record,
      utils,
      wsHeight,
      checkResult,
      unCheckResult,
      activeTab,
      invoiceSource,
      dispatch,
    };

    const feeTypeProps = {
      feeType,
      utils,
      wsHeight,
      dispatch,
    };

    const payWayProps = {
      payWay,
      utils,
      wsHeight,
      dispatch,
    };

    const onTabChange = (key) => {
      console.log(key);
      this.props.dispatch({
        type: 'regCheckout/load',
        payload: { activeTab: key, invoiceSource },
      });
    };

    return (
      <Spin spinning={isSpin}>
        <Tabs defaultActiveKey="1" onChange={onTabChange}>
          <TabPane tab="收费结账" key="1">
            <Row gutter={10}>
              <Col span={12} className={Styles.leftCol}>
                <FeeType {...feeTypeProps} />
                <PayWay {...payWayProps} />
              </Col>
              <Col span={12} className={Styles.rightCol}>
                <CheckoutEditor {...editorProps} />
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="取消结账" key="2">
            <Row gutter={10}>
              <Col span={12} className={Styles.leftCol}>
                <FeeType {...feeTypeProps} />
                <PayWay {...payWayProps} />
              </Col>
              <Col span={12} className={Styles.rightCol}>
                <UnCheckoutEditor {...editorProps} />
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Spin>
    );
  }
}

export default connect(({ regCheckout, utils, base }) => ({
  regCheckout, utils, base,
}))(RegCheckoutMain);
