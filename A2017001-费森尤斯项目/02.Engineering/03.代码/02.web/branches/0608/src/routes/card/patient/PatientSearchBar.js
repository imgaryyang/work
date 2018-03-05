import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button, Radio } from 'antd';
import MiCard from '../../../components/ScanMiCardInput';
import IdCard from '../../../components/ScanIdCardInput';
import MedicalCard from '../../../components/ScanMedicalCardInput';
import DictRadioGroup from '../../../components/DictRadioGroup';
import styles from './Patient.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
/* const RadioButton = Radio.Button; */

class PatientSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.readMedicalCardDone = this.readMedicalCardDone.bind(this);
    this.readIdCardDone = this.readIdCardDone.bind(this);
    this.readMiCardDone = this.readMiCardDone.bind(this);
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) this.doSearch(values);
    });
  }

  doSearch(values) {
    // console.log('search values:', values);
    if (typeof this.props.onSearch === 'function') {
      this.props.onSearch(values);
    }
  }

  handleReset() {
    /* this.props.dispatch({
      type: 'patient/setState',
      payload: {
        query: {},
      },
    });*/
    this.doSearch({});
    this.props.form.resetFields();
    /* this.doSearch(this.props.form.getFieldsValue());*/
  }

  readMedicalCardDone(info) {
    // console.log('readMedicalCardDone in PatientSearchBar:', info);
    const newQuery = {
      ...this.props.patient.query,
      patientId: info.patientId,
      name: info.name,
      idNo: info.idNo,
      medicalCardNo: info.medicalCardNo,
      miCardNo: null,
    };
    this.props.dispatch({
      type: 'patient/setState',
      payload: {
        query: newQuery,
      },
    });
    this.doSearch(newQuery);
  }

  readIdCardDone(info) {
    // console.log(info);
    this.props.dispatch({
      type: 'patient/setState',
      payload: {
        query: { ...this.props.patient.query, ...info },
      },
    });
  }

  readMiCardDone(info) {
    // console.log(info);
    const newQuery = {
      ...this.props.patient.query,
      patientId: info.patientId,
      name: info.name,
      idNo: info.idNo,
      medicalCardNo: null,
      miCardNo: info.miCardNo,
    };
    this.props.dispatch({
      type: 'patient/setState',
      payload: {
        query: newQuery,
      },
    });
    this.doSearch(newQuery);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { query } = this.props.patient;
    return (
      <Form inline className={styles.searchForm} >
        <Row>
          <Col span={12} >
            <FormItem wrapperCol={{ span: 24 }} style={{ width: '100%' }} >
              {getFieldDecorator('patientId', {
                initialValue: query.patientId,
              })(
                <Input placeholder="患者ID" maxLength={12} />,
              )}
            </FormItem>
          </Col>
          <Col span={12} >
            <FormItem wrapperCol={{ span: 24 }} style={{ width: '100%' }} >
              {getFieldDecorator('idNo', {
                initialValue: query.idNo,
              })(
                <IdCard readed={this.readIdCardDone} maxLength={18} iconOnly placeholder="身份证号" />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12} >
            <FormItem wrapperCol={{ span: 24 }} style={{ width: '100%' }} >
              {getFieldDecorator('medicalCardNo', {
                initialValue: query.medicalCardNo,
              })(
                <MedicalCard readed={this.readMedicalCardDone} maxLength={20} iconOnly placeholder="诊疗卡号" />,
              )}
            </FormItem>
          </Col>
          <Col span={12} >
            <FormItem wrapperCol={{ span: 24 }} style={{ width: '100%' }} >
              {getFieldDecorator('miCardNo', {
                initialValue: query.miCardNo,
              })(
                <MiCard readed={this.readMiCardDone} maxLength={20} iconOnly placeholder="医保卡号" />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ paddingLeft: '0', paddingRight: '0' }} >
            <FormItem wrapperCol={{ span: 24 }} style={{ width: '100%' }} >
              {getFieldDecorator('name', {
                initialValue: query.name,
              })(
                <Input maxLength={15} placeholder="患者姓名" />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12} >
            <Button type="primary" onClick={this.handleSubmit} size="large" icon="search" >查询</Button>
          </Col>
          <Col span={12} >
            <Button onClick={this.handleReset} size="large" icon="reload" >清空</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
const PatientSearchBarForm = Form.create()(PatientSearchBar);
export default connect(({ patient }) => ({ patient }))(PatientSearchBarForm);

