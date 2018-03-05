import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { notification,Modal,Input, Button, Row, Col, DatePicker, Select, Form, Card } from 'antd';
import DataSourceSelect from '../../../components/DataSourceSelect';
import styles from './OutputInfo.less';
import CompanySearchInput from '../../../components/searchInput/CompanySearchInput';

const Option = Select.Option;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'YYYY-MM-DD HH:mm:ss';

class SelectForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDataSource',
      payload: ['materialCompanyInfoSupply'],
    });
    this.props.dispatch({
      type: 'matOutputDetailInfo/loadOutputDetail',
      payload: {
        queryCon: {
          outputState: '2',
        },
      },
    });
  }

  onDateChange(dates, dateStrings) {
    if (dateStrings[0] && dateStrings[1]) {
      const beginTime = moment(dateStrings[0]).startOf('day');
      const endTime = moment(dateStrings[1]).endOf('day');
      const dateRange = {
        dateRange: [beginTime.format(timeFormat), endTime.format(timeFormat)],
      };
      this.props.dispatch({
        type: 'matOutputDetailInfo/setState',
        payload: { query: { dateRange: dateRange.dateRange } },
      });
    } else {
      this.props.dispatch({
        type: 'matOutputDetailInfo/setState',
        payload: { query: { dateRange: null } },
      });
    }
  }

  onSelect(value) {
    console.log(value.id);
    this.props.dispatch({
      type: 'matOutputDetailInfo/setState',
      payload: { query: { companyInfo: { id: value.id } } },
    });
  }


  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const value = _.omit(values, 'dateRange');
        this.doSearch(value);
      }
    });
  }
    // 导出
  handleExport() {
    const w = window.open('about:blank');
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const value = _.omit(values, 'dateRange');
        const query = this.props.matOutputDetailInfo.query;
        const condition = { ...query, ...value, ...{ outputState: '2' } };
        w.location.href = '/api/hcp/material/outputInfo/expertToExcel?data=' + JSON.stringify(condition);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'matOutputDetailInfo/setState',
      payload: { query: { outputState: '2' } },
    });
  }

  doSearch(values) {
    const condition = { ...values, ...{ outputState: '2' } };
    this.props.dispatch({
      type: 'matOutputDetailInfo/loadOutputDetail',
      payload: {
        queryCon: condition,
      },
    });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    const { typeData, deptData, materialType, totalSum, pageSum } = this.props.matOutputDetailInfo;
    const { getFieldDecorator } = this.props.form;
     // 构造出库类型select
    let typeOptions = [];
    if (typeData) {
      typeOptions = typeData.map(type => <Option key={type.columnKey}>{type.columnVal}</Option>);
    }

    // 构造物资分类select
    let materialOptions = [];
    if (materialType) {
      materialOptions = materialType.map(material => <Option key={material.columnKey}>{material.columnVal}</Option>);
    }


    // 构造出库科室select
    let deptOptions = [];
    if (deptData) {
      deptOptions = deptData.map(dept => <Option key={dept.id}>{dept.deptName}</Option>);
    }


    return (
      <Form inline >
        <Row type="flex" style={{ marginBottom: '5px' }} >
          <Col span={20} >
            <FormItem>
              { getFieldDecorator('materialType')(
                <Select style={{ width: '90px' }} placeholder="物资分类" allowClear>
                  {materialOptions}
                </Select>)}
            </FormItem>
            <FormItem>
              { getFieldDecorator('outType')(
                <Select style={{ width: '80px' }} placeholder="出库类型" allowClear >
                  {typeOptions}
                </Select>)}
            </FormItem>
            <FormItem>
              { getFieldDecorator('deptInfo.id')(
                <Select placeholder="出库科室" style={{ width: '80px' }} allowClear>
                  {deptOptions}
                </Select>)}
            </FormItem>
            <FormItem>
              { getFieldDecorator('outBill')(
                <Input style={{ width: '80px' }} placeholder="出库单号" />,
              )}
            </FormItem>
            <FormItem style={{ display: 'none' }}>
      	  		{getFieldDecorator('companyInfo.id')(<Input />)}
      	  	</FormItem>
            <FormItem>
              { getFieldDecorator('companyName')(
                <CompanySearchInput
                  placeholder="供货商"
      	          companyType={['2']}
      	          services={['2']}
      	          onSelect={(value)=>this.onSelect(value)}
      	          style={{ width: '150px' }} />                  
                )
              }
            </FormItem>
            <FormItem>
              { getFieldDecorator('dateRange')(
                <RangePicker
                  ranges={{ 今天: [moment(), moment()], 本月: [moment(), moment().endOf('month')] }}
                  format={dateFormat}
                  style={{ width: '200px' }}
                  onChange={this.onDateChange}
                />,
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" size="large" onClick={() => this.handleSubmit()}>查询</Button>
            </FormItem>
            <FormItem>
              <Button size="large" onClick={() => this.handleReset()}>清空</Button>
            </FormItem>
          </Col>
          <Col span={4} className="action-form-operating" style={{ textAlign: 'right' }} >
            <FormItem>
              <Button size="large" onClick={() => this.handleExport()} icon="export">导出</Button>
            </FormItem>
          </Col>
        </Row>
        {/*<Row type="flex" justify="space-around" style={{ padding: '6px' }}>
          <Col span="8" >
            <FormItem label="金额总计" {...formItemLayout} style={{ width: '100%' }}>
              <div >{totalSum[0] ? totalSum[0].formatMoney() : 0.00}</div>
            </FormItem>
          </Col>
          <Col span="8" >
            <FormItem label="金额小计" {...formItemLayout} style={{ width: '100%' }} >
              <div >{pageSum ? pageSum.formatMoney() : 0.00}</div>
            </FormItem>
          </Col>
          <Col span="2" />
        </Row>*/}
      </Form>
    );
  }
}
const OutStockForm = Form.create()(SelectForm);
export default connect(({ matOutputDetailInfo }) => ({ matOutputDetailInfo }))(OutStockForm);
