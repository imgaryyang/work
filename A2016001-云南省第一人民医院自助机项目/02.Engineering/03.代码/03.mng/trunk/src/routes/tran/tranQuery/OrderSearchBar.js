import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button,DatePicker } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

class OrderSearchBar extends Component {

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
	        <Input style ={{width:'100px'}} placeholder="发生金额" />,
	      )}
	    </FormItem>
	    <FormItem>
	      {getFieldDecorator('createTime')(
	        <DatePicker style ={{width:'100px'}} placeholder="日期" />,
	      )}
	    </FormItem>
	    <FormItem>
        {getFieldDecorator('bizType')(
		  <Select style ={{width:'100px'}} placeholder="业务类型" >
		  <Option value={'00'}> {'门诊预存'}</Option>
		  <Option value={'01'}> {'预约'}</Option>
		  <Option value={'02'}> {'挂号'}</Option>
		  <Option value={'03'}> {'门诊缴费'}</Option>
		  <Option value={'04'}> {'住院预缴'}</Option>
		  <Option value={'05'}> {'办理就诊卡'}</Option>
		  <Option value={'06'}> {'社保建档'}</Option>
	      </Select>	  
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
const OrderSearchBarForm = Form.create()(OrderSearchBar);
export default connect()(OrderSearchBarForm);
