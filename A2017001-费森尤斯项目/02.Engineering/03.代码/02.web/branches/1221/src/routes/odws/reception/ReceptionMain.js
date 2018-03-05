/**
 * 门急诊医生站
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import moment from 'moment';

import ReceptionList from './ReceptionList';

class ReceptionMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'odws/loadRegInfo',
      payload: {
        query: {
          regTime: moment().format('YYYY-MM-DD'),
          regState: '21',
        },
      },
    });
  }

  render() {
    const { spin } = this.props.odws;
    return (
      <Spin spinning={spin} style={{ width: '100%', height: '100%' }} >
        <ReceptionList />
      </Spin>
    );
  }
}

export default connect(
  ({ odws }) => ({ odws }),
)(ReceptionMain);

