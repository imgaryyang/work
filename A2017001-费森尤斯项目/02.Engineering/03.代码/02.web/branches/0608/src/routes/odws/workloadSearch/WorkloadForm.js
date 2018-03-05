import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Input, Button, Row, Col, DatePicker, Select, Form, Card } from 'antd';
import DataSourceSelect from '../../../components/DataSourceSelect';
import styles from './Workload.less';

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
    this.doSearch = this.doSearch.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'workloadSearch/loadWordloadListDetail',
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
        type: 'workloadSearch/setState',
        payload: { query: { dateRange: dateRange.dateRange } },
      });
    } else {
      this.props.dispatch({
        type: 'workloadSearch/setState',
        payload: { query: { dateRange: null } },
      });
    }
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
        const query = this.props.workloadSearch.query;
        const condition = { ...query, ...value };
        w.location.href = '/api/hcp/odws/workloadSearch/expertToExcel?data=' + JSON.stringify(condition);
      }
    });
  }
    // 打印预留
  handlePrint() {
  }

  handleReset() {
    this.props.form.resetFields();
  }

  doSearch(values) {
    const condition = { ...values };
    this.props.dispatch({
      type: 'workloadSearch/loadWordloadListDetail',
      payload: {
        queryCon: condition,
      },
    });
  }

  render() {
    const { deptData } = this.props.workloadSearch;
    const { getFieldDecorator } = this.props.form;

    // 构造科室名称select
    let deptOptions = [];
    if (deptData) {
      deptOptions = deptData.map(dept => <Option key={dept.id}>{dept.deptName}</Option>);
    }

    return (
      <Form inline >
        <Card className={styles.infoCard} >
          <Row type="flex" justify="space-between" >
            <Col span="20">
              <FormItem>
                { getFieldDecorator('exeDept.id')(
                  <Select placeholder="科室名称" style={{ width: 110, marginRight: 5 }} allowClear>
                    {deptOptions}
                  </Select>)}
              </FormItem>
              <FormItem>
                { getFieldDecorator('dateRange')(
                  <RangePicker
                    ranges={{ 今天: [moment(), moment()], 本月: [moment(), moment().endOf('month')] }}
                    format={dateFormat}
                    style={{ width: '400px' }}
                    onChange={this.onDateChange}
                  />,
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" size="large" onClick={() => this.handleSubmit()} icon="search" >查询</Button>
              </FormItem>
              <FormItem>
                <Button size="large" onClick={() => this.handleReset()} icon="reload" >清空</Button>
              </FormItem>
            </Col>
            <Col span="4" style={{ textAlign: 'right' }}>
              <FormItem>
                <Button type="primary" size="large" onClick={() => this.handlePrint()} icon="printer" >打印</Button>
              </FormItem>
              <FormItem>
                <Button size="large" onClick={() => this.handleExport()} icon="export" >导出</Button>
              </FormItem>
            </Col>
          </Row>
        </Card>
      </Form>
    );
  }
}
const WorkloadForm = Form.create()(SelectForm);
export default connect(({ workloadSearch }) => ({ workloadSearch }))(WorkloadForm);
