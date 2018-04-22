import React, { Component, PropTypes } 	from 'react';
import { Menu, Icon,Breadcrumb,Button} 	from 'antd';
import { connect } 											from 'dva';
import { Link } 												from 'dva/router';

import NavBar 													from './NavBar.js';
import Ajax 														from '../../utils/ajax';
import styles 													from './NavContainer.css';
import bg 															from '../../assets/bg.jpg';


class NavContainer extends React.Component {

	constructor(props) {
	    super(props);
	}
	
	componentWillMount(){
	}
	
	componentDidMount(){}
	
	componentDidUpdate(){}
	
	goBack () {
		this.props.router.goBack();
	}
	
	render(){
		
		const {current} = this.props.frame;

		let wsStyle = {
			width: _screenWidth + 'px',
			height: (_windowHeight - _navBarHeight * _remSize) + 'px',
		}
		
		return (
			<div className={styles.container} style={{backgroundImage:'url('+bg+')'}}>
				<NavBar />
				<div className={styles.workspace} style = {wsStyle} >
					{this.props.children}
				</div>
			</div>
		);	
	}
}  



/**
 * ({frame}) => ({frame})用于获取namespace为frame的model; 
 * connect 函数用于将获取到的model与组件Framework做关联
 */
export default connect(({frame}) => ({frame}))(NavContainer);


