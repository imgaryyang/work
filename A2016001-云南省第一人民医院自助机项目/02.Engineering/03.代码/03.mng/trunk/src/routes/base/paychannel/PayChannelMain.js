import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import Editor from './PayChannelEditor'
import List from './PayChannelList';

class PayChannelMain extends React.Component {

	constructor(props) {
	    super(props);
	}
	render(){
		const {spin,record} = this.props.payChannel;
		return(
			<Spin spinning={spin} >
				<List />
				<Editor data ={record} />
			</Spin>
		)
	}
}
export default  connect(({payChannel})=>({payChannel}))(PayChannelMain);

