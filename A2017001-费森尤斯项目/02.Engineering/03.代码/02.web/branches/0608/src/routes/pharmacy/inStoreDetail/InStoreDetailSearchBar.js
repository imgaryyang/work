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
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDataSource',
      payload: ['companyInfoSupply'],
    });
  }
  onSearch(values) {
    this.props.dispatch({
      type: 'inStoreDetail/load',
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
      type: 'inStoreDetail/setSearchObjs',
      payload: searchObj,
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
        this.setSearchObjs(_.omit(values, 'dateRange'));
        this.onSearch(this.props.searchObjs);
      }
    });
  }
  exportToExcel() {
    const w = window.open('about:blank');
    this.props.form.validateFields((err, values) => {
      this.setSearchObjs(_.omit(values, 'dateRange'));
      w.location.href = `/api/hcp/pharmacy/directIn/expertToExcel?data=${JSON.stringify(this.props.searchObjs)}`;
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.setTag(null);
    this.setSearchObjs(null);
    this.onSearch();
  }

  companySelectEvent(value) {
	  console.log('companySelectEvent value:', value);
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
              {getFieldDecorator('deptId')(<DeptSelect showSearch style={{ width: '80px' }} deptType={['004', '005']} placeholder="入库科室" allowClear />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('inBill')(<Input style={{ width: '80px' }} placeholder="入库单号" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('companyName')(/*<DataSourceSelect
                showSearch
                style={{ width: '150px' }}
                tabIndex="6"
                codeName="companyInfoSupply"
                placeholder="供货商"
                allowClear
              />*/
              <CompanySearchInput
              placeholder="供货商"
        
	          companyType={['2']}
	          services={['1']}
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
            <Button type="primary" size="large" onClick={this.exportToExcel} className="on-add" icon="printer" >
              导出
            </Button>
            <Button size="large" className="on-add" icon="export" >
              打印
            </Button>
          </Col>
        </Row> 
      </Form>
    );
  }
}

export default Form.create()(InStoreDetailSearchBar);
