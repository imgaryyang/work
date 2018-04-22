import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import List from './MonitorList';

class MonitorMain extends React.Component {

	constructor(props) {
	    super(props);
	}
	render(){
		const {spin,record} = this.props.monitor;
		return(
			<Spin spinning={spin} >
				<List />
			</Spin>
		)
	}
}
export default  connect(({monitor})=>({monitor}))(MonitorMain);

