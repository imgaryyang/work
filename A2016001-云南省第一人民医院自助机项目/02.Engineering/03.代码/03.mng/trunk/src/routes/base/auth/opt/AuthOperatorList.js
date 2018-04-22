import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Table, Button, Icon, Row, Col, Popconfirm, notification } from 'antd';
import CommonTable from '../../../../components/CommonTable'

class OperatorList extends React.Component {

	constructor(props) {
	    super(props);
	    this.onSelect = this.onSelect.bind(this);
	}
	
	componentWillMount(){
		this.props.dispatch({
			type : 'operatorAuth/loadOperators',
		});
//		if(this.props.operatorAuth.roleId != null){
//			this.props.dispatch({
//				type : 'operatorAuth/loadOperatorKeys',
//			});
//		}
	}
	componentWillReceiveProps(props){
		if(props.operatorAuth.roleId == this.props.operatorAuth.roleId)return;
		if(props.operatorAuth.roleId != null){
			this.props.dispatch({
				type : 'operatorAuth/loadOperatorKeys',
			});
		}else{
			this.props.dispatch({
				type : 'operatorAuth/loadOperatorKeys',
			});
		}
	}
	onPageSizeChange(current, pageSize){
		const { page } = this.props.operatorAuth.operator;
		const newPage = {...page,pageSize:pageSize,pageNo:1};
		this.props.dispatch({
			type : 'operatorAuth/loadOperators',
			payload:{page : newPage},
		});
	}
	
	onPageChange(pageNo){
		const { page } = this.props.operatorAuth.operator;
		const newPage = {...page,pageNo:pageNo};
		this.props.dispatch({
			type : 'operatorAuth/loadOperators',
			payload:{page : newPage},
		});
	}
	
	onSelect(record,selected){
		var type = selected?'assignOperator':'unAssignOperator';
		this.props.dispatch({
			type : 'operatorAuth/'+type,
			operatorId : record.id,
		});
	}
	
	render(){
		const { operator, roleId } = this.props.operatorAuth;
		const { data,selectedRowKeys,page } = operator ;
		const disable = roleId?false:true;
		const columns = [
		   {title:'人员编号', 	dataIndex :'no',		key:'no'},
		   {title:'名称',  	dataIndex :'name',		key:'name'},
		   {title:'手机号',	dataIndex :'mobile',	key:'mobile'},
		   {title:'就诊卡编号',	dataIndex :'medicalCardNo',	key:'medicalCardNo'},
		   {title:'地址',  	dataIndex :'address', key:'address'},
		   {title:'注册时间', 	dataIndex :'createTime', key:'createTime'},
		   {title:'注册人员', 	dataIndex :'regOperator', key:'regOperator'},
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
export default connect(({operatorAuth})=>({operatorAuth}))(OperatorList);
