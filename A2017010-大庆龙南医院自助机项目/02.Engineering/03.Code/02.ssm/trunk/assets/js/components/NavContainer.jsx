import React, { Component, PropTypes } 	from 'react';
import { Menu, Icon, Button, Row, Col,} 	from 'antd';
import styles from './NavContainer.css';

class NavContainer extends React.Component {

	constructor(props) {
	    super(props);
	    this.goBack = this.goBack.bind(this);
	    this.goHome = this.goHome.bind(this);
	}
	goBack () {
		if(this.props.onBack)this.props.onBack();
	}
	goHome () {
		if(this.props.onHome)this.props.onHome();
	}
	render(){
		const { title } = this.props;
		let wsStyle = {
			width: document.body.clientWidth + 'px',
			height: (document.body.clientHeight - 120) + 'px',
		}
		return (
			<div className='nvc_container' >
				<Row className='nvc_bar'>
					<Col span = {4} >
						<div className='nvc_backbtn' onClick={this.goBack} >返回</div>
					</Col>
					<Col span = {16} style = {{padding: '0  1.5rem 0  1.5rem'}} >
						<div className='nvc_titlewrap'>{title}</div>
					</Col>
					<Col span = {4} >
						<div className='nvc_homebtn' onClick={this.goHome} >回首页</div>
					</Col>
				</Row>
				<div className='nvc_workspace' >
					{this.props.children}
				</div>
			</div>
		);	
	}
}  
//  <div className='nvc_modal' style={{display:false,backgroundImage:"url('./images/loading06')"}}>
// </div>
module.exports = NavContainer;


