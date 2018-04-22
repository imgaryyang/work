import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import List from './TroubleList';

class TroubleMain extends Component {

	constructor (props) {
		super(props);
	}

	render () {
		const {spin} = this.props.troubleManage;

		return (
			<Spin spinning={spin} >
				<div style = {{padding: '15px'}} >
					<List />
				</div>
			</Spin>
		)
	}
}
export default connect(({troubleManage})=>({troubleManage}))(TroubleMain);

