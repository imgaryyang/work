import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import List from './MngMenuList';

class MenuMain extends Component {

	constructor (props) {
		super(props);
	}

	render () {
		const {spin} = this.props.mngMenu;

		return (
			<Spin spinning={spin} >
				<div style = {{padding: '15px'}} >
					<List />
				</div>
			</Spin>
		)
	}
}
export default connect(({mngMenu})=>({mngMenu}))(MenuMain);

