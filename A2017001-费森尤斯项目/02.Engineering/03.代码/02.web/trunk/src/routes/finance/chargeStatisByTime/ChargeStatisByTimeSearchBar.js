import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Row, Col, Form, Button, Icon, DatePicker } from 'antd';
import DeptSelect from '../../../components/DeptSelect';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'YYYY-MM-DD HH:mm:ss';

class chargeStatisByTimeSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.exportToExcel = ::this.exportToExcel;
    this.handleReset = ::this.handleReset;
    this.onSearch = ::this.onSearch;
    this.setSearchObjs = ::this.setSearchObjs;
    this.onDateChange = ::this.onDateChange;
  }
  onSearch(values) {
    this.props.dispatch({
      type: 'chargeStatisByDoc/loadByTimeAndDept',
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
      type: 'chargeStatisByDoc/setSearchObjs',
      payload: searchObj,
    });
  }

  setTag(selectedTag) {
    this.props.dispatch({
      type: 'chargeStatisByDoc/setState',
      payload: { selectedTag },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setSearchObjs(_.omit(values, 'dateRange'));
        this.onSearch(this.props.searchObjs);
      }
    });
  }
  exportToExcel() {
    const w = window.open('about:blank');
    this.props.form.validateFields((err, values) => {
      this.setSearchObjs(_.omit(values, 'dateRange'));
      w.location.href = `/api/hcp/payment/chargeStatis/exportStatisByTime?data=${JSON.stringify(this.props.searchObjs)}`;
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.setTag(null);
    this.setSearchObjs(null);
    this.onSearch();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="action-form-wrapper">
        <Row type="flex">
          <Col span={20} className="action-form-searchbar">
            <Form inline >
              <FormItem>
                <span>开单科室： </span>
              </FormItem>
              <FormItem>
                {getFieldDecorator('deptId')(<DeptSelect showSearch style={{ width: '100px' }} deptType={['001']} placeholder="开单科室" allowClear = 'true'/>)}
              </FormItem>
              <FormItem>
                <span>收费日期： </span>
              </FormItem>
              <FormItem>
                {
                  getFieldDecorator('dateRange')(
                    <RangePicker
                      ranges={{ 今天: [moment(), moment()], 本月: [moment(), moment().endOf('month')] }}
                      format={dateFormat}
                      style={{ width: '250px' }}
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
          <Col span={4} className="action-form-operating">
            <Button size="large" onClick={this.exportToExcel} className="btn-left" icon="export">
              导出
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(chargeStatisByTimeSearchBar);
