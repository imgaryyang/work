import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class ProcureSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const search = this.props.onSearch;
    // console.info('bar handleSubmit ', search);
    this.props.form.validateFields((err, values) => {
      // console.info('---onSearch----', values);
      if (!err && search)search(values);
    });
    this.props.form.getFieldInstance('commonName').refs.input.select();
    // this.props.form.resetFields();
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
          {getFieldDecorator('commonName')(
            <Input
              placeholder="物资名称/条码"
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
const ProcureSearchBarForm = Form.create()(ProcureSearchBar);
export default connect()(ProcureSearchBarForm);

