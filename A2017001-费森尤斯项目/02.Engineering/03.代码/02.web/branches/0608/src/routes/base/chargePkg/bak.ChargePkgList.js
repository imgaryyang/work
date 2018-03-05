import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import {Table,Button,Icon,Row,Col,Popconfirm,notification,Tree,Tooltip} from 'antd';
import CommonTable from '../../../components/CommonTable'
import Editor from './ChargePkgEditor'


class ChargePkgList extends React.Component {

	constructor(props) {
	    super(props);
	    
	}
	
	componentWillMount(){
		this.props.dispatch({
			type:'chargePkg/loadDicts'
		});
		this.props.dispatch({
			type:'chargePkg/load'
		});
	}
	componentWillReceiveProps (props) {
		if ( (this.props.chargePkg.selectedType['code']+this.props.chargePkg.selectedType['dis'])!= (props.chargePkg.selectedType['code']+this.props.chargePkg.selectedType['dis']) ) {
			var selectedType = props.chargePkg.selectedType;
			console.info("成功***********",selectedType)
			
			let values = {
				busiClass: selectedType.code ? selectedType.group : '', 
				groupClass: selectedType.type == '2' ? selectedType.code : ''
			};

			this.onSearch(values);
		}
	}
	forAdd(){
		this.props.dispatch({
			type:'chargePkg/setState',
			payload:{record:{}}
		});
	}
	forDeleteAll(){console.info('deleteAll',this.props);
		var {selectedRowKeys} = this.props.chargePkg;
		if(selectedRowKeys && selectedRowKeys.length>0){//selectedRowKeys是跨页的，selectedRows不是
			this.props.dispatch({
				type:'chargePkg/deleteSelected'
			});
		}else{
			notification.warning({
			    message: '警告!',
			    description: '您目前没有选择任何数据！',
			});
		}
	}
	onEdit(record){
		this.props.dispatch({
			type:'chargePkg/setState',
			payload:{record:record}
		});
	}
	onCopy(record){
		this.props.dispatch({
			type:'chargePkg/setState',
			payload:{record:{...record,id:null}}
		});
	}
	onDetail(record){console.info('onEdit',record);
		this.props.dispatch({
			type:'chargePkg/setState',
			payload:{showDetail:true,comboId:record.comboId}
		});
	}
	onDelete(record){
		this.props.dispatch({
			type:'chargePkg/delete',
			id:record.id
		});
	}
	onSearch(values){console.info('list search ',values)
		this.props.dispatch({
			type:'chargePkg/load',
			payload:{
				query:values,
				showDetail:false
			}
		});
	}
	rowSelectChange(selectedRowKeys, selectedRows){console.info('rowSelectChange',selectedRowKeys);
		this.props.dispatch({
			type:'chargePkg/setState',
			payload:{selectedRowKeys:selectedRowKeys}
		});
	}
	onPageChange(page){
		this.props.dispatch({
			type:'chargePkg/load',
			payload:{
				page:page
			}
		});
	}
	
	render(){
		var {chargePkg}   = this.props;
		let dicts = chargePkg.dicts
		
		var chargePkg = this.props.chargePkg;
		var {page,data,selectedRowKeys,showDetail} = chargePkg;
		var deleteAllF = this.forDeleteAll.bind(this);
		const columns = [
		   {title:'套餐id',  dataIndex :'comboId',key:'comboId'},
		   {title:'套餐名称',  dataIndex :'comboName',key:'comboName'},
		   { title: '业务分类',
		        dataIndex: 'busiClass',
		        key: 'busiClass',
		        render: (value) => {
		          return dicts.dis('BUSI_CLASS', value);
		        },
		      },
		   {title:'维护分类',  
		    	  dataIndex :'groupClass',    
		    	  key:'groupClass'   , 
		    	  render: (value) => {
			         return dicts.dis('GROUP_CLASS', value);
		        },
		     },
		   {title:'所属科室',  dataIndex :'useDept',key:'useDept'},
		   {title:'拼音',    dataIndex :'spellCode',  key:'spellCode' },
		   {title:'五笔',    dataIndex :'wbCode',     key:'wbCode'    },
		   {title:'自定义码',dataIndex :'userCode',   key:'userCode'  },
//		   {title:'备注',dataIndex :'comm',   key:'comm'  },
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
		        	<Tooltip placement="top" title={"编辑"}> 
		        	<Icon type="edit" style={{cursor:'pointer',color:'blue'}} onClick={this.onEdit.bind(this,record)} />
		        	</Tooltip>
			        <span className="ant-divider" />
			        <Tooltip placement="top" title={"明细"}>
			        	<Icon type="bars" style={{cursor:'pointer',color:'gray'}} onClick={this.onDetail.bind(this,record)} />
			        </Tooltip>
		        	<span className="ant-divider" />
			        <Tooltip placement="top" title={"复制"}> 	
			        	<Icon type="copy" style={{cursor:'pointer',color:'gray'}} onClick={this.onCopy.bind(this,record)}/>
			        </Tooltip>
			        <span className="ant-divider" />
			        <Popconfirm placement="left" title={"您确定要删除此项么?该套餐对应的明细也会被残忍删除喔"} cancelText={"否"} okText="是"
			        	onConfirm={this.onDelete.bind(this,record)} >
			        <Tooltip placement="top" title={"删除"}> 
			        	<Icon type="delete" style={{cursor:'pointer',color:'red'}} />
			        </Tooltip>
			        </Popconfirm>
		        </span>
		      ),
			}];
	
		let display=showDetail?'none':'';
		console.info('*****ChargePkgList****',display)
		let style = {display:display};
		return (
			<div>
			<div style = {style}>
				<div style={{ marginBottom: 8}}>
				<Row>
					<Col span={20}></Col>
					<Col span={4}> 
						<Button type="primary" style={{marginRight:'4px'}} onClick={this.forAdd.bind(this)}>新增</Button>
					{
						(selectedRowKeys.length>0)?(
								<Popconfirm placement="left" cancelText={"否"} okText="是" onConfirm={deleteAllF}
									title={("您确定要删除所有的"+selectedRowKeys.length+"选中项么?这些套餐对应的明细也会被残忍删除喔")} >
									<Button type="danger">删除</Button>
								</Popconfirm> 
						):(<Button type="danger" onClick={deleteAllF}>删除</Button>)
					}
					</Col>
				</Row>
				</div>
				
				<CommonTable data={data} page={page} columns={columns}
				expandedRowRender={record => <p>备注：{record.comm}</p >}
					onPageChange ={this.onPageChange.bind(this)}
					onSelectChange ={this.rowSelectChange.bind(this)}
				/>
			</div>
			</div>
		);	
	}
}
export default connect(({chargePkg})=>({chargePkg}))(ChargePkgList);
/*<Col span={20}> <SearchBar onSearch={this.onSearch.bind(this)} /></Col>*/

