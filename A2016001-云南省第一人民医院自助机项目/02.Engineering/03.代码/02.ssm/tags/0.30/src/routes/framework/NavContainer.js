import React, { Component, PropTypes } 	from 'react';
import { Menu, Icon, Button, Row, Col,} 	from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import styles from './NavContainer.css';
import bg from '../../assets/bg.jpg';
import loadingGif from '../../assets/loading06.gif';
import config from '../../config';
import medicalCardUtil  from '../../utils/medicalCardUtil';
import miCardUtil  from '../../utils/miCardUtil';

class NavContainer extends React.Component {

	constructor(props) {
	    super(props);
	    this.goBack = this.goBack.bind(this);
	    this.goHome = this.goHome.bind(this);
	}
	
	componentWillMount(){
	}
	
	componentDidMount(){}
	
	componentDidUpdate(){}
	
	goBack () {
	  const { backDisabled, onBack } = this.props.frame.nav;
	  
	  if(backDisabled)this.goHome();
	  else if(onBack)onBack();
	  else if(this.props.location.pathname == 'login' || this.props.location.pathname == '/login'){
		  this.props.dispatch(routerRedux.push('/homepage'));
	  }else {
		  this.props.dispatch( routerRedux.goBack());
	  }
	}
	goHome () {
	  const { baseInfo,medicalCardInfo,miCardInfo} = this.props.patient;
	  if(!medicalCardInfo.cardNo){
		  console.info('无就诊卡，关闭就诊卡读卡器');
		  //medicalCardUtil.safeClose();
	  }
	  if(!miCardInfo.cardNo){
		  console.info('无社保卡，关闭社保卡读卡器');
		  miCardUtil.safeClose(); 
	  }
	  const { homeDisabled, onHome } = this.props.frame.nav;
	  if(homeDisabled)return;
	  else if(onHome)onHome();
	  else {
		  this.props.dispatch(routerRedux.push({pathname: '/',}));
	  }
	}
	render(){
		const { nav } = this.props.frame; // console.info(this.props.frame);
		const { title } = nav;
		const { loading } = this.props.frame;
		const modalDisplay = loading?'':'none';
		let wsStyle = {
			width: _screenWidth + 'px',
			height: (_screenHeight - config.navBar.height * config.remSize) + 'px',
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
			<div className={styles.container} >
				<Row className={styles.bar} style = {containerStyle}>
					<Col span = {4} >
						<div className={styles.backbtn} onClick={this.goBack} style = {buttonStyle} >返回</div>
					</Col>
					<Col span = {16} style = {{padding: '0 ' + config.navBar.padding + 'rem 0 ' + config.navBar.padding + 'rem'}} >
						<div className={styles.titlewrap} style = {titleStyle} >{title}</div>
					</Col>
					<Col span = {4} >
						<div className={styles.homebtn} onClick={this.goHome} style = {buttonStyle} >回首页</div>
					</Col>
				</Row>
				<div className={styles.workspace} style = {wsStyle} >
					{this.props.children}
				</div>
				 <div className={styles.modal} style={{display:modalDisplay,backgroundImage:"url('"+loadingGif+"')"}}>
		        </div>
			</div>
		);	
	}
}  

export default connect(({frame,patient}) => ({frame,patient}))(NavContainer);


