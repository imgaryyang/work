import React, { Component, PropTypes } from 'react';
import { Link } from 'dva/router';
import { Menu, Icon,Breadcrumb,Row,Col } from 'antd';
import { connect } from 'dva';
import searchBar from './ClientMenuSearchBar';

class Authority extends React.Component {

	constructor(props) {
	    super(props);
	}
	
	componentWillMount(){
	}
	
	componentDidMount(){
	}
	
	componentDidUpdate(){
	}
	
	render(){
		return (
			<div >
				首页
			</div>
		);	
	}
}
export default connect()(Authority);

