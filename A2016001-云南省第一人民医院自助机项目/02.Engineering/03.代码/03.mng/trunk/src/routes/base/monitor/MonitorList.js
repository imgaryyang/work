import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Table, Button, Icon, Row, Modal,Col, Popconfirm, notification } from 'antd';
import CommonTable from '../../../components/CommonTable'
import SearchBar from './MonitorSearchBar';
import moment from 'moment';

class MonitorList extends React.Component {

	constructor(props) {
	    super(props);
	    this.checkState = this.checkState.bind(this);
	}
	
	componentWillMount(){
		
	}
	
	onSearch(values){
		this.props.dispatch({
			type : 'monitor/load',
			payload:{
				query : values
			}
		});
	}
	onPageChange(page){
		this.props.dispatch({
			type : 'monitor/load',
			payload:{
				page : page
			}
		});
	}
	checkState(record){
		const timestamp1 = Date.parse(new Date());
		const timestamp2 = Date.parse(new Date(record.monitorState));
		const time = (timestamp1-timestamp2)/1000/60;
		if(time>10){
			return false;
		}
		return true;
	}
	render(){
		var { monitor } = this.props;
		var { page, data, selectedRowKeys } = monitor;
		const check = this.checkState;
		const columns = [
		   {title:'机器编号',  	dataIndex :'code',		key:'code'},
		   {title:'机器名称',  	dataIndex :'name',		key:'name'},
		   {title:'所属银行',  	dataIndex :'mngName',	key:'mngName'},
		   {title:'监控时间',  	dataIndex :'monitorState',	key:'monitorState'},		   
		   {title: '运行状态',	key: 'demo',			render: (text, record) => (
				   check(record) ? (
						    <Icon type="check-circle" style={{cursor:'pointer',color:'#86CF2F'}} />
						   ):(
							<Icon type="close-circle" style={{cursor:'pointer',color:'#DD3852'}}  />   
						   )
			      ),
		   }
		];
		return (
			<div style = {{paddingLeft: '10px'}} >
				<div style={{ marginBottom: 8}}>
				<Row>
					<Col span={24}> <SearchBar onSearch={ this.onSearch.bind(this) } /></Col>
					
				</Row>
				</div>
				<CommonTable data={ data } page={ page } columns={ columns } 
					onPageChange={ this.onPageChange.bind(this) }
					bordered
				/>
			</div> 
		);	
	}
}
export default connect(({monitor})=>({monitor}))(MonitorList);

