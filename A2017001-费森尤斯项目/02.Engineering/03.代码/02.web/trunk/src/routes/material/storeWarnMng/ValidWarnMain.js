import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Layout, Input, Button, Popconfirm, Tooltip, Icon } from 'antd';

import ValidWarnInfoList from './ValidWarnInfoList';

const { Header, Footer, Sider, Content } = Layout;

class ValidWarnMain extends React.Component {

	constructor(props) {
	    super(props);
	    console.info(props)
	}
	
	render(){
		return(
				<div>
					<ValidWarnInfoList />
				</div>
		)
	}
}
export default connect()(ValidWarnMain);
