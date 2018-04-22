import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

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
      <Form inline style={{ marginBottom: '10px' }} >
        <FormItem>
          {getFieldDecorator('name')(
            <Input placeholder="中文名" onPressEnter={this.handleSubmit} />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('idNo')(
            <Input placeholder="身份证号" onPressEnter={this.handleSubmit} />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('mobile')(
            <Input placeholder="手机" onPressEnter={this.handleSubmit} />,
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="button" size="large" onClick={this.handleSubmit} >查询</Button>
        </FormItem>
        <FormItem>
          <Button onClick={this.handleReset} size="large" >清空</Button>
        </FormItem>
      </Form>
    );
  }
}
const SearchBarForm = Form.create()(SearchBar);
export default connect()(SearchBarForm);
