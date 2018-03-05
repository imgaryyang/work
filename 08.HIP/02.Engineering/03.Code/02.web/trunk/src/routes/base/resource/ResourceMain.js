import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';
import Editor from './ResourceEditor'
import List from './ResourceList';

class ResourceMain extends React.Component {

	constructor(props) {
	    super(props);
	}
	render(){
		const {spin,record} = this.props.resource;
		
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
export default  connect(({resource})=>({resource}))(ResourceMain);

