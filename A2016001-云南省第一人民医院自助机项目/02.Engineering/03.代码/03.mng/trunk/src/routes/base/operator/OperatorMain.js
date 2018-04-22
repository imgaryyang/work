import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import Editor from './OperatorEditor'
import List from './OperatorList';

class OperatorMain extends React.Component {

	constructor(props) {
	    super(props);
	}
	render(){
		const {spin,record} = this.props.operator;
		console.info('record : ',record);
		return(
			<Spin spinning={spin} >
				<List />
				<Editor data ={record} />
			</Spin>
		)
	}
}
export default  connect(({operator})=>({operator}))(OperatorMain);

