import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Button } from 'antd';
import moment from 'moment';

import CommonTable 		from '../../../components/CommonTable';

class TranDetail extends Component {
	
	constructor(props) {
		super(props);
		this.handleCancel = this.handleCancel.bind(this);
		this.onSelectTran = this.onSelectTran.bind(this);
	}
	
	componentWillMount() {
		
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
				tranVisible: false,
				tranDetails: [],
			},
		});
	}
	
	onSelectTran(record) {
		const { account } = this.props.dealRefundTran;
		
		this.props.dispatch({
			type: 'dealRefundTran/setState',
			payload: {
				tranVisible: false,
				tranDetails: [],
			},
		});
		if(this.props.showDealWin){
			this.props.showDealWin(account, record);
		}
	}
	
	render() {
		const title = '充值明细';
		const { dealRefundTran, base } = this.props;
		const { wsHeight } = base;
		const { tranVisible, tranDetails } = dealRefundTran;
		const columns = [
		    {
		    	title: '退款账户',
		    	dataIndex: 'account',
		    	key: 'account',
		    	width: 100,
		    	render: (value, record) => {
		    		return (
		    			<div>
		    				{ value }
		    			</div>	
		    		);
		    	},
		    },
		    {
		    	title: '支付时间',
		    	dataIndex: 'paymentTime',
		    	key: 'paymentTime',
		    	width: 100,
		    	render: (value, record) => {
		    		return (
		    			<div>
		    				{ value }
		    			</div>	
		    		);
		    	},
		    },
		    {
		    	title: '支付金额',
		    	dataIndex: 'recharge',
		    	key: 'recharge',
		    	width: 100,
		    	render: (value, record) => {
		    		return (
		    			<div>
		    				{ value.formatMoney() }
		    			</div>	
		    		);
		    	},
		    },
		    {
		    	title: '已退金额',
		    	dataIndex: 'refund',
		    	key: 'refund',
		    	width: 100,
		    	render: (value, record) => {
		    		return (
		    			<div>
		    				{ value.formatMoney() }
		    			</div>	
		    		);
		    	},
		    },
		    {
		    	title: '操作',
		    	dataIndex: 'operator',
		    	key: 'operator',
		    	width: 100,
		    	render: (value, record) => {
		    		return (
		    			<div>
		    				<Button onClick={()=>this.onSelectTran(record)} size="small" >退款</Button>
		    			</div>	
		    		);
		    	},
		    },
		];
		return (
			<Modal
			width={850}
			height={600}
			title={title} 
			visible={tranVisible}
			closable
			footer={null}
			maskClosable={false}
			onCancel={this.handleCancel}
			>
				<CommonTable
					rowKey={record => `${record.rechargeNumber}`}
					data={tranDetails}
					columns={columns}
					onPageChange={this.onPageChange}
					onSelectChange={this.rowSelectChange}
					scroll={{ y: (wsHeight - 41 - 36 - 62) }}
					bordered
					size="middle"
					className="compact-table"
					pagination={false}
				/>
			</Modal>
		);
	}
}

export default connect( ({ dealRefundTran, base }) => ({ dealRefundTran, base }),)(TranDetail);
