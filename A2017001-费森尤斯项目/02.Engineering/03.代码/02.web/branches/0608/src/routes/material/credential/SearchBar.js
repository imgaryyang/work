import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, DatePicker } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSubmit() {
    const search = this.props.onSearch;
    this.props.form.validateFields((err, values) => {
      if (err) return;
      if (!err && search) {
        search(values);
      }
    });
  }

  handleReset() {
    this.props.dispatch({
      type: 'credential/setState',
      payload: {
        query: {},
      },
    });
    this.props.form.resetFields();
  }

  render() {
    const { credential, form } = this.props;
    const { getFieldDecorator } = form;
    const { query } = credential;
    return (
      <Form inline>
        <FormItem>
          {
            getFieldDecorator('regNo', {
              initialValue: query.regNo,
            })(<Input style={{ width: '100%' }} maxLength={30} placeholder="证书号" />)
          }
        </FormItem>
        <FormItem>
          {
            getFieldDecorator('regStartDate', {
              initialValue: typeof query.regStartDate !== 'undefined' && query.regStartDate !== null ? moment(query.regStartDate) : null,
            })(
              <DatePicker style={{ width: '100%' }} placeholder="开始时间" />,
            )
          }
        </FormItem>
        <FormItem>
          {
            getFieldDecorator('regStopDate', {
              initialValue: typeof query.regStopDate !== 'undefined' && query.regStopDate !== null ? moment(query.regStopDate) : null,
            })(
              <DatePicker style={{ width: '100%' }} placeholder="结束时间" />,
            )
          }
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSubmit} size="large" icon="search" >查询</Button>
        </FormItem>
        <FormItem>
          <Button onClick={this.handleReset} size="large" icon="reload" >清空</Button>
        </FormItem>
      </Form>
    );
  }
}
const SearchBarForm = Form.create()(SearchBar);
export default connect(
  ({ credential }) => ({ credential }),
)(SearchBarForm);

