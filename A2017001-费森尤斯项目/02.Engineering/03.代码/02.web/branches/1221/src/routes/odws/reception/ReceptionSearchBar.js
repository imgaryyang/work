import React, { Component } from 'react';
import { connect } from 'dva';
import { isEmpty } from 'lodash';

import { Row, Col, Form, Input, Button, Radio, DatePicker, notification } from 'antd';
import moment from 'moment';

import MiCard from '../../../components/ScanMiCardInput';
import MedicalCard from '../../../components/ScanMedicalCardInput';
import DictSelect from '../../../components/DictSelect';

import styles from './Reception.less';

const FormItem = Form.Item;

class ReceptionSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReg = this.handleReg.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.readMedicalCardDone = this.readMedicalCardDone.bind(this);
    this.readMiCardDone = this.readMiCardDone.bind(this);
    this.changeRegState = this.changeRegState.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.handleRegNotify(nextProps.register.regResult);
  }

  handleSubmit(regState) {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let newValues = { ...values };
        if (regState) newValues = { ...newValues, regState };
        if (newValues.regTime) newValues = { ...newValues, regTime: moment(values.regTime).format('YYYY-MM-DD') };
        this.doSearch(newValues);
      }
    });
  }

  doSearch(values) {
    // console.log('search values:', values);
    if (typeof this.props.onSearch === 'function') {
      this.props.onSearch(values, true);
    }
  }

  handleReset() {
    this.props.dispatch({
      type: 'odws/setState',
      payload: {
        query: {
          regTime: moment().format('YYYY-MM-DD'),
        },
      },
    });
    this.props.form.resetFields();
    this.doSearch({
      regTime: moment().format('YYYY-MM-DD'),
      regState: '21',
    });
  }

  handleReg() {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (!values.regLevel) {
        notification.warning({
          message: '警告',
          description: '请选择号别！',
          duration: 2,
        });
        return;
      }
      const { dispatch, base } = this.props;
      const { user } = base;
      const { regLevel } = values;

      const isEmergency = (regLevel === '2') ? '1' : '0';

      const defaultParams = {
        regDeptId: user.loginDepartment.id,
        feeType: '1',
        reviewFlag: '1',
        emergencyFlag: isEmergency,
        remark: '-1',
      };

      const params = { ...values, ...defaultParams };

      dispatch({ type: 'register/save', params });
    });
  }

  /* 挂号提示信息 */
  handleRegNotify(result) {
    const { success, msg } = result;
    if (!isEmpty(result)) {
      if (success) {
        notification.success({
          message: '通知信息',
          description: '登记成功！',
          duration: 2,
        });
        this.handleReset();
      } else {
        notification.error({
          message: '通知信息',
          description: `登记失败：[${msg}]`,
          duration: 2,
        });
      }
      this.props.dispatch({
        type: 'register/setState',
        payload: { regResult: {} },
      });
    }
  }


  readMedicalCardDone(info) {
    // console.log(info);

    const newQuery = {
      ...this.props.odws.query,
      patientCode: info.patientId,
      patientName: info.name,
      idNo: info.idNo,
      medicalCardNo: info.medicalCardNo,
      miCardNo: null,
      id: info.id,
    };
    this.props.dispatch({
      type: 'odws/setState',
      payload: {
        query: newQuery,
      },
    });
    this.doSearch(newQuery);
  }

  readMiCardDone(info) {
    // console.log(info);
    const newQuery = {
      ...this.props.odws.query,
      patientCode: info.patientId,
      patientName: info.name,
      idNo: info.idNo,
      medicalCardNo: null,
      miCardNo: info.miCardNo,
      id: info.id,
    };
    this.props.dispatch({
      type: 'odws/setState',
      payload: {
        query: newQuery,
      },
    });
    this.doSearch(newQuery);
  }

  changeRegState(e) {
    this.handleSubmit(e.target.value);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { query } = this.props.odws;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <Form inline className={styles.searchForm} >
        {/* <FormItem style={{ display: 'none' }} >{getFieldDecorator('drugDeptId', {
          initialValue: this.props.base.user.loginDepartment.id,
        })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }} >{getFieldDecorator('applyState', {
          initialValue: '1',
        })(<Input />)}
        </FormItem>*/}
        <Row className={styles.receptionSearchRow} >
          <Col span={6} >
            <FormItem style={{ display: 'none' }} >{getFieldDecorator('patientId', {
              initialValue: query.id,
            })(<Input />)}</FormItem>
            <FormItem style={{ width: '100%' }} label="诊疗卡号" {...formItemLayout} >
              {getFieldDecorator('medicalCardNo', {
                initialValue: query.medicalCardNo,
              })(
                <MedicalCard readed={this.readMedicalCardDone} maxLength={10} placeholder="诊疗卡号" iconOnly style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem style={{ width: '100%' }} label="医保卡号" {...formItemLayout} >
              {getFieldDecorator('miCardNo', {
                initialValue: query.miCardNo,
              })(
                <MiCard readed={this.readMiCardDone} maxLength={20} placeholder="医保卡号" iconOnly style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem style={{ width: '100%' }} label="患者编号" {...formItemLayout} >
              {getFieldDecorator('patientCode', {
                initialValue: query.patientCode,
              })(
                <Input maxLength={12} placeholder="患者编号" />,
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem style={{ width: '100%' }} label="患者姓名" {...formItemLayout} >
              {getFieldDecorator('patientName', {
                initialValue: query.patientName,
              })(
                <Input maxLength={15} placeholder="患者姓名" />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row className={styles.receptionSearchRow} style={{ marginTop: '10px' }} >
          <Col span={6} >
            <FormItem style={{ width: '100%' }} label="就诊号" {...formItemLayout} >
              {getFieldDecorator('regId', {
                initialValue: query.regId,
              })(
                <Input maxLength={20} placeholder="就诊号" />,
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem style={{ width: '100%' }} label="号别" {...formItemLayout} >
              {getFieldDecorator('regLevel', {
                initialValue: query.regLevel,
                /* rules: [{ required: true, message: '号别不能为空' }],*/
              })(
                <DictSelect
                  style={{ width: '100%' }}
                  tabIndex={0}
                  columnName="REG_LEVEL"
                  allowClear
                />,
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            {/* <Row>
              <Col span={6} />
              <Col span={9} style={{ textAlign: 'right' }} >
                <Button type="primary" htmlType="submit" style={{ width: '100%', marginRight: '10px' }} icon="search" size="large" >查询</Button>
              </Col>
              <Col span={1} />
              <Col span={8} style={{ textAlign: 'right' }} >
                <Button onClick={this.handleReset} style={{ width: '100%' }} icon="reload" size="large" >清空</Button>
              </Col>
            </Row>*/}
            <FormItem style={{ width: '100%' }} label="是否待诊" {...formItemLayout} >
              {getFieldDecorator('regState', {
                initialValue: query.regState ? query.regState : '21',
              })(
                <Radio.Group onChange={this.changeRegState} >
                  <Radio value="21">待诊患者</Radio>
                  <Radio value="31">已诊患者</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem style={{ width: '100%' }} label="挂号日期" {...formItemLayout} >
              {getFieldDecorator('regTime', {
                initialValue: query.regTime ? moment(query.regTime) : moment(),
              })(
                <DatePicker format="YYYY-MM-DD" placeholder="挂号日期" style={{ width: '100%' }} allowClear={true} />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }} >
          <Col span={24} style={{ textAlign: 'right' }} >
            <Button type="primary" ghost style={{ marginRight: '10px' }} icon="search" size="large" onClick={() => this.handleSubmit()} >查询</Button>
            <Button style={{ marginRight: '10px' }} icon="reload" size="large" onClick={this.handleReset} >清空</Button>
            <Button type="primary" icon="plus-circle-o" size="large" onClick={this.handleReg} >登记</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
const ReceptionSearchBarForm = Form.create()(ReceptionSearchBar);
export default connect(
  ({ odws, base, register }) => ({ odws, base, register }),
)(ReceptionSearchBarForm);
