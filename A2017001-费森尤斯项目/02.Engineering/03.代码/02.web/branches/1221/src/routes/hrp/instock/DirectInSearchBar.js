import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';


const FormItem = Form.Item;

class DirectInSearchBar extends Component {

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
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form style={{ paddingBottom: '10' }} inline>
        <FormItem>
          {getFieldDecorator('tradeName')(
            <Input placeholder="资产" />,
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSubmit} >查询</Button>
        </FormItem>
      </Form>
    );
  }
}
const DirectInSearchBarForm = Form.create()(DirectInSearchBar);
export default connect(({ hrpDirectIn }) => ({ hrpDirectIn }))(DirectInSearchBarForm);

