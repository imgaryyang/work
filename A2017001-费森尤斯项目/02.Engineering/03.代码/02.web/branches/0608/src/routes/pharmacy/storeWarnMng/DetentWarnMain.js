import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Layout, Input, Button, Popconfirm, Tooltip, Icon } from 'antd';

import DetentWarnInfoList from './DetentWarnInfoList';

const { Header, Footer, Sider, Content } = Layout;

class DetentWarnMain extends React.Component {

	constructor(props) {
	    super(props);
	    
	}
	
	render(){
		return(
				<div>
					<DetentWarnInfoList />
				</div>
		)
	}
}
export default connect()(DetentWarnMain);
