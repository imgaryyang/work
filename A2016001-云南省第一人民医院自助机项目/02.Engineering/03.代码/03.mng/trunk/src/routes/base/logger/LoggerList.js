import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Table, Button, Icon, Row, Col, Popconfirm, notification } from 'antd';
import CommonTable from '../../../components/CommonTable'
import SearchBar from './LoggerSearchBar';

class LoggerList extends React.Component {

	constructor(props) {
	    super(props);
	    this.showLogger = this.showLogger.bind(this);
	    this.onSearch = this.onSearch.bind(this);
	    this.onPageChange = this.onPageChange.bind(this);
	}
	
	componentWillMount(){
		
	}
	
	onSearch(values){
		this.props.dispatch({
			type : 'logger/load',
			payload:{
				query : values
			}
		});
	}
	
	
	onPageChange(page){
		this.props.dispatch({
			type : 'logger/load',
			payload:{
				page : page
			}
		});
	}
	showLogger(record){
		this.props.dispatch({
			type : 'logger/setState',
			payload:{
				logger : record,
				visible: true,
			}
		});
	}
	render(){
		var { logger } = this.props;
		var { page, data, selectedRowKeys } = logger;
		const columns = [
		   {title:'时间',  	dataIndex :'createDay',		key:'createDay'},
		   {title:'方法',  	dataIndex :'methodCode',	key:'methodCode'},
		   {title:'URL',  	dataIndex :'url',	key:'url'},
		   {title: '操作',	key: 'action',			render: (text, record) => (
			        <span>
			        <Button type="primary" style={{marginRight:'4px'}}  onClick={ this.showLogger.bind(this, record) }>查看明细</Button>
			        </span>
			      ),
			}
		];
		return (
			<div style = {{paddingLeft: '10px'}} >
				<div style={{ marginBottom: 8}}>
				<Row>
					<Col span={24}> 
						<SearchBar onSearch={ this.onSearch.bind(this) } />
					</Col>
				</Row>
				</div>
				<CommonTable data={ data } page={ page } columns={ columns } rowSelection={false}
					onPageChange={ this.onPageChange.bind(this) }
				/>
			</div> 
		);	
	}
}
export default connect(({logger})=>({logger}))(LoggerList);

