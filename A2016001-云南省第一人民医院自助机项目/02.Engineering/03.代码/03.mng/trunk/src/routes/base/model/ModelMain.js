import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import List from './ModelList';

class ModelMain extends Component {

	constructor (props) {
		super(props);
	}

	render () {
		const {spin} = this.props.modelManage;

		return (
			<Spin spinning={spin} >
				<div style = {{padding: '15px'}} >
					<List />
				</div>
			</Spin>
		)
	}
}
export default connect(({modelManage})=>({modelManage}))(ModelMain);

