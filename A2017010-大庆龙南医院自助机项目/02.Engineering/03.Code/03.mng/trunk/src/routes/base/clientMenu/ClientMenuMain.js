import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import Editor from './ClientMenuEditor'
import List from './ClientMenuList';

class MenuMain extends React.Component {

	constructor(props) {
	    super(props);
	}
	render(){
		const {spin,record} = this.props.clientMenu;
		
		return(
			<Spin spinning={spin} >
				<List />
				<Editor />
			</Spin>
		)
	}
}
export default  connect(({clientMenu})=>({clientMenu}))(MenuMain);

