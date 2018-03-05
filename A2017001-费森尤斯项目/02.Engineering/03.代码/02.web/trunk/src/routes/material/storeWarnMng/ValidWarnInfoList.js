import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Icon } from 'antd';
import CommonTable from '../../../components/CommonTable';
import SearchBar from './StoreWarnMngSearchBar';

class ValidWarnInfoList extends React.Component {

	constructor(props) {
	    super(props);
	}
	componentWillMount(){
		this.props.dispatch({
			type:'materialValidWarnInfo/loadValidWarn',
		});
		this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['MATERIAL_TYPE'],
    });
	}
	
	onSearch( values ){
		this.props.dispatch({
			type:'materialValidWarnInfo/loadValidWarn',
			payload: {queryCon:values},
		});
	}
	
    onPageChange(pageNew) {
	    this.props.dispatch({
	      type: 'materialValidWarnInfo/loadValidWarn',
	      payload: { pageNew },
	    });
	  }

	render(){
		const { data, page, spin} = this.props.materialValidWarnInfo || {};
		const { dicts } = this.props.utils;
		const columns = [
		    {title:'物资分类',dataIndex :'materialType',key:'materialType', width: 70,
			    render: (value) => {
	          return dicts.dis('MATERIAL_TYPE', value);
	        },
        },
		    {title:'编码',dataIndex :'materialCode',key:'materialCode',width: 70,},
		    {title:'名称',dataIndex :'tradeName',key:'tradeName',width: 150,},
		    {title:'规格',dataIndex :'materialSpecs',key:'materialSpecs',width: 70,},
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
		    {title:'有效期',dataIndex :'validDate',key:'validDate',width: 70},
		      {title:'预警天数',
		    	  dataIndex :'validDate',
		    	  key:'alertNum',
		    	  width: 70,
		    	  render: (value) => {
		    		  var nowDate = new Date();
		    		  var udpDate = new Date(value.substr(0,4),value.substr(5,2) - 1,value.substr(8,2));
		    		  
		    		  return Math.floor((udpDate - nowDate)/(24*60*60*1000)) + 1;
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
				<CommonTable
            data={data} page={page} columns={columns} bordered pagination
            rowSelection={false} onPageChange={this.onPageChange.bind(this)} />
				</Row>
				</Spin>
		);	
	}
}
export default connect(({materialValidWarnInfo, utils})=>({materialValidWarnInfo, utils}))(ValidWarnInfoList);
