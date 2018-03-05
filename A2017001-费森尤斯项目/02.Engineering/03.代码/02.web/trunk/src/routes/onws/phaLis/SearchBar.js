import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Icon, DatePicker, Checkbox } from 'antd';
import moment from 'moment';
import _ from 'lodash';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'YYYY-MM-DD HH:mm:ss';

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
    this.onSearch = ::this.onSearch;
    this.onChangeCheck = ::this.onChangeCheck;
    this.setSearchObjs = ::this.setSearchObjs;
    this.onDateChange = ::this.onDateChange;
    this.readMedicalCardDone = ::this.readMedicalCardDone;
  }
  state={
    checked: true,
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'phaLis/load',
      payload: { query: values },
    });
  }
  onChangeCheck(e) {
    const check = e.target.checked;
    this.state.checked = check;
    this.props.form.setFieldsValue({
      isEffect: check,
    });
  }

  onDateChange(dates, dateStrings) {
    const beginTime = moment(dateStrings[0]).startOf('day');
    const endTime = moment(dateStrings[1]).endOf('day');
    const dateRange = {
      dateRange: [beginTime.format(timeFormat), endTime.format(timeFormat)],
    };
    this.setSearchObjs(dateRange);
  }

  setSearchObjs(searchObj) {
    this.props.dispatch({
      type: 'phaLis/setSearchObjs',
      payload: searchObj,
    });
  }
  saveData() {
    this.props.dispatch({
      type: 'phaLis/save',
    });
  }
  readMedicalCardDone(info) {
    this.props.form.resetFields(['medicalCardNo']);
    this.props.dispatch({
      type: 'phaLis/setState',
      payload: {
        patient: { ...this.props.patient, ...info },
      },
    });
  }

  handleSubmit() {
    const { searchObjs } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setSearchObjs(_.omit(values, 'dateRange'));
        this.onSearch(searchObjs);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'phaLis/setState',
      payload: { patient: {} },
    });
    this.setSearchObjs(null);
    this.onSearch(null);
  }

  exportToExcel() {
    const w = window.open('about:blank');
    w.location.href = '/api/hcp/onws/phaPatlis/exportToExcel';
  }
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="action-form-wrapper">
        <Row>
          <Col span={22} className="action-form-searchbar">
            <Form inline>
              <FormItem>
                {getFieldDecorator('medicalCardNo', {
                })(
                  <Input
                    tabIndex={1}
                    placeholder="诊疗卡"
                  />,
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('regId')(<Input placeholder="就诊号" style={{ width: '120px' }} />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('name')(<Input placeholder="姓名" style={{ width: '80px' }} />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('IDCard')(<Input placeholder="身份证号" style={{ width: '140px' }} />)}
              </FormItem>
              {/* </Form>
              <Form inline>*/}
              <FormItem>
                {
                  getFieldDecorator('dateRange')(
                    <RangePicker
                      ranges={{ 今天: [moment(), moment()], 本月: [moment(), moment().endOf('month')] }}
                      format={dateFormat}
                      style={{ width: '200px' }}
                      onChange={this.onDateChange}
                    />,
                  )
                }
              </FormItem>
              <FormItem>
                <Checkbox checked={this.state.checked} name="check" onChange={this.onChangeCheck} style={{ width: '65px' }} >有效</Checkbox>
              </FormItem>
              <FormItem style={{ display: 'none' }}>
                {getFieldDecorator('isEffect')(<Input />)}
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit}>
                  <Icon type="search" />查询
                </Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleReset}>
                  <Icon type="reload" />清空
                </Button>
              </FormItem>
            </Form>
          </Col>
          <Col span={2} className="action-form-operating">
            <Button type="primary" size="large" className="btn-left" onClick={this.exportToExcel.bind(this)} >
              <Icon type="export" />导出
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(SearchBar);
