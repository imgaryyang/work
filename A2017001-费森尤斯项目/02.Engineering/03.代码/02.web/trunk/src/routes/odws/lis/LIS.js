/**
 * 检验
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

import styles from './LIS.less';

class LIS extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    const { odwsLis } = this.props;
    const { spin } = odwsLis;
    return (
      <Spin spinning={spin} style={{ width: '100%', height: '100%' }} >
        LIS
      </Spin>
    );
  }
}

export default connect(
  ({ odws, odwsLis, base }) => ({ odws, odwsLis, base }),
)(LIS);

