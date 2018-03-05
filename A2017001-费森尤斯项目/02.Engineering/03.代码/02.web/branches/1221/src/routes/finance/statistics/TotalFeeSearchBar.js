import { connect } from 'dva';
import React, { Component } from 'react';
import { DatePicker, Form, Select, Button, Row, Col, notification } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;

class TotalFeeSearchBar extends Component {

  constructor(props) {
    super(props);
    this.onSearch = ::this.onSearch;
  }

  onSearch() {
    this.props.form.validateFields((err, values) => {
      // console.log(values);
      if (err) return;
      if (moment(values.startMonth).format('YYYY-MM') > moment(values.endMonth).format('YYYY-MM')) {
        notification.warning({
          message: '警告',
          description: '终止月份不能小于起始月份！',
        });
        return;
      }
      // console.log(moment(values.endMonth).diff(moment(values.startMonth), 'months'));
      if (moment(values.endMonth).diff(moment(values.startMonth), 'months') >= 12) {
        notification.warning({
          message: '警告',
          description: '查询区间不能超过1年！',
        });
        return;
      }
      this.props.dispatch({
        type: 'financeStatistics/loadTotalFee',
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
    const json = data && data.startMonth && data.endMonth ?
    { startMonth: moment(data.startMonth).format('YYYY-MM'), endMonth: moment(data.endMonth).format('YYYY-MM') } :
    { startMonth: moment().format('YYYY-MM'), endMonth: moment().format('YYYY-MM') };
    w.location.href = `/api/hcp/finance/statistics/exportTotalFee?data= ${JSON.stringify(json)}`;
  }
  render() {
    const { financeStatistics, form, base } = this.props;
    const { getFieldDecorator } = form;
    const { totalFeeQuery, hospitalList } = financeStatistics;
    const { chanel } = totalFeeQuery;
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
            <FormItem>
              { getFieldDecorator('startMonth', {
                initialValue: totalFeeQuery.startMonth || moment(),
              })(
                <MonthPicker
                  format="YYYY-MM"
                  placeholder="开始月份"
                  allowClear={false}
                />,
              )}
            </FormItem>
            <FormItem>
              { getFieldDecorator('endMonth', {
                initialValue: totalFeeQuery.endMonth || moment(),
              })(
                <MonthPicker
                  format="YYYY-MM"
                  placeholder="结束月份"
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

const TotalFeeSearchBarForm = Form.create()(TotalFeeSearchBar);
export default connect(
  ({ financeStatistics, base }) => ({ financeStatistics, base }),
)(TotalFeeSearchBarForm);
