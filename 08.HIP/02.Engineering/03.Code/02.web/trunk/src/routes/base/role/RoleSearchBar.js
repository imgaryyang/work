import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class RoleSearchBar extends Component {

  handleSubmit() {
    const search = this.props.onSearch;
    // console.info('bar handleSubmit ', search);
    this.props.form.validateFields((err, values) => {
      if (!err && search)search(values);
    });
  }
  handleReset() {
    this.props.form.resetFields();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form inline>
        <FormItem>
          {getFieldDecorator('name')(
            <Input placeholder="名称" style={{ width: '120px' }} onPressEnter={this.handleSubmit.bind(this)} />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('code')(
            <Input placeholder="编码" style={{ width: '100px' }} onPressEnter={this.handleSubmit.bind(this)} />,
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSubmit.bind(this)} icon="search" >查询</Button>
        </FormItem>
        <FormItem>
          <Button onClick={this.handleReset.bind(this)} icon="reload" >清空</Button>
        </FormItem>
      </Form>
    );
  }
}
const RoleSearchBarForm = Form.create()(RoleSearchBar);
export default connect()(RoleSearchBarForm);

