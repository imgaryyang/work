import React, { Component, PropTypes } from 'react';
import { TimePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { Spin, Tabs,Tooltip, Icon, Row, Col, Button, Modal, DatePicker, Form, Input, Cascader, Select, Checkbox, Radio } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
class EditorForm extends React.Component {

	constructor(props) {
	    super(props);
	    this.handleCancel = this.handleCancel.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	    this.close        = this.close.bind(this);
	    this.reset        = this.reset.bind(this);
	}
	
	reset(){
		this.props.form.resetFields();
	}
	
	componentWillReceiveProps(nextProps){
		if( nextProps.data == null ){
			this.reset();
		}
	}
	
	handleCancel(){
		var values = this.props.form.getFieldsValue();
		if(values.bornDate){
			values.bornDate = values.bornDate.format('YYYY-MM-DD');
		}
		var data = this.props.data;
		var changed = this.compare(values,data);
		if(changed){
			Modal.confirm({
			    title: '确认',
			    content: '放弃保存您的修改？',
			    okText: '放弃',
			    cancelText: '我再看看',
			    onOk:()=>{this.close();}
			  });
		}else{
			this.close();
		}
	}
	
	close(){
		this.props.dispatch({
			type : 'payChannel/setState',
			payload:{
				record : null
			}
		});
	}
	compare(obj,values){
		for(var key in obj){
			if(obj[key] != values[key]){
				return true;
			}
		}
		return false;
	}
	
	handleSubmit(e){
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				if(values.bornDate){
					values.bornDate = values.bornDate.format('YYYY-MM-DD');
				}
				this.props.dispatch({
					type : 'payChannel/save',
					params : values
				});
			}
		});
	}
	render(){
		const { getFieldDecorator } = this.props.form;
		const {spin } = this.props.payChannel;
		const data    = this.props.data || {};
		const visible = this.props.data ? true : false;
		const title   = data.name || "新增";
		const isCreate= data.id ? false : true;
		const formItemLayout = {
	    	labelCol: { span: 6 },
	    	wrapperCol: { span: 16 },
	    };
		return (
			<Modal width={850} title={title} visible={visible} closable={true} footer={null} maskClosable={false} onCancel={this.handleCancel} >
			<Spin spinning={spin} >
			<Form onSubmit={this.handleSubmit}>	
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('id',{ initialValue:data.id})(<Input />)
				}
				</FormItem>
				<Row>
				<Col span={12}>
				 	<FormItem label="支付编码"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('code',{
				 			initialValue : data.code,
				 			rules: [{ required: true, message: '支付编码不能为空' },]
				 		})(<Input tabIndex={1}/>)
				 	}
				 	</FormItem>
				 	<FormItem label="支付名称"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('name',{
				 			initialValue : data.name,
				 			rules: [{ required: true, message: '支付名称不能为空' },]
				 		})( <Input tabIndex={2}/>)
				 	}
				 	</FormItem>
				</Col>
				<Col span={12}>
			 	<FormItem label="商户号"  {...formItemLayout}>
			 	{
			 		getFieldDecorator('mchId',{
			 			initialValue : data.mchId,
			 			rules: [{ required: true, message: '商户号不能为空' },]
			 		})(<Input tabIndex={1}/>)
			 	}
			 	</FormItem>
			 	<FormItem label="商户名称"  {...formItemLayout}>
			 	{
			 		getFieldDecorator('mchName',{
			 			initialValue : data.mchName,
			 			rules: [{ required: true, message: '商户名称不能为空' },]
			 		})( <Input tabIndex={2}/>)
			 	}
			 	</FormItem>
			</Col>
				<Col span={12}>
				 	
				 	<FormItem label="对账时间"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('checkTime',{
				 			initialValue : data.checkTime,
				 			rules: [{ required: true, message: '对账时间不能为空' },]
				 		})(<Input tabIndex={2}/>)
				 	}
				 	</FormItem>
			 	<FormItem label="退款对账时间"  {...formItemLayout}>
			 	{
			 		getFieldDecorator('refCheckTime',{
			 			initialValue : data.refCheckTime,
			 			rules: [{ required: true, message: '退款对账时间不能为空' },]
			 		})(<Input tabIndex={2}/>)
			 	}
			 	</FormItem>
			 	
			</Col>
		
			<Col span={12}>
			 	<FormItem label="前置IP"  {...formItemLayout}>
			 	{
			 		getFieldDecorator('frontIp',{
			 			initialValue : data.frontIp,
			 			rules: [{ required: true, message: '前置IP不能为空' },]
			 		})(<Input tabIndex={2}/>)
			 	}
		 	</FormItem>
			 	<FormItem label="前置端口"  {...formItemLayout}>
			 	{
			 		getFieldDecorator('frontPort',{
			 			initialValue : data.frontPort,
			 			rules: [{ required: true, message: '前置端口不能为空' },]
			 		})(<Input tabIndex={4}/>)
			 	}
			 	</FormItem>
			</Col>
			<Col span={12}>
			<FormItem  label="退汇对账时间"  {...formItemLayout}>
		 	{
		 		getFieldDecorator('retCheckTime',{
		 			initialValue :  data.retCheckTime,
		 			rules: [{ required: true, message: '退汇对账时间不能为空' },]
		 		})(<Input tabIndex={2}/>)
		 	}
			</FormItem>
			<FormItem label="字符集"  {...formItemLayout}>
		 	{
		 		getFieldDecorator('charset',{
		 			initialValue : data.charset,
		 			rules: [{ required: true, message: '字符集不能为空' },]
		 		})( 
		 				<Select defaultValue="UTF-8">
	 		    <Option value={"ASCII"}>ASCII</Option>
	 		   <Option value={"GB2312"}>GB2312</Option>
	 		  <Option value={"GBK"}>GBK</Option>
	 		 <Option value={"GB18030"}>GB18030</Option>
	 		<Option value={"ISO-8859-1"}>ISO-8859-1</Option>
	 		<Option value={"UTF-8"}>UTF-8</Option>
	 		<Option value={"UTF-16"}>UTF-16</Option>
	 		<Option value={"Unicode"}>unicode</Option>
	 	      </Select>)
		 	}
		 	</FormItem>
		 	</Col>
			
	<Col span={12}>
	 	<FormItem  label="更新时间"  {...formItemLayout}>
	 	{
	 		getFieldDecorator('updateTime',{
	 			initialValue : data.updateTime,
	 			rules: [{ required: false, message: '更新时间不能为空' },]
	 		})(<Input disabled placeholder="更新时间"tabIndex={2}/>)
	 	}
 	</FormItem>
 	<FormItem  label="更新人"  {...formItemLayout}>
 	{
 		getFieldDecorator('updateUser',{
 			initialValue :  data.updateUser,
 			rules: [{ required: false, message: '更新人不能为空' },]
 		})(<Input disabled placeholder="更新人"tabIndex={2}/>)
 	}
	</FormItem>	
	</Col>
	<Col span={12}>
	<FormItem label="状态"  {...formItemLayout}>
 	{
 		getFieldDecorator('status',{
 			initialValue : data.status,
 			rules: [{ required: true, message: '状态不能为空' },]
 		})(<Select defaultValue="1">
		    <Option value={"1"}>1</Option>
 		   <Option value={"0"}>0</Option>
 		  <Option value={"9"}>9</Option></Select>)
 	}
 	</FormItem></Col>
	<Col span={12}>
	<FormItem  label="备注"  {...formItemLayout}>
	{
		getFieldDecorator('memo',{
			initialValue :  data.memo,
			rules: [{ required: true, message: '备注不能为空' },]
		})(<Input tabIndex={2}/>)
	}
</FormItem>	
</Col>
			</Row>
				<Row>
					<Col span={10}> </Col>
					<Col span={1}><Button type="primary" htmlType="submit">保存</Button></Col>
					<Col span={2}> </Col>
					<Col span={1}><Button onClick={this.reset}>重置</Button></Col>
					<Col span={10}> </Col>
				</Row>
			</Form>
			</Spin>
			</Modal >
		);	
	}
}
const  Editor = Form.create()(EditorForm);
export default connect(({payChannel})=>({payChannel}))(Editor);