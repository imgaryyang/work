import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

import styles from './ProcureInstock.less';

const FormItem = Form.Item;

class ProcureInstockSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSubmit() {
    const search = this.props.onSearch;
    // console.info('bar handleSubmit ', search);
    this.props.form.validateFields((err, values) => {
      // console.info('---onSearch----', values);
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
      <Form inline style={{ paddingBottom: 5 }} >
        <FormItem {...formItemLayout} >
          {getFieldDecorator('buyBill')(
            <Input
              placeholder="物资采购单号"
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
const ProcureSearchBarForm = Form.create()(ProcureInstockSearchBar);
export default connect()(ProcureSearchBarForm);

