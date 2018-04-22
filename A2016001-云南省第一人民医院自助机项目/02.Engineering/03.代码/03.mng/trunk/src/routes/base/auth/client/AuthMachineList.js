import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Table, Button, Icon, Row, Col, Popconfirm, notification } from 'antd';
import CommonTable from '../../../../components/CommonTable'

class MachineList extends React.Component {

	constructor(props) {
	    super(props);
	    this.onSelect = this.onSelect.bind(this);
	}
	
	componentWillMount(){
		this.props.dispatch({
			type : 'clientAuth/loadMachines',
		});
//		if(this.props.clientAuth.roleId != null){
//			this.props.dispatch({
//				type : 'clientAuth/loadMachineKeys',
//			});
//		}
	}
	componentWillReceiveProps(props){
		if(props.clientAuth.roleId == this.props.clientAuth.roleId)return;
		if(props.clientAuth.roleId != null){
			this.props.dispatch({
				type : 'clientAuth/loadMachineKeys',
			});
		}else{
			this.props.dispatch({
				type : 'clientAuth/loadMachineKeys',
			});
		}
	}
	onPageSizeChange(current, pageSize){
		const { page } = this.props.clientAuth.machine;
		const newPage = {...page,pageSize:pageSize,pageNo:1};
		this.props.dispatch({
			type : 'clientAuth/loadMachines',
			payload:{page : newPage},
		});
	}
	
	onPageChange(pageNo){
		const { page } = this.props.clientAuth.machine;
		const newPage = {...page,pageNo:pageNo};
		this.props.dispatch({
			type : 'clientAuth/loadMachines',
			payload:{page : newPage},
		});
	}
	
	onSelect(record,selected){
		var type = selected?'assignMachine':'unAssignMachine';
		this.props.dispatch({
			type : 'clientAuth/'+type,
			machineId : record.id,
		});
	}
	
	render(){
		const { machine, roleId } = this.props.clientAuth;
		const { data,selectedRowKeys,page } = machine ;
		const disable = roleId?false:true;
		const columns = [
		   {title:'编码',  	dataIndex :'code',		key:'code'},
		   {title:'名称',  	dataIndex :'name',		key:'name'},
		   {title:'所属医院',  	dataIndex :'hospitalName',	key:'hospitalName'},
		   {title:'地区',  	dataIndex :'areaName', key:'areaName'},
		   {title:'管理方',  	dataIndex :'mngName', key:'mngName'},
		   {title:'MAC',  	dataIndex :'mac', key:'mac'},
		   {title:'IP',  	dataIndex :'ip', key:'ip'},
		  // {title:'更新时间',  	dataIndex :'updateTime', key:'updateTime'},
		  // {title:'更新人员',  	dataIndex :'updateUser', key:'updateUser'},
		   {title:'注册时间',  	dataIndex :'regTime', key:'regTime'},
		  // {title:'注册人员',  	dataIndex :'regUser', key:'regUser'},
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
export default connect(({clientAuth})=>({clientAuth}))(MachineList);
//onSelectChange={ this.rowSelectChange.bind(this) }