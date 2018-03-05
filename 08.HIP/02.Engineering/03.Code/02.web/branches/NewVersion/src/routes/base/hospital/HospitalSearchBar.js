import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

class HospitalSearchBar extends Component {
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
    const { getFieldDecorator } = this.props.form;
    return (
      <Form inline>
        <FormItem>
          {getFieldDecorator('hosName')(<Input placeholder="医院名称" />)}
        </FormItem>
          <FormItem>
            {getFieldDecorator('spellCode')(<Input placeholder="拼音" />)}
          </FormItem>
            <FormItem>
              {getFieldDecorator('wbCode')(<Input placeholder="五笔" />)}
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
const HospitalSearchBarForm = Form.create()(HospitalSearchBar);
export default connect(({ hospital }) => ({ hospital }))(HospitalSearchBarForm);
