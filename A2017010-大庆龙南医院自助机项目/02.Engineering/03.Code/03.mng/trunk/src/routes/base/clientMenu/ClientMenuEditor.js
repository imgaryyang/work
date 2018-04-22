import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button,Spin,Modal } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class ClientMenuEditor extends React.Component {

	constructor(props) {
	    super(props);
	    this.handleCancel = this.handleCancel.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	    this.close = this.close.bind(this);
	    this.reset = this.reset.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.clientMenu.record == null) this.reset();
	}

	reset() {
		this.props.form.resetFields();
	}

	handleCancel() {console.info( this.props.form.getFieldsValue);
	console.info( this.props.form.getFieldsValue());
		const values = this.props.form.getFieldsValue();
	    const data = this.props.clientMenu.record;
	    const changed = this.compare(values, data);
	    if (changed) {
	      Modal.confirm({
	        title: '确认',
	        content: '放弃保存您的修改？',
	        okText: '放弃',
	        cancelText: '我再看看',
	        onOk: () => { this.close();},
	      });
	    } else {
	      this.close();
	    }
	}

	  close() {
	    this.props.dispatch({
	      type: 'clientMenu/setState',
	      payload: { record: null },
	    });
	  }

	  compare(obj, values) {
	    if (typeof obj.id === 'undefined') {
	      return false;
	    }
	    for (const key in obj) {
	      if (obj[key] !== values[key]) return true;
	    }
	    return false;
	  }

	  handleSubmit() {
	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	        const newValues = { ...values };
	        this.props.dispatch({
	          type: 'clientMenu/save',
	          params: newValues,
	        });
	      }
	    });
	  }

	render(){
		const { getFieldDecorator } = this.props.form;
		const { record } = this.props.clientMenu;
		const menu = record||{};
		const visible = record ? true : false;
	    const title = menu.name || '新增';
	    
		const formItemLayout = {
	    	labelCol: { span: 5 },
	    	wrapperCol: { span: 15 },
	    };
		return (
			<Modal width={850} title={title} visible={visible} closable footer={null} maskClosable={false} onCancel={this.handleCancel}>
			 <Form onSubmit={this.handleSubmit.bind(this)}>
			 <FormItem style={{display:'none'}}>
			 	{
			 		getFieldDecorator('id',{ initialValue:menu.id})(<Input />)
			 	}
			 </FormItem>
			 <FormItem style={{display:'none'}}>
			 	{
			 		getFieldDecorator('type',{ initialValue:'client'})(<Input />)
			 	}
			 </FormItem>
			 <Row>
				 <Col span={12}>
				 	<FormItem label="名称"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('name',{ 
		 					initialValue:menu.name,
		 					rules: [{ required: true, message: '名称不能为空' },]
		 				})(<Input />)
				 	}
				 	</FormItem>
				 	<FormItem label="编码"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('code',{
				 			initialValue:menu.code,
				 			rules: [{ required: true, message: '编码不能为空' },]
				 		})(<Input />)
				 	}
				 	</FormItem>
				 	<FormItem label="长度"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('colspan',{
				 			initialValue:menu.colspan,
				 			rules: [{ required: true, message: '长度不能为空' },]
				 		})(<Input />)
				 	}
				 	</FormItem>
				 	<FormItem label="配色"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('color',{
				 			initialValue:menu.color,
				 			rules: [{ required: true, message: '配色不能为空' },]
				 		})(<Input />)
				 	}
				 	</FormItem>
				 	<FormItem label="排序"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('sort',{
				 			initialValue:menu.sort,
				 			rules: [{ required: true, message: '排序不能为空' },]
				 		})(<Input />)
				 	}
				 	</FormItem>
				 	<FormItem label="url"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('url',{
				 			initialValue:menu.url
				 		})(<Input />)
				 	}
				 	</FormItem>
				 </Col>
				 <Col span={12}>
				 <FormItem label="别名"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('alias',{
				 			initialValue:menu.alias,
				 			rules: [{ required: true, message: '别名不能为空' },]
				 		})(<Input />)
				 	}
				 	</FormItem>
				 	<FormItem label="路径"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('pathname',{
				 			initialValue:menu.pathname,
				 			rules: [{ required: true, message: '路径不能为空' },]
				 		})(<Input />)
				 	}
				 	</FormItem>			 	
				 	
				 	<FormItem label="高度"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('rowspan',{
				 			initialValue:menu.rowspan,
				 			rules: [{ required: true, message: '高度不能为空' },]
				 		})(<Input />)
				 	}
				 	</FormItem>
				 	<FormItem label="图标"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('icon',{
				 			initialValue:menu.icon,
				 			rules: [{ required: true, message: '图标不能为空' },]
				 		})(<Input />)
				 	}
				 	</FormItem>
				 	<FormItem label="坐标"  {...formItemLayout}>
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
			 	<Col span={1}><Button type="primary" htmlType="submit">保存</Button></Col>
			 	<Col span={2}> </Col>
			 	<Col span={1}><Button >清空</Button></Col>
			 	<Col span={10}> </Col>
			 </Row>
			 </Form>
		</Modal>
		);	
	}
}
const ClientMenuEditorForm = Form.create()(ClientMenuEditor);
export default connect(({clientMenu})=>({clientMenu}))(ClientMenuEditorForm);

