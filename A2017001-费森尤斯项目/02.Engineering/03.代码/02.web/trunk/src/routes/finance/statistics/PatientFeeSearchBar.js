import { connect } from 'dva';
import React, { Component } from 'react';
import { DatePicker, Form, Input, Button, Row, Col } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class PatientFeeSearchBar extends Component {

  constructor(props) {
    super(props);
    this.onSearch = ::this.onSearch;
    this.handlePrint = ::this.handlePrint;
    this.handleExport = ::this.handleExport;
  }

  onSearch() {
    this.props.form.validateFields((err, values) => {
      console.log(values);
      if (err) return;
      this.props.dispatch({
        type: 'financeStatistics/loadPatientFee',
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
    w.location.href = `/api/hcp/finance/statistics/exportPatientFee?data= ${JSON.stringify(json)}`;
  }

  render() {
    const { financeStatistics, form } = this.props;
    const { getFieldDecorator } = form;
    const { patientFeeQuery } = financeStatistics;

    return (
      <Form inline style={{ marginBottom: '10px' }} >
        <Row>
          <Col span={18} >
            <FormItem>
              { getFieldDecorator('dateRange', {
                initialValue: patientFeeQuery.dateRange || [moment(), moment()],
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
          </Col>
          <Col span={3} style={{ paddingRight: '3px' }} >
            <Button onClick={this.handleExport.bind(this)} type="primary" size="large" style={{ width: '100%' }} icon="reload" >导出</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const PatientFeeSearchBarForm = Form.create()(PatientFeeSearchBar);
export default connect(
  ({ financeStatistics }) => ({ financeStatistics }),
)(PatientFeeSearchBarForm);
