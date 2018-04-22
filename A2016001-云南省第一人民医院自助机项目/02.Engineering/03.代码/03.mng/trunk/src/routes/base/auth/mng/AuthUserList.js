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
		   {title:'身份证号',	dataIndex :'idNo',		key:'idNo'},
		   {title:'名称',  	dataIndex :'name',		key:'name'},
		   {title:'手机', 	dataIndex :'mobile',	key:'mobile'},
		   {title:'拼音',  	dataIndex :'pinyin', 	key:'pinyin'},
		   {title:'民族',  	dataIndex :'folk', 		key:'folk'},
		   {title:'邮箱',  	dataIndex :'email', 	key:'email'},
		   {title:'出生日期', 	dataIndex :'bornDate', 	key:'出生日期'},
		   {title:'地区',  	dataIndex :'address', 	key:'address'},
		   {title:'所属机构', 	dataIndex :'org', 		key:'org'},
		   {title:'创建日期', 	dataIndex :'createDate', key:'createDate'},
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
			<div style = {{paddingLeft: '5px'}} >
				<Table rowKey="id" rowSelection={rowSelection} pagination={pagination} columns={columns} dataSource={data} />
			</div> 
		);	
	}
}
export default connect(({mngAuth})=>({mngAuth}))(UserList);
