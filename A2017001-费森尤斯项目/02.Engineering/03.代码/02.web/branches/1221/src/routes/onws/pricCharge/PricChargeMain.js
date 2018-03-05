import React, { Component } from 'react';
import { Spin, Row, Col } from 'antd';
import { connect } from 'dva';
import PricChargeLeft from './PricChargeLeft';
import PricChargeRight from './PricChargeRight';


class PricChargeMain extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'pricCharge/getCurrentInvoice',
      invoiceType: { invoiceType: '2' },
    });
    this.props.dispatch({
      type: 'pricCharge/getRecipeId',
    });
  }
  render() {
    const { spin } = this.props.pricCharge;
    return (
      <Spin spinning={spin}>
        <Row>
          <Col span={4} style={{ padding: '3px', paddingRight: '5px' }} >
            <PricChargeLeft />
          </Col>
          <Col span={20} style={{ padding: '3px', paddingRight: '5px' }} >
            <PricChargeRight />
          </Col>
        </Row>
      </Spin>
    );
  }
}


export default connect(
  ({ pricCharge }) => ({ pricCharge }))(PricChargeMain);
