/**
 * 费用汇总
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

import OrderFeeList from './OrderFeeList';
import ChargeFeeList from './ChargeFeeList';

import styles from './Fee.less';

class Fee extends Component {
  render() {
    const { odwsFee } = this.props;
    const { spin } = odwsFee;
    return (
      <Spin spinning={spin} style={{ width: '100%', height: '100%' }} >
        <div style={{ padding: '3px' }} >
          <OrderFeeList />
          <ChargeFeeList />
          <div className={styles.total} >
            费用合计：
            <span>3,000.00</span>
          </div>
        </div>
      </Spin>
    );
  }
}

export default connect(
  ({ odws, odwsFee, base }) => ({ odws, odwsFee, base }),
)(Fee);

