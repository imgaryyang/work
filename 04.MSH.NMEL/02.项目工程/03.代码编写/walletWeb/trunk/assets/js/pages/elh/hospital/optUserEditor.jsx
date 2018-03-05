
'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal,Form,Select,Cascader,Row,Button,Input, DatePicker, Col } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;

class EditorForm extends Component{
	constructor (props) {
		super(props);
	}
	onReset(e){
		e.preventDefault();
	    this.props.form.resetFields();
	}
	onSubmit(e){
		let scope = this;
		e.preventDefault();
	    this.props.form.validateFields((errors, values) => {
	      if (!!errors) {
	    	  Modal.error({title: '表单校验失败'});
	        return;
	      }
	      scope.save(values);
	    });
	}
	save(data){
		var scope = this;
		//医院级别特殊处理
		let fetch = Ajax.put('api/elh/hospital/mng/'+data.id, data, {
			catch: 3600,dataType:'json'
		});
		fetch.then(res => {
			if(res.success){
				scope.close();
				scope.refreshList()
			}
			else Modal.error({title: '保存失败'});
		});
	}
	close(){
		if(this.props.onClose){
			this.props.onClose(arguments);
		}
	}
	refreshList(){
		if(this.props.refreshList){
			this.props.refreshList(arguments);
		}
	}
	render () {
		const { getFieldProps } = this.props.form;
		return (
			<Form horizontal style={{display:'block'}}>
				<Input  type = "hidden" {...getFieldProps('id',{initialValue:this.props.data.id})} />
				<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="用户名" >
		    		<Input placeholder="用户名" {...getFieldProps('username',{initialValue:this.props.data.username})} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="姓名" >
		    		<Input placeholder="name" {...getFieldProps('name',{initialValue:this.props.data.name})} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="手机号" >
		    		<Input placeholder="mobile" {...getFieldProps('mobile',{initialValue:this.props.data.mobile})} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="电子邮箱" >
		    		<Input placeholder="email" {...getFieldProps('email',{initialValue:this.props.data.email})} />
		    	</FormItem>
		        <FormItem wrapperCol={{ span: 12, offset: 7 }} >
		        	<Button type="primary" onClick={this.onSubmit.bind(this)} htmlType="submit">保存</Button>&nbsp;&nbsp;&nbsp;
		        	<Button type="ghost" onClick={this.onReset.bind(this)}>重置</Button>
		        </FormItem>
			</Form>
		);
	}
}
const Editor = createForm()(EditorForm);
module.exports = Editor;