import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Icon, DatePicker, Checkbox, Modal } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import MedicalCard from '../../../components/ScanMedicalCardInput';

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
    this.setSearchObjs = ::this.setSearchObjs;
    this.onDateChange = ::this.onDateChange;
    this.readMedicalCardDone = ::this.readMedicalCardDone;
  }
  state={
    checked: true,
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'phaLisResult/load',
      payload: { query: values },
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
      type: 'phaLisResult/setSearchObjs',
      payload: searchObj,
    });
  }
  saveData() {
    this.props.dispatch({
      type: 'phaLisResult/save',
    });
  }
  readMedicalCardDone(info) {
    this.props.form.resetFields(['medicalCardNo']);
    this.props.dispatch({
      type: 'phaLisResult/setState',
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
      type: 'phaLisResult/setState',
      payload: { patient: {} },
    });
    this.setSearchObjs(null);
    this.onSearch(null);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { patient } = this.props;

    return (
      <div className="action-form-wrapper">
        <Row>
          <Col span={22} className="action-form-searchbar">
            <Form inline>
              <FormItem>
                {getFieldDecorator('medicalCardNo', {
                  initialValue: patient ? patient.medicalCardNo : '',
                })(
                  <MedicalCard
                    iconOnly
                    maxLength={30}
                    placeholder="诊疗卡"
                    readed={this.readMedicalCardDone}
                    style={{ width: '130px' }}
                  />,
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('regId')(<Input placeholder="就诊号" style={{ width: '120px' }} />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('name', { initialValue: patient ? patient.name : '' })(<Input placeholder="姓名" style={{ width: '80px' }} />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('IDCard', { initialValue: patient ? patient.idNo : '' })(<Input placeholder="身份证号" style={{ width: '140px' }} />)}
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
        </Row>
      </div>
    );
  }
}

export default Form.create()(SearchBar);
