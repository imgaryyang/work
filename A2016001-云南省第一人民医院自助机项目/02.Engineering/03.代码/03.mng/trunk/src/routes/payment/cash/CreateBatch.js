import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Row, Col, Button, Modal, DatePicker, Form, Input, Select } from 'antd';
import moment from 'moment';

import MachineSelect 		from '../../../components/MachineSelect';
const FormItem = Form.Item;

class CreateBatchForm extends Component {
	constructor(props) {
		super(props);
		this.hideModal = this.hideModal.bind(this);
		this.createBatch = this.createBatch.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentWillMount() {
		const { dicts } = this.props.machine;
		 if(!dicts || dicts.length < 1){
			 this.props.dispatch({
				 type: 'machine/initCashboxDicts',
		  });
		}
	}
	hideModal(){
		  this.props.dispatch({
		      type: 'cash/setState',
		      payload: {
		    	  batchVisible: false,
		      },
		  });
	}
	handleSubmit() {
	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	    	  const newValues = {...values};
	    	  if(newValues.machineId){
	    		  const { machineId }  =  { ...newValues}
		    	  this.createBatch(machineId);
	    	  }  
	      }
	    });
	 }
	createBatch(machineId){
		this.props.dispatch({
	          type: 'cash/save',
	          machineId: machineId,
	    });
	}
	render(){
		const { getFieldDecorator } = this.props.form;
		const { batchVisible } = this.props.cash;
		const formItemLayout = {
			      labelCol: { span: 6 },
			      wrapperCol: { span: 16 },
		};
		return (
			<Modal
				title="清钞"
		        visible={batchVisible}
		        onOk={this.hideModal}
		        onCancel={this.hideModal}
		        okText="确认"
		        cancelText="取消"
			>
				<Form onSubmit={this.handleSubmit}>
					<Row>
						<Col span={12}>
						<FormItem label="自助机" {...formItemLayout}>
		                  {
		                    getFieldDecorator('machineId')(<MachineSelect style={{width:'150px'}} placeholder="选择自助机" />)
		                  }
		                </FormItem>
						</Col>
						<Col span={12}>
							<Button type="primary" style={{width:'150px'}} htmlType="submit" size="large" >清钞</Button>
						</Col>
					</Row>
				</Form>
			</Modal>	
		);
	}
}
const CreateBatch = Form.create()(CreateBatchForm);
export default connect(({ cash, machine }) => ({ cash, machine }))(CreateBatch);