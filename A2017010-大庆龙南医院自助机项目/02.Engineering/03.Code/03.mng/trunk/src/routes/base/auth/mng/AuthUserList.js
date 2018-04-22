import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Table, Button, Icon, Row, Col, Popconfirm, notification } from 'antd';
import CommonTable from '../../../../components/CommonTable'

class UserList extends React.Component {

	constructor(props) {
	    super(props);
	    this.onSelect = this.onSelect.bind(this);
	}
	
	componentWillMount(){
		this.props.dispatch({
			type : 'mngAuth/loadUsers',
		});
//		if(this.props.mngAuth.roleId != null){
//			this.props.dispatch({
//				type : 'mngAuth/loadUserKeys',
//			});
//		}
	}
	componentWillReceiveProps(props){
		if(props.mngAuth.roleId == this.props.mngAuth.roleId)return;
		if(props.mngAuth.roleId != null){
			this.props.dispatch({
				type : 'mngAuth/loadUserKeys',
			});
		}else{
			this.props.dispatch({
				type : 'mngAuth/loadUserKeys',
			});
		}
	}
	onPageSizeChange(current, pageSize){
		const { page } = this.props.mngAuth.user;
		const newPage = {...page,pageSize:pageSize,pageNo:1};
		this.props.dispatch({
			type : 'mngAuth/loadUsers',
			payload:{page : newPage},
		});
	}
	
	onPageChange(pageNo){
		const { page } = this.props.mngAuth.user;
		const newPage = {...page,pageNo:pageNo};
		this.props.dispatch({
			type : 'mngAuth/loadUsers',
			payload:{page : newPage},
		});
	}
	
	onSelect(record,selected){
		var type = selected?'assignUser':'unAssignUser';
		this.props.dispatch({
			type : 'mngAuth/'+type,
			userId : record.id,
		});
	}
	
	render(){
		const { user, roleId } = this.props.mngAuth;
		const { data,selectedRowKeys,page } = user ;
		const disable = roleId?false:true;
		const columns = [
		   {title:'编码',  	dataIndex :'code',		key:'code'},
		   {title:'名称',  	dataIndex :'name',		key:'name'},
		   {title:'所属医院',  	dataIndex :'hospitalName',	key:'hospitalName'},
		   {title:'地区',  	dataIndex :'areaName', key:'areaName'},
		   {title:'管理方',  	dataIndex :'mngName', key:'mngName'},
		   {title:'MAC',  	dataIndex :'mac', key:'mac'},
		   {title:'IP',  	dataIndex :'ip', key:'ip'},
		   {title:'更新时间',  	dataIndex :'updateTime', key:'updateTime'},
		   {title:'更新人员',  	dataIndex :'updateUser', key:'updateUser'},
		   {title:'注册时间',  	dataIndex :'regTime', key:'regTime'},
		   {title:'注册人员',  	dataIndex :'regUser', key:'regUser'},
		   {title:'描述',  	dataIndex :'description', key:'description'},
		];
		const rowSelection = disable?null:{ selectedRowKeys, onSelect: this.onSelect,};
		var pageSize = page.pageSize || 10;
		const pagination = {
				total: page.total||0,
				pageSize: pageSize,
				showSizeChanger: true,
				showQuickJumper:true,
				showTotal : function(total, range){
					return '第'+range[0]+'-'+range[1]+'条  共 '+total+' 条';
				},
				onShowSizeChange: this.onPageSizeChange.bind(this),
				onChange: this.onPageChange.bind(this),
		};
		return (
			<div style = {{paddingLeft: '10px'}} >
				<Table rowKey="id" rowSelection={rowSelection} pagination={pagination} columns={columns} dataSource={data} />
			</div> 
		);	
	}
}
export default connect(({mngAuth})=>({mngAuth}))(UserList);
//onSelectChange={ this.rowSelectChange.bind(this) }