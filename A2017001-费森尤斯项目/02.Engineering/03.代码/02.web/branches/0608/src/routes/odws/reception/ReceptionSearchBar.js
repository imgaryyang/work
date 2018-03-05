import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button, Radio, DatePicker } from 'antd';
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
    this.handleReset = this.handleReset.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.readMedicalCardDone = this.readMedicalCardDone.bind(this);
    this.readMiCardDone = this.readMiCardDone.bind(this);
    this.changeRegState = this.changeRegState.bind(this);
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
    });
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
            <FormItem style={{ width: '100%' }} label="诊疗卡号" {...formItemLayout} >
              {getFieldDecorator('medicalCardNo', {
                initialValue: query.medicalCardNo,
              })(
                <MedicalCard readed={this.readMedicalCardDone} maxLength={10} placeholder="诊疗卡号" iconOnly />,
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem style={{ width: '100%' }} label="医保卡号" {...formItemLayout} >
              {getFieldDecorator('miCardNo', {
                initialValue: query.miCardNo,
              })(
                <MiCard readed={this.readMiCardDone} maxLength={20} placeholder="医保卡号" iconOnly />,
              )}
            </FormItem>
          </Col>
          <Col span={6} >
            <FormItem style={{ width: '100%' }} label="患者ID" {...formItemLayout} >
              {getFieldDecorator('patientCode', {
                initialValue: query.patientCode,
              })(
                <Input maxLength={12} placeholder="患者ID" />,
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
            <FormItem style={{ width: '100%' }} label="挂号日期" {...formItemLayout} >
              {getFieldDecorator('regTime', {
                initialValue: query.regTime ? moment(query.regTime) : moment(),
              })(
                <DatePicker format="YYYY-MM-DD" placeholder="挂号日期" style={{ width: '100%' }} allowClear={false} />,
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
                <Radio.Group className={styles.receptionSearchScopeRadio} onChange={this.changeRegState} >
                  <Radio.Button value="21">待诊</Radio.Button>
                  <Radio.Button value="31">已诊</Radio.Button>
                </Radio.Group>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }} >
          <Col span={18} />
          <Col span={6} style={{ textAlign: 'right' }} >
            <Row>
              <Col span={6} />
              <Col span={9} style={{ paddingRight: '2px' }} >
                <Button type="primary" htmlType="submit" style={{ width: '100%' }} icon="search" size="large" onClick={() => this.handleSubmit()} >查询</Button>
              </Col>
              <Col span={9} style={{ paddingLeft: '2px' }} >
                <Button onClick={this.handleReset} style={{ width: '100%' }} icon="reload" size="large" >清空</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    );
  }
}
const ReceptionSearchBarForm = Form.create()(ReceptionSearchBar);
export default connect(
  ({ odws, base }) => ({ odws, base }),
)(ReceptionSearchBarForm);

