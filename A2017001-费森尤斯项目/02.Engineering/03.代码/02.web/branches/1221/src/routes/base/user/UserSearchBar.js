import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

import DeptSelect from '../../../components/DeptSelect';

const FormItem = Form.Item;

class UserSearchBar extends Component {

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
    this.props.search();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form inline>
        <FormItem>
          {
            getFieldDecorator('deptId')(
              <DeptSelect placeholder="所属科室" style={{ width: '126px' }} allowClear />,
            )
          }
        </FormItem>
        <FormItem>
          {getFieldDecorator('name')(
            <Input placeholder="中文名" onPressEnter={this.handleSubmit}/>,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('idNo')(
            <Input placeholder="身份证号" maxLength={18} onPressEnter={this.handleSubmit}/>,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('mobile')(
            <Input placeholder="手机" maxLength={11} onPressEnter={this.handleSubmit}/>,
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSubmit} size="large" icon="search" >查询</Button>
        </FormItem>
        <FormItem>
          <Button onClick={this.handleReset.bind(this)} size="large" icon="reload" style={{ width: '100%' }} >清空</Button>
        </FormItem>
      </Form>
    );
  }
}
const UserSearchBarForm = Form.create()(UserSearchBar);
export default connect()(UserSearchBarForm);

