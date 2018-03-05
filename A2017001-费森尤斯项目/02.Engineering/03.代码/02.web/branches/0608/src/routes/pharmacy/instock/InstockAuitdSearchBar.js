import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class InstockAuitdSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSubmit() {
    const search = this.props.onSearch;
    this.props.form.validateFields((err, values) => {
      if (!err && search)search(values);
    });
    this.props.form.resetFields();
  }

  handleReset() {
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
      style: { width: '100%' },
    };
    return (
      <Form inline style={{ paddingBottom: '5px' }} >
        <FormItem {...formItemLayout} >
          {getFieldDecorator('appBill')(
            <Input
              placeholder="请领单"
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

const InstockAuitdSearchBarForm = Form.create()(InstockAuitdSearchBar);
export default connect()(InstockAuitdSearchBarForm);

