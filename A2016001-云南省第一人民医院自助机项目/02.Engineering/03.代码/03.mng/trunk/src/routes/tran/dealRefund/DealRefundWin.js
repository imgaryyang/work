import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tabs, Row, Col, Button, Modal, DatePicker, Form, Input, Select } from 'antd';
import { arrayToString } from '../../../utils/tools';
import { prestore } from '../../base/Dict';
import FieldSet from '../../../components/FieldSet';
import CommonTable from '../../../components/CommonTable';
import MachineSelect from '../../../components/MachineSelect';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class DealRefundForm extends Component {

	constructor(props) {
		super(props);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getLimit = this.getLimit.bind(this);
		this.close = this.close.bind(this);
		this.reset = this.reset.bind(this);
	}

	componentWillMount() {
		const { dicts } = this.props.machine;
		 if(!dicts || dicts.length < 1){
			 this.props.dispatch({
				 type: 'machine/initDicts',
			 });
		 }
	}

	reset() {
		this.props.form.resetFields();
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
			type: 'dealRefundTran/setState',
			payload: {
				dealVisible: false,
				dealSpin: false,
				msg: '', 
			},
		});
		this.props.form.resetFields();
	}

	handleSubmit() {
		const { patient, account, tranDetail } = this.props.dealRefundTran;
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const newValues = { ...values };
				this.props.dispatch({
					type: 'dealRefundTran/dealRefund',
					payload: {
						newValues,
						patient,
						account,
						tranDetail,
					},
				});
				this.props.form.resetFields();
			}
		});
	}
	getLimit(){//可退金额
		const { patient, tranDetail, creditAmt } = this.props.dealRefundTran;
		if(!patient || !patient.balance){
			return '0';
		}
		if(tranDetail && tranDetail.rechargeNumber){ //可退金额取 余额和订单可退金额中最小值
			return patient.balance > (tranDetail.recharge-tranDetail.refund) ? tranDetail.recharge-tranDetail.refund : patient.balance;
		}else{
			var limit = 0;
			if(patient && patient.balance){
				limit = patient.balance - creditAmt ;
			}

			return limit > 0 ? limit : '0' ;
		}
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { dealSpin, dealVisible, patient, account, tranDetail, creditAmt} = this.props.dealRefundTran;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 16 },
		};
		var limit = this.getLimit() ;
		console.info("render",limit);
		const patients = [ patient ];
		const patientMsgColumns = [
		        {
		        	title: '患者',
		            dataIndex: 'patientNo',
		            key: 'patientNo',
		            width: 100,
		            render: (value, record) => {
		              return (
		                <div>
		                	{record.no || '-'} | {record.name || '-'} 
		                </div>
		              );
		            },
		        }, 
		        {
		        	title: '联系方式',
		            dataIndex: 'mobile',
		            key: 'mobile',
		            width: 100,
		            render: (value, record) => {
		              return (
		                <div>
		                	{record.mobile || record.telephone }
		                </div>
		              );
		            },
		        }, 
		        {
		        	title: '账户余额',
		            dataIndex: 'balance',
		            key: 'balance',
		            width: 100,
		            render: (value, record) => {
		              return (
		                <div>
		                	{ (value||'0').formatMoney() } 
		                </div>
		              );
		            },
		        }, 
		];
		const accounts = [ account ];
		const accountMsgColumns = [
		       {
		    	   title: '账户',
		            dataIndex: 'accNo',
		            key: 'accNo',
		            width: 100,
		            render: (value, record) => {
		              return (
		                <div>
		            	{value || '-'} | {record.cardBank || '-'} 
		                </div>
		              );
		            },
		       },  {
		    	   title: '账户类型',
		            dataIndex: 'accType',
		            key: 'accType',
		            width: 100,
		            render: (value, record) => {
		              return (
		                <div>
		                	{ prestore.paymentWay[value] }
		                </div>
		              );
		            },
		       },  {
		    	   title: '卡类型',
		            dataIndex: 'cardType',
		            key: 'cardType',
		            width: 100,
		            render: (value, record) => {
		              return (
		                <div>
		                	{ prestore.cardType[record.cardType] }
		                </div>
		              );
		            },
		       }, 
		];
		return (
				<Modal
					width={850}
					title={'退款处理'} 
					visible={dealVisible}
					closable
					footer={null}
					maskClosable={false}
					onCancel={this.handleCancel}
					style={{ top: '25px' }}
				>
				<Spin spinning={dealSpin} >
				 	<FieldSet title="患者信息" style={{ marginBottom: '5px' }} >
						<CommonTable
			                data={patients}
			                columns={patientMsgColumns}
			                bordered
			                size="middle"
			                className="compact-table"
			                pagination={false}
			                rowSelection={false}
						/>
					</FieldSet>
					<FieldSet title="账户信息" style={{ marginBottom: '5px' }} >
						<CommonTable
			                data={accounts}
			                columns={accountMsgColumns}
			                bordered
			                size="middle"
			                className="compact-table"
			                pagination={false}
			                rowSelection={false}
						/>
					</FieldSet>
					<FieldSet title="退款信息" style={{ marginBottom: '5px' }} >
					<Form>
						<Row>  
							<Col span={12}>
								<FormItem label="最多可退金额" {...formItemLayout}>
								{
									getFieldDecorator('allowRefund', {
										initialValue: limit,
										rules: [{ required: true, message: '可退金额为空' }],
									})(<Input tabIndex={4} disabled={true}/>)
								}
								</FormItem>
								<FormItem label="退款金额" {...formItemLayout}>
								{
									getFieldDecorator('amount', {
										initialValue: limit,
										rules: [{ required: true, message: '退款金额为空' }],
									})(<Input placeholder="请填写退款金额" tabIndex={4} />)
								}
								</FormItem>
								<FormItem label="自助机" {...formItemLayout}>
								 {
				                      getFieldDecorator('machineId', {
				                    	  required: true, message: '机器不能为空'
				                      })(<MachineSelect tabIndex={13} />)
				                  }
								</FormItem>
								<FormItem label="原第三方流水号" {...formItemLayout}>
								{
									getFieldDecorator('outTradeNo', {
										initialValue: tranDetail.outTradeNo || '-',
									})(<Input tabIndex={4} disabled={true}/>)
								}
								</FormItem>
							</Col>
							<Col span={12}>
								<FormItem label="退款账户" {...formItemLayout}>
								{
									getFieldDecorator('account', {
										initialValue: account.accId || '',
										rules: [{ required: true, message: '退款账户为空' }],
									})(<Input tabIndex={4} disabled={true} />)
								}
								</FormItem>
								<FormItem label="退款账户名" {...formItemLayout}>
								{
									getFieldDecorator('accountName', {
										initialValue: patient.name,
										rules: [{ required: true, message: '账户姓名为空' }],
									})(<Input placeholder="请填写退款账户姓名" tabIndex={4} />)
								}
								</FormItem>
								<FormItem label="原预存流水号" {...formItemLayout}>
								{
									getFieldDecorator('rechargeNumber', {
										initialValue: tranDetail.rechargeNumber || '-',
									})(<Input tabIndex={4} disabled={true} />)
								}
								</FormItem>
								<FormItem label="原预存金额" {...formItemLayout}>
								{
									getFieldDecorator('recharge', {
										initialValue: tranDetail.recharge || '-',
										rules: [{ required: true, message: '预存余额为空' }],
									})(<Input tabIndex={4} disabled={true} />)
								}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={23} style={{ textAlign: 'right' }} >
								<Button type="primary" htmlType="button"  onClick={()=>this.handleSubmit()} style={{ marginRight: '10px' }} icon="save" size="large" >保存</Button>
								<Button onClick={this.reset} icon="reload" size="large" >重置</Button>
							</Col>
						</Row>
					</Form>
					</FieldSet>
				</Spin>
			</Modal>
		);
	}
}
const DealRefundWin = Form.create()(DealRefundForm);
export default connect(({ dealRefundTran, machine }) => ({ dealRefundTran, machine }))(DealRefundWin);

