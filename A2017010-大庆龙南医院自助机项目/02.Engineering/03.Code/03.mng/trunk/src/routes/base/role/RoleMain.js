import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';
import Editor from './RoleEditor'
import List from './RoleList';

class RoleMain extends React.Component {

	constructor(props) {
	    super(props);
	}
	render(){
		const {spin,record} = this.props.role;
		
		return(
			<Spin spinning={spin} >
				<Row>
					<Col span = {14} ><List /></Col>
					<Col span = {10} ><Editor /></Col>
				</Row>
			</Spin>
		)
	}
}
export default  connect(({role})=>({role}))(RoleMain);

