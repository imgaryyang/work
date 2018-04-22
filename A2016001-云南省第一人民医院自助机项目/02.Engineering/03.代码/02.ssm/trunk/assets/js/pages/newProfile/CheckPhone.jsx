"use strict";

import { Component, PropTypes } from 'react';
import { Row, Col,  Modal, Icon }    from 'antd';
import styls from './CheckPhone.css';
import baseUtil from '../../utils/baseUtil.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import Steps from '../../components/Steps.jsx';
import Card from '../../components/Card.jsx';
import VerifyAuthCode from '../base/VerifyAuthCode.jsx';
class Page extends Component {
	constructor (props) {
		super(props);
		this.onBack = this.onBack.bind(this);
		this.onHome = this.onHome.bind(this);
		this.onVerfied = this.onVerfied.bind(this);
		
		const  { profile, type , mediumInfo,career } = props;
		var profileInfo = {};
		
		if(profile){
			const {name,idNo,mobile,telephone,occupationnum} = profile 
			profileInfo = {name ,idNo,mobile: mobile || telephone,};			
		}else {
			const {sfzh,xm,userName,idNo} = mediumInfo;
			profileInfo = {name:userName||xm ,idNo:idNo||sfzh };
		}
		this.state = {
		  showCareerModal:false,
		  steps : ['读取医保卡', '校验手机号', '收费','发卡'],
		  profile:profileInfo,
		  careerName:career.name,
		}
	}
	onVerfied(mobile,verfied){
		if(this.props.afterVerfied && verfied)this.props.afterVerfied(mobile,verfied);
	}
	onBack(){
		if(this.props.cancelVerfied)this.props.cancelVerfied();
	}
	onHome(){
		 baseUtil.goHome('miPhoneHome'); 
	}
	render () { 
		var  width = document.body.clientWidth - 48;
		var  careerWidth = width - 36;
		var  modalWinTop = 13;
		
		const {profile,careerName } = this.state;
		const {type} = this.props;
		return (
	      <NavContainer title='校验手机号' onBack={this.onBack} onHome={this.onHome} >
	        <Steps steps = {this.state.steps} current = {2} />
	        <Card bordered = {true} style = {{margin: '2rem', padding: '2rem', fontSize: '2.5rem'}} >
	          <Row>
	      	    <Col span = {6} >姓名 ：{profile.name}</Col>
	      	    <Col span = {12} >身份证号 ：{profile.idNo}</Col>
	      	    <Col span = {6} >{careerName?'职业 : '+careerName:''}</Col>
	          </Row>
	        </Card>
	      	<VerifyAuthCode onVerfied={this.onVerfied} mobile={profile.mobile || profile.telephone} type={type}/>
	      </NavContainer>
	    );
	}
}

Page.propTypes = {
  children: PropTypes.any
}

module.exports = Page;