import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button } from 'antd';

const FormItem = Form.Item;

class UserSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSubmit() {
    const search = this.props.onSearch;
    // console.info('bar handleSubmit ',search);
    this.props.form.validateFields((err, values) => {
      if (!err && search) {
        search(values);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form inline onSubmit={this.handleSubmit.bind(this)}>
        <FormItem>
          {getFieldDecorator('settleNo')(
            <Input placeholder="结算单号" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('idNo')(
            <Input placeholder="身份证号" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('mobile')(
            <Input placeholder="手机" />,
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" size="large" icon="search" >查询</Button>
        </FormItem>
        <FormItem>
          <Button onClick={this.handleReset.bind(this)} size="large" icon="reload" >清空</Button>
        </FormItem>
      </Form>
    );
  }
}
const UserSearchBarForm = Form.create()(UserSearchBar);
export default connect()(UserSearchBarForm);

