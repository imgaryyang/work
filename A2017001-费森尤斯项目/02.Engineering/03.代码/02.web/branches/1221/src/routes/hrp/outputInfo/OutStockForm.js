import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Input, Button, Row, Col, DatePicker, Select, Form, Card } from 'antd';
import DataSourceSelect from '../../../components/DataSourceSelect';
import CompanySearchInput from '../../../components/searchInput/CompanySearchInput';
import styles from './OutputInfo.less';

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
    this.handlePrint = this.handlePrint.bind(this);
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
      type: 'hrpOutputDetailInfo/loadOutputDetail',
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
        type: 'hrpOutputDetailInfo/setState',
        payload: { query: { dateRange: dateRange.dateRange } },
      });
    } else {
      this.props.dispatch({
        type: 'hrpOutputDetailInfo/setState',
        payload: { query: { dateRange: null } },
      });
    }
  }

  onSelect(value) {
    this.props.dispatch({
      type: 'hrpOutputDetailInfo/setState',
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
        const query = this.props.hrpOutputDetailInfo.query;
        const condition = { ...query, ...value, ...{ outputState: '2' } };
        w.location.href = '/api/hcp/hrp/outputInfo/expertToExcel?data=' + JSON.stringify(condition);
      }
    });
  }
    // 打印预留
  handlePrint() {
  }

  handleReset() {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'hrpOutputDetailInfo/setState',
      payload: { query: { outputState: '2' } },
    });
  }

  doSearch(values) {
    const condition = { ...values, ...{ outputState: '2' } };
    this.props.dispatch({
      type: 'hrpOutputDetailInfo/loadOutputDetail',
      payload: {
        queryCon: condition,
      },
    });
  }

  render() {
    const { typeData, deptData } = this.props.hrpOutputDetailInfo;
    const { getFieldDecorator } = this.props.form;
     // 构造出库类型select
    let typeOptions = [];
    if (typeData) {
      typeOptions = typeData.map(type => <Option key={type.columnKey}>{type.columnVal}</Option>);
    }


    // 构造目标科室select
    let deptOptions = [];
    if (deptData) {
      deptOptions = deptData.map(dept => <Option key={dept.id}>{dept.deptName}</Option>);
    }


    return (
      <Form inline >
        <Card className={styles.infoCard} >
          <Row type="flex" justify="space-around" >
            <FormItem>
              { getFieldDecorator('outType')(
                <Select style={{ width: 100, marginRight: 5 }} placeholder="出库类型" allowClear >
                  {typeOptions}
                </Select>)}
            </FormItem>
            <FormItem>
              { getFieldDecorator('toDept.id')(
                <Select placeholder="目的科室" style={{ width: 100, marginRight: 5 }} allowClear>
                  {deptOptions}
                </Select>)}
            </FormItem>
            <FormItem>
              { getFieldDecorator('outBill')(
                <Input style={{ width: '100%' }} placeholder="出库单号" />,
              )}
            </FormItem>
            <FormItem>
              { getFieldDecorator('companyId')(
                <CompanySearchInput
                  placeholder="固资供货商"
                  companyType={['2']}
                  services={['3']}
                  onSelect={this.onSelect.bind(this)}
                  style={{ width: '200px' }}
                />)}
            </FormItem>
            <FormItem>
              { getFieldDecorator('dateRange')(
                <RangePicker
                  ranges={{ 今天: [moment(), moment()], 本月: [moment(), moment().endOf('month')] }}
                  format={dateFormat}
                  style={{ width: '300px' }}
                  onChange={this.onDateChange}
                />,
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" size="large" onClick={() => this.handleSubmit()}>查询</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" size="large" onClick={() => this.handleReset()}>清空</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" size="large" onClick={() => this.handlePrint()}>打印</Button>
            </FormItem>
            <FormItem>
              <Button type="primary" size="large" onClick={() => this.handleExport()}>导出</Button>
            </FormItem>
          </Row>
        </Card>
      </Form>
    );
  }
}
const OutStockForm = Form.create()(SelectForm);
export default connect(({ hrpOutputDetailInfo }) => ({ hrpOutputDetailInfo }))(OutStockForm);
