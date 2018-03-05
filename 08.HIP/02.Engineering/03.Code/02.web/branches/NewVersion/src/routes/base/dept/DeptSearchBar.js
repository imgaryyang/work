import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'dva';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, Spin } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class MngMenuSearchBar extends React.Component {
  constructor(props) {
	    super(props);
  }

  handleSubmit(e) {
    const search = this.props.onSearch;
    console.info('bar handleSubmit ', search);
    this.props.form.validateFields((err, values) => {
      if (!err && search)search(values);
    });
  }
  handleReset() {
	    this.props.form.resetFields();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    // const getFieldDecorator = this.props.form.getFieldDecorator;
    return (
      <Form inline>
        <FormItem>
          {getFieldDecorator('deptName')(<Input placeholder="科室名称" />)}
        </FormItem>
          <FormItem>
            {getFieldDecorator('otherName')(<Input placeholder="别名" />)}
          </FormItem>
            <FormItem>
              {getFieldDecorator('eName')(<Input placeholder="英文名称" />)}
            </FormItem>
              <FormItem>
                <Button type="primary" onClick={this.handleSubmit.bind(this)}>查询</Button>
              </FormItem>
                <FormItem>
                  <Button type="primary" onClick={this.handleReset.bind(this)}>清空</Button>
                </FormItem>
      </Form>
    );
  }
}
const MngMenuSearchBarForm = Form.create()(MngMenuSearchBar);
export default connect()(MngMenuSearchBarForm);

