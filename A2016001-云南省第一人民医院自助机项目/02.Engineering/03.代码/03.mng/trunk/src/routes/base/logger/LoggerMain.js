import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import List from './LoggerList';
import Show from './LoggerShow';

class LoggerMain extends React.Component {

	constructor(props) {
	    super(props);
	}
	render(){
		const {spin,record} = this.props.logger;
		return(
			<Spin spinning={spin} >
				<List /> 
				<Show />
			</Spin>
		)
	}
}
export default  connect(({logger})=>({logger}))(LoggerMain);

