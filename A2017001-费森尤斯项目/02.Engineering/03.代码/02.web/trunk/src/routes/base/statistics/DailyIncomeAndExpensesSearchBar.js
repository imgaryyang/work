import { connect } from 'dva';
import React, { Component } from 'react';
import { DatePicker, Form, Button, Row, Col, notification, Input, Select } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

class DailyIncomeAndExpensesSearchBar extends Component {

  constructor(props) {
    super(props);
    this.onSearch = ::this.onSearch;
  }

  onSearch() {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      if (moment(values.startTime).format('YYYY-MM-DD') > moment(values.endTime).format('YYYY-MM-DD')) {
        notification.warning({
          message: '警告',
          description: '终止日期不能小于起始日期！',
        });
        return;
      }
      if (moment(values.endTime).diff(moment(values.startTime), 'months') >= 12) {
        notification.warning({
          message: '警告',
          description: '查询区间不能超过1年！',
        });
        return;
      }
      this.props.dispatch({
        type: 'financeStatistics/loadDailyIncomeAndExpenses',
        payload: {
          query: values,
          startFrom0: true,
        },
      });
    });
  }

  handlePrint() {

  }

  handleExport() {
    const data = this.props.form.getFieldsValue();
    const w = window.open('about:blank');
    const json = data ?
    { startTime: data.startTime ? moment(data.startTime).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'), endTime: data.endTime ? moment(data.endTime).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'), chanel: data.chanel ? data.chanel : '' } :
    { startTime: moment().format('YYYY-MM-DD'), endTime: moment().format('YYYY-MM-DD'), chanel: data.chanel ? data.chanel : '' };
    w.location.href = `/api/hcp/finance/statistics/exportDailyIncomeAndExpenses?data= ${JSON.stringify(json)}`;
  }
  render() {
    const { financeStatistics, form, base } = this.props;
    const { getFieldDecorator } = form;
    const { incomeAndExpensesQuery, hospitalList } = financeStatistics;
    const { chanel } = incomeAndExpensesQuery;
    const { user } = base;
    let options = [];
    options.push(<Option value=""> 全部</Option>);
    if (hospitalList && hospitalList.length > 0) {
      for (const hos of hospitalList) {
        options.push(<Option value={hos.hosId}> {hos.hosName}</Option>);
      }
    }
    return (
      <Form inline style={{ marginBottom: '10px' }} >
        <Row>
          <Col span={3} style={{ paddingRight: '3px' }} >
            <FormItem style={{ width: '100%' }}>
              { getFieldDecorator('hosId', {
                initialValue: chanel === 'person' ? user.hosId : '',
              })(
                <Select style={{ width: '160px' }} disabled={chanel ==='person' ? 'true' : ''}  allowClear = 'true'>{options}</Select>,
                )}
            </FormItem>
          </Col>
          <Col span={18} >
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('chanel', { initialValue: incomeAndExpensesQuery.chanel })(<Input />)}
            </FormItem>
            <FormItem>
              { getFieldDecorator('startTime', {
                initialValue: incomeAndExpensesQuery.startTime || moment(),
              })(
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="开始日期"
                  allowClear={false}
                />,
              )}
            </FormItem>
            <FormItem>
              { getFieldDecorator('endTime', {
                initialValue: incomeAndExpensesQuery.endTime || moment(),
              })(
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="结束日期"
                  allowClear={false}
                />,
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" icon="search" onClick={this.onSearch} >搜索</Button>
            </FormItem>
          </Col>
          <Col span={3} style={{ paddingRight: '3px' }} >
            <Button onClick={this.handleExport.bind(this)} size="large" type="primary" style={{ width: '100%' }} icon="reload" >导出</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const DailyIncomeAndExpensesSearchBarForm = Form.create()(DailyIncomeAndExpensesSearchBar);
export default connect(
  ({ financeStatistics, base }) => ({ financeStatistics, base }),
)(DailyIncomeAndExpensesSearchBarForm);
