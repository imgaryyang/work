import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import Editor from './AreaEditor'
import List from './AreaList';

class AreaMain extends React.Component {

	constructor(props) {
	    super(props);
	}
	render(){
		const {spin,record} = this.props.area;
		console.info('record : ',record);
		return(
			<Spin spinning={spin} >
				<List />
				<Editor data ={record} />
			</Spin>
		)
	}
}
export default  connect(({area})=>({area}))(AreaMain);

