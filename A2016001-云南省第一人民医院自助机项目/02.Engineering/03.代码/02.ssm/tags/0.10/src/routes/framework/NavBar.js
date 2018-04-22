import React, { PropTypes } 				from 'react';
import { routerRedux } 							from 'dva/router';
import { Row, Col, Button, Icon } 	from 'antd';
import { connect } 									from 'dva';
import styles 											from './NavBar.css';
import config 											from '../../config';

function NavBar({
	nav,
	dispatch
}) {
	let { onBack, onForward, onHome, display, backDisabled, homeDisabled, title } = nav;
	
	function backHandle(e) {
		if (backDisabled) {
			defaultHome();
			return;
		}

		if(onBack)onBack(e,dispatch);
		else defaultBack();
	}
	function forwardHandle(e) {
		if(onForward)onForward(e,dispatch);
		else defaultForward();
	}
	function homeHandle(e) {
		if(onForward)onForward(e,dispatch);
		else defaultHome();
	}
	function defaultBack(){
		 dispatch(routerRedux.goBack());
	}
	function defaultForward(){
		 dispatch(routerRedux.goBack());
	}
	function defaultHome(){
		dispatch(routerRedux.push({
			pathname: '/',
		}));
	}

	let containerStyle = {
		height: config.navBar.height + 'rem', 
		padding: config.navBar.padding + 'rem',
	};

	let buttonStyle = {
		fontSize: '3rem',
		width: '100%',
		lineHeight: (config.navBar.height - config.navBar.padding * 2) + 'rem',
	}

	let titleStyle = {
		fontSize: '4rem',
		color: '#4E4E4E',
		width: '100%',
		lineHeight: (config.navBar.height - config.navBar.padding * 2) + 'rem',
		paddingLeft: config.navBar.padding + 'rem',
		paddingRight: config.navBar.padding + 'rem',
	}
  
  return (
		<div className={styles.bar} style = {containerStyle} >
			<Row>
				<Col span = {4} >
					<div className={styles.backbtn} onClick={backHandle} style = {buttonStyle} >返回</div>
				</Col>
				<Col span = {16} style = {{padding: '0 ' + config.navBar.padding + 'rem 0 ' + config.navBar.padding + 'rem'}} >
					<div className={styles.titlewrap} style = {titleStyle} >{title}</div>
				</Col>
				<Col span = {4} >
					<div className={styles.homebtn} disabled={homeDisabled} onClick={homeHandle} style = {buttonStyle} >回首页</div>
				</Col>
			</Row>
		</div>
	);
};
export default connect(({nav})=>({nav}))(NavBar);
