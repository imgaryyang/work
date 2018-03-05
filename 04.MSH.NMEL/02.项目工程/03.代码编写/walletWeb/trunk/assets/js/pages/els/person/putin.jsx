'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal,Form,Select,Cascader,Row,Button,Input, DatePicker, Col ,message,Upload,Icon} from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;

 class ElsPersonManagePutIn extends Component {
	constructor (props) {
		super(props);
	}
	onReset(e){
		console.info(this.props.form.getFieldsValue());
		e.preventDefault();
	    this.props.form.resetFields();
	}
	
	onPreview(){
	 	if(this.props.onPreview){
	 		this.props.onPreview(arguments);
	 	}
	 }
	
	 


	render () {
		const props = {
		  name: 'file',
		  action: 'api/els/preview/perupload',
		  accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
		  headers: {
		    authorization: 'authorization-text',
		  },
		onChange(info) {
		    if (info.file.status !== 'uploading') {
		      console.log(info.file, info.fileList);
		    }
		    if (info.file.status === 'done') {
		      message.success(`${info.file.name} 上传成功。`);
		    } else if (info.file.status === 'error') {
		      Modal.error({title:`${info.file.name} 上传失败:${info.file.response.msg}`});
		    }
		  },
		};

		const { getFieldProps } = this.props.form;
		return (
			<Form horizontal>
	
		        <FormItem wrapperCol={{ span: 12, offset: 7 }} >
					<Upload {...props}>
					     <Button type="ghost">
					       <Icon type="upload" /> 点击上传
					     </Button>
				    </Upload>
		        	<Button type="primary" onClick={this.onPreview.bind(this)}>下一步</Button>


		        </FormItem>
			</Form>
		);
	}
	
 
 }
const PutIn = createForm()(ElsPersonManagePutIn);

module.exports = PutIn