"use strict";

import { Component, PropTypes } from 'react';
import baseUtil from '../../utils/baseUtil.jsx';
import { Row, Col,  Modal, Icon }    from 'antd';
import Card from '../../components/Card.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import Steps from '../../components/Steps.jsx';
import VerifyAuthCode from '../base/VerifyAuthCode.jsx';
class Page extends Component {
	constructor (props) {
		super(props);
		this.onBack = this.onBack.bind(this);
		this.onHome = this.onHome.bind(this);
		this.onVerfied = this.onVerfied.bind(this);
		this.state = {
		}
	}
	onVerfied(mobile,verfied){
		if(this.props.afterVerfied && verfied)this.props.afterVerfied(mobile,verfied);
	}
	onBack(){
		if(this.props.cancelVerfied)this.props.cancelVerfied();
	}
	onHome(){
		 baseUtil.goHome('refundPhoneHome'); 
	}
	render () { 
		var  { type } = this.props;
		var  width = document.body.clientWidth - 48;
		var  careerWidth = width - 36;
		var  modalWinTop  = 13;
		var  patient = baseUtil.getCurrentPatient();
		return (
	      <NavContainer title='校验手机号' onBack={this.onBack} onHome={this.onHome} >
	        <Card bordered = {true} style = {{margin: '6rem 2rem 6rem 2rem', padding: '2rem', fontSize: '2.5rem'}} >
	          <Row>
	      	    <Col span = {6} >姓名 ：{patient.name}</Col>
	      	    <Col span = {12} >身份证号 ：{patient.idNo}</Col>
	          </Row>
	        </Card>
	      	<VerifyAuthCode onVerfied={this.onVerfied} mobile={patient.mobile ||patient.telephone} type={type} force={true}/>
	      </NavContainer>
	    );
	}
}

Page.propTypes = {
  children: PropTypes.any
}

module.exports = Page;