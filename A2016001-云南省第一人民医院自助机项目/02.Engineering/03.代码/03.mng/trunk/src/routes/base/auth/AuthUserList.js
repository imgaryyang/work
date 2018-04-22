import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Table, Button, Icon, Row, Col, Popconfirm, notification } from 'antd';
import CommonTable from '../../../components/CommonTable'

class UserList extends React.Component {

	constructor(props) {
	    super(props);
	    this.onSelect = this.onSelect.bind(this);
	}
	
	componentWillMount(){
		this.props.dispatch({
			type : 'auth/loadUsers',
		});
//		if(this.props.auth.roleId != null){
//			this.props.dispatch({
//				type : 'auth/loadUserKeys',
//			});
//		}
	}
	componentWillReceiveProps(props){
		if(props.auth.roleId == this.props.auth.roleId)return;
		if(props.auth.roleId != null){
			this.props.dispatch({
				type : 'auth/loadUserKeys',
			});
		}else{
			this.props.dispatch({
				type : 'auth/loadUserKeys',
			});
		}
	}
	onPageSizeChange(current, pageSize){
		const { page } = this.props.auth.user;
		const newPage = {...page,pageSize:pageSize,pageNo:1};
		this.props.dispatch({
			type : 'auth/loadUsers',
			page : newPage,
		});
	}
	
	onPageChange(pageNo){
		const { page } = this.props.auth.user;
		const newPage = {...page,pageNo:pageNo};
		this.props.dispatch({
			type : 'auth/loadUsers',
			page : newPage,
		});
	}
	
	onSelect(record,selected){
		var type = selected?'assignUser':'unAssignUser';
		this.props.dispatch({
			type : 'auth/'+type,
			userId : record.id,
		});
	}
	
	render(){
		const { user, roleId } = this.props.auth;
		const { data,selectedRowKeys,page } = user ;
		const disable = roleId?false:true;
		const columns = [
		   {title:'中文名',  	dataIndex :'name',		key:'name'},
		   {title:'英文名',  	dataIndex :'enName',	key:'enName'},
		   {title:'简称',  	dataIndex :'shortName', key:'shortName'},
		   {title:'性别',    	dataIndex :'gender',  	key:'gender',
			   render: (value, record) => {
				   if( value=='0') return '女';
				   else if( value=='1') return '男';
				   else return "";
			   }
		   },
		   {title:'身份证号',  	dataIndex :'idNo',  	key:'idNo'},
		   {title:'手机',    	dataIndex :'mobile',    key:'mobile'},
		   {title:'民族',    	dataIndex :'folk',  	key:'folk'},
		   {title:'邮箱',    	dataIndex :'email',     key:'email'},
		   {title:'出生日期',	dataIndex :'bornDate',	key:'bornDate'},
		   {title:'状态',	    dataIndex :'active',	key:'active',
			   render: function(value, record){
				   if(value){
					   return <a style={{color:'green'}}>正常</a>
				   }else{
					   return <a style={{color:'red'}}>已禁用</a>
				   }
			   },
		   }
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
export default connect(({auth})=>({auth}))(UserList);
//onSelectChange={ this.rowSelectChange.bind(this) }