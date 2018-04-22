import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import List from './AreaList';

class AreaMain extends Component {

	constructor (props) {
		super(props);
	}

	render () {
		const {spin} = this.props.areaManage;

		return (
			<Spin spinning={spin} >
				<div style = {{padding: '15px'}} >
					<List />
				</div>
			</Spin>
		)
	}
}
export default connect(({areaManage})=>({areaManage}))(AreaMain);

