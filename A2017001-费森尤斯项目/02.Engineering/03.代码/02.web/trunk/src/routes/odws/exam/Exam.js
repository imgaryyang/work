/**
 * 检查
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

import styles from './Exam.less';

class Exam extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    const { odwsExam } = this.props;
    const { spin } = odwsExam;
    return (
      <Spin spinning={spin} style={{ width: '100%', height: '100%' }} >
        Exam
      </Spin>
    );
  }
}

export default connect(
  ({ odws, odwsExam, base }) => ({ odws, odwsExam, base }),
)(Exam);

