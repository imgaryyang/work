import _ from 'lodash';
import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, notification } from 'antd';
import { connect } from 'dva';
import PayCounter from '../../../components/PayCounter';

const FormItem = Form.Item;

class SearchBarFoot extends Component {

  state = {
    medicalCardRequired: true,
    checked: true,
    disabled: false,
    inputValue: '',
    payInfo: {
      namespace: 'outpatientCharge',
      title: '门诊费用收银台',
      orderDesc: '门诊费',
    },
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'outpatientCharge/setState',
      payload: { form: this.props.form },
    });
  }

  componentWillReceiveProps(nextProps) {
    this.handleRegNotify(nextProps.outpatientCharge.regResult);
    this.handlePayNotify(nextProps.outpatientCharge.payResult);
  }

  onNotifyClose() {
    this.props.dispatch({
      type: 'payCounter/setState',
      payload: { isVisible: false },
    });
  }

  /* 挂号提示信息 */
  handleRegNotify(result) {
    if (result) {
      const { success } = result;
      if (!_.isEmpty(result)) {
        if (!success) {
          notification.error({
            message: '通知信息',
            description: '收费失败！',
            duration: 4,
          });
        }
        this.props.dispatch({
          type: 'register/setState',
          payload: { regResult: {} },
        });
      }
    }
  }

  /* 支付提示信息 */
  handlePayNotify(result) {
    if (result) {
      const { success } = result;
      if (!_.isEmpty(result)) {
        if (success) {
          notification.success({
            message: '通知信息',
            description: '收费成功！',
            duration: 4,
            onClose: this.onNotifyClose.bind(this),
          });
          this.handleReset();
        } else {
          notification.error({
            message: '通知信息',
            description: '支付失败！',
            duration: 4,
            onClose: this.onNotifyClose.bind(this),
          });
        }
        this.props.dispatch({
          type: 'outpatientCharge/setState',
          payload: { payResult: {} },
        });
      }
    }
  }

  handleReset() {
    this.props.dispatch({
      type: 'outpatientCharge/setState',
      payload: {
        userInfo: {},
        tmpItem: [],
        itemCost: 0.00,
      },
    });
    this.props.dispatch({
      type: 'outpatientCharge/getCurrentInvoice',
      invoiceType: { invoiceType: '2' },
    });
    this.props.form.resetFields();
    const orderNo = this.props.payCounter.payInfo.orderNo;
    this.props.dispatch({
      type: 'print/getPrintInfo',
      payload: { code: '005', bizId: orderNo },
    });
  }

  reset() {
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { onSubCharge, totCost, invoiceUse, onAdd } = this.props;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      style: { width: '200px' },
    };

    const payInfo = {
      payCounter: this.props.payCounter,
      dispatch: this.props.dispatch,
      ...this.state.payInfo,
    };
    return (
      <div style={{ height: '42px', paddingTop: `${(42 - 32)}px` }} >
        <Form inline>
          <Row type="flex" justify="left">
            <Col span={14}>
              <FormItem label="总额" {...formItemLayout}>
                { getFieldDecorator('totCost', { initialValue: totCost ? totCost.formatMoney(2) : '' })(<Input disabled style={{ textAlign: 'right' }} />)}
              </FormItem>
              <FormItem label="发票号" {...formItemLayout}>
                { getFieldDecorator('totCost', { initialValue: invoiceUse })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={10} style={{ textAlign: 'right' }} >
              <div>
                <Button size="large" type="primary" onClick={onSubCharge} className="on-save" icon="save" style={{ marginRight: '10px' }} >
                  确定
                </Button>
                <Button size="large" onClick={onAdd} className="on-save" icon="calculator" style={{ marginRight: '10px' }} >
                  划价
                </Button>
                <Button size="large" onClick={this.handleReset.bind(this)} icon="reload" >
                  重置
                </Button>
              </div>
            </Col>
          </Row>
          <PayCounter {...payInfo} />
        </Form>
      </div>
    );
  }
}

const editorForm = Form.create()(SearchBarFoot);
export default connect(
  ({ outpatientCharge, payCounter }) => ({ outpatientCharge, payCounter }))(editorForm);
