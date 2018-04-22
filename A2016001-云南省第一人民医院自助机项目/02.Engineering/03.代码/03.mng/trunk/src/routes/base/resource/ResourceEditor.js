import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Row, Col, Button,Form, Input,} from 'antd';

const FormItem = Form.Item;

class EditorForm extends Component {

	constructor(props) {
	    super(props);
	    this.handleSubmit = this.handleSubmit.bind(this);
	    this.reset        = this.reset.bind(this);
	    this.clear = this.clear.bind(this);
	}
	componentWillReceiveProps(nextProps){
		const { record }  = nextProps.resource;
		if(record != this.props.resource.record){
			if(nextProps.resource.record == null )this.reset();
		}
	}
	reset(){
		this.props.form.resetFields();
	}
	clear(){
		this.props.form.resetFields();
		this.props.dispatch({
			type:'resource/setState',
			payload:{record:null}
		});
	}
	compare(obj,values){
		for(var key in obj){
			if(obj[key] != values[key])return true;
		}
		return false;
	}
	handleSubmit(e){
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				this.props.dispatch({
					type:'resource/save',
					params:values
				});
			}
		});
	}
	render(){
		const { getFieldDecorator } = this.props.form;
		const data    = this.props.resource.record||{};
		const formItemLayout = {
	    	labelCol: { span: 6 },
	    	wrapperCol: { span: 18 },
	    };
		return (
			<Form onSubmit={this.handleSubmit}>
				<Row style={{marginBottom:'5px'}}>
					<Col span={13}> </Col>
					<Col span={3}><Button type="primary" htmlType="submit">保存</Button></Col>
					<Col span={3}><Button onClick={this.reset}>重置</Button></Col>
					<Col span={3}><Button onClick={this.clear}>清空</Button></Col>
				</Row>
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('id',{ initialValue:data.id})(<Input />)
				}
				</FormItem>
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('hosId',{ initialValue:data.hosId})(<Input />)
				}
				</FormItem>
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('creator',{ initialValue:data.creator})(<Input />)
				}
				</FormItem>
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('createTime',{ initialValue:data.createTime})(<Input />)
				}
				</FormItem>
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('updateTime',{ initialValue:data.updateTime})(<Input />)
				}
				</FormItem>
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('updater',{ initialValue:data.updater})(<Input />)
				}
				</FormItem>
				<FormItem label="名称"  {...formItemLayout}>
			 	{
			 		getFieldDecorator('name',{
			 			initialValue : data.name,
			 			rules: [{ required: true, message: '名称不能为空' },]
			 		})(<Input />)
			 	}
			 	</FormItem>
			 	<FormItem label="编码"  {...formItemLayout}>
			 	{
			 		getFieldDecorator('code',{
			 			initialValue : data.code,
			 			rules: [{ required: true, message: '编码不能为空' },]
			 		})(<Input />)
			 	}
			 	</FormItem>
			 	<FormItem label="描述"  {...formItemLayout}>
			 	{
			 		getFieldDecorator('description',{
			 			initialValue : data.description,
			 		})(<Input type="textarea" rows={4} /> )
			 	}
			 	</FormItem>
			</Form>
		);	
	}
}
const  Editor = Form.create()(EditorForm);
export default connect(({resource})=>({resource}))(Editor);


