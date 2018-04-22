import React, { Component, PropTypes } 	from 'react';
import { Menu, Icon,Breadcrumb,Button} 	from 'antd';
import { connect } 											from 'dva';
import { Link } 												from 'dva/router';

import NavBar 													from './NavBar.js';
import Ajax 														from '../../utils/ajax';
import styles 													from './NavContainer.css';
import bg 															from '../../assets/bg.jpg';
import config 													from '../../config';


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
			height: (_screenHeight - config.navBar.height * config.remSize) + 'px',
		}
		
		return (
			<div className={styles.container} >
				<NavBar />
				<div className={styles.workspace} style = {wsStyle} >
					{this.props.children}
				</div>
			</div>
		);	
	}
}  

export default connect(({frame}) => ({frame}))(NavContainer);


