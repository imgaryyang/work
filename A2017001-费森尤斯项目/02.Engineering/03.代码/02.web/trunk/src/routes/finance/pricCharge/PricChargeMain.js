import React, { Component } from 'react';
import { Spin, Row, Col } from 'antd';
import { connect } from 'dva';
import PricChargeLeft from './PricChargeLeft';
import PricChargeRight from './PricChargeRight';


class PricChargeMain extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'pricChargeModel/getCurrentInvoice',
      invoiceType: { invoiceType: '2' },
    });
    this.props.dispatch({
      type: 'pricChargeModel/getRecipeId',
    });
  }
  render() {
    const { spin } = this.props.pricChargeModel;
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
  ({ pricChargeModel }) => ({ pricChargeModel }))(PricChargeMain);
