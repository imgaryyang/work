import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Table, Button, Icon, Row, Modal,Col, Popconfirm, notification } from 'antd';
import CommonTable from '../../../components/CommonTable'
import Editor from './PayChannelEditor'
import SearchBar from './PayChannelSearchBar';

class PayChannelList extends React.Component {

	constructor(props) {
	    super(props);
	}
	
	componentWillMount(){
		this.props.dispatch({
			type : 'payChannel/load'
		});
	}
	
	forAdd(){
		this.props.dispatch({
			type : 'payChannel/setState',
			payload:{
				record : {}
			}
		});
	}
	
	forDeleteAll(){
		console.info('deleteAll',this.props);
		var { selectedRowKeys } = this.props.payChannel;
		//selectedRowKeys是跨页的，selectedRows不是
		if( selectedRowKeys && selectedRowKeys.length>0 ){
			this.props.dispatch({
				type : 'payChannel/deleteSelected'
			});
		}
		else{
			notification.warning({
			    message: '警告!',
			    description: '您目前没有选择任何数据！',
			});
		}
	}
	
	onEdit(record){
		console.info('onEdit',record);
		this.props.dispatch({
			type : 'payChannel/setState',
			payload : {
				record : record
			}
			
		});
	}
	onDelete(record){
		console.info('onDelete',record);
		Modal.confirm({
		    title: '确认删除',
		    content: '确认删除该项吗？',
		    okText: '确定',
		    cancelText: '取消',
		    onOk:()=>{
		    	this.props.dispatch({
					type : 'payChannel/delete',
					payload : {
						id : record.id
					}
				});
		    }
		});
	}
		
	onSearch(values){
		console.info('list search ',values)
		this.props.dispatch({
			type : 'payChannel/load',
			payload:{
				query : values
			}
		});
	}
	
	rowSelectChange( selectedRowKeys, selectedRows ){
		console.info('rowSelectChange', selectedRowKeys);
		this.props.dispatch({
			type : 'payChannel/setState',
			payload:{
				selectedRowKeys : selectedRowKeys
			}
		});
	}
	
	onPageChange(page){
		this.props.dispatch({
			type : 'payChannel/load',
			payload:{
				page : page
			}
		});
	}
	formatDate(value) {
        var now = new Date(value),
            y = now.getFullYear(),
            m = ("0" + (now.getMonth() + 1)).slice(-2),
            d = ("0" + now.getDate()).slice(-2);
        return y + "-" + m + "-" + d + " " + now.toTimeString().substr(0, 8);
    }
	render(){
		var { payChannel } = this.props;
		var { page, data, selectedRowKeys } = payChannel;
		var deleteAllF = this.forDeleteAll.bind(this);
		
		const columns = [
		   {title:'支付编码',  	dataIndex :'code',		key:'code'},
		   {title:'支付名称',  	dataIndex :'name',		key:'name'},
		   {title:'商户号',  	dataIndex :'mchId',	key:'mchId'},
		   {title:'商户名称',  	dataIndex :'mchName',	key:'mchName'},		   
		   {title:'字符集',  	dataIndex :'charset', key:'charset'},
		   {title:'对账时间',  	dataIndex :'checkTime', key:'checkTime'},
		   {title:'退款对账时间',  	dataIndex :'refCheckTime', key:'refCheckTime'},
		   {title:'退汇对账时间',  	dataIndex :'retCheckTime', key:'retCheckTime'},
		   {title:'前置IP',  	dataIndex :'frontIp', key:'frontIp'},
		   {title:'前置端口',  	dataIndex :'frontPort', key:'frontPort'},
		   {title:'状态',  	dataIndex :'status', key:'status'},
		   {title:'更新时间',  	dataIndex :'updateTime', key:'updateTime',render: (value) => { 
			    return this.formatDate(value);
	      }},
		   {title:'更新人',  	dataIndex :'updateUser', key:'updateUser'},
		   {title:'备注',  	dataIndex :'memo', key:'memo'},		  
		   {title: '操作',	key: 'action',			render: (text, record) => (
				   <span>
			        <Icon type="edit" style={{cursor:'pointer',color:'blue'}} onClick={ this.onEdit.bind(this, record) } />
			        <span className="ant-divider" />
			        <Icon type="delete" style={{cursor:'pointer',color:'red'}} onClick={ this.onDelete.bind(this, record) } />
		        </span>
		      ),
		   	}
		];
		return (
			<div style = {{paddingLeft: '10px'}} >
				<div style={{ marginBottom: 8}}>
				<Row>
					<Col span={20}> <SearchBar onSearch={ this.onSearch.bind(this) } /></Col>
					<Col span={4}> 
						<Button type="primary" style={{marginRight:'4px'}} onClick={ this.forAdd.bind(this) }>新增</Button>
				        <span className="ant-divider" />
				        {
								(selectedRowKeys.length>0)?(
										<Popconfirm placement="left" cancelText={"否"} okText="是" onConfirm={deleteAllF}
											title={("您确定要删除所有的"+selectedRowKeys.length+"选中项么?")} >
											<Button type="primary">删除</Button>
										</Popconfirm> 
								):(<Button type="primary" onClick={deleteAllF}>删除</Button>)
							}
					</Col>
					
				</Row>
				</div>
				<CommonTable data={ data } page={ page } columns={ columns } 
					onPageChange={ this.onPageChange.bind(this) }
					onSelectChange={ this.rowSelectChange.bind(this) }
					bordered
				/>
			</div> 
		);	
	}
}
export default connect(({payChannel})=>({payChannel}))(PayChannelList);

