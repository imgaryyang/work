import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import Editor from './OrgEditor'
import List from './OrgList';

class OrgMain extends React.Component {

	constructor(props) {
	    super(props);
	}
	render(){
		const {spin,record} = this.props.org;
		console.info('OrgMain-record : ',record);
		return(
			<Spin spinning={spin} >
				<List />
				<Editor data ={record} />
			</Spin>
		)
	}
}
export default  connect(({org})=>({org}))(OrgMain);

