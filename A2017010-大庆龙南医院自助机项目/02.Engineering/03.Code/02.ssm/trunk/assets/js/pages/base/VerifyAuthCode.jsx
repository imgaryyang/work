import React, { Component } from 'react';
import { Row, Col, Modal, message } from 'antd';
import TimerPage from '../../TimerPage.jsx';
import NumKeyboard from '../../components/keyboard/NumKeyboard.jsx';
import Input from '../../components/Input.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import styles from './VerifyAuthCode.css';
import baseUtil from '../../utils/baseUtil.jsx';

import { testMobile } from '../../utils/validation.jsx';

class VerifyAuthCode extends TimerPage {
	
  constructor(props){
	  super(props);
	  this.authCodeSended = this.bind(this.authCodeSended,this);
	  this.authCodeVerfied = this.bind(this.authCodeVerfied,this);
	  this.submit = this.bind(this.submit,this);
	  this.startTimer = this.bind(this.startTimer,this);
	  this.verfy = this.bind(this.verfy,this);
	  this.setFocus = this.bind(this.setFocus,this);
	  this.sendAuthCode = this.bind(this.sendAuthCode,this);
	  this.submit = this.bind(this.submit,this);
	  this.skip = this.bind(this.skip,this);
	  this.onKeyDown =  this.bind(this.onKeyDown,this);
	  this.state = {
		timer:0,
		mask:false,
		mobile:{
			oldValue:'',
			value:'',
			focus:true,
			disable:true,
			maxLength:11,
			btn:'免费获取验证码',
			waiting:false,
		},
		authCode:{
			value:'',
			focus:false,
			disable:true,
			maxLength:4,
			waiting:false,
		},
		msg:{},
		field:'mobile'
	  };
  }
  
  componentDidMount() {
    const { mobile } = this.props;
    if(mobile && mobile.length == 11){
      var mobileState = this.state.mobile;
      var disMobile = mobile.substr(0, 3) +"****"+ mobile.substr(mobile.length-4, mobile.length);
      this.setState({mobile:{...mobileState,oldValue:mobile,value:disMobile,disable:false,editable:false}},()=>{
//    	  this.sendAuthCode();
      })
    }else{
    	baseUtil.speak('msg_inputPhone');
    }
  }
  componentWilUnMount() {
   this.setState({timer:0});
  }
  setFocus(field){
	  if(field == 'authCode'){
		  if(this.state.mobile.disable)return;
		  var { mobile, authCode } = this.state;
		  mobile.focus = false;
		  authCode.focus = true;
		  this.setState({ field,mobile,authCode});
	  }else{
		  const defaultMobile = this.props.mobile;
		  if(defaultMobile)return;//有默认手机号的不允许修改	
		  var { mobile, authCode } = this.state;
		  //if(!mobile.editable)return;
		  mobile.focus = true;
		  authCode.focus = false;
		  this.setState({ field,mobile,authCode});
	  }
	  
  }
  onKeyDown(key){
	  const defaultMobile = this.props.mobile;
	  if(this.state.field == 'mobile' && defaultMobile)return;//有默认手机号的不允许修改	
	  
	  const field = this.state[this.state.field];
	  var old = field.value;
	  if('清空'==key) field.value="";
	  else if('删除'==key) field.value=old.substr(0, old.length - 1);//删除
	  else if(old.length < field.maxLength) field.value=old+key;
	  field.disable = (field.value.length < field.maxLength);
	  this.state[this.state.field] = field;
	  this.setState(this.state);
  }
  sendAuthCode() {
	var { mobile } = this.state;
	var phone = mobile.oldValue||mobile.value;
	if(!(phone && testMobile(phone))) {
		 baseUtil.warning('您输入的手机号不合法，请重新输入！');
		 this.flag = false;
		 return;
    }
    mobile.waiting = true;
    var { type } = this.props;
    var msg = {
  	  mobile : mobile.oldValue || mobile.value,
  	  type : type || 'COMMON',
    };
    let fetch = Ajax.post("/api/ssm/base/sms/sendCode/",msg,{catch: 3600});
	fetch.then(res => {
		if(res && res.success){
			this.authCodeSended(res.result||{});
		}else if( res && res.msg ){
			baseUtil.error(res.msg);
    	}else{
    		baseUtil.error("发送验证码错误,请稍后再试");
    	}
	}).catch((ex) =>{
		baseUtil.error("发送验证码错误,请稍后再试");
	})
  }
  authCodeSended(msg){
	var { mobile,authCode } = this.state;
    mobile.waiting = false;
    mobile.focus = false;
    authCode.focus = true;
    this.setState({field:'authCode',msg:msg,mobile,timer:60},()=>{
    	this.startTimer();
    });
  }
  startTimer(){
	  const timer = this.state.timer;
	  if(timer<=0)return;
	  this.setState({timer:(timer-1)},()=>{
		  setTimeout(this.startTimer,1000);
	  });
  }
  authCodeVerfied(verfied){//校验成功
	  var { authCode,mobile } = this.state;
	  authCode.waiting = false;
	  this.setState({authCode,mask:false},()=>{
		  if(this.props.onVerfied)this.props.onVerfied(mobile.value,verfied);
	  })
  }
  submit(){
	if(this.flag)return;//防止重复提交
	this.flag = true;
	this.verfy();
  }
  verfy(){
	const { type,force } = this.props;
	var { mobile,authCode } = this.state;
	var { msg } = this.state;
	var closed = false;
	if(window.ssmConfig && window.ssmConfig['sms.skip'] === true){
	  closed = true;
	}
	if(window.ssmConfig && window.ssmConfig['sms.skipWhenCard'] === true &&
			(type == 'REG' || type == 'REP')){
	  closed = true;
	}
	if(force)closed = false;//不接受开关控制
	if(closed){
		var phone = mobile.oldValue||mobile.value;
		if(!(phone && testMobile(phone))) {
			 baseUtil.warning('您输入的手机号不合法，请重新输入！');
			 this.flag = false;
			 return;
	    }
		this.authCodeVerfied(true);
		return;
	}
    
    msg.code = authCode.value;
    authCode.waiting = true;
    
    let fetch = Ajax.post("/api/ssm/base/sms/validCode/",msg,{catch: 3600});
	fetch.then(res => {
		if(res && res.success){
			this.authCodeVerfied(true);
		}else{
			var msg = "校验码不正确，请重新输入";
			if(res && res.msg)msg = res.msg;
			baseUtil.notice(msg);
			this.authCodeVerfied(false);
			this.flag = false;
		}
	}).catch((ex) =>{
		baseUtil.notice("校验异常，请重试");
		this.authCodeVerfied(false);
		this.flag = false;
	})
  }
  skip(){
	  this.authCodeVerfied(false);  
  }
  render() {
	const { type,force } = this.props;
	const { mobile, authCode,mask} = this.state;
	const { canSkip } = this.props; 
	var loadingDisplay = mask?'':'none' ;
	let height = document.body.clientHeight - 530;
	var closed = false;
	if(window.ssmConfig && window.ssmConfig['sms.skip'] === true){
	  closed = true;
	}
	if(window.ssmConfig && window.ssmConfig['sms.skipWhenCard'] === true && 
			(type == 'REG' || type == 'REP')){
	  closed = true;
	}
	if(force)closed = false;//不接受开关控制
	
	var closeStyle = closed?{display:'none'}:{};
    return (
      <Row>
    	<Col span = {12} className = 'auth_code_left' >
          <Card style = {{padding: '1rem', height: height + 'px'}} >
            <div className = 'auth_code_label' >手机号：</div>
            <Input value = {mobile.value} placeholder = '请输入手机号码' focus = {mobile.focus} 
              onClick = {()=>{this.setFocus('mobile')}} />
           <div style={closeStyle}> 
            <Button className='auth_code_sendbtn' 
              text = {this.state.timer <= 0 ? mobile.btn:this.state.timer+'秒后可以再次发送'}  
              waiting = {mobile.waiting} 
              disabled = {this.state.timer > 0 || mobile.disable} 
              onClick = {this.sendAuthCode} />
            <div className = 'auth_code_label' > 验证码：</div>
            <Input value = {authCode.value} 
              placeholder = '请输入验证码'
              focus = {authCode.focus} style = {{textAlign: 'center'}} 
              disabled = {authCode.disable}
              onClick = {()=>{this.setFocus('authCode')}} />
           {
            	canSkip?(
            		<Row>
            		<Col span={11}>
	            		<Button className='auth_code_checkbtn'
		                    text = '确定' 
		                    waiting = {authCode.waiting}
		                    disabled = {authCode.disable} 
		                    onClick = {this.submit} />
            		</Col>
	            	<Col span={2}>&nbsp;</Col>
            		<Col span={11}>
	            		<Button className='auth_code_checkbtn'
		                    text = '跳过' 
		                    waiting = {false}
		                    disabled = {false} 
		                    onClick = {this.skip} />
            		</Col>
            		</Row>
            	):(
	    			<Button className='auth_code_checkbtn'
	                	text = '确定' 
	                    waiting = {authCode.waiting}
	                    disabled = {authCode.disable} 
	                    onClick = {this.submit} />
            	)
           }
           </div>
           <div style={{display:closed?'':'none'}}>
           <Button className='auth_code_checkbtn' 	text = '确定' 
             waiting = {false}   disabled = {false} 
             onClick = {this.submit} />
           </div>
           </Card>
        </Col>
        <Col span = {12} className = 'auth_code_right'  >
          <NumKeyboard onKeyDown={this.onKeyDown} hasDot={false} height = {height} />
        </Col>
        <div className='fm_modal' style={{display:loadingDisplay,backgroundImage:"url('./images/loading06.gif')"}}></div>
      </Row>
    );
  }
}
module.exports = VerifyAuthCode;

