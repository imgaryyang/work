import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Tooltip, Icon, Row, Col, Button,Modal,Form, Input, Cascader, Select, Checkbox, Radio } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class EditorFormDetail extends React.Component {

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
		if(nextProps.chargePkg.detailRecord == null )this.reset();
	}
	handleCancel(){
		var values = this.props.form.getFieldsValue();
		var detailData = this.props.chargePkg.detailRecord;
		var changed = this.compare(values,detailData);
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
			type:'chargePkg/setState',
			payload:{detailRecord:null}
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
				values.hosId = "00000000";
				this.props.dispatch({
					type:'chargePkg/saveDetail',
					params:values
				});
			}
		});
	}
	render(){
		const { getFieldDecorator } = this.props.form;
		const data    = this.props.chargePkg.detailRecord||{};
		const visible = this.props.chargePkg.detailRecord?true:false;
		const comboId = data.comboId
		const title   = data.columnName||"新增";
		const isCreate= data.id?false:true;
		const formItemLayout = {
	    	labelCol: { span: 5 },
	    	wrapperCol: { span: 15 },
	    };
		//hasFeedback 属性删除，解决firefox无法输入汉字的bug xiaweiyi
		return (
			<Modal width={850} title={title} visible={visible} closable={true} footer={null} maskClosable={false} onCancel={this.handleCancel} >
			<Form >
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('id',{ initialValue:data.id})(<Input />)
				}
				</FormItem>
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('comboId',{ initialValue:data.comboId})(<Input />)
				}
				</FormItem>
				<Row>
				<Col span={12}>
				
				 	<FormItem label="组合号"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('comboNo',{
				 			initialValue : data.comboNo,
				 			rules: [{ required: true, message: '组合号不能为空' },]
				 		})(<Input tabIndex={1}/>)
				 	}
				 	</FormItem>
				 	
				 	<FormItem label="项目编码"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('itemCode',{
				 			initialValue : data.itemCode,
				 			rules: [{ required: true, message: '项目编码不能为空' },]
				 		})(<Input tabIndex={3}/>)
				 	}
				 	</FormItem>
				 	
				 	<FormItem label="单位"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('unit',{
				 			initialValue:data.unit,
				 			rules: [{ required: true, message: '单位不能为空' },]
				 		})(<Input tabIndex={5}/>)
				 	}
				 	</FormItem>
				 	<FormItem label="用法"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('usage',{
				 			initialValue : data.usage,
				 			rules: [{ required: true, message: '用法不能为空' },]
				 		})(<Input tabIndex={7}/>)
				 	}
				 	</FormItem>	
				 	
				 	<FormItem label="一次剂量"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('dosage',{
				 			initialValue:data.dosage,
				 			rules: [{ required: true, message: '一次剂量不能为空' },]
				 		})(<Input tabIndex={9}/>)
				 	}
				 	</FormItem>
				 	<FormItem label="默认科室"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('defaultDept',{
				 			initialValue:data.defaultDept,
				 			rules: [{ required: true, message: '默认科室不能为空' },]
				 		})(<Input tabIndex={11}/>)
				 	}
				 	</FormItem>
				 	<FormItem label="停用标志"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('stop',{
				 			initialValue:data.stop,
				 		})(
				 			<RadioGroup tabIndex ={13}>
						 		 <Radio value={true}>停用</Radio>
						 		 <Radio value={false}>未停用</Radio>
					 		 </RadioGroup >
				 		)
				 	}
				 	</FormItem>
				 	
				 	
				</Col>
				<Col span={12}>
					<FormItem label="组内序号"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('comboSort',{
				 			initialValue : data.comboSort,
				 			
				 			rules: [{ required: true, message: '组内序号不能为空' },]
				 		})(<Input tabIndex={2}/>)
				 	}
				 	</FormItem>
				 	
				 	<FormItem label="默认数量"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('defaultNum',{
				 			initialValue:data.defaultNum,
				 			rules: [{ required: true, message: '默认数量不能为空' },]
				 		})(<Input tabIndex={4}/>)
				 	}
				 	</FormItem>
				 	
				 	<FormItem label="付数"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('days',{
				 			initialValue:data.days
				 		})(<Input tabIndex ={6}/>)
				 	}
				 	</FormItem>
				 	<FormItem label="频次"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('freq',{
				 			initialValue:data.freq,
				 			rules: [{ required: true, message: '频次不能为空' },]
				 		})(<Input tabIndex={8}/>)
				 	}
				 	</FormItem>
				 	
				 	<FormItem label="剂量单位"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('dosageUnit',{
				 			initialValue:data.dosageUnit,
				 			rules: [{ required: true, message: '剂量单位不能为空' },]
				 		})(<Input tabIndex={10}/>)
				 	}
				 	</FormItem>
					
				 	<FormItem label="备注"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('comm',{
				 			initialValue:data.comm
				 		})(<Input tabIndex ={12}/>)
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
const  EditorDetail = Form.create()(EditorFormDetail);
export default  connect(({chargePkg})=>({chargePkg}))(EditorDetail);



