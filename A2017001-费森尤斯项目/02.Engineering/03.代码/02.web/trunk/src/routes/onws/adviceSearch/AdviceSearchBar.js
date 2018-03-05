import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button, Icon, DatePicker } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import IdCard from '../../../components/ScanIdCardInput';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'YYYY-MM-DD HH:mm:ss';

class AdviceSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
    this.onSearch = ::this.onSearch;
    this.setSearchObjs = ::this.setSearchObjs;
    this.onDateChange = ::this.onDateChange;
    this.readMedicalCardDone = ::this.readMedicalCardDone;
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'advice/load',
      payload: { query: values },
    });
  }

 onDateChange(dates, dateStrings) {
  if (dateStrings[0] && dateStrings[1]) {
    const beginTime = moment(dateStrings[0]).startOf('day');
    const endTime = moment(dateStrings[1]).endOf('day');
    const dateRange = {
      dateRange: [beginTime.format(timeFormat), endTime.format(timeFormat)],
    };
    this.setSearchObjs(dateRange);
  } else {
    this.setSearchObjs({ dateRange: null });
  }
 }

  setSearchObjs(searchObj) {
    this.props.dispatch({
      type: 'advice/setSearchObjs',
      payload: searchObj,
    });
  }

  readMedicalCardDone(info) {
    this.props.form.resetFields(['medicalCardNo']);
    this.props.dispatch({
      type: 'advice/setState',
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
      type: 'advice/setState',
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
          <Col lg={24} md={24} sm={24} xs={24} className="action-form-searchbar">
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
                {getFieldDecorator('idNo', {

                })(
                  <IdCard readed={this.readIdCardDone} maxLength={18} iconOnly placeholder="身份证号" />,
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('patientName')(<Input placeholder="姓名" />)}
              </FormItem>
              <FormItem label="挂号日期">
                {
                  getFieldDecorator('dateRange')(
                    <RangePicker
                      ranges={{ 今天: [moment(), moment()], 本月: [moment(), moment().endOf('month')] }}
                      format={dateFormat}
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

const AdviceSearchBarForm = Form.create()(AdviceSearchBar);
export default connect(({ advice }) => ({ advice }))(AdviceSearchBarForm);
