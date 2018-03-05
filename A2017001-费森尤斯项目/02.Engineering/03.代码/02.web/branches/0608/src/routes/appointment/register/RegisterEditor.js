import React, { Component } from 'react';
import { Row, Col, Form, Input, DatePicker, Card,
  Checkbox, Button, notification, Icon } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import DictRadioGroup from '../../../components/DictRadioGroup';
import MedicalCard from '../../../components/ScanMedicalCardInput';
import PayCounter from '../../../components/PayCounter';
import NumberInput from '../../../components/NumberInput';
import Styles from './Register.less';

const FormItem = Form.Item;

class EditorForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
    this.handleReg = ::this.handleReg;
    this.onNotifyClose = ::this.onNotifyClose;
    this.readMedicalCardDone = ::this.readMedicalCardDone;
  }

  state = {
    medicalCardRequired: true,
    disabled: false,
    payInfo: {
      namespace: 'register',
      title: '挂号收银台',
      orderDesc: '挂号费',
    },
  };

  componentWillMount() {
    this.props.dispatch({
      type: 'register/setState',
      payload: { form: this.props.form },
    });
  }

  componentWillReceiveProps(nextProps) {
    this.handleRegNotify(nextProps.regResult);
    this.handlePayNotify(nextProps.payResult);
  }

  onNotifyClose() {
    this.props.dispatch({
      type: 'payCounter/setState',
      payload: { isVisible: false },
    });
  }

  /* 挂号提示信息 */
  handleRegNotify(result) {
    const { success, msg } = result;
    if (!_.isEmpty(result)) {
      if (!success) {
        notification.error({
          message: '通知信息',
          description: `挂号失败：[${msg}]`,
          duration: 2,
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
    const { success } = result;
    if (!_.isEmpty(result)) {
      if (success) {
        notification.success({
          message: '通知信息',
          description: '挂号成功！',
          duration: 2,
          onClose: this.onNotifyClose,
        });
        this.handleReset();
      } else {
        notification.error({
          message: '通知信息',
          description: '支付失败！',
          duration: 2,
          onClose: this.onNotifyClose,
        });
      }
      this.props.dispatch({
        type: 'register/setState',
        payload: { payResult: {} },
      });
    }
  }

  handleReset() {
    this.props.dispatch({
      type: 'register/setState',
      payload: {
        patient: {},
        record: {},
        totalFee: 0.00,
      },
    });
    this.props.form.resetFields();
    const orderNo = this.props.payCounter.payInfo.orderNo;
    this.props.dispatch({
      type: 'print/getPrintInfo',
      payload: { code: '001', bizId: orderNo },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.dispatch({ type: 'register/save', params: values });
    });
  }

  handleReg() {
    this.props.dispatch(routerRedux.push('/card/patient'));
  }

  readMedicalCardDone(info) {
    this.props.form.resetFields(['medicalCardNo']);
    this.props.dispatch({
      type: 'register/setState',
      payload: {
        patient: { ...this.props.patient, ...info },
      },
    });
  }

  render() {
    const { data, patient, record, wsHeight, totalFee, dispatch, payCounter } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { dicts, depts, deptsIdx } = this.props.utils;
    const isDisabled = () => _.isEmpty(record) && totalFee <= 0.00;

    const twoColLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    const checkboxLayout = {
      wrapperCol: { span: 24 },
    };

    const onPressEnter = (e) => {
      let obj = data.find(d => d.numSourceId === e.target.value);
      obj = _.isObject(obj) ? obj : {};
      this.props.dispatch({
        type: 'register/setState',
        payload: { record: obj },
      });
      this.props.dispatch({
        type: 'register/getTotalFee',
        payload: { regLevel: obj.regLevel },
      });
    };

    const payInfo = {
      payCounter,
      dispatch,
      ...this.state.payInfo,
    };

    const onReviewFlagChange = (e) => {
      // console.log(`checked = ${e.target.checked}`);
      this.props.form.setFieldsValue({
        reviewFlag: e.target.checked,
      });
    };

    return (
      <Card style={{ height: `${wsHeight}px` }} bodyStyle={{ padding: 10 }} >
        <Form style={{ height: `${wsHeight - 60}px`, overflowY: 'scroll' }}>
          <Row>
            <Col span={24}>
              <div className={Styles.fieldSet} >
                <div />
                <span>在档信息</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={12} className={Styles.formCol} >
              <FormItem label="诊疗卡" {...twoColLayout} >
                {getFieldDecorator('medicalCardNo', {
                  initialValue: patient.medicalCardNo || '',
                  rules: [
                    { required: this.state.medicalCardRequired, message: '诊疗卡号不能为空' },
                    { max: 20, message: '诊疗卡长度不能超过10个字符' },
                  ],
                })(
                  <MedicalCard
                    iconOnly
                    maxLength={20}
                    tabIndex={1}
                    readed={this.readMedicalCardDone}
                  />,
                )}
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('patientId', { initialValue: patient.id })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12} className={Styles.formCol} >
              <FormItem label="身份证号" {...twoColLayout} >
                {getFieldDecorator('idNo', { initialValue: patient.idNo || '' })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col span={12} className={Styles.formCol} >
              <FormItem label="姓名" {...twoColLayout} >
                {getFieldDecorator('name', { initialValue: patient.name })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12} className={Styles.formCol} >
              <FormItem label="出生日期" {...twoColLayout} >
                {
                  getFieldDecorator('birthday', { initialValue: patient.birthday ? moment(patient.birthday) : null })(
                    <DatePicker style={{ width: '100%' }} tabIndex={7} disabled />,
                  )
                }
              </FormItem>
            </Col>
            <Col span={12} className={Styles.formCol} >
              <FormItem label="性别" {...twoColLayout} >
                {getFieldDecorator('sex', { initialValue: patient.sex })(<DictRadioGroup disabled columnName="SEX" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12} className={Styles.formCol} >
              <FormItem label="手机号码" {...twoColLayout} >
                {getFieldDecorator('mobile', { initialValue: patient.mobile || '' })(<Input disabled maxLength={11} />)}
              </FormItem>
            </Col>
            <Col span={12} className={Styles.formCol} >
              <FormItem label="家庭住址" {...twoColLayout} >
                {getFieldDecorator('idAddress', { initialValue: patient.idAddress })(<Input disabled />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className={Styles.fieldSet} >
                <div />
                <span>挂号信息</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={12} className={Styles.formCol}>
              <FormItem label="就诊类别" {...twoColLayout}>
                {
                  getFieldDecorator('feeType', { initialValue: '1' })(
                    <DictRadioGroup columnName="FEE_TYPE" tabIndex={6} />,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12} className={Styles.formCol} >
              <FormItem label="序号" {...twoColLayout}>
                {
                  getFieldDecorator('numSourceId', {
                    initialValue: record.numSourceId || '',
                  })(
                    <NumberInput
                      numberType="integer"
                      maxLength={4}
                      placeholder="输入1-4位数字"
                      onPressEnter={onPressEnter}
                    />,
                )}
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('regLevel', { initialValue: record.regLevel })(<Input />)}
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('regDeptId', { initialValue: record.deptId })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12} className={Styles.formCol} >
              <div className="ant-col-6 ant-form-item-label">
                号源信息：
              </div>
              <div className="ant-col-16 ant-form-item-control-wrapper">
                <div className={Styles.regInfo}>{`${dicts.dis('REG_LEVEL', record.regLevel)} - ${depts.disDeptNameByDeptId(deptsIdx, record.deptId)}`}</div>
              </div>
            </Col>
          </Row>
          <Row type="flex" align="middle">
            <Col span={12} className={Styles.formCol} >
              <div className="ant-col-6 ant-form-item-label">
                标志：
              </div>
              <div className="ant-col-4 ant-form-item-control-wrapper">
                <FormItem {...checkboxLayout}>
                  {getFieldDecorator('reviewFlag', {
                    initialValue: true,
                    valuePropName: 'checked',
                  })(
                    <Checkbox onChange={onReviewFlagChange} >初诊</Checkbox>,
                  )}
                </FormItem>
              </div>
              <div className="ant-col-4 ant-form-item-control-wrapper">
                <FormItem {...checkboxLayout}>
                  {getFieldDecorator('emergencyFlag', {
                    initialValue: false,
                    valuePropName: 'checked',
                  })(
                    <Checkbox disabled>急诊</Checkbox>,
                  )}
                </FormItem>
              </div>
            </Col>
            <Col span={12} className={Styles.formCol} >
              <div className="ant-col-6 ant-form-item-label">
                总费用：
              </div>
              <div className="ant-col-16 ant-form-item-control-wrapper">
                <div className={Styles.totalAmt}>{totalFee.formatMoney()}</div>
              </div>
            </Col>
          </Row>
          <div className={Styles.bottomShadow} />
          <div className={Styles.bottomBtnContainer} >
            <div className="action-form-wrapper">
              <Row type="flex" gutter={24} justify="end">
                <Col className="action-form-operating">
                  <Button
                    type="primary"
                    size="large"
                    className="on-add"
                    disabled={isDisabled()}
                    onClick={this.handleSubmit}
                  >
                    <Icon type="plus-circle-o" />挂号
                  </Button>
                  <Button onClick={this.handleReset} size="large" className="on-add">
                    <Icon type="reload" />重置
                  </Button>
                  <Button type="primary" onClick={this.handleReg} size="large" ghost className="on-delete">
                    <Icon type="folder-add" />建档
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </Form>
        <PayCounter {...payInfo} />
      </Card>
    );
  }
}

export default Form.create()(EditorForm);
