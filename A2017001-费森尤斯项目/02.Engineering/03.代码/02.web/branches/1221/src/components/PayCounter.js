import React, { PropTypes, Component } from 'react';
import { Modal, Row, Col, Button, Form, Steps, Icon, Radio, Progress, Spin } from 'antd';
import _ from 'lodash';
import Styles from './PayCounter.less';
import NumberInput from '../components/NumberInput';
import cashIconN from '../assets/image/pay/cash_btn_icon_n.png';
import alipayIconN from '../assets/image/pay/alipay_btn_icon_n.png';
import wepayIconN from '../assets/image/pay/wepay_btn_icon_n.png';
import unionPayIconN from '../assets/image/pay/unionpay_btn_icon_n.png';
// import alipayQrcode from '../assets/image/pay/alipay-QR-Code.png';

const Step = Steps.Step;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;

/**
 * @Author xlbd
 * @Desc PayCounter 收银台
 */
class PayCounter extends Component {

  static propTypes = {

    /**
     * payCounter modal
     */
    payCounter: PropTypes.object,

    /**
     * dispatch 方法
     */
    dispatch: PropTypes.func,

    /**
     * namespace 调用收银台的model的namespace
     */
    namespace: PropTypes.string,

    /**
     * title 收银台标题
     */
    title: PropTypes.string,

    /**
     * orderDesc 订单描述
     */
    orderDesc: PropTypes.string,

  };

  state = {
    newKey: _.random(1000),
    steps: [{
      title: '创建订单',
    }, {
      title: '选择支付方式',
    }, {
      title: '支付成功',
    }],
    payChannel: [{
      code: '1',
      name: '现金支付',
      img: cashIconN,
      class: Styles.cash,
    }, {
      code: '8',
      name: '支付宝支付',
      img: alipayIconN,
      class: Styles.alipay,
    }, {
      code: '9',
      name: '微信支付',
      img: wepayIconN,
      class: Styles.wepay,
    }, {
      code: 'unionpay',
      name: '银联支付',
      img: unionPayIconN,
      class: Styles.unionpay,
    }],
    activeRadio: '1',
    changeAmount: 0,
  }

  componentDidMount() {
    // this.numberInput.focus();
  }

  onRadioChange = (e) => {
    this.setState({
      activeRadio: e.target.value,
    });
  }

  onCurrencyChange = (value) => {
    const paidAmount = parseFloat(value || 0);
    const { amt } = this.props.payCounter.payInfo;
    if (isNaN(paidAmount)) {
      return;
    }
    const reg = /^(([1-9]\d*)(\.\d{1,2})?)$|(0\.0?([1-9]\d?))$/;
    // const reg = /^(-)?(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/;
    if ((reg.test(paidAmount)) || paidAmount === '') {
      if (paidAmount > 0.00) {
        const changeAmount = (paidAmount - amt) > 0.00 ? (paidAmount - amt) : 0.00;
        this.setState({ changeAmount });
      }
    }
  }

  handleCancel(e) {
    e.preventDefault();
    const { isPaying } = this.props.payCounter;

    if (isPaying) {
      Modal.confirm({
        title: '确认',
        content: '放弃本次收费？',
        okText: '放弃',
        cancelText: '我再看看',
        onOk: () => {
          this.handleClose();
        },
      });
    } else {
      this.handleClose();
    }
  }

  handleClose() {
    this.props.dispatch({
      type: 'payCounter/setState',
      payload: { isVisible: false },
    });
  }

  handleAfterClose() {
    // reset state
    const { isDone } = this.props.payCounter;
    const { orderNo } = this.props.payCounter.payInfo;
    this.setState({ changeAmount: 0 });
    if (!isDone) {
      this.props.dispatch({
        type: 'payCounter/removeOrder',
        payload: { orderNo },
      });
    }
    this.props.dispatch({ type: 'payCounter/resetPayInfo' });
  }

  confirmPay() {
    const { namespace, payCounter } = this.props;
    const { orderNo, amt } = payCounter.payInfo;
    const payChannelCode = this.state.activeRadio;
    this.props.dispatch({
      type: 'payCounter/createSettlement',
      payload: { namespace, orderNo, amt, payChannelCode },
    });
  }

  render() {
    const { steps, payChannel, activeRadio, changeAmount } = this.state;
    const { title, orderDesc, payCounter, form } = this.props;
    const { current, isVisible, payInfo, isPaying, isDone } = payCounter;
    const { getFieldDecorator } = form;

    const channelGroup = channelData => channelData.map((item) => {
      return (
        <RadioButton value={item.code} key={item.code} className={Styles.payChannel}>
          <img alt={item.code} width="100%" src={item.img} />
          <span className={item.class}>{item.name}</span>
        </RadioButton>
      );
    });

    const checkAmount = (rule, value, callback) => {
      if (value < payInfo.amt) {
        callback('实收金额不能小于应付金额!');
      }
    };

    const formColLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };

    return (
      <Modal
        closable
        width={800}
        title={title}
        footer={null}
        style={{ top: 25 }}
        visible={isVisible}
        maskClosable={false}
        key={this.state.newKey}
        wrapClassName="pay-counter"
        onCancel={this.handleCancel.bind(this)}
        afterClose={this.handleAfterClose.bind(this)}
      >
        <Spin spinning={isPaying}>
          <Row type="flex" justify="center" align="middle" className={Styles.payInfo}>
            <Col span={24}>
              <Steps current={current}>
                {steps.map(item => <Step key={item.title} title={item.title} />)}
              </Steps>
            </Col>
          </Row>
          <hr className={Styles.payHr} />
          <Row type="flex" justify="center" align="middle" className={Styles.payInfo}>
            <Col span={12}>
              <div>项目：{orderDesc} - 订单号：{payInfo.orderNo}</div>
            </Col>
            <Col span={12} className={Styles.payInfo_amtInfo}>
              <div className={Styles.payInfo_amtInfo_layout}>
                <span>应付金额：</span>
                <span className={Styles.payInfo_amt}>{(payInfo.amt || 0.00).formatMoney()}</span>
              </div>
            </Col>
          </Row>
          <hr className={Styles.payHr} />
          <div className={Styles.payContent}>
            {
              !_.isBoolean(isDone)
              ?
              activeRadio === '1'
              ?
                <div>
                  <Row type="flex" justify="center" gutter={12}>
                    <RadioGroup onChange={this.onRadioChange.bind(this)} value={activeRadio}>
                      {channelGroup(payChannel)}
                    </RadioGroup>
                  </Row>
                  <Form className={Styles.formWrapper}>
                    <Row type="flex" justify="center" align="middle" className={Styles.payInfo}>
                      <Col span={12} className={Styles.payInfo_formCol}>
                        <FormItem label="实收金额：" {...formColLayout}>
                          {getFieldDecorator('paidAmount', {
                            rules: [{ validator: checkAmount }],
                          })(
                            <NumberInput
                              numberType="currency"
                              addonBefore="¥"
                              size="large"
                              className={Styles.payInfo_currencyInput}
                              onChange={this.onCurrencyChange.bind(this)}
                              // onPressEnter={this.onPressEnter.bind(this)}
                            />,

                            // <InputNumber
                            //   className={Styles.payInfo_currencyInput}
                            //   onChange={this.onCurrencyChange.bind(this)}
                            // />,
                          )}
                        </FormItem>
                      </Col>
                      <Col span={12} className={Styles.payInfo_amtInfo}>
                        <div className={Styles.payInfo_amtInfo_layout}>
                          <span>找零：</span>
                          <span className={Styles.payInfo_amt}>
                            {(changeAmount || 0.00).formatMoney()}
                          </span>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </div>
              :
                <Row type="flex" justify="center" gutter={12}>
                  <RadioGroup onChange={this.onRadioChange.bind(this)} value={activeRadio}>
                    {channelGroup(payChannel)}
                  </RadioGroup>
                </Row>
              :
              isDone
              ?
                <div>
                  <Row type="flex" justify="center" gutter={12}>
                    <Progress type="circle" percent={100} />
                  </Row>
                  <Row type="flex" justify="center" gutter={12} className={Styles.payContent_msg}>
                    <span>支付成功</span>
                  </Row>
                </div>
              :
                <div>
                  <Row type="flex" justify="center" gutter={12}>
                    <Progress type="circle" percent={100} status="exception" />
                  </Row>
                  <Row type="flex" justify="center" gutter={12} className={Styles.payContent_msg}>
                    <span>支付失败</span>
                  </Row>
                </div>
            }
          </div>
          <Row type="flex" gutter={24} className="action-form-footer">
            <Col span={24} className="action-form-operating">
              <Button
                size="large"
                type="primary"
                onClick={this.confirmPay.bind(this)}
                disabled={isPaying}
                className="on-save"
                style={{ display: _.isBoolean(isDone) ? isDone ? 'none' : '' : '' }}
              >
                <Icon type={isPaying ? 'loading' : 'check-circle-o'} />确认收费
              </Button>
            </Col>
          </Row>
        </Spin>
      </Modal>
    );
  }
}

export default Form.create()(PayCounter);
