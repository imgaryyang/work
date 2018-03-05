'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import {Modal,Form,Select,Switch,Cascader,Row,Button,Input, DatePicker, Col  } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;

class CreateForm extends Component{
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
		let fetch = Ajax.post('api/elh/department/create', data, {
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
			<Form horizontal>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="科室代码" >
	        		<Input placeholder="科室代码" {...getFieldProps('code')} />
	        	</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="科室名称" >
	        		<Input placeholder="科室名称" {...getFieldProps('name')} />
	        	</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="科室类型" >
	        		<Input placeholder="科室类型" {...getFieldProps('type')} />
	        	</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="排序序号" >
	        		<Input placeholder="排序序号" {...getFieldProps('sortno')} />
	        	</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="特色科室" >
	        		<Switch checkedChildren="是" unCheckedChildren="否" {...getFieldProps('isSpecial')}/>
	        	</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="位置" >
	        		<Input placeholder="位置" {...getFieldProps('address')} />
	        	</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="摘要" >
	        		<Input placeholder="摘要" {...getFieldProps('brief')} />
	        	</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="描述" >
	        		<Input placeholder="描述" {...getFieldProps('description')} />
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

module.exports = Create
