import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Checkbox } from 'antd';

const FormItem = Form.Item;

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
// 含过期 true 不含过期 false
    const { incInvalid } = this.props.credentialWarn.query;
    this.props.dispatch({
      type: 'credentialWarn/setState',
      payload: {
        query: { incInvalid: !incInvalid },
      },
    });
  }

  handleSubmit() {
    const search = this.props.onSearch;
    this.props.form.validateFields((err, values) => {
      if (err) return;
      if (!err && search) {
        search(values);
      }
    });
  }


  handleReset() {
    this.props.dispatch({
      type: 'credentialWarn/setState',
      payload: {
        query: {},
      },
    });
    this.props.form.resetFields();
  }

  render() {
    const { credentialWarn, form } = this.props;
    const { getFieldDecorator } = form;
    const { query, warnDate } = credentialWarn;
    return (
      <Form inline>
        <FormItem label="预警天数">
          {
            getFieldDecorator('warnDate', {
              initialValue: warnDate,
            })(<Input style={{ width: '100%' }} maxLength={30} />)
          }
        </FormItem>
        <FormItem>
          <Checkbox defaultChecked={false} onChange={this.onChange}>含过期</Checkbox>
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSubmit} size="large" icon="search" >查询</Button>
        </FormItem>
      </Form>
    );
  }
}
const SearchBarForm = Form.create()(SearchBar);
export default connect(
  ({ credentialWarn }) => ({ credentialWarn }),
)(SearchBarForm);

