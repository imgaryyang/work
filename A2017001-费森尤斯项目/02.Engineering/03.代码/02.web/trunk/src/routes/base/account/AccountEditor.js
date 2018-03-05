import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Tooltip, Icon, Row, Col, Button, Modal, Form, Input, Cascader, Select, Checkbox, Radio } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

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
		if(nextProps.data == null )this.reset();
	}
	
	handleCancel(){
		var values = this.props.form.getFieldsValue();
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
			type:'account/setState',
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
				this.props.dispatch({
					type:'account/save',
					params:values
				});
			}
		});
	}
	
	render(){
		const { getFieldDecorator } = this.props.form;
		const data    = this.props.data || {};
		const visible = this.props.data ? true : false;
		const title   = data.columnName || "新增";
		const isCreate= data.id?false:true;
		const formItemLayout = {
	    	labelCol: { span: 5 },
	    	wrapperCol: { span: 15 },
	    };
		//hasFeedback 属性删除，解决firefox无法输入汉字的bug xiaweiyi
		return (
			<Modal width={850} title={title} visible={visible} closable={true} footer={null} maskClosable={false} onCancel={this.handleCancel} >
			<Form>
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('id',{ initialValue : data.id })(<Input />)
				}
				</FormItem>
				<Row>
				<Col span={12}>
					<FormItem label="用户名"  {...formItemLayout}>
					{
						getFieldDecorator('username',{
							initialValue : data.hosId,
							rules: [{ required: true, message: '用户名不能为空' },]
						})(<Input tabIndex ={1}/>)
					}
					</FormItem>
				 	
				 	<FormItem label="用户ID"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('userId',{
				 			initialValue : data.columnName,
				 			rules: [{ required: true, message: '用户ID不能为空' },]
				 		})(<Input tabIndex={3}/>)
				 	}
				 	</FormItem>
				 	<FormItem label="账户状态"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('status',{
				 			initialValue : data.spellCode,
				 			rules: [{ required: true, message: '账户状态不能为空' },]
				 		})(<Input tabIndex={5}/>)
				 	}
				 	</FormItem>	
				</Col>
				<Col span={12}>
					<FormItem label="密码"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('password',{
				 			initialValue : data.columnGroup,
				 			rules: [{ required: true, message: '密码不能为空' },]
				 		})(<Input tabIndex={2}/>)
				 	}
				 	</FormItem>
				 	<FormItem label="用户类型"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('type',{
				 			initialValue : data.columnCode,
				 			rules: [{ required: true, message: '用户类型不能为空' },]
				 		})(<Input tabIndex={4}/>)
				 	}
				 	</FormItem>
				</Col>
				</Row>
				<Row>
					<Col span={10}> </Col>
					<Col span={1}><Button type="primary" onClick={this.handleSubmit}>保存</Button></Col>
					<Col span={2}> </Col>
					<Col span={1}><Button onClick={this.reset}>重置</Button></Col>
					<Col span={10}> </Col>
				</Row>
			</Form>
			</Modal >
		);	
	}
}
const  Editor = Form.create()(EditorForm);
export default connect()(Editor);


