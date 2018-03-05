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

    const search = this.props.onSearch;
    search();
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
            })(<Input style={{ width: '100%' }} maxLength={30} placeholder="证书号/证书名称" onPressEnter={this.handleSubmit}/>)
          }
        </FormItem>
        <FormItem>
          {
            getFieldDecorator('producerName', {
              initialValue: query.producerName,
            })(<Input style={{ width: '100%' }} maxLength={30} placeholder="厂商" onPressEnter={this.handleSubmit}/>)
          }
        </FormItem>
        <FormItem>
          {
            getFieldDecorator('tradeName', {
              initialValue: query.tradeName,
            })(<Input style={{ width: '100%' }} maxLength={30} placeholder="产品名称" onPressEnter={this.handleSubmit}/>)
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

