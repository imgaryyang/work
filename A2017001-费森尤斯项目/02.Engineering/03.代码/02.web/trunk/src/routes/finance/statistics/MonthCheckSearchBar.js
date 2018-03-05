import { connect } from 'dva';
import React, { Component } from 'react';
import { Form, Button, Row, Col, notification, Input, Select } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

class MonthCheckSearchBar extends Component {

  constructor(props) {
    super(props);
    this.onSearch = ::this.onSearch;
  }

  onSearch() {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      if (values.startTime >= values.endTime) {
        notification.warning({
          message: '警告',
          description: '终止日期小于等于起始日期！',
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
        type: 'financeStatistics/loadMonthCheck',
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
    { startTime: data.startTime ? moment(data.startTime).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss'), endTime: data.endTime ? moment(data.endTime).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss'), chanel: data.chanel ? data.chanel : '' } :
    { startTime: moment().format('YYYY-MM-DD HH:mm:ss'), endTime: moment().format('YYYY-MM-DD HH:mm:ss'), chanel: data.chanel ? data.chanel : '' };
    w.location.href = `/api/hcp/finance/statistics/exportMonthCheck?data= ${JSON.stringify(json)}`;
  }
  render() {
    const { financeStatistics, form } = this.props;
    const { getFieldDecorator } = form;
    const { monthCheckQuery, checkTimeList } = financeStatistics;
    let option = [];
    if (checkTimeList && checkTimeList.length > 0) {
      for (const d of checkTimeList) {
        option.push(<Option value={d}>{moment(d).format('YYYY-MM-DD')}</Option>);
      }
    }
    return (
      <Form inline style={{ marginBottom: '10px' }} >
        <Row>
          <Col span={18} >
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('chanel', { initialValue: monthCheckQuery.chanel })(<Input />)}
            </FormItem>
            <FormItem>
              { getFieldDecorator('startTime')(<Select style={{ width: '180px' }} placeholder="开始时间"  allowClear = 'true'>{option}</Select>)}
            </FormItem>
            <FormItem>
              { getFieldDecorator('endTime')(<Select style={{ width: '180px' }} placeholder="结束时间"  allowClear = 'true'>{option}</Select>)}
            </FormItem>
            <FormItem>
              <Button type="primary" icon="search" onClick={this.onSearch} >搜索</Button>
            </FormItem>
          </Col>
          <Col span={3} style={{ paddingRight: '3px' }} >
          </Col>
          <Col span={3} style={{ paddingRight: '3px' }} >
            <Button onClick={this.handleExport.bind(this)} size="large" type="primary" style={{ width: '100%' }} icon="reload" >导出</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const MonthCheckSearchBarForm = Form.create()(MonthCheckSearchBar);
export default connect(
  ({ financeStatistics }) => ({ financeStatistics }),
)(MonthCheckSearchBarForm);
