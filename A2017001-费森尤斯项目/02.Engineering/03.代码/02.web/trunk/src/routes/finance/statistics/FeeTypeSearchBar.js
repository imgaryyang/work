import { connect } from 'dva';
import React, { Component } from 'react';
import { DatePicker, Form, Select, Button, Row, Col } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class FeeTypeSearchBar extends Component {

  constructor(props) {
    super(props);
    this.onSearch = ::this.onSearch;
    this.handlePrint = ::this.handlePrint;
    this.handleExport = ::this.handleExport;
  }

  onSearch() {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.props.dispatch({
        type: 'financeStatistics/loadFeeType',
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
    const w = window.open('about:blank');
    const data = this.props.form.getFieldsValue();
    const json = data && data.dateRange ? { startDate: moment(data.dateRange[0]).format('YYYY-MM-DD'), endDate: moment(data.dateRange[1]).format('YYYY-MM-DD') } : {};
    w.location.href = `/api/hcp/finance/statistics/exportFeeType?data= ${JSON.stringify(json)}`;
  }

  render() {
    const { financeStatistics, form, base } = this.props;
    const { getFieldDecorator } = form;
    const { feeTypeQuery, hospitalList } = financeStatistics;
    const { chanel } = feeTypeQuery;
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
              { getFieldDecorator('dateRange', {
                initialValue: feeTypeQuery.dateRange || [moment(), moment()],
              })(
                <RangePicker
                  format="YYYY-MM-DD"
                />,
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" icon="search" onClick={this.onSearch} >搜索</Button>
            </FormItem>
          </Col>
          <Col span={3} style={{ paddingRight: '3px' }} >
            <Button onClick={this.handleExport.bind(this)} type="primary" size="large" style={{ width: '100%' }} icon="reload" >导出</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const FeeTypeSearchBarForm = Form.create()(FeeTypeSearchBar);
export default connect(
  ({ financeStatistics, base }) => ({ financeStatistics, base }),
)(FeeTypeSearchBarForm);
