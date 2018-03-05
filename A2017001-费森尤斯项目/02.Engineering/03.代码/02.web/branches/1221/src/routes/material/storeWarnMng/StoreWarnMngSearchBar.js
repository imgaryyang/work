import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class StoreWarnMngSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const search = this.props.onSearch;

    this.props.form.validateFields((err, values) => {
      if (!err && search)search(values);
    });
    // this.props.form.resetFields();
  }

  handleReset() {
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form inline >
        <FormItem>
          {getFieldDecorator('tradeName', {
            rules: [{ max: 50, message: '查询码不能超过50个字符' }],
          })(<Input style={{ width: 200, marginRight: 5 }} placeholder="查询码(名称/拼音/五笔/编码/条码)" maxLength={50} />)}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSubmit} >查询</Button>
        </FormItem>
      </Form>
    );
  }
}

const StoreWarnMngSearchBarForm = Form.create()(StoreWarnMngSearchBar);
export default connect()(StoreWarnMngSearchBarForm);
