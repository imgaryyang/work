import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Spin, Button, Row, Col} from 'antd';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';
import { checkDetailResult, } from '../../base/Dict';
import SearchBar from './CheckDetailSearchBar.js';

import styles from './CheckMain.less';

class CheckDetail extends Component {
	
	constructor(props) {
		super(props);
		this.onSearch = this.onSearch.bind(this);
		this.onPageChange = this.onPageChange.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleSync = this.handleSync.bind(this);
		this.handlePayAdd = this.handlePayAdd.bind(this);
		this.handleRefundCancel = this.handleRefundCancel.bind(this);
		this.handleAllRefundCancel = this.handleAllRefundCancel.bind(this);
		this.handleSyncFile = this.handleSyncFile.bind(this);
		this.handleImport = this.handleImport.bind(this);
		this.handleCheck = this.handleCheck.bind(this);
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
			type: 'check/setState',
			payload: {
				detailVisible: false,
				checkRecord: {},
				details: [],
			},
		});
	}
	onPageChange(page) {
		this.props.dispatch({
			type: 'check/loadDetails',
			payload: {page,},
		});
	}
	onSearch(values) {
	  console.info('list search ', values);
	  this.props.dispatch({
		  type: 'check/loadDetails',
		  payload: {  detailQuery: values, page: {pageNo: 1}, },
	  });
	}
	handleSync(record) {
		 Modal.confirm({
			 title: '确认',
			 content: '是否确认该笔交易同步第三方状态？',
			 okText: '确认',
			 cancelText: '我再看看',
			 onOk: () => { 
				 var settlement = {
        			settleNo : record.ssmNo,	
				 };
				 this.props.dispatch({
   	      			type: 'check/thirdSync',
	       	      	payload: { settlement }
   	  			 });
			 },
		 });
	}
	handlePayAdd(record) {
		const modal = Modal.success({
		    title: '提示信息',
		    content: '功能暂无开通',
		});
		setTimeout(() => modal.destroy(), 5000);
	}
	handleRefundCancel(record) {
		Modal.confirm({
	        title: '确认',
	        content: '是否确认该笔退款被撤销？',
	        okText: '确认',
	        cancelText: '我再看看',
	        onOk: () => { 
	        	var settlement = {
        			settleNo : record.ssmNo,	
        		};
	        	this.props.dispatch({
	    			type: 'check/cancelRefund',
	    			payload: {  settlement },
	    		});
	    	},
		});
	}
	handleAllRefundCancel() {
		const modal = Modal.success({
			title: '提示信息',
			content: '功能暂无开通',
		});
		setTimeout(() => modal.destroy(), 5000);
	}
	handleSyncFile() {
		const { checkRecord } = this.props.check;
		
		Modal.confirm({
			title: '确认',
			content: '是否确认重新下载文件？',
			okText: '确认',
			cancelText: '我再看看',
			onOk: () => { 
				this.props.dispatch({
					type: 'check/handleSyncFile',
					payload: {  checkRecord },
				});
			},
		});
	}
	handleImport() {
		const { checkRecord } = this.props.check;
		
		Modal.confirm({
			title: '确认',
			content: '是否确认重新导入数据？',
			okText: '确认',
			cancelText: '我再看看',
			onOk: () => { 
				this.props.dispatch({
					type: 'check/handleImport',
					payload: {  checkRecord },
				});
			},
		});
	}
	handleCheck() {
		const { checkRecord } = this.props.check;
		
		Modal.confirm({
	        title: '确认',
	        content: '是否确认重新对账？',
	        okText: '确认',
	        cancelText: '我再看看',
	        onOk: () => { 
	        	this.props.dispatch({
	    			type: 'check/handleCheck',
	    			payload: {  checkRecord },
	    		});
	    	},
		});
	}
	
	render() {
		const { check, base } = this.props;
		const { wsHeight } = base;
		const { detailPage, detailVisible, detailSpin, details, checkRecord } = check;
		const title = checkRecord.id?'【'+checkRecord.payChannel.name + "|" +checkRecord.chkDate+ '】对账明细，总共【'+checkRecord.total+'|'+checkRecord.amt+'】,成功【'+checkRecord.successTotal+'|'+checkRecord.successAmt+'】。':'对账明细'
		const columns = [
			{ title: '交易信息',
			    dataIndex: 'id',
			    key: 'id',
			    width: 200,
			    render: (value, record) => {
			        return (
			          <div>
			          	{`交易类型: ${checkDetailResult.tradeType[record.tradeType] || '-'} | ${checkRecord.payChannel.name}`}<br />
			          	交易账户: {record.account || '-'} | {record.amt.formatMoney()}
			          </div>
			        );
			    },
			},
			{ title: '第三方渠道',
			    dataIndex: 'tradeNo',
			    key: 'tradeNo',
			    width: 200,
			    render: (value, record) => {
			        return (
			          <div className={styles.order} >
			            {record.tradeNo || '-'} | {'成功'}<br />
			            <font className={styles.createTime} >{moment(record.tradeDate+ " " +record.tradeTime).format('YYYY-MM-DD HH:mm:ss')}</font>
			          </div>
			        );
			    },
			},
			{ title: '自助机',
			    dataIndex: 'ssmNo',
			    key: 'ssmNo',
			    width: 200,
			    render: (value, record) => {
			        return (
			          <div className={styles.order} >
			          	{`${record.ssmNo || '-'} | ${record.ssmCode || '-'} | ${checkDetailResult.checkStatus[record.ssmCheckStatus] || '-'}`}<br />
			            <font className={styles.createTime} >{moment(record.ssmTime).format('YYYY-MM-DD HH:mm:ss')}</font>
			          </div>
			        );
			    },
			},
			{ title: 'HIS',
			    dataIndex: 'hisNo',
			    key: 'hisNo',
			    width: 150,
			    render: (value, record) => {
			        return (
			          <div className={styles.order} >
			          	{`${record.hisNo || '-'} | ${checkDetailResult.checkStatus[record.hisCheckStatus] || '-'} | ${record.hisDealOpt || '-'}`}<br />
			            <font className={styles.createTime} >{moment(record.hisTime).format('YYYY-MM-DD HH:mm:ss')}</font>
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
		    		if(record && record.tradeType == 'SP'){
		    			return (
			    			<div>
				    			<Button onClick={() => this.handleSync(record)} size="small" >交易同步</Button>
			    				<Button onClick={() => this.handlePayAdd(record)} size="small" >补录</Button>
			    			</div>	
			    		);
		    		} else if(record && record.tradeType == 'SR'){
		    			return (
			    			<div>
				    			<Button onClick={() => this.handleSync(record)} size="small" >交易同步</Button>
			    			</div>	
			    		);
		    		} else if(record && record.tradeType == 'SC'){
		    			return (
			    			<div>
				    			<Button onClick={() => this.handleRefundCancel(record)} size="small" >取消退款</Button> 
			    			</div>	
			    		);
		    		}
		    		return (
		    			<div/>
		    		);
		    	},
		    },
		];
		var footers = [];
		if(checkRecord&&checkRecord.chkType=='3'){
			footers = [
		        /* <Button key="cancelAll" size="large"  onClick={this.handleAllRefundCancel}> 取消所有退款 </Button>,*/
		         <Button key="againSync" size="large" onClick={this.handleSyncFile}> 重新下载文件 </Button>,
		         <Button key="againImport" size="large" onClick={this.handleImport}> 重新导入数据 </Button>,
		         <Button key="againCheck" size="large" onClick={this.handleCheck}> 重新对账 </Button>,
		         <Button key="cancel" type="primary" size="large" onClick={this.handleCancel}> 取消 </Button>,
	         ];
		} else {
			footers = [
		         <Button key="againSync" size="large" onClick={this.handleSyncFile}> 重新下载文件 </Button>,
		         <Button key="againImport" size="large" onClick={this.handleImport}> 重新导入数据 </Button>,
		         <Button key="againCheck" size="large" onClick={this.handleCheck}> 重新对账 </Button>,
		         <Button key="cancel" type="primary" size="large" onClick={this.handleCancel}> 取消 </Button>,
	         ];
		}
			
		return (
			<Modal
			style={{ top: '25px' }}
			width={1150}
			title={title} 
			visible={detailVisible}
			closable
			footer={footers}
			maskClosable={false}
			onCancel={this.handleCancel}
			>	
				<Spin spinning={detailSpin} >
				<div style={{ marginBottom: 8 }}>
		          <Row>
		            <Col span={23}> <SearchBar onSearch={this.onSearch} /></Col>
		          </Row>
		        </div>
				<CommonTable
					rowKey={record => `${record.id}`}
					data={details}
					columns={columns}
					page={detailPage}
					onPageChange={this.onPageChange}
				 	rowSelection={false}
					scroll={{ y: (wsHeight - 41 - 36 - 62) }}
					size="middle"
					className="compact-table"
					pagination={true}
					bordered
				/>
				</Spin>
			</Modal>
		);
	}
}
export default connect(({ check, base }) => ({ check, base }),)(CheckDetail);
