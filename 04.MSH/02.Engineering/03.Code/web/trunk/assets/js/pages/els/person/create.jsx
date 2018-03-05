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
		this.state = {
				nameStatus: '',
				nameHelp: '',
				idNoStatus: '',
				idNoHelp: '',
				acctNoStatus: '',
				acctNoHelp: '',
				bankNoStatus: '',
				bankNoHelp: '',
				departmentStatus: '',
				departmentHelp: '',
				bankNameStatus: '',
				bankNameHelp: '',
				mobileStatus: '',
				mobileHelp: '',
		};
	}
	onReset(e){
		e.preventDefault();
	    this.props.form.resetFields();
	}
	
	validateData(data){
		
		var flag = true;
		//手机正则表达式
		var isMobile = /^1[3|4|5|7|8]\d{9}$/;
		//身份证正则表达式
		var isIDCard = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/; 
		//银行卡号正则表达式
		var isBankCard = /^(\d{16}|\d{19})$/; 
		
		this.setState({
			nameStatus: '',
			nameHelp: '',
			idNoStatus: '',
			idNoHelp: '',
			acctNoStatus: '',
			acctNoHelp: '',
			bankNoStatus: '',
			bankNoHelp: '',
			departmentStatus: '',
			departmentHelp: '',
			bankNameStatus: '',
			bankNameHelp: '',
			mobileStatus: '',
			mobileHelp: '',
		});
		
		//验证姓名是否为空
		if("" == data.name || null == data.name ){
			this.setState({
				nameStatus: 'error',
				nameHelp: '姓名不能为空',
			});
			flag = false;
		}
		//验证身份证号码是否为空
		if("" == data.idNo || null == data.idNo ){
			this.setState({
				idNoStatus: 'error',
				idNoHelp: '身份证号不能为空',
			});
			flag = false;
		}else if(!isIDCard.test(data.idNo)){
			this.setState({
				idNoStatus: 'error',
				idNoHelp: '身份证号不正确，如尾号是X须大写',
			});
			flag = false;
		}
		
		//验证卡号是否为空
		if("" == data.acctNo || null == data.acctNo ){
			this.setState({
				acctNoStatus: 'error',
				acctNoHelp: '卡号不能为空',
			});
			flag = false;
		}else if(!isBankCard.test(data.acctNo)){
			this.setState({
				acctNoStatus: 'error',
				acctNoHelp: '卡号不正确',
			});
			flag = false;
		}
		
		//验证手机号是否为空
		if("" != data.mobile && null != data.mobile ){
			if(!isMobile.test(data.mobile)){//验证手机号的正确性
				this.setState({
					mobileStatus: 'error',
					mobileHelp: '手机号格式错误',
				});
				flag = false;
			}
		}
		
		return flag;
	}
	
	onSubmit(e){
		let scope = this;
		e.preventDefault();
	    this.props.form.validateFields((errors, values) => {
	      if (!this.validateData(values)) {
	        return false;
	      }
	      scope.save(values);
	    });
	}
	save(data){
		var scope = this;
		data.state = '1';
		let fetch = Ajax.post('api/els/permng/create', data, {
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
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="姓名" validateStatus={this.state.nameStatus} help={this.state.nameHelp} required>
		    		<Input  {...getFieldProps('name')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="身份证号" validateStatus={this.state.idNoStatus} help={this.state.idNoHelp} required>
		    		<Input  {...getFieldProps('idNo')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="卡号" validateStatus={this.state.acctNoStatus} help={this.state.acctNoHelp} required>
		    		<Input  {...getFieldProps('acctNo')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="行号" validateStatus={this.state.bankNoStatus} help={this.state.bankNoHelp}>
		    		<Input  {...getFieldProps('bankNo')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="行名" validateStatus={this.state.bankNameStatus} help={this.state.bankNameHelp}>
		    		<Input  {...getFieldProps('bankName')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="部门" validateStatus={this.state.departmentStatus} help={this.state.departmentHelp}>
		    		<Input  {...getFieldProps('department')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="手机号" validateStatus={this.state.mobileStatus} help={this.state.mobileHelp}>
		    		<Input  {...getFieldProps('mobile')} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="状态">
		    		<Select  {...getFieldProps('state',{initialValue: "1"})} >
		        	  <Select.Option value="1">有效</Select.Option>
		        	  <Select.Option value="0">无效</Select.Option>
		        	</Select>
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
