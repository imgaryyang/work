import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button } from 'antd';
import MiCard from '../../../components/ScanMiCardInput';
import MedicalCard from '../../../components/ScanMedicalCardInput';
import styles from './DrugDispense.less';

const FormItem = Form.Item;

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.readMedicalCardDone = this.readMedicalCardDone.bind(this);
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
    this.props.dispatch({
      type: 'drugDispense/setState',
      payload: {
        query: {},
      },
    });
    this.props.form.resetFields();
    this.doSearch({
      drugDeptId: this.props.base.user.loginDepartment.id,
      applyState: '1',
    });
  }

  readMedicalCardDone(info) {
    // console.log(info);
    this.props.dispatch({
      type: 'drugDispense/setState',
      payload: {
        query: { ...this.props.drugDispense.query, ...info },
      },
    });
  }

  readMiCardDone(info) {
    // console.log(info);
    this.props.dispatch({
      type: 'drugDispense/setState',
      payload: {
        query: { ...this.props.drugDispense.query, ...info },
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { query } = this.props.drugDispense;
    return (
      <Form inline className={styles.searchForm} >
        <FormItem style={{ display: 'none' }} >{getFieldDecorator('drugDeptId', {
          initialValue: this.props.base.user.loginDepartment.id,
        })(<Input />)}
        </FormItem>
        <FormItem style={{ display: 'none' }} >{getFieldDecorator('applyState', {
          initialValue: '1',
        })(<Input />)}
        </FormItem>
        <Row>
          {/* <Col span={12} >
            <FormItem style={{ width: '100%' }} wrapperCol={{ span: 24 }} >
              {getFieldDecorator('barcode', {
                initialValue: query.barcode,
              })(
                <Input maxLength={20} placeholder="条形码" />,
              )}
            </FormItem>
          </Col> */}
          <Col span={24} style={{ paddingLeft: '0', paddingRight: '0' }} >
            <FormItem style={{ width: '100%' }} wrapperCol={{ span: 24 }} >
              {getFieldDecorator('invoiceNo', {
                initialValue: query.invoiceNo,
              })(
                <Input maxLength={20} placeholder="发票号" />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12} >
            <FormItem style={{ width: '100%' }} wrapperCol={{ span: 24 }} >
              {getFieldDecorator('medicalCardNo', {
                initialValue: query.medicalCardNo,
              })(
                <MedicalCard readed={this.readMedicalCardDone} maxLength={10} placeholder="诊疗卡号" iconOnly />,
              )}
            </FormItem>
          </Col>
          <Col span={12} >
            <FormItem style={{ width: '100%' }} wrapperCol={{ span: 24 }} >
              {getFieldDecorator('miCardNo', {
                initialValue: query.miCardNo,
              })(
                <MiCard readed={this.readMiCardDone} maxLength={20} placeholder="医保卡号" iconOnly />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12} >
            <FormItem style={{ width: '100%' }} wrapperCol={{ span: 24 }} >
              {getFieldDecorator('patientId', {
                initialValue: query.patientId,
              })(
                <Input maxLength={14} placeholder="患者Id" />,
              )}
            </FormItem>
          </Col>
          <Col span={12} >
            <FormItem style={{ width: '100%' }} wrapperCol={{ span: 24 }} >
              {getFieldDecorator('patientName', {
                initialValue: query.patientName,
              })(
                <Input maxLength={15} placeholder="患者姓名" />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12} >
            <Button type="primary"  onClick={this.handleSubmit} size="large" icon="search" >查询</Button>
          </Col>
          <Col span={12} >
            <Button onClick={this.handleReset} size="large" icon="reload" >清空</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
const SearchBarForm = Form.create()(SearchBar);
export default connect(({ drugDispense, base }) => ({ drugDispense, base }))(SearchBarForm);

