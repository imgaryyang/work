"use strict";

import { Component, PropTypes } from 'react';
import baseUtil from '../../utils/baseUtil.jsx';
import { Row, Col,  Modal, Icon }    from 'antd';
import styls from './ReadIdCard.css';
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
		  steps : ['读取身份证', '校验手机号', '收费','发卡'],
		  profile:{},
		}
	}
	onVerfied(mobile,verfied){
		if(this.props.afterVerfied && verfied)this.props.afterVerfied(mobile,verfied);
	}
	onBack(){
		if(this.props.cancelVerfied)this.props.cancelVerfied();
	}
	onHome(){
		 baseUtil.goHome('cardPhoneHome'); 
	}
	render () { 
		var  width = document.body.clientWidth - 48;
		var  careerWidth = width - 36;
		var  modalWinTop  = 13;
		var  { profile } = this.props;
		var career = profile.careerName ;
		if(!career && profile.occupationnum){
			for(var c of Career.careers){
				if(c.code == profile.occupationnum ){
					career = c.name;
					return;
				}
			}
		} 
		return (
	      <NavContainer title='校验手机号' onBack={this.onBack} onHome={this.onHome} >
	        <Steps steps = {this.state.steps} current = {2} />
	        <Card bordered = {true} style = {{margin: '2rem', padding: '2rem', fontSize: '2.5rem'}} >
	          <Row>
	      	    <Col span = {6} >姓名 ：{profile.name}</Col>
	      	    <Col span = {12} >身份证号 ：{profile.idNo}</Col>
	      	    <Col span = {6} >{career?'职业 : '+career:''}</Col>
	          </Row>
	        </Card>
	      	<VerifyAuthCode onVerfied={this.onVerfied} mobile={profile.mobile ||profile. telephone}/>
	      </NavContainer>
	    );
	}
}

Page.propTypes = {
  children: PropTypes.any
}

module.exports = Page;