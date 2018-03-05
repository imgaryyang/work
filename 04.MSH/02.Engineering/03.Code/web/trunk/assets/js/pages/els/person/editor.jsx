
'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal,Form,Select,Cascader,Row,Button,Input, DatePicker, Col ,message} from 'antd';
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
	//	if(data.hosLevel && data.hosLevel.length>1)data.hosLevel=data.hosLevel[1];
		let fetch = Ajax.put('api/els/permng/update',data, {
			catch: 3600,dataType:'json'
		});
		fetch.then(res => {
			if(res.success){
				scope.close();
				scope.refreshList()
				message.success('修改成功！');
			}
			else message.error('修改失败! ' + '原因:' + res.msg);
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

	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="姓名*" >

		    		<Input  {...getFieldProps('name',{initialValue:this.props.data.name})} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="身份证号*" >
		    		<Input  {...getFieldProps('idNo',{initialValue:this.props.data.idNo})} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="卡号*" >
		    		<Input  {...getFieldProps('acctNo',{initialValue:this.props.data.acctNo})} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="行号" >
		    		<Input  {...getFieldProps('bankNo',{initialValue:this.props.data.bankNo})} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="行名" >
		    		<Input  {...getFieldProps('bankName',{initialValue:this.props.data.bankName})} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="部门" >
		    		<Input  {...getFieldProps('department',{initialValue:this.props.data.department})} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="手机号" >
		    		<Input  {...getFieldProps('mobile',{initialValue:this.props.data.mobile})} />
		    	</FormItem>
		    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="状态" >
		    		<Select  {...getFieldProps('state',{initialValue:this.props.data.state})} >
		        	  <Select.Option value="1">有效</Select.Option>
		        	  <Select.Option value="0">无效</Select.Option>
		        	</Select>
		    	</FormItem>
	
	
		        <FormItem wrapperCol={{ span: 12, offset: 7 }} >
		        	<Button type="primary" onClick={this.onSubmit.bind(this)} htmlType="submit">保存</Button>&nbsp;&nbsp;&nbsp;
		        
		        </FormItem>
			</Form>
		);
	}
}
const Editor = createForm()(EditorForm);
module.exports = Editor;