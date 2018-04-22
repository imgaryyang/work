import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, DatePicker, notification } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

class TranSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSubmit() {
    const search = this.props.onSearch;
    this.props.form.validateFields((err, values) => {
      if (err) return;
      if (!values.patientId && !values.patientIdNo && !values.patientName && !values.patientMobile) {
        notification.warning({
          message: '警告',
          description: '请填写查询条件',
        });
        return;
      }
      if (typeof search === 'function') {
        const newValues = {
          ...values,
          startDate: moment(values.startDate).format('YYYY-MM-DD'),
          endDate: moment(values.endDate).format('YYYY-MM-DD'),
        };
        search(newValues);
      }
    });
  }

  handleReset() {
    this.props.dispatch({
      type: 'cashTran/setState',
      payload: {
        query: {
          startDate: moment().format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
        },
      },
    });
    this.props.form.resetFields();
  }

  render() {
    const { form, cashTran } = this.props;
    const { getFieldDecorator } = form;
    const { query } = cashTran;
    return (
      <Form inline style={{ marginBottom: '10px' }} >
        <FormItem>
          {getFieldDecorator('patientId', {
            initialValue: query.patientId,
          })(
            <Input placeholder="健康号" maxLength={20} onPressEnter={this.handleSubmit} />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('patientIdNo', {
            initialValue: query.patientIdNo,
          })(
            <Input placeholder="身份证号" maxLength={18} onPressEnter={this.handleSubmit} />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('patientName', {
            initialValue: query.patientName,
          })(
            <Input placeholder="患者姓名" maxLength={20} onPressEnter={this.handleSubmit} />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('patientMobile', {
            initialValue: query.patientMobile,
          })(
            <Input placeholder="患者手机号" maxLength={11} onPressEnter={this.handleSubmit} style={{ width: '95px' }} />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('startDate', {
            initialValue: moment(query.startDate),
          })(
            <DatePicker placeholder="起始日期" style={{ width: '100px' }} />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('endDate', {
            initialValue: moment(query.endDate),
          })(
            <DatePicker placeholder="结束日期" style={{ width: '100px' }} />,
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="button" size="large" onClick={this.handleSubmit} >查询</Button>
        </FormItem>
        <FormItem>
          <Button onClick={this.handleReset} size="large" >清空</Button>
        </FormItem>
      </Form>
    );
  }
}
const TranSearchBarForm = Form.create()(TranSearchBar);
export default connect( ({ cashTran }) => ({ cashTran }),)(TranSearchBarForm);
