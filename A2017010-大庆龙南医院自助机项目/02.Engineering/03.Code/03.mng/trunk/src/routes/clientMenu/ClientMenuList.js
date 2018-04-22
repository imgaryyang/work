import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import {Table,Button,Icon,Row,Col,Popconfirm,notification} from 'antd';
import CommonTable from '../../components/CommonTable'
import Editor from './ClientMenuEditor'
import SearchBar from './ClientMenuSearchBar';

class ClientMenuList extends React.Component {

	constructor(props) {
	    super(props);
	}
	
	componentWillMount(){
		this.props.dispatch({
			type:'clientMenu/load'
		});
	}
	forAdd(){
		this.props.dispatch({
			type:'clientMenu/addOrActiveTab',
			tab:{title:'新增',cmp:<Editor/>,key:'creator'}
		});
	}
	forDeleteAll(){console.info('deleteAll',this.props);
		var {selectedRowKeys} = this.props.clientMenu;
		if(selectedRowKeys && selectedRowKeys.length>0){//selectedRowKeys是跨页的，selectedRows不是
			this.props.dispatch({
				type:'clientMenu/deleteSelected'
			});
		}else{
			notification.warning({
			    message: '警告!',
			    description: '您目前没有选择任何数据！',
			});
		}
	}
	onEdit(record){console.info('onEdit',record);
		this.props.dispatch({
			type:'clientMenu/addOrActiveTab',
			tab:{title:record.name,cmp:<Editor menu={record}/>,key:'creator'}
		});
	}
	onDelete(record){
		this.props.dispatch({
			type:'clientMenu/delete',
			id:record.id
		});
	}
	onSearch(values){console.info('list search ',values)
		this.props.dispatch({
			type:'clientMenu/load',
			payload:{
				query:values
			}
		});
	}
	rowSelectChange(selectedRowKeys, selectedRows){console.info('rowSelectChange',selectedRowKeys);
		this.props.dispatch({
			type:'clientMenu/setState',
			state:{selectedRowKeys:selectedRowKeys}
		});
	}
	onPageChange(page){
		this.props.dispatch({
			type:'clientMenu/load',
			payload:{
				page:page
			}
		});
	}
	render(){
		var {dispatch,clientMenu} = this.props;
		var {page,menus,selectedRowKeys} = clientMenu;
		var deleteAllF = this.forDeleteAll.bind(this);
		const columns = [
		   {title: '名称',dataIndex: 'name',key: 'name',},
		   {title: '别名',dataIndex: 'alias',key: 'alias',}, 
		   {title: '路径', dataIndex: 'pathname',key: 'pathname',},
		   {title: '编码',dataIndex: 'code',key: 'code',}, 
		   {title: 'url',dataIndex: 'url',key: 'url',}, 
		   {title: '坐标',dataIndex: 'coordinate',key: 'coordinate',},
		   {title: '长度',dataIndex: 'colspan',key: 'colspan',}, 
		   {title: '高度',dataIndex: 'rowspan',key: 'rowspan',},
		   {title: '配色',dataIndex: 'color',key: 'color',}, 
		   {title: '图标',dataIndex: 'icon',key: 'icon',},
		   {title: '排序',dataIndex: 'sort',key: 'sort',},
		   {title: '操作',key: 'action',render: (text, record) => (
		        <span>
			        <Icon type="edit" style={{cursor:'pointer',color:'blue'}} onClick={this.onEdit.bind(this,record)} />
			        <span className="ant-divider" />
			        <Popconfirm placement="left" title={"您确定要删除此项么?"} cancelText={"否"} okText="是"
			        	onConfirm={this.onDelete.bind(this,record)} >
			        	<Icon type="delete" style={{cursor:'pointer',color:'red'}} />
			        </Popconfirm>
		        </span>
		      ),
			}];
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
				<CommonTable data={menus} page={page} columns={columns} 
					onPageChange ={this.onPageChange.bind(this)}
					onSelectChange ={this.rowSelectChange.bind(this)}
				/>
			</div> 
		);	
	}
}
export default connect(({clientMenu})=>({clientMenu}))(ClientMenuList);

