import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import { connect } from 'dva';
import PricChargeLeft from './PricChargeLeft';
import PricChargeTop from './PricChargeTop';
import PricChargeFoot from './PricChargeFoot';
import PricChargeList from './PricChargeList';

class PricChargeMain extends Component {

  handleCancel() {
    this.props.dispatch({
      type: 'outpatientCharge/setState',
      payload: { record: null },
    });
  }

  render() {
    const { wsHeight } = this.props.base;
    const leftCardHeight = wsHeight - 6 - 53;
    const rightCardHeight = leftCardHeight - 111 - 10 - 42;
    return (
      <Row>
        <Col span={4} style={{ padding: '3px', paddingRight: '5px' }} >
          <PricChargeLeft cardHeight={leftCardHeight} />
        </Col>
        <Col span={20} style={{ padding: '3px', paddingLeft: '5px' }} >
          <Row type="flex" justify="left">
            <PricChargeTop />
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Card style={{ height: `${rightCardHeight}px` }} className="card-padding-5" >
              <PricChargeList innerHeight={rightCardHeight - 10} />
            </Card>
          </Row>
          <PricChargeFoot />
        </Col>
      </Row>
    );
  }
}

export default connect(
  ({ outpatientCharge, base }) => ({ outpatientCharge, base }))(PricChargeMain);
