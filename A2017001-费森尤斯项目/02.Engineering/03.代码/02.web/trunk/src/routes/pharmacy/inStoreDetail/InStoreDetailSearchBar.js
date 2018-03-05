import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Modal, Row, Col, Form, Button, Icon, DatePicker, Input, notification } from 'antd';
import DictSelect from '../../../components/DictSelect';
import DeptSelect from '../../../components/DeptSelect';

import CompanySearchInput from '../../../components/searchInput/CompanySearchInput';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'YYYY-MM-DD HH:mm:ss';

class InStoreDetailSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
    this.exportToExcel = ::this.exportToExcel;
    this.handleReset = ::this.handleReset;
    this.onSearch = ::this.onSearch;
    this.setDetailSearchObjs = ::this.setDetailSearchObjs;
    this.onDateChange = ::this.onDateChange;
    this.companySelectEvent = ::this.companySelectEvent;
  }
  onSearch(values) {
    this.props.dispatch({
      type: 'inStoreDetail/searchDetail',
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
      this.setDetailSearchObjs(dateRange);
    } else {
      this.setDetailSearchObjs({ dateRange: null });
    }
  }

  setDetailSearchObjs(detailSearchObj) {
    this.props.dispatch({
      type: 'inStoreDetail/setDetailSearchObjs',
      payload: detailSearchObj,
    });
  }

  setTag(selectedTag) {
    this.props.dispatch({
      type: 'inStoreDetail/setState',
      payload: { selectedTag },
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.onSearch(values);
      }
    });
  }
  exportToExcel() {
    const w = window.open('about:blank');
    this.props.form.validateFields((err, values) => {
      this.setDetailSearchObjs(_.omit(values, 'dateRange'));
      w.location.href = `/api/hcp/pharmacy/directIn/expertToExcel?data=${JSON.stringify(this.props.detailSearchObjs)}`;
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.setTag(null);
    this.setDetailSearchObjs(null);
    this.onSearch();
  }

  companySelectEvent(value) {
    this.props.form.setFieldsValue({
      company: value.id,
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form inline style={{ marginBottom: '5px' }} >
        <Row type="flex">
          <Col span={20} className="action-form-searchbar">
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('company')(<Input />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('drugType')(<DictSelect showSearch style={{ width: '90px' }} columnName="DRUG_TYPE" placeholder="药品分类" allowClear />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('inType')(<DictSelect showSearch style={{ width: '80px' }} columnName="IN_TYPE" placeholder="入库类型" allowClear />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('deptId')(<DeptSelect showSearch style={{ width: '80px' }} deptType={['001', '004', '005']} placeholder="入库科室" allowClear />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('inBill')(<Input style={{ width: '80px' }} placeholder="入库单号" />)}
            </FormItem>
            <FormItem>
              { getFieldDecorator('producerName')(
                <CompanySearchInput
                  placeholder="供货商"
                  companyType={['2']}
                  services={['1']}
                  onSelect={this.companySelectEvent}
                  style={{ width: '100px' }}
                />)}
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('dateRange')(
                  <RangePicker
                    ranges={{ 今天: [moment(), moment()], 本月: [moment(), moment().endOf('month')] }}
                    format={dateFormat}
                    style={{ width: '200px' }}
                    onChange={this.onDateChange}
                    allowClear
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
          </Col>
          <Col span={4} className="action-form-operating" style={{ textAlign: 'right' }} >
            <Button type="primary" size="large" onClick={this.exportToExcel} className="btn-left" icon="printer" >
              导出
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(InStoreDetailSearchBar);
