import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class DirectInventorySearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) this.doSearch(values);
    });
  }

  doSearch(values) {
    if (typeof this.props.A === 'function') { this.props.A(values); }
  }

  render() {
    /* CommonItemSearchInput : 0 - 收费项目 ；1 - 药品 */
    const { getFieldDecorator } = this.props.form;
    const { user } = this.props.base;
    // console.info('登录信息', user);

    const deptId = user.loginDepartment.id;
    const hosId = user.hosId;
    const deptName = user.loginDepartment.deptName;
    const userName = user.name;
    // console.info(userName);
    const formItemLayout = {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
      style: { width: '100%' },
    };

    return (
      <Form inline style={{ paddingBottom: '5px' }} >
        <FormItem style={{ display: 'none' }}>
          {getFieldDecorator('userName', { initialValue: userName })(
            <Input placeholder="姓名" style={{ width: '100px' }} />,
          )}
        </FormItem>
        <FormItem style={{ display: 'none' }}>
          {getFieldDecorator('deptId', { initialValue: deptId })(
            <Input placeholder="部门" style={{ width: '100px' }} />,
          )}
        </FormItem>
        <FormItem style={{ display: 'none' }}>
          {getFieldDecorator('hosId', { initialValue: hosId })(
            <Input placeholder="医院" style={{ width: '100px' }} />,
          )}
        </FormItem>
        <FormItem style={{ display: 'none' }}>
          {getFieldDecorator('deptName', { initialValue: deptName })(
            <Input disabled placeholder="部门" style={{ width: '100px' }} />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} >
          {getFieldDecorator('commonName')(
            <Input
              placeholder="资产名称（汉字/拼音/条码）"
              addonAfter={
                <Button onClick={this.handleSubmit} icon="search" size="small" >查询</Button>
              }
              onPressEnter={this.handleSubmit}
              style={{ width: '100%' }}
            />,
          )}
        </FormItem>
      </Form>
    );
  }
}

const DirectInventorySearchBarForm = Form.create()(DirectInventorySearchBar);
export default connect(
  ({ hrpDirectIn, utils, base }) => ({ hrpDirectIn, utils, base }),
)(DirectInventorySearchBarForm);
