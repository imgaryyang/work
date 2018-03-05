
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
		let fetch = Ajax.put('/bdrp/org/optuser/optuser/update',data, {
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

			<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="机构名称*" >
        		<Input readonly="disable" {...getFieldProps('orgName',{initialValue:this.props.data.orgName})} />
        		<Input type="hidden" {...getFieldProps('orgId',{initialValue:this.props.data.orgId})} />
        	</FormItem>
        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="姓名*" >
	    		<Input  {...getFieldProps('name',{initialValue:this.props.data.name})} />
	    	</FormItem>
	    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="用户名*" >
	    		<Input  {...getFieldProps('username',{initialValue:this.props.data.username})} />
	    	</FormItem>
	    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="手机号*" >
    			<Input  {...getFieldProps('mobile',{initialValue:this.props.data.mobile})} />
    		</FormItem>
	    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="电子邮箱" >
	    		<Input  {...getFieldProps('email',{initialValue:this.props.data.email})} />
	    	</FormItem>
	    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="其他联系方式" >
	    		<Input  {...getFieldProps('otherContactWay',{initialValue:this.props.data.otherContactWay})} />
	    	</FormItem>
	    	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="状态" >
	    		<Select  {...getFieldProps('state',{initialValue:this.props.data.state})} >
	        	  <Select.Option value="1">启用</Select.Option>
	        	  <Select.Option value="0">禁用</Select.Option>
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