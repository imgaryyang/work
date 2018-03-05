import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import {Table,Button,Icon,Row,Col,Popconfirm,notification,Tree,Tooltip} from 'antd';
import CommonTable from '../../../components/CommonTable'
import Editor from './ChargeDetailEditor'


class ChargeDetailList extends React.Component {

	constructor(props) {
	    super(props);
	    
	}
	
//	componentWillMount(){
//		this.props.dispatch({
//			type:'chargePkg/loadDetail'
//		});
//	}
	componentWillReceiveProps (props) {
		if ( this.props.chargePkg.comboId != props.chargePkg.comboId ) {
			let comboId = props.chargePkg.comboId;
			console.info("zhoumin****comboId",this.props.chargePkg.comboId)
			console.info("zhoumin****comboId",props.chargePkg.comboId)
			//console.log('formValues:', formValues);
			
			//console.log('values:', values);
			this.onSearch(comboId);
		}
	}
	forAdd(){
		let comboId = this.props.chargePkg.comboId
		this.props.dispatch({
			type:'chargePkg/setState',
			payload:{detailRecord:{comboId:comboId}}
		});
	}
	
	onEdit(record){
	let comboId = this.props.chargePkg.comboId
		this.props.dispatch({
			type:'chargePkg/setState',
			payload:{detailRecord:{...record,comboId}}
		});
	}
	onCopy(record){
	let comboId = this.props.chargePkg.comboId
		this.props.dispatch({
			type:'chargePkg/setState',
			payload:{detailRecord:{...record,comboId,id:null}}
		});
	}
	onDelete(record){
		console.info("onDelete",record.id)
		this.props.dispatch({
			type:'chargePkg/deleteDetail',
			id:record.id
		});
	}
	onSearch(values){console.info('list search ',values)
		this.props.dispatch({
			type:'chargePkg/loadDetail',
			comboId: values
		});
	}
	
	onBack(){
		this.props.dispatch({
			type:'chargePkg/setState',
			payload:{
				showDetail:false
			}
		});
	}
	render(){
		let chargePkg = this.props.chargePkg;
		console.info("***chargePkg***",chargePkg)
		let {detailData,showDetail} = chargePkg;
		console.info("***detailData***",detailData)
		const columns = [
		   {title:'组合号',  dataIndex :'comboNo',key:'comboNo'},
		   {title:'组内序号',  dataIndex :'comboSort',key:'comboSort'},
		   {title:'项目编码',    dataIndex :'itemCode',     key:'itemCode'},
		   {title:'默认数量',    dataIndex :'defaultNum',     key:'defaultNum'    },
		   {title:'单位',  dataIndex :'unit',key:'unit'},
		   {title:'付数',    dataIndex :'days',  key:'days' },
		   {title:'用法',    dataIndex :'usage',     key:'usage'    },
		   {title:'频次',dataIndex :'freq',   key:'freq'  },
		   {title:'一次剂量',dataIndex :'dosage',   key:'dosage'  },
		   {title:'剂量单位',dataIndex :'dosageUnit',   key:'dosageUnit'  },
		   
		   {title:'停用标志',dataIndex :'stop',   key:'stop',
			   render: (value, record) => {
				   return value ? '停用':'未停用';
			   },
		   },
		   {title:'默认科室',dataIndex :'defaultDept', key:'defaultDept'},
		   {title:'备注',dataIndex :'comm', key:'comm'},
		   {title: '操作',key: 'action',render: (text, record) => (
		        <span>
		        	<Tooltip placement="top" title={"编辑"}>
			        	<Icon type="edit" style={{cursor:'pointer',color:'blue'}} onClick={this.onEdit.bind(this,record)} />
			        </Tooltip>
			        <span className="ant-divider" />
			        <Tooltip placement="top" title={"复制"}> 	
			        	<Icon type="copy" style={{cursor:'pointer',color:'gray'}} onClick={this.onCopy.bind(this,record)}/>
			        </Tooltip>
			        <span className="ant-divider" />
			        <Popconfirm placement="left" title={"您确定要删除此项么?"} cancelText={"否"} okText="是"
			        	onConfirm={this.onDelete.bind(this,record)} >
			        	<Tooltip placement="top" title={"删除"}>
			        		<Icon type="delete" style={{cursor:'pointer',color:'red'}} />
			        	</Tooltip>
			        </Popconfirm>
		        </span>
		      ),
			}];
		let display=showDetail?'':'none';
		console.info("zhoumin",display)
		let style = {display:display};
		return (
			<div>
			<div style = {style}>
				<div style={{ marginBottom: 8}}>
				<Row>
					<Col span={20}></Col>
					<Col span={4}> 
						<Button type="primary" style={{marginRight:'4px'}} onClick={this.forAdd.bind(this)}>新增</Button>
						<Button type="gray" style={{marginRight:'4px'}} onClick={this.onBack.bind(this)}>返回</Button>
					</Col>
				</Row>
				<CommonTable data={detailData}  columns={columns} pagination={false} rowSelection={false}
				/>
				</div>
				
			
			</div> 
			</div>
		);	
	}
}
export default connect(({chargePkg})=>({chargePkg}))(ChargeDetailList);
/*<Col span={20}> <SearchBar onSearch={this.onSearch.bind(this)} /></Col>*/
/*<CommonTable data={data} page={page} columns={columns} 
onPageChange ={this.onPageChange.bind(this)}
onSelectChange ={this.rowSelectChange.bind(this)}
/>
*/
