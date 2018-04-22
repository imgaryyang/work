import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Table, Button, Icon, Row, Col, Popconfirm, notification } from 'antd';
import CommonTable from '../../../components/CommonTable'
import Editor from './AreaEditor'
import SearchBar from './AreaSearchBar';

class AreaList extends React.Component {

	constructor(props) {
	    super(props);
	}
	
	componentWillMount(){
		/*this.props.dispatch({
			type : 'area/load'
		});*/
	}
	
	forAdd(){
		this.props.dispatch({
			type : 'area/setState',
			payload:{
				record : {}
			}
		});
	}
	
	forDeleteAll(){
		console.info('deleteAll',this.props);
		var { selectedRowKeys } = this.props.area;
		//selectedRowKeys是跨页的，selectedRows不是
		if( selectedRowKeys && selectedRowKeys.length>0 ){
			this.props.dispatch({
				type : 'area/deleteSelected'
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
			type : 'area/setState',
			payload : {
				record : record
			}
		});
	}
	onDelete(record){
		this.props.dispatch({
			type : 'area/delete',
			payload : {
				id : record.id
			}
		});
	}
	
	onSearch(values){
		console.info('list search ',values)
		this.props.dispatch({
			type : 'area/load',
			payload:{
				query : values
			}
		});
	}
	
	rowSelectChange( selectedRowKeys, selectedRows ){
		console.info('rowSelectChange', selectedRowKeys);
		this.props.dispatch({
			type : 'area/setState',
			payload:{
				selectedRowKeys : selectedRowKeys
			}
		});
	}
	
	onPageChange(page){
		this.props.dispatch({
			type : 'area/load',
			payload:{
				page : page
			}
		});
	}
	
	render(){
		var { area } = this.props;
		var { page, data, selectedRowKeys } = area;
		var deleteAllF = this.forDeleteAll.bind(this);
		
		const columns = [
		   {title:'编号',  	dataIndex :'no',		key:'code'},
		   {title:'名称',  	dataIndex :'name',		key:'name'},
		   {title:'所属机构',  	dataIndex :'areaName',	key:'areaName'},
		   {title:'就诊卡号',  	dataIndex :'medicalCardNo', key:'medicalCardNo'},
		   {title:'地址',  	dataIndex :'adress', key:'adress'},
		   {title: '操作',	key: 'action',			render: (text, record) => (
		        <span>
			        <Icon type="edit" style={{cursor:'pointer',color:'blue'}} onClick={ this.onEdit.bind(this,record) } />
			        <span className="ant-divider" />
			        <Icon type="edit" style={{cursor:'pointer',color:'blue'}} onClick={ this.onDelete.bind(this,record) } />
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
					</Col>
				</Row>
				</div>
				<CommonTable data={ data } page={ page } columns={ columns } 
					onPageChange={ this.onPageChange.bind(this) }
					onSelectChange={ this.rowSelectChange.bind(this) }
				/>
			</div> 
		);	
	}
}
export default connect(({area})=>({area}))(AreaList);

