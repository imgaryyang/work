import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Spin, Tabs,Tooltip, Icon, Row, Col, Button, Modal, DatePicker,Form, Input, Cascader, Select, Checkbox, Radio } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

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
		if( nextProps.data == null ){
			this.reset();
		}
	}
	
	handleCancel(){
		var values = this.props.form.getFieldsValue();
		if(values.bornDate){
			values.bornDate = values.bornDate.format('YYYY-MM-DD');
		}
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
			type : 'machine/setState',
			payload:{
				record : null
			}
		});
	}
	
	compare(obj,values){
		for(var key in obj){
			if(obj[key] != values[key]){
				return true;
			}
		}
		return false;
	}
	
	handleSubmit(e){
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				if(values.bornDate){
					values.bornDate = values.bornDate.format('YYYY-MM-DD');
				}
				this.props.dispatch({
					type : 'machine/save',
					params : values
				});
			}
		});
	}
	render(){
		const { getFieldDecorator } = this.props.form;
		const {spin } = this.props.machine;
		const data    = this.props.data || {};
		const visible = this.props.data ? true : false;
		const title   = data.name || "新增";
		const isCreate= data.id ? false : true;
		const formItemLayout = {
	    	labelCol: { span: 6 },
	    	wrapperCol: { span: 16 },
	    };
		return (
			<Modal width={850} title={title} visible={visible} closable={true} footer={null} maskClosable={false} onCancel={this.handleCancel} >
			<Spin spinning={spin} >
			<Form onSubmit={this.handleSubmit}>	
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('id',{ initialValue:data.id})(<Input />)
				}
				</FormItem>
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('hospitalNo',{ initialValue:data.hospitalNo})(<Input />)
				}
				</FormItem>
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('updateTime',{ initialValue:data.updateTime})(<Input />)
				}
				</FormItem>
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('updateUser',{ initialValue:data.updateUser})(<Input />)
				}
				</FormItem>
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('regTime',{ initialValue:data.regTime})(<Input />)
				}
				</FormItem>
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('regUser',{ initialValue:data.regUser})(<Input />)
				}
				</FormItem>
				<FormItem style={{display:'none'}}>
				{
					getFieldDecorator('status',{ initialValue:data.status})(<Input />)
				}
				</FormItem>
				<Row>
				<Col span={12}>
				 	<FormItem label="编码"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('code',{
				 			initialValue : data.name,
				 			rules: [{ required: true, message: '编码不能为空' },]
				 		})(<Input tabIndex={1}/>)
				 	}
				 	</FormItem>
				 	<FormItem label="MAC"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('mac',{
				 			initialValue : data.mac,
				 			rules: [{ required: true, message: 'MAC不能为空' },]
				 		})(<Input tabIndex={3}/>)
				 	}
				 	</FormItem>
				</Col>
				<Col span={12}>
				 	<FormItem label="名称"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('name',{
				 			initialValue : data.name,
				 			rules: [{ required: true, message: '名称不能为空' },]
				 		})(<Input tabIndex={2}/>)
				 	}
				 	</FormItem>
				 	<FormItem label="IP"  {...formItemLayout}>
				 	{
				 		getFieldDecorator('ip',{
				 			initialValue : data.ip,
				 			rules: [{ required: true, message: 'IP不能为空' },]
				 		})(<Input tabIndex={4}/>)
				 	}
				 	</FormItem>
				</Col>
				</Row>
				<Row>
					<Col  span={24}>
						<FormItem label="描述" labelCol= {{ span: 3 }} wrapperCol={{ span: 20 }} >
						{
							getFieldDecorator('desciption',{
								initialValue : data.desciption,
							})(<Input type="textarea" rows={4}  tabIndex={13}/>)
						}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={10}> </Col>
					<Col span={1}><Button type="primary" htmlType="submit">保存</Button></Col>
					<Col span={2}> </Col>
					<Col span={1}><Button onClick={this.reset}>重置</Button></Col>
					<Col span={10}> </Col>
				</Row>
			</Form>
			</Spin>
			</Modal >
		);	
	}
}
const  Editor = Form.create()(EditorForm);
export default connect(({machine})=>({machine}))(Editor);





//"hospitalName" : "昆华医院",

//"areaId" : null,
//"areaCode" : null,
//"areaName" : null,

//"mngId" : "4028a0815a91d9a5015a91da378b0000",
//"mngCode" : "alipay",
//"mngName" : "支付宝",
//"mngType" : "1",

//"hisUser" : null,


//"modelId" : null,
//"modelCode" : null,

//"supplier" : null,
//"medicalRecords" : 0,
//"isMedicalRecord" : null,
//"cardRecords" : 0,
//"isCardRecord" : null,
//"a4Records" : 0,
//"isA4Record" : null,
//"a5Records" : 0,
//"isA5Record" : null,

