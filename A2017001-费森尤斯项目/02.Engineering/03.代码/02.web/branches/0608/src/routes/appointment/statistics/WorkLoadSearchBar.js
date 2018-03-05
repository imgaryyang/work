import React, { Component } from 'react';
import { Row, Col, Form, Button, Icon, DatePicker } from 'antd';
import moment from 'moment';
import _ from 'lodash';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'YYYY-MM-DD HH:mm:ss';

class WorkLoadSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.handleReset = ::this.handleReset;
    this.onSearch = ::this.onSearch;
    this.setSearchObjs = ::this.setSearchObjs;
    this.onDateChange = ::this.onDateChange;
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'workLoad/load',
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

  setSearchObjs(searchObjs) {
    this.props.dispatch({
      type: 'workLoad/setSearchObjs',
      payload: { searchObjs },
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
    this.setSearchObjs({});
    this.onSearch({});
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const disabledDate = (current) => {
      // Can not select days before today and today
      return current && current.valueOf() > Date.now();
    };

    return (
      <div className="action-form-wrapper">
        <Row>
          <Form inline>
            <Col lg={18} md={18} sm={24} xs={24} className="action-form-searchbar">
              <FormItem label="挂号日期">
                {
                  getFieldDecorator('dateRange')(
                    <RangePicker
                      style={{ width: '200px' }}
                      disabledDate={disabledDate}
                      ranges={{ 今天: [moment(), moment()], 本月: [moment(), moment().endOf('month')] }}
                      format={dateFormat}
                      onChange={this.onDateChange}
                    />,
                  )
                }
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit}>
                  <Icon type="search" />统计
                </Button>
              </FormItem>
              <FormItem>
                <Button onClick={this.handleReset}>
                  <Icon type="reload" />清空
                </Button>
              </FormItem>
            </Col>
            <Col lg={6} md={6} sm={24} xs={24} className="action-form-operating">
              <FormItem>
                <Button type="primary">
                  <Icon type="printer" />打印
                </Button>
              </FormItem>
              <FormItem>
                <Button type="primary" ghost>
                  <Icon type="export" />导出
                </Button>
              </FormItem>
            </Col>
          </Form>
        </Row>
      </div>
    );
  }
}

export default Form.create()(WorkLoadSearchBar);
