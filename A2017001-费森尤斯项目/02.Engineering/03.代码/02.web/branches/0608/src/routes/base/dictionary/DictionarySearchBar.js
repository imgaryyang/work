import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class DictSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }

  componentWillReceiveProps(props) {
    if (this.props.dict.selectedType.code !== props.dict.selectedType.code) {
      const selectedType = props.dict.selectedType;
      const formValues = this.props.form.getFieldsValue();
      // console.log('formValues:', formValues);
      const values = {
        ...formValues,
        columnGroup: selectedType.code ? selectedType.group : '',
        columnName: selectedType.type === '2' ? selectedType.code : '',
        columnDis: selectedType.type === '2' ? selectedType.dis : '',
      };
      // console.log('values:', values);
      this.doSearch(values);
    }
  }

  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) this.doSearch(values);
    });
  }

  doSearch(values) {
    // console.log('search values:', values);
    if (typeof this.props.onSearch === 'function') { this.props.onSearch(values); }
  }

  handleReset() {
    this.props.form.resetFields();
    this.doSearch(this.props.form.getFieldsValue());
  }

  render() {
    const { selectedType } = this.props.dict;
    // console.log(selectedType);
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
          {getFieldDecorator('columnKey')(
            <Input placeholder="键" onPressEnter={this.handleSubmit} />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('columnVal')(
            <Input placeholder="值" onPressEnter={this.handleSubmit} />,
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSubmit} size="large" icon="search" >查询</Button>
        </FormItem>
        <FormItem>
          <Button htmlType="reset" onClick={this.handleReset} size="large" icon="reload" >清空</Button>
        </FormItem>
      </Form>
    );
  }
}
const DictSearchBarForm = Form.create()(DictSearchBar);
export default connect(({ dict }) => ({ dict }))(DictSearchBarForm);

