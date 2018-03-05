import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Tooltip, Icon, Row, Col, Button,Modal,Form, Input, Cascader, Select, Checkbox, Radio } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class EditorForm extends React.Component {

	constructor(props) {
	    super(props);
	    this.handleCancel = this.handleCancel.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	    this.close        = this.close.bind(this);
	    this.reset        = this.reset.bind(this);
	}
	reset(){
		this.props.form.resetFields();
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.data == null )this.reset();
	}
	handleCancel(){
		var values = this.props.form.getFieldsValue();
		var data = this.props.data;
		var changed = this.compare(values,data);
		if(changed){
			Modal.confirm({
			    title: '确认',
			    content: '放弃保存您的修改？',
			    okText: '放弃',
			    cancelText: '我再看看',
			    onOk:()=>{this.close();}
			  });
		}else{
			this.close();
		}
	}
	close(){
		this.props.dispatch({
			type:'dictionary/setState',
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
					type:'dictionary/save',
					params:values
				});
			}
		});
	}
	render(){
		const { getFieldDecorator } = this.props.form;
		const data    = this.props.data||{};
		const visible = this.props.data?true:false;
		const title   = data.columnName||"新增";
		const isCreate= data.id?false:true;
		const formItemLayout = {
	    	labelCol: { span: 5 },
	    	wrapperCol: { span: 15 },
	    };
		//hasFeedback 属性删除，解决firefox无法输入汉字的bug xiaweiyi
		return (
			<Modal width={850} title={title} visible={visible} closable={true} footer={null} maskClosable={false} onCancel={this.handleCancel} >
			<Form>
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('id',{ initialValue:data.id})(<Input />)
				}
				</FormItem>
				<Row>
				<Col span={12}>
					<FormItem label="医院ID"  {...formItemLayout}>
					{
						getFieldDecorator('hosId',{ 
							initialValue:data.hosId,
							rules: [{ required: true, message: '医院id不能为空' },]
						})(<Input tabIndex ={1}/>)
					}
					</FormItem>
				 	<FormItem label="列分组"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('columnGroup',{
				 			initialValue : data.columnGroup,
				 			rules: [{ required: true, message: '列分组不能为空' },]
				 		})(<Input tabIndex={3}/>)
				 	}
				 	</FormItem>
				 	<FormItem label="列名称"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('columnName',{
				 			initialValue : data.columnName,
				 			rules: [{ required: true, message: '列名称不能为空' },]
				 		})(<Input tabIndex={5}/>)
				 	}
				 	</FormItem>
				 	<FormItem label="列编码"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('columnCode',{
				 			initialValue : data.columnCode,
				 			rules: [{ required: true, message: '列编码不能为空' },]
				 		})(<Input tabIndex={7}/>)
				 	}
				 	</FormItem>
				 	<FormItem label="拼音"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('spellCode',{
				 			initialValue : data.spellCode,
				 			rules: [{ required: true, message: '拼音不能为空' },]
				 		})(<Input tabIndex={9}/>)
				 	}
				 	</FormItem>	
				 	<FormItem label="自定义码"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('userCode',{
				 			initialValue:data.userCode,
				 			rules: [{ required: true, message: '自定义码不能为空' },]
				 		})(<Input tabIndex={11}/>)
				 	}
				 	</FormItem>
				 	<FormItem label="创建人员"  {...formItemLayout} style={{display:isCreate?'none':''}}>
				 	{
				 		getFieldDecorator('createOper',{
				 			initialValue:data.createOper,
				 		})(<Input disabled={true}/>)
				 	}
				 	</FormItem>
				 	<FormItem label="更新人员"  {...formItemLayout} style={{display:isCreate?'none':''}}>
				 	{
				 		getFieldDecorator('updateOper',{
				 			initialValue:data.updateOper,
				 		})(<Input disabled={true}/>)
				 	}
				 	</FormItem>
				</Col>
				<Col span={12}>
					<FormItem label="序号"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('sortId',{
				 			initialValue:data.sortId,
				 			rules: [{ required: true, message: '序号不能为空' },]
				 		})(<Input tabIndex ={2}/>)
				 	}
				 	</FormItem>
				 	<FormItem label="默认"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('defaulted',{
				 			initialValue:data.defaulted,
				 		})(
				 			<RadioGroup tabIndex ={4}>
						 		 <Radio value={true}>是</Radio>
						 		 <Radio value={false}>否</Radio>
					 		 </RadioGroup>
				 		)
				 	}
				 	</FormItem>
				 	<FormItem label="列显示"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('columnDis',{
				 			initialValue:data.columnDis
				 		})(<Input tabIndex ={6}/>)
				 	}
				 	</FormItem>

				 	<FormItem label="列值"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('columnVal',{
				 			initialValue:data.columnVal,
				 			rules: [{ required: true, message: '列值不能为空' },]
				 		})(<Input tabIndex ={8}/>)
				 	}
				 	</FormItem>
				 	
				 	<FormItem label="五笔"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('wbCode',{
				 			initialValue:data.wbCode,
				 			rules: [{ required: true, message: '五笔不能为空' },]
				 		})(<Input tabIndex ={10}/>)
				 	}
				 	</FormItem>
				 	
				 	<FormItem label="停用标志"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('stop',{
				 			initialValue:data.stop,
				 		})(
				 			<RadioGroup tabIndex ={12}>
						 		 <Radio value={true}>停用</Radio>
						 		 <Radio value={false}>未停用</Radio>
					 		 </RadioGroup >
				 		)
				 	}
				 	</FormItem>
				 	<FormItem label="创建时间"  {...formItemLayout} style={{display:isCreate?'none':''}}>
				 	{
				 		getFieldDecorator('createTime',{
				 			initialValue:data.createTime,
				 		})(<Input disabled={true}/>)
				 	}
				 	</FormItem>
				 	
				 	<FormItem label="更新时间"  {...formItemLayout} style={{display:isCreate?'none':''}}>
				 	{
				 		getFieldDecorator('updateTime',{
				 			initialValue:data.updateTime,
				 		})(<Input disabled={true}/>)
				 	}
				 	</FormItem>
				</Col>
				</Row>
				<Row>
					<Col span={10}> </Col>
					<Col span={1}><Button type="primary" onClick={this.handleSubmit}>保存</Button></Col>
					<Col span={2}> </Col>
					<Col span={1}><Button onClick={this.reset}>重置</Button></Col>
					<Col span={10}> </Col>
				</Row>
			</Form>
			</Modal >
		);	
	}
}
const  Editor = Form.create()(EditorForm);
export default connect()(Editor);


