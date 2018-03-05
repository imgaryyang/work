import _ from 'lodash';
import React, { Component } from 'react';
import { Row, Col, Button, Form, Input, notification, Icon } from 'antd';
import { connect } from 'dva';
import PayCounter from '../../../components/PayCounter';

const FormItem = Form.Item;

class PricChargeFoot extends Component {

  state = {
    medicalCardRequired: true,
    checked: true,
    disabled: false,
    inputValue: '',
    payInfo: {
      namespace: 'pricChargeModel',
      title: '门诊费用收银台',
      orderDesc: '门诊费',
    },
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'pricChargeModel/setState',
      payload: { form: this.props.form },
    });
  }

  componentWillReceiveProps(nextProps) {
    this.handleRegNotify(nextProps.pricChargeModel.regResult);
    this.handlePayNotify(nextProps.pricChargeModel.payResult);
  }

  onNotifyClose() {
    this.props.dispatch({
      type: 'payCounter/setState',
      payload: { isVisible: false },
    });
  }

  /* 挂号提示信息 */
  handleRegNotify(result) {
    if (!_.isEmpty(result)) {
      const { success } = result;
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

  /* 支付提示信息 */
  handlePayNotify(result) {
    if (!_.isEmpty(result)) {
      const { success } = result;
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
        type: 'pricChargeModel/setState',
        payload: { payResult: {} },
      });
    }
  }
  handleReset() {
    this.props.dispatch({
      type: 'pricChargeModel/setState',
      payload: {
        userInfo: {},
        tmpItem: [],
        itemCost: 0.00,
        itemData: [],
        record: 'clear',
        currentRecipe: '',
      },
    });
    this.props.dispatch({
      type: 'pricChargeModel/getCurrentInvoice',
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

  saveTemplate() {
    this.props.dispatch({
      type: 'pricChargeModel/setState',
      payload: { record: '1,2' },
    });
  }

  saveCharge() {
    this.props.dispatch({
      type: 'pricChargeModel/saveCharge',
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { itemCost, invoiceUse } = this.props.pricChargeModel;
    const { payCounter, dispatch } = this.props;
    const payInfo = {
      payCounter,
      dispatch,
      ...this.state.payInfo,
    };

    return (
      <div style={{ height: '42px', paddingTop: `${(42 - 32)}px` }} >
        <Form inline>
          <Row>
            <Col span={14}>
              <FormItem label="合计费用" >
                { getFieldDecorator('totCost', { initialValue: itemCost ? itemCost.formatMoney(2) : '' })(<Input style={{ width: 100 }} disabled />)}
              </FormItem>
              <FormItem label="当前发票号" >
                { getFieldDecorator('totCost', { initialValue: invoiceUse.invoiceUse })(<Input style={{ width: 100 }} disabled />)}
              </FormItem>
              <FormItem label="票段" >
                { getFieldDecorator('totCost', { initialValue: ((invoiceUse && invoiceUse.invoiceStart && invoiceUse.invoiceEnd) ? (invoiceUse.invoiceStart + '~' + invoiceUse.invoiceEnd) : '') })(<Input style={{ width: 100 }} disabled />)}
              </FormItem>
            </Col>
            <Col span={10} style={{ textAlign: 'right' }} >
              <Button size="large" type="primary" onClick={this.saveCharge.bind(this)} icon="pay-circle-o" style={{ marginRight: '10px' }} >收费</Button>
              <Button size="large" onClick={this.handleReset.bind(this)}>
                <Icon type="reload" />重置</Button>
            </Col>
          </Row>
          <PayCounter {...payInfo} />
        </Form>
      </div>
    );
  }
}

const editorForm = Form.create()(PricChargeFoot);
export default connect(
  ({ pricChargeModel, payCounter }) => ({ pricChargeModel, payCounter }))(editorForm);
