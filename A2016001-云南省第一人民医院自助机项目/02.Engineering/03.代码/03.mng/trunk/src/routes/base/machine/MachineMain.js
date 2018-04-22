import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import Editor from './MachineEditor'
import List from './MachineList';

class MachineMain extends React.Component {

	constructor(props) {
	    super(props);
	}
	render(){
		const {spin,record} = this.props.machine;
		console.info('record : ',record);
		return(
			<Spin spinning={spin} >
				<List />
				<Editor data ={record} />
			</Spin>
		)
	}
}
export default  connect(({machine})=>({machine}))(MachineMain);

