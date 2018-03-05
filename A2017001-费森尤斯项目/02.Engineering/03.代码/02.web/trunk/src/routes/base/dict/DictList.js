import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import {Table,Button,Icon,Row,Col,Popconfirm,notification} from 'antd';
import CommonTable from '../../../components/CommonTable'
import Editor from './DictEditor'
import SearchBar from './DictSearchBar';

class DictList extends React.Component {

	constructor(props) {
	    super(props);
	}
	
	componentWillMount(){
		this.props.dispatch({
			type:'dictionary/load'
		});
	}
	forAdd(){
		this.props.dispatch({
			type:'dictionary/setState',
			payload:{record:{}}
		});
	}
	forDeleteAll(){console.info('deleteAll',this.props);
		var {selectedRowKeys} = this.props.dictionary;
		if(selectedRowKeys && selectedRowKeys.length>0){//selectedRowKeys是跨页的，selectedRows不是
			this.props.dispatch({
				type:'dictionary/deleteSelected'
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
			type:'dictionary/setState',
			payload:{record:record}
		});
	}
	onDelete(record){
		this.props.dispatch({
			type:'dictionary/delete',
			id:record.id
		});
	}
	onSearch(values){console.info('list search ',values)
		this.props.dispatch({
			type:'dictionary/load',
			payload:{
				query:values
			}
		});
	}
	rowSelectChange(selectedRowKeys, selectedRows){console.info('rowSelectChange',selectedRowKeys);
		this.props.dispatch({
			type:'dictionary/setState',
			payload:{selectedRowKeys:selectedRowKeys}
		});
	}
	onPageChange(page){
		this.props.dispatch({
			type:'dictionary/load',
			payload:{
				page:page
			}
		});
	}
	render(){
		var {dictionary}   = this.props;
		var {page,data,selectedRowKeys} = dictionary;
		var deleteAllF = this.forDeleteAll.bind(this);
		const columns = [
		   {title:'医院id',  dataIndex :'hosId',      key:'hosId', },
		   {title:'列分组',  dataIndex :'columnGroup',key:'columnGroup'},
		   {title:'列编码',  dataIndex :'columnCode ',key:'columnCode'},
		   {title:'列名称',  dataIndex :'columnName', key:'columnName'},
		   {title:'列值',    dataIndex :'columnVal',  key:'columnVal' },
		   {title:'列显示',  dataIndex :'columnDis',  key:'columnDis' },
		   {title:'序号',    dataIndex :'sortId',     key:'sortId'    },
		   {title:'默认',    dataIndex :'defaulted',  key:'defaulted',
			   render: function(value, record){
				   return value?'是':'否';
			   },
		   },
		   {title:'拼音',    dataIndex :'spellCode',  key:'spellCode' },
		   {title:'五笔',    dataIndex :'wbCode',     key:'wbCode'    },
		   {title:'自定义码',dataIndex :'userCode',   key:'userCode'  },
		   {title:'停用标志',dataIndex :'stop',   key:'stop',
			   render: (value, record) => {
				   return value ? '停用':'未停用';
			   },
		   },
		   {title:'创建时间',dataIndex :'createTime', key:'createTime'},
		   {title:'创建人员',dataIndex :'createOper', key:'createOper'},
		   {title:'更新时间',dataIndex :'updateTime', key:'updateTime'},
		   {title:'更新人员',dataIndex :'updateOper', key:'updateOper'},
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
				<CommonTable data={data} page={page} columns={columns} 
					onPageChange ={this.onPageChange.bind(this)}
					onSelectChange ={this.rowSelectChange.bind(this)}
				/>
			</div> 
		);	
	}
}
export default connect(({dictionary})=>({dictionary}))(DictList);

