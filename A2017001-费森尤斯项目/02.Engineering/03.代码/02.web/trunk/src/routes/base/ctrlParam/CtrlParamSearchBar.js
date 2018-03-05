import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class CtrlParamSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) this.doSearch(values);
    });
  }

  doSearch(values) {
    if (typeof this.props.onSearch === 'function') { this.props.onSearch(values); }
  }

  handleReset() {
    this.props.form.resetFields();
    this.doSearch(this.props.form.getFieldsValue());
  }

  render() {
    const { selectedType } = this.props.ctrlParam;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form inline>
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('columnGroup', {
            initialValue: selectedType.code ? selectedType.group : '',
          })(
            <Input placeholder="列名称" />,
          )}
        </FormItem>
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('columnName', {
            initialValue: selectedType.type === '2' ? selectedType.code : '',
          })(
            <Input placeholder="列名称" />,
          )}
        </FormItem>
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('columnDis', {
            initialValue: selectedType.type === '2' ? selectedType.dis : '',
          })(
            <Input placeholder="列显示" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('controlId')(
            <Input placeholder="控制id" onPressEnter={this.handleSubmit} />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('controlNote')(
            <Input placeholder="控制说明" onPressEnter={this.handleSubmit} />,
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" size="large" icon="search" onClick={this.handleSubmit} >查询</Button>
        </FormItem>
        <FormItem>
          <Button htmlType="reset" onClick={this.handleReset} size="large" icon="reload" >清空</Button>
        </FormItem>
      </Form>
    );
  }
}
const CtrlParamSearchBarForm = Form.create()(CtrlParamSearchBar);
export default connect(({ ctrlParam }) => ({ ctrlParam }))(CtrlParamSearchBarForm);
