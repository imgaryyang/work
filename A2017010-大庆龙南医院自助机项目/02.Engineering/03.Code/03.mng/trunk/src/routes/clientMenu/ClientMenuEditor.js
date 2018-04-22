import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button,Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class ClientMenuEditor extends React.Component {

	constructor(props) {
	    super(props);
	}
	handleSubmit(e){
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				this.props.dispatch({
					type:'clientMenu/save',
					params:values
				});
			}
		});
	}
	render(){
		const { getFieldDecorator } = this.props.form;
		const menu = this.props.menu||{};
		const formItemLayout = {
	    	labelCol: { span: 5 },
	    	wrapperCol: { span: 15 },
	    };
		return (
			 <Form>
			 <FormItem style={{display:'none'}}>
			 	{
			 		getFieldDecorator('id',{ initialValue:menu.id})(<Input />)
			 	}
			 </FormItem>
			 <Row>
				 <Col span={12}>
				 	<FormItem label="名称" hasFeedback {...formItemLayout}>
				 	{
				 		getFieldDecorator('name',{ 
		 					initialValue:menu.name,
		 					rules: [{ required: true, message: '名称不能为空' },]
		 				})(<Input />)
				 	}
				 	</FormItem>
				 	<FormItem label="编码" hasFeedback {...formItemLayout}>
				 	{
				 		getFieldDecorator('code',{
				 			initialValue:menu.code,
				 			rules: [{ required: true, message: '编码不能为空' },]
				 		})(<Input />)
				 	}
				 	</FormItem>
				 	<FormItem label="长度" hasFeedback {...formItemLayout}>
				 	{
				 		getFieldDecorator('colspan',{
				 			initialValue:menu.colspan,
				 			rules: [{ required: true, message: '长度不能为空' },]
				 		})(<Input />)
				 	}
				 	</FormItem>
				 	<FormItem label="配色" hasFeedback {...formItemLayout}>
				 	{
				 		getFieldDecorator('color',{
				 			initialValue:menu.color,
				 			rules: [{ required: true, message: '配色不能为空' },]
				 		})(<Input />)
				 	}
				 	</FormItem>
				 	<FormItem label="排序" hasFeedback {...formItemLayout}>
				 	{
				 		getFieldDecorator('sort',{
				 			initialValue:menu.sort,
				 			rules: [{ required: true, message: '排序不能为空' },]
				 		})(<Input />)
				 	}
				 	</FormItem>
				 	<FormItem label="url" hasFeedback {...formItemLayout}>
				 	{
				 		getFieldDecorator('url',{
				 			initialValue:menu.url
				 		})(<Input />)
				 	}
				 	</FormItem>
				 </Col>
				 <Col span={12}>
				 <FormItem label="别名" hasFeedback {...formItemLayout}>
				 	{
				 		getFieldDecorator('alias',{
				 			initialValue:menu.alias,
				 			rules: [{ required: true, message: '别名不能为空' },]
				 		})(<Input />)
				 	}
				 	</FormItem>
				 	<FormItem label="路径" hasFeedback {...formItemLayout}>
				 	{
				 		getFieldDecorator('pathname',{
				 			initialValue:menu.pathname,
				 			rules: [{ required: true, message: '路径不能为空' },]
				 		})(<Input />)
				 	}
				 	</FormItem>			 	
				 	
				 	<FormItem label="高度" hasFeedback {...formItemLayout}>
				 	{
				 		getFieldDecorator('rowspan',{
				 			initialValue:menu.rowspan,
				 			rules: [{ required: true, message: '高度不能为空' },]
				 		})(<Input />)
				 	}
				 	</FormItem>
				 	<FormItem label="图标" hasFeedback {...formItemLayout}>
				 	{
				 		getFieldDecorator('icon',{
				 			initialValue:menu.icon,
				 			rules: [{ required: true, message: '图标不能为空' },]
				 		})(<Input />)
				 	}
				 	</FormItem>
				 	<FormItem label="坐标" hasFeedback {...formItemLayout}>
				 	{
				 		getFieldDecorator('coordinate',{
				 			initialValue:menu.coordinate,
				 		})(<Input />)
				 	}
				 	</FormItem>
				 </Col>
			 </Row>
			 <Row>
			 	<Col span={10}> </Col>
			 	<Col span={1}><Button type="primary" htmlType="button" onClick={this.handleSubmit.bind(this)} >保存</Button></Col>
			 	<Col span={2}> </Col>
			 	<Col span={1}><Button >清空</Button></Col>
			 	<Col span={10}> </Col>
			 </Row>
			 </Form>
		);	
	}
}
const ClientMenuEditorForm = Form.create()(ClientMenuEditor);
export default connect()(ClientMenuEditorForm);

