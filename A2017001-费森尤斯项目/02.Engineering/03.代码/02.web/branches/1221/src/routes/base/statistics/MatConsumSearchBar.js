import { connect } from 'dva';
import React, { Component } from 'react';
import { DatePicker, Form, Button, Row, Col, notification, Input } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

class MatConsumSearchBar extends Component {

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
        type: 'financeStatistics/loadMatConsum',
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
    w.location.href = `/api/hcp/finance/statistics/exportMatConsum?data= ${JSON.stringify(json)}`;
  }
  render() {
    const { financeStatistics, form } = this.props;
    const { getFieldDecorator } = form;
    const { matConsumQuery } = financeStatistics;

    return (
      <Form inline style={{ marginBottom: '10px' }} >
        <Row>
          <Col span={18} >
            <FormItem style={{ display: 'none' }}>
              {getFieldDecorator('chanel', { initialValue: matConsumQuery.chanel })(<Input />)}
            </FormItem>
            <FormItem>
              { getFieldDecorator('startTime', {
                initialValue: matConsumQuery.startTime || moment(),
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
                initialValue: matConsumQuery.endTime || moment(),
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
          </Col>
          <Col span={3} style={{ paddingRight: '3px' }} >
            <Button onClick={this.handleExport.bind(this)} size="large" type="primary" style={{ width: '100%' }} icon="reload" >导出</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const MatConsumSearchBarForm = Form.create()(MatConsumSearchBar);
export default connect(
  ({ financeStatistics }) => ({ financeStatistics }),
)(MatConsumSearchBarForm);
