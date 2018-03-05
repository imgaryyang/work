'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import {Modal,Form,Select,Cascader,Row,Button,Input, DatePicker, Col  } from 'antd';
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
		if(data.hosLevel && data.hosLevel.length>1)data.hosLevel=data.hosLevel[1];
		let fetch = Ajax.post('api/elh/hospital/mng/create', data, {
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
		const levelOptions = [
		    {value: '3',label: '三级',children: [{
			    value: '3A',label: '甲等',
			  },{
			    value: '3B',label: '乙等',
			  },{
			    value: '3C',label: '丙等',
			  }],
			},{value: '2',label: '二级',children: [{
			    value: '2A',label: '甲等',
			  },{
			    value: '2B',label: '乙等',
			  },{
			    value: '2C',label: '丙等',
			  }],
			},{value: '1',label: '一级',children: [{
			    value: '1A',label: '甲等',
			  },{
			    value: '1B',label: '乙等',
			  },{
			    value: '1C',label: '丙等',
			  }],
		}];
		const { getFieldProps } = this.props.form;
		return (
			<Form horizontal>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="机构代码" >
	        		<Input placeholder="机构代码" {...getFieldProps('code')} />
	        	</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="机构名称" >
	        		<Input placeholder="机构名称" {...getFieldProps('name')} />
	        	</FormItem>	
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="医院类型" >
		        	<Select placeholder="医院类型" {...getFieldProps('hosType')} >
		        	  <Select.Option value="1">综合医院</Select.Option>
		        	  <Select.Option value="2">专科医院</Select.Option>
		        	</Select>
	        	</FormItem>	
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="医院级别" >
		        	<Cascader placeholder="医院级别" options={levelOptions} {...getFieldProps('hosLevel')} />
	        	</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="联系人" >
		    		<Input placeholder="联系人" {...getFieldProps('linkman')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="联系人联系方式" >
		    		<Input placeholder="联系人联系方式" {...getFieldProps('lmContactWay')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="邮编" >
		    		<Input placeholder="邮编" {...getFieldProps('zipcode')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="地址" >
		    		<Input placeholder="地址" {...getFieldProps('address')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="客户专员" >
		    		<Input placeholder="客户专员" {...getFieldProps('salesman')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="客户专员联系方式" >
		    		<Input placeholder="客户专员联系方式" {...getFieldProps('smContactWay')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="状态" >
		    		<Select placeholder="状态" {...getFieldProps('state',{})} >
		        	  <Select.Option value="1">正常</Select.Option>
		        	  <Select.Option value="2">已下线</Select.Option>
		        	</Select>
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="备注" >
		    		<Input placeholder="备注" {...getFieldProps('memo')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="医院" >
		    		<Input placeholder="医院" {...getFieldProps('logo')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="医院微主页背景图" >
		    		<Input placeholder="医院微主页背景图" {...getFieldProps('hosHomeBg')} />
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
