import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';

import Styles from './Register.less';
import Editor from './RegisterEditor';
import List from './RegisterList';

class RegisterMain extends Component {
  render() {
    const { dispatch } = this.props;
    const {
      data, page, isSpin, patient, record, form,
      totalFee, regResult, payResult, isEmergency,
    } = this.props.register;
    const utils = this.props.utils;
    const { wsHeight } = this.props.base;
    const payCounter = this.props.payCounter;

    const editorProps = {
      data,
      patient,
      record,
      utils,
      wsHeight,
      totalFee,
      isEmergency,
      payCounter,
      regResult,
      payResult,
      dispatch,
    };

    const listProps = {
      data,
      page,
      utils,
      form,
      wsHeight,
      dispatch,
    };

    return (
      <Spin spinning={isSpin}>
        <Row gutter={10}>
          <Col span={8} className={Styles.leftCol}>
            <List {...listProps} />
          </Col>
          <Col span={16} className={Styles.rightCol}>
            <Editor {...editorProps} />
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default connect(({ register, utils, base, payCounter }) => (
  { register, utils, base, payCounter }
))(RegisterMain);
