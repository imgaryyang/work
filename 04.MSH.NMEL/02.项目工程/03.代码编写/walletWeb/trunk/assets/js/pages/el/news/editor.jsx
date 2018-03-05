
'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import {Modal,Form,Select,Cascader,Row,Button,Input, DatePicker, Col ,Upload,Icon } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;
const Dragger = Upload.Dragger;
class EditorForm extends Component{
	constructor (props) {
		super(props);
		this.state={
			image:props.data.image
		}
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
		let fetch = Ajax.put('api/el/base/news/'+data.id, data, {
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
	delImage(){
		this.state.image='';
		this.setState({image:this.state.image}); 
	}
	imageChange(opts){
		let file = opts.file,fileList=opts.fileList,event=opts.event;
		if(file&&file.status=="done"){
			let res = file.response;
			if(res.success){
				this.state.image = res.result.id;
				this.setState({image:this.state.image});//TODO 这里有警告
			}else Modal.error({title: '文件上传失败'});
		}
	}
	render () {
		const { getFieldProps } = this.props.form;
		const imageProps = {
			  action : '/api/el/base/images/upload',
			  name: 'file',
			  showUploadList: false,
			  data : {fkType:"01"}
		};
		return (
			<Form horizontal>
				<Input  type = "hidden" {...getFieldProps('fkType',{initialValue:this.props.data.fkType})} />
				<Input  type = "hidden" {...getFieldProps('image',{initialValue:this.state.image})} />
				<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} label="标题" >
	        		<Input placeholder="标题" {...getFieldProps('caption',{initialValue:this.props.data.caption})} />
	        	</FormItem>
	        		<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} label="作者" >
	        		<Input placeholder="作者" {...getFieldProps('feededBy',{initialValue:this.props.data.feededBy})} />
	        	</FormItem>
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} label="摘要" >
	        		<Input type="textarea" rows={4} placeholder="摘要" {...getFieldProps('digest',{initialValue:this.props.data.digest})} />
	        	</FormItem>
	        	{
	        		(this.state.image)?(
		        		<FormItem labelCol={{ span: 5 }}  wrapperCol={{ span: 12 }} label="图片" >
		        			<div style={{height: 210,width:'100%'}}>
		        			<Button type="ghost" style={{float:'right'}} onClick={this.delImage.bind(this)}>删除</Button>
				        	<img src={'/api/el/base/images/view/'+this.state.image} style={{height: 180,width:'100%'}}/>
		        			</div>
				        </FormItem>
			        ):(
		        		<FormItem labelCol={{ span: 5 }} style={{height: 180 }} wrapperCol={{ span: 12 }} label="图片" >
		        	      <Dragger {...imageProps} onChange={this.imageChange.bind(this)}>
		        	        <p className="ant-upload-drag-icon">
		        	          <Icon type="inbox" /> 
		        	        </p>
		        	        <p className="ant-upload-text">点击或将文件拖拽到此区域上传</p>
		        	      </Dragger>
		        	    </FormItem>
			        )
	        	}
	        	<FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} label="正文" >
	        		<Input type="textarea" rows={10} placeholder="正文" {...getFieldProps('body',{initialValue:this.props.data.body})} />
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