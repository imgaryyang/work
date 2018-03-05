import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Icon } from 'antd';
import CommonTable from '../../../components/CommonTable'
import SearchBar from './StoreWarnMngSearchBar';

class DetentWarnInfoList extends React.Component {

	constructor(props) {
	    super(props);
	}
	componentWillMount(){
		this.props.dispatch({
			type:'detentWarnInfo/loadDetentWarn'
		});
	}
	
	onSearch( values ){
		this.props.dispatch({
			type:'detentWarnInfo/loadDetentWarn',
			payload: {query:values},
		});
	}
	
    onPageChange(page) {
	    this.props.dispatch({
	      type: 'detentWarnInfo/loadDetentWarn',
	      payload: { page },
	    });
	  }

	render(){
		const { DetentDetail, page, spin } = this.props.detentWarnInfo || {};
		
		const {data} = DetentDetail;
		const columns = [
	    {title:'药品分类',dataIndex :'drugType',key:'drugType',width: 70,},
	    {title:'编码',dataIndex :'drugCode',key:'drugCode',width: 90,},
	    {title:'名称',dataIndex :'tradeName',key:'tradeName',width: 150,},
	    {title:'规格',dataIndex :'specs',key:'specs',width: 70,},
	    {title:'生产厂家',dataIndex :'companyInfo.companyName',key:'companyInfo.companyName',width:200,},
		  { title: '停用标识',
	        dataIndex: 'stop',
	        key: 'stop',
	        width: 70,
	        render: (value) => {
	        	if (value){
	        		return "正常";
	        	}
	        	else{
	        		return "停用";
	        	}
	        },
	      },
	      {title:'最近更新时间',dataIndex :'updateTime',key:'updateTime', width:150},
	      {title:'预警天数',
	    	  dataIndex :'updateTime',
	    	  key:'alertNum',
	    	  width: 70,
	    	  render: (value) => {
	    		  var nowDate = new Date();
	    		  var udpDate = new Date(value.substr(0,4),value.substr(5,2) - 1,value.substr(8,2));
	    		  return Math.floor((nowDate - udpDate)/(24*60*60*1000));
	    	  }
	      },
	    ];
		return (
				<Spin spinning={spin} >

				<Row type='flex' align='middle' style = {{paddingBottom:15, paddingTop:15}} >
			<Col>
				<SearchBar onSearch={values=>this.onSearch(values)}/>
			</Col>
		</Row>
				<Row>
				<CommonTable data={data} page={page} columns={columns} bordered={true}
				 rowSelection={false} onPageChange={this.onPageChange.bind(this)}/>
				</Row>
				</Spin>
		);	
	}
}
export default connect(({detentWarnInfo})=>({detentWarnInfo}))(DetentWarnInfoList);
