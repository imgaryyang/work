import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, DatePicker, notification } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

class TranSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  handleSubmit() {
    const search = this.props.onSearch;
    this.props.form.validateFields((err, values) => {
      if (err) return;
      if (!values.no ) {
        notification.warning({
          message: '警告',
          description: '请填写查询条件',
        });
        return;
      }
      if (typeof search === 'function') {
        const newValues = {
          ...values,
        };
        search(newValues);
      }
    });
  }
  handleAdd() {
	  const showAdditional = this.props.showAdditional;
	  if(showAdditional) showAdditional();
  }
  handleReset() {
	  this.props.dispatch({
	      type: 'dealRefundTran/setState',
	      payload: {
	        query: {
	        	
	        },
	      },
	    });
	    this.props.form.resetFields();
  }

  render() {
    const { form, dealRefundTran } = this.props;
    const { getFieldDecorator } = form;
    const { query } = dealRefundTran;
    return (
      <Form inline style={{ marginBottom: '10px' }} >
        <FormItem>
          {getFieldDecorator('no', {
            initialValue: query.no,
          })(
            <Input placeholder="健康号" maxLength={20} onPressEnter={this.handleSubmit} />,
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="button" size="large" onClick={this.handleSubmit} >查询</Button>
        </FormItem>
        <FormItem>
          <Button onClick={this.handleReset} size="large" >清空</Button>
        </FormItem>
      </Form>
    );
  }
}
const TranSearchBarForm = Form.create()(TranSearchBar);
export default connect( ({ dealRefundTran }) => ({ dealRefundTran }),)(TranSearchBarForm);
