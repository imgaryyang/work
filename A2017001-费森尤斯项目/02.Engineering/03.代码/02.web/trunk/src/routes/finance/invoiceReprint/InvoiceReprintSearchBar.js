import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Row, Col, Form, Input, Button, DatePicker } from 'antd';
import MedicalCard from '../../../components/ScanMedicalCardInput';
import MiCard from '../../../components/ScanMiCardInput';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY-MM-DD';

class InvoiceReprintSearchBar extends Component {

  componentDidMount() {
    this.handleSubmit();
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const query = _.omit(values, 'dateRange');  // 如果不用_.omit而用omit，返回的对象会是lodashwarpper
        query.startDate = values.dateRange[0] ? values.dateRange[0].startOf('day') : null;
        query.endDate = values.dateRange[1] ? values.dateRange[1].endOf('day') : null;
        this.props.dispatch({
          type: 'invoiceReprint/load',
          payload: { query },
        });
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    // this.handleSubmit(); 实测加上提交，会有查询条件未清空的问题
    this.props.dispatch({
      type: 'invoiceReprint/setState',
      payload: { query: {} },
    });
  }

  infoToQuery(info) {
    const query = {
      ...this.props.invoiceReprint.query,
      patientInfo: {
        name: info.name,
        medicalCardNo: info.medicalCardNo,
        miCardNo: info.miCardNo,
      },
    };
    return query;
  }

  readCardDone(info) {
    this.props.dispatch({
      type: 'invoiceReprint/setState',
      payload: {
        query: this.infoToQuery(info),
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { patientInfo } = this.props.invoiceReprint.query || {};

    // 卡号、姓名、发票号、起止时间、查询按钮
    return (
      <div className="action-form-wrapper">
        <Row type="flex" justify="left">
          <Col span={24} className="action-form-searchbar">
            <Form inline>
              <FormItem >
                {getFieldDecorator('patientInfo.medicalCardNo', { initialValue: patientInfo ? patientInfo.medicalCardNo : '' })(<MedicalCard readed={this.readCardDone.bind(this)} maxLength={10} iconOnly placeholder="诊疗卡号" />)}
              </FormItem>
              <FormItem >
                {getFieldDecorator('patientInfo.miCardNo', { initialValue: patientInfo ? patientInfo.miCardNo : '' })(<MiCard readed={this.readCardDone.bind(this)} maxLength={20} iconOnly placeholder="医保卡号" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('patientInfo.name', {
                  initialValue: patientInfo ? patientInfo.name : '',
                  // rules: [{ max: 15, message: '病人姓名不能超过15个字符' }], //如果加上rules，刷卡时就无法反显姓名，很奇怪
                })(<Input placeholder="病人姓名" maxLength={15} style={{ width: 100 }} />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('invoiceNo', {
                  rules: [{ max: 14, message: '发票号不能超过14个字符' }],
                })(<Input placeholder="发票号" maxLength={14} />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('dateRange', { initialValue: [moment(new Date(), dateFormat), moment(new Date(), dateFormat)] })(<RangePicker format={dateFormat} style={{ width: 200 }} />)}
              </FormItem>
              <FormItem>
                <Button type="primary" icon="search" onClick={this.handleSubmit.bind(this)}>查询</Button>
              </FormItem>
              <FormItem>
                <Button size="large" icon="reload" onClick={this.handleReset.bind(this)}>清空</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(({ invoiceReprint, utils }) =>
  ({ invoiceReprint, utils }))(Form.create()(InvoiceReprintSearchBar));
