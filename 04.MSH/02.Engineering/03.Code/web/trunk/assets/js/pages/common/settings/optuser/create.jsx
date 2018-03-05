'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import {Modal,Form,Select,Cascader,Row,Button,Input, DatePicker, Col ,message } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;

class CreateForm extends Component{
	constructor (props) {
		super(props);
	}
	onReset(e){
		console.info(this.props.form.getFieldsValue());
		e.preventDefault();
	    this.props.form.resetFields();
	}
	onSubmit(e){
		let scope = this;
		e.preventDefault();
	    this.props.form.validateFields((errors, values) => {
	      if(values.name==null){
	    	  Modal.error({title: '姓名不能为空'});
	    	  return;
	      }
	      if(values.username==null){
	    	  Modal.error({title: '用户名不能为空'});
	    	  return;
	      }
	      if(values.mobile==null){
	    	  Modal.error({title: '电话号码不能为空'});
	    	  return;
	      }
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
	//	if(data.hosLevel && data.hosL evel.length>1)data.hosLevel=data.hosLevel[1];
		console.info(data);
		let fetch = Ajax.post('/bdrp/org/optuser/optuser/create', data, {
			catch: 3600,dataType:'json'
		});
		fetch.then(res => {
			if(res.success){
				scope.close();
				scope.refreshList()
				message.success('新增成功！');
			}
			else message.error('新增失败! ' + '原因:' + res.msg);
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
			<Form horizontal>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="机构名称*" >
	        		<Input readonly="disable" {...getFieldProps('orgName')} />
	        		<Input type="hidden" {...getFieldProps('orgId')} />
	        	</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="姓名*" >
		    		<Input  {...getFieldProps('name')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="用户名*" >
		    		<Input  {...getFieldProps('username')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="手机号*" >
	    			<Input  {...getFieldProps('mobile')} />
	    		</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="电子邮箱" >
		    		<Input  {...getFieldProps('email')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="其他联系方式" >
		    		<Input  {...getFieldProps('otherContactWay')} />
		    	</FormItem>
	
		        <FormItem wrapperCol={{ span: 12, offset: 7 }} >
		        	<Button type="primary" onClick={this.onSubmit.bind(this)} htmlType="submit">保存</Button>&nbsp;&nbsp;&nbsp;
		        	<Button type="ghost" onClick={this.onReset.bind(this)}>重置</Button>
		        </FormItem>
			</Form>
		);
	}
}
const Create = createForm()(CreateForm);

module.exports = Create;
