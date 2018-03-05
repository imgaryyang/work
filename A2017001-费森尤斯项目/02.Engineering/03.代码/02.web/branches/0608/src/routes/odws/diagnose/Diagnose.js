/**
 * 诊断
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import DiagnoseTmp from './DiagnoseTmp';
import DiagnoseList from './DiagnoseList';

import styles from './Diagnose.less';

const { Sider, Content } = Layout;

class Diagnose extends Component {

  componentWillMount() {
    // 载入诊断信息
    this.props.dispatch({
      type: 'odwsDiagnose/loadDiagnosis',
      payload: this.props.odws.currentReg.id,
    });
    // 载入常用诊断信息
    this.props.dispatch({
      type: 'odwsDiagnose/loadTopDiagnosis',
    });
  }

  componentWillReceiveProps(props) {
    // 当前就诊人发生改变
    if (this.props.odws.currentReg.id !== props.odws.currentReg.id) {
      // 载入诊断信息
      this.props.dispatch({
        type: 'odwsDiagnose/loadDiagnosis',
        payload: props.odws.currentReg.id,
      });
    }
  }

  render() {
    const { odwsDiagnose } = this.props;
    const { spin } = odwsDiagnose;
    return (
      <Spin spinning={spin} style={{ width: '100%', height: '100%' }} >
        <Layout className={styles.mainLayout} >
          <Sider >
            <DiagnoseTmp />
          </Sider>
          <Content >
            <DiagnoseList />
          </Content>
        </Layout>
      </Spin>
    );
  }
}

export default connect(
  ({ odws, odwsDiagnose, base }) => ({ odws, odwsDiagnose, base }),
)(Diagnose);

