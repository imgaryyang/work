import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'dva';
import { Table, Button, Icon, Row, Col, Popconfirm, notification } from 'antd';
import CommonTable from '../../../components/CommonTable'
import Editor from './AccountEditor'
import SearchBar from './AccountSearchBar';

class AccountList extends React.Component {

	constructor(props) {
	    super(props);
	}

	componentWillMount(){
		this.props.dispatch({
			type:'account/load'
		});
	}

	forAdd(){
		this.props.dispatch({
			type:'account/setState',
			payload:{record:{}}
		});
	}

	//全部删除
	forDeleteAll(){
		console.info('deleteAll',this.props);
		var {selectedRowKeys} = this.props.account;
		if(selectedRowKeys && selectedRowKeys.length>0){//selectedRowKeys是跨页的，selectedRows不是
			this.props.dispatch({
				type:'account/deleteSelected'
			});
		}else{
			notification.warning({
			    message: '警告!',
			    description: '您目前没有选择任何数据！',
			});
		}
	}

	//单挑记录删除
	onDelete(record){
		this.props.dispatch({
			type:'account/delete',
			id : record.id
		});
	}

	onEdit(record){
		console.info('onEdit',record);
		this.props.dispatch({
			type:'account/setState',
			payload:{
				record : record
			}
		});
	}

	onSearch(values){
		console.info('list search ',values)
		this.props.dispatch({
			type:'account/load',
			payload:{
				query : values
			}
		});
	}

	rowSelectChange(selectedRowKeys, selectedRows){
		console.info('rowSelectChange',selectedRowKeys);
		this.props.dispatch({
			type:'account/setState',
			payload:{
				selectedRowKeys : selectedRowKeys
			}
		});
	}

	onPageChange(page){
		this.props.dispatch({
			type:'account/load',
			payload:{
				page:page
			}
		});
	}

	render(){
		var { account } = this.props;
		var { page, data, selectedRowKeys } = account;
		var deleteAllF = this.forDeleteAll.bind(this);

		const columns = [
		   { title:'ID',		dataIndex :'id',      	key:'id' },
		   { title:'用户名',  		dataIndex :'username',	key:'username'},
		   { title:'密码',  		dataIndex :'password',	key:'password'},
		   { title:'用户ID',  	dataIndex :'userId', 	key:'userId'},
		   { title:'用户类型',  	dataIndex :'type',  	key:'type' },
		   { title:'用户状态',  	dataIndex :'status',  	key:'status' },
		   { title: '操作',		key: 'action',
			  render: (text, record) => (
		        <span>
			        <Icon type="edit" style={{cursor:'pointer',color:'blue'}} onClick={this.onEdit.bind(this,record)} />
			        <span className="ant-divider" />
			        <Popconfirm placement="left" title={"您确定要删除此项么?"} cancelText={"否"} okText="是"
			        	onConfirm={this.onDelete.bind(this,record)} >
			        	<Icon type="delete" style={{cursor:'pointer',color:'red'}} />
			        </Popconfirm>
		        </span>
		      ),
			}
		];

		return (
			<div>
				<div style={{ marginBottom: 8}}>
				<Row>
					<Col span={20}> <SearchBar onSearch={this.onSearch.bind(this)} /></Col>
					<Col span={4}>
						<Button type="primary" style={{marginRight:'4px'}} onClick={this.forAdd.bind(this)}>新增</Button>
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
				<CommonTable data = { data } page = { page } columns = { columns }
					onPageChange = { this.onPageChange.bind(this) }
					onSelectChange = { this.rowSelectChange.bind(this) }
				/>
			</div>
		);
	}
}
export default connect(({account})=>({account}))(AccountList);

