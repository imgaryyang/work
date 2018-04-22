import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Row, Col, Button, Modal, DatePicker, Upload, Icon, Form, Input, Select,message } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

class CheckRetDetailsImpForm extends Component {
	constructor(props) {
		super(props);
		this.hideModal = this.hideModal.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentWillMount() {
	}
	hideModal(){
		this.props.dispatch({
			type: 'check/setState',
			payload: {
				importDetailVisible: false,
			},
		});
	}
	handleSubmit() {
		this.props.dispatch({
			type: 'check/setState',
			payload: {
				importDetailVisible: false,
			},
		});
		this.props.dispatch({
  		  	type: 'check/loadChecks',
  	  	});
	}
	render(){
		const { getFieldDecorator, getFieldValue } = this.props.form;
		const { importDetailVisible } = this.props.check;
		var chkDate = getFieldValue("chkDate"); 
		if (chkDate) {
			chkDate = chkDate.format('YYYY-MM-DD');
		}
		var payChannelCode = getFieldValue("payChannelCode");
		const formItemLayout = {
		      labelCol: { span: 6 },
		      wrapperCol: { span: 16 },
		};
		const props = {
			  name: 'file',
			  action: '/api/ssm/payment/check/retDetail/import/'+payChannelCode+"/"+chkDate,
			  headers: {
			    authorization: 'authorization-text',
			  },
			  multiple: false,
			  accept: '.xlsx',
			  beforeUpload: (file) => {
				  if( !chkDate || !payChannelCode ){
					  return false;
				  }

				  return true;
		      },
			  onChange(info) {
			    if (info.file.status !== 'uploading') {
			      console.log(info.file, info.fileList);
			    }
			    if (info.file.status === 'done') {
			    	console.info(info.file.response);
			    	message.success(`${info.file.name} file uploaded successfully`);
			    } else if (info.file.status === 'error') {
			    	message.error(`${info.file.name} file upload failed.`);
			    }
			  },
		};
		return (
			<Modal
				title="导入退汇明细"
		        visible={importDetailVisible}
		        onOk={this.handleSubmit}
		        onCancel={this.hideModal}
		        okText="确认"
		        cancelText="取消"
			>
			<Form onSubmit={this.handleSubmit}>
	            <Row>
	              <Col span={12}>
	                <FormItem label="对账日期" {...formItemLayout}>
	                  {
	                    getFieldDecorator('chkDate', )(<DatePicker tabIndex={8} format={'YYYY-MM-DD'} style={{ width: '100%' }} />)
	                  }
	                </FormItem>
	              </Col>
	              <Col span={12}>
		              <FormItem label="对账银行" {...formItemLayout}>
		              {
		            	  getFieldDecorator('payChannelCode',)(
		    	      		  <Select style ={{width:'100px'}}>
		    	      		  <Option value={'0306'}> {'广发银行'}</Option>
		    	      		  <Option value={'0308'}> {'招商银行'}</Option>
		    	      	      </Select> )
		              }
		            </FormItem>
		          </Col>
	            </Row>
	            <Row>
	              <Col span={12}>
		            <FormItem>
				        <Upload {...props}>
					    	<Button><Icon type="upload" /> 导入点钞记录</Button>
					    </Upload>
				    </FormItem>
			      </Col>
	            </Row>
	         </Form>
			</Modal>	
		);
	}
}
const CheckRetDetailsImpWin = Form.create()(CheckRetDetailsImpForm);
export default connect(({ check }) => ({ check }))(CheckRetDetailsImpWin);