import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Row, Col, Button, Modal, DatePicker, Form, Input, Select } from 'antd';
import { arrayToString } from '../../../utils/tools';
import { prestore } from '../../base/Dict';
import FieldSet from '../../../components/FieldSet';
import CommonTable from '../../../components/CommonTable';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class LoggerShow extends Component {
	constructor(props) {
		super(props);
		this.handleCancel = this.handleCancel.bind(this);
		this.close = this.close.bind(this);
	}
	componentWillMount(){
		
	}
	handleCancel() {
		Modal.confirm({
			title: '确认',
			content: '是否关闭？',
			okText: '关闭',
			cancelText: '我再看看',
			onOk: () => { this.close(); },
		});
	}
	close() {
		this.props.dispatch({
			type: 'logger/setState',
			payload: {
				visible: false,
			},
		});
	}
	render() {
		const { logger, visible, showSpin } = this.props.logger;
		const { getFieldDecorator } = this.props.form;
		return (
				<Modal
					width={850}
					title={'http请求信息'} 
					visible={visible}
					closable
					footer={null}
					maskClosable={false}
					onCancel={this.handleCancel}
					style={{ top: '25px' }}
				>
				<Form>
					<FormItem label="方法" labelCol={{ span: 3 }} wrapperCol={{ span: 24 }} >
		              {
		                getFieldDecorator('methodCode', {
		                  initialValue: logger.methodCode || logger.message ,
		                })(<Input type='textarea' rows={1}  tabIndex={1} />)
		              }
		            </FormItem>
		            <FormItem label="URL" labelCol={{ span: 3 }} wrapperCol={{ span: 24 }} >
		              {
		                getFieldDecorator('url', {
		                  initialValue: logger.url || '',
		                })(<Input type='textarea' rows={1}  tabIndex={1} />)
		              }
		            </FormItem>
		            <FormItem label="请求参数" labelCol={{ span: 3 }} wrapperCol={{ span: 24 }} >
		              {
		                getFieldDecorator('param' || '', {
		                  initialValue: logger.param,
		                })(<Input type='textarea' rows={2}  tabIndex={1} />)
		              }
		            </FormItem>
					<FormItem label="响应信息" labelCol={{ span: 3 }} wrapperCol={{ span: 24 }} >
		              {
		                getFieldDecorator('response' || '', {
		                  initialValue: logger.response,
		                })(<Input type='textarea' rows={4}  tabIndex={1} />)
		              }
		            </FormItem>
		        </Form>
				</Modal>
		)
	}
}
const Show = Form.create()(LoggerShow);
export default connect(({ logger }) => ({ logger }))(Show);
