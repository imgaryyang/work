import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button,DatePicker } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

class UserSearchBar extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSubmit() {
    const search = this.props.onSearch;
    // console.info('bar handleSubmit ',search);
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
          {getFieldDecorator('patientName')(
            <Input placeholder="患者姓名" />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('patientNo')(
            <Input placeholder="患者编号" />,
          )}
        </FormItem>
      	<FormItem>
	      {getFieldDecorator('realAmt')(
	        <Input placeholder="发生金额" />,
	      )}
	    </FormItem>
	    
	    <FormItem>
	      {getFieldDecorator('createTime')(
	        <DatePicker placeholder="日期" />,
	      )}
	    </FormItem>
        <FormItem>
          {getFieldDecorator('status')(
		  <Select style ={{width:'100px'}} placeholder="状态" >
		  <Option value={'A'}> {'创建'}</Option>
		  <Option value={'0'}> {'成功'}</Option>
		  <Option value={'1'}> {'支付完成'}</Option>
		  <Option value={'2'}> {'支付失败'}</Option>
		  <Option value={'3'}> {'交易失败'}</Option>
		  <Option value={'4'}> {'交易完成'}</Option>
		  <Option value={'5'}> {'退款中'}</Option>
		  <Option value={'6'}> {'退款失败'}</Option>
		  <Option value={'7'}> {'退款成功'}</Option>
		  <Option value={'9'}> {'已关闭'}</Option>
		  <Option value={'E'}> {'异常'}</Option>
	      </Select>	  
          )}
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
const UserSearchBarForm = Form.create()(UserSearchBar);
export default connect()(UserSearchBarForm);

//<FormItem>
//{getFieldDecorator('payChannelCode')(
//  <Select style ={{width:'100px'}} placeholder="支付渠道" >
//  <Option value={'0000'}> {'现金'}</Option>
//  <Option value={'bank'}> {'银行卡'}</Option>
//  <Option value={'0306'}> {'广发'}</Option>
//  <Option value={'0308'}> {'招商'}</Option>
//  <Option value={'9998'}> {'微信'}</Option>
//  <Option value={'9999'}> {'支付宝'}</Option>
//  </Select>	  
//)}
//</FormItem>
