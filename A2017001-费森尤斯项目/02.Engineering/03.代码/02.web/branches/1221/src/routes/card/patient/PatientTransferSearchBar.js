import { connect } from 'dva';
import React, { Component } from 'react';
import { DatePicker, Form, Input, Button, Row, Col, notification } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { MonthPicker } = DatePicker;

class PatientTransferSearchBar extends Component {

  constructor(props) {
    super(props);
    this.onSearch = ::this.onSearch;
  }

  onSearch() {
    this.props.form.validateFields((err, values) => {
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
        type: 'patienttransfer/setState',
        payload: { patientTransferQuery: values },
      });
      this.props.dispatch({
        type: 'patienttransfer/loadPatientTransfer',
        payload: {
          query: values,
          startFrom0: true,
        },
      });
    });
  }
  render() {
    const { patienttransfer, form } = this.props;
    const { getFieldDecorator } = form;
    const { patientTransferQuery } = patienttransfer;

    return (
      <Form inline style={{ marginBottom: '10px' }} >
        <Row>
          <Col span={18} >
            <FormItem>
              { getFieldDecorator('startMonth', {
                initialValue: patientTransferQuery.startMonth || moment(),
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
                initialValue: patientTransferQuery.endMonth || moment(),
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
          </Col>
        </Row>
      </Form>
    );
  }
}

const PatientTransferSearchBarForm = Form.create()(PatientTransferSearchBar);
export default connect(
  ({ patienttransfer }) => ({ patienttransfer }),
)(PatientTransferSearchBarForm);
