import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Row, Col, Form, Button, Icon, DatePicker, Input } from 'antd';
import DictSelect from '../../../components/DictSelect';
import DeptSelect from '../../../components/DeptSelect';
import DataSourceSelect from '../../../components/DataSourceSelect';
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
    this.setSearchObjs = ::this.setSearchObjs;
    this.onDateChange = ::this.onDateChange;
    this.companySelectEvent = ::this.companySelectEvent;    
  }
  companySelectEvent(value) {
	  console.log('companySelectEvent value:', value);
	 this.props.form.setFieldsValue({
		 company: value.id,
    });
  }  
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDataSource',
      payload: ['materialCompanyInfoSupply'],
    });
  }
  onSearch(values) {
    this.props.dispatch({
      type: 'matInStoreDetail/load',
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
      type: 'matInStoreDetail/setSearchObjs',
      payload: searchObj,
    });
  }

  setTag(selectedTag) {
    this.props.dispatch({
      type: 'matInStoreDetail/setState',
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
      w.location.href = `/api/hcp/material/directIn/expertToExcel?data=${JSON.stringify(this.props.searchObjs)}`;
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
                {getFieldDecorator('materialType')(<DictSelect showSearch style={{ width: '120px' }} columnName="MATERIAL_TYPE" placeholder="物资分类" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('inType')(<DictSelect showSearch style={{ width: '100px' }} columnName="IN_TYPE" placeholder="入库类型" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('deptId')(<DeptSelect showSearch style={{ width: '100px' }} deptType={['010']} placeholder="入库科室" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('inBill')(<Input style={{ width: '100px' }} placeholder="入库单号" />)}
              </FormItem>
                <FormItem>
                {getFieldDecorator('companyName')(
                <CompanySearchInput
                placeholder="供货商"
          
  	          companyType={['2']}
  	          services={['2']}
  	          onSelect={(value)=>this.companySelectEvent(value)}
  	          style={{ width: '150px' }} />
          
                )}
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
          <Col lg={{ span: 4 }} md={{ span: 4 }} sm={8} xs={24} className="action-form-operating">
            <Button type="primary" size="large" onClick={this.exportToExcel} className="on-add">
              导出
            </Button>
            <Button size="large" className="on-add">
              打印
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(InStoreDetailSearchBar);
