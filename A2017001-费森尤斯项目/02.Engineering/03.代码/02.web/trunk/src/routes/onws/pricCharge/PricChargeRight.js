import React, { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import PricChargeTop from './PricChargeTop';
import List from './PricChargeList';
import PricChargeFoot from './PricChargeFoot';


class PricChargeRight extends Component {

  render() {
    const { wsHeight } = this.props.base;
    return (
      <div>
        <PricChargeTop />
        <Card style={{ marginTop: 10, height: `${wsHeight - 111 - 10 - 42}px` }} className="card-padding-5" >
          <List />
        </Card>
        <PricChargeFoot />
      </div>
    );
  }
}


export default connect(
  ({ pricCharge, base }) => ({ pricCharge, base }))(PricChargeRight);
