import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button } from 'antd';

const FormItem = Form.Item;

class CheckDetailSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSubmit() {
    const search = this.props.onSearch;
    this.props.form.validateFields((err, values) => {
      if (!err && search) {
        search(values);
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form inline onSubmit={this.handleSubmit.bind(this)}>
        <FormItem>
          {getFieldDecorator('account')(
            <Input placeholder="账号" />,
          )}
        </FormItem>
        <FormItem>
	        {getFieldDecorator('amt')(
	    		<Input style ={{width:'100px'}} placeholder="金额" />,
	        )}
        </FormItem>
        <FormItem>
	        {getFieldDecorator('tradeNo')(
	    		<Input placeholder="渠道流水" />,
	        )}
        </FormItem>
        <FormItem>
	        {getFieldDecorator('ssmNo')(
        		<Input placeholder="自助机流水" />,
	        )}
        </FormItem>
        <FormItem>
	        {getFieldDecorator('hisNo')(
        		<Input placeholder="HIS流水" />,
	        )}
        </FormItem>
        <FormItem>
        	{getFieldDecorator('hisCheckStatus', {
              initialValue: '',
            })(<Select  style ={{width:'100px'}} tabIndex={5}>
            	  <Option value={''}> {'全部'}</Option>
            	  <Option value={'A'}> {'初始'}</Option>
            	  <Option value={'0'}> {'成功'}</Option>
            	  <Option value={'1'}> {'失败'}</Option>
            	  <Option value={'2'}> {'长款'}</Option>
            	  <Option value={'3'}> {'短款'}</Option>
            	  <Option value={'4'}> {'无本地交易'}</Option>
            	  <Option value={'5'}> {'无渠道交易'}</Option>
      	      </Select> )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" size="large" icon="search" >查询</Button>
        </FormItem>
        <FormItem>
          <Button onClick={this.handleReset.bind(this)} size="large" icon="reload" >清空</Button>
        </FormItem>
      </Form>
    );
  }
}
const CheckDetailSearchBarForm = Form.create()(CheckDetailSearchBar);
export default connect()(CheckDetailSearchBarForm);

