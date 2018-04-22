import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Modal, message } from 'antd';
import { WorkSpace, Card, Input, Button, Confirm, NumKeyboard } from '../../components';
import { testMobile } from '../../utils/validation';
import config from '../../config';
import styles from './VerifyAuthCode.css';
	     
import baseUtil from '../../utils/baseUtil';
const _resendTime = config.timer.resendAuthMsg;
const _authCodeLen = config.authCodeLen;

class VerifyAuthCode extends Component {
	
  constructor(props){
	  super(props);
	  this.authCodeSended = this.authCodeSended.bind(this);
	  this.authCodeVerfied = this.authCodeVerfied.bind(this);
	  this.notice = this.notice.bind(this);
	  this.submit = this.submit.bind(this);
	  this.startTimer = this.startTimer.bind(this);
  }
  
  state = {
	timer:0,
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
		maxLength:_authCodeLen,
		waiting:false,
	},
	showConfirm:false,
	field:'mobile'
  };
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
		  var { mobile, authCode } = this.state;
//		  if(!mobile.editable)return;
		  mobile.focus = true;
		  authCode.focus = false;
		  this.setState({ field,mobile,authCode});
	  }
	  
  }
  onKeyDown(key){
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
    if(!testMobile(mobile.oldValue||mobile.value)) {
      this.setState({showConfirm: true}); //TODO: 播放语音：您输入的手机号不合法，请重新输入
      return;
    }
    mobile.waiting = true;
    var { type } = this.props;
    this.setState({mobile},()=>{
      this.props.dispatch({
        type: 'patient/sendAuthCode',
        payload: {
          msg:{
        	  mobile : mobile.oldValue || mobile.value,
        	  type : type || 'COMMON',
          },
          callback : this.authCodeSended,
        }
      });
    });
  }
  authCodeSended(sended){
	var { mobile,authCode } = this.state;
	if(!sended){
		mobile.waiting = false;
		this.setState({field:'authCode',mobile},()=>{
		  this.notice("发送验证码错误，请稍后再试");	
		});
	}
    mobile.waiting = false;
    mobile.focus = false;
    authCode.focus = true;
    this.setState({field:'authCode',mobile,timer:60},()=>{
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
  notice(msg){
	this.props.dispatch({
	  type: 'frame/showNotice',
	  payload: {
		 msg,
	  }
    });
  }
  authCodeVerfied(verfied){//校验成功
	  var { authCode,mobile } = this.state;
	  authCode.waiting = false;
	  this.setState({authCode},()=>{
		  if(this.props.onVerfied)this.props.onVerfied(mobile.value,verfied);
	  })
  }
  submit(){
	const { type } = this.props;
	var { mobile,authCode } = this.state;
	var { msg } = this.props.patient;
	
	var closed = false;
	if(window.ssmConfig && window.ssmConfig['sms.skip'] === true){
	  closed = true;
	}
	if(window.ssmConfig && window.ssmConfig['sms.skipWhenCard'] === true &&
			(type == 'REG' || type == 'REP')){
	  closed = true;
	}
	if(closed){
		if(!testMobile(mobile.oldValue||mobile.value)) {
	      this.setState({showConfirm: true}); //TODO: 播放语音：您输入的手机号不合法，请重新输入
	      return;
	    }
		this.authCodeVerfied(true);
		return;
	}
    
    msg.code = authCode.value;
    authCode.waiting = true;
    this.setState({authCode},()=>{
    	this.props.dispatch({
			type: 'patient/checkAuthCode',
			payload: {
				msg,
				callback : this.authCodeVerfied,
			}
		});
    });
  }
  skip(){
	  this.authCodeVerfied(false);  
  }
  render() {
	const { type } = this.props;
	const { mobile, authCode} = this.state;
	const { canSkip } = this.props; 
	let height = config.getWS().height - (22 + config.navBar.height) * config.remSize;
	
	var closed = false;
	if(window.ssmConfig && window.ssmConfig['sms.skip'] === true){
	  closed = true;
	}
	if(window.ssmConfig && window.ssmConfig['sms.skipWhenCard'] === true && 
			(type == 'REG' || type == 'REP')){
	  closed = true;
	}
	console.info('skipWhenCard',window.ssmConfig);
	console.info('type',type);
	var closeStyle = closed?{display:'none'}:{};
    return (
      <Row>
    	<Col span = {12} className = {styles.left} >
          <Card style = {{padding: '1rem', height: height + 'px'}} >
            <div className = {styles.label} >手机号：</div>
            <Input value = {mobile.value} placeholder = '请输入手机号码' focus = {mobile.focus} 
              onClick = {this.setFocus.bind(this,'mobile')} />
           <div style={closeStyle}> 
            <Button className={styles.sendbtn} 
              text = {this.state.timer <= 0 ? mobile.btn:this.state.timer+'秒后可以再次发送'}  
              waiting = {mobile.waiting} 
              disabled = {this.state.timer > 0 || mobile.disable} 
              onClick = {this.sendAuthCode.bind(this)} />
            <div className = {styles.label} > 验证码：</div>
            <Input value = {authCode.value} 
              placeholder = '请输入验证码'
              focus = {authCode.focus} style = {{textAlign: 'center'}} 
              disabled = {authCode.disable}
              onClick = {this.setFocus.bind(this,'authCode')} />
           {
            	canSkip?(
            		<Row>
            		<Col span={11}>
	            		<Button className={styles.checkbtn}
		                    text = '确定' 
		                    waiting = {authCode.waiting}
		                    disabled = {authCode.disable} 
		                    onClick = {this.submit.bind(this)} />
            		</Col>
	            	<Col span={2}>&nbsp;</Col>
            		<Col span={11}>
	            		<Button className={styles.checkbtn}
		                    text = '跳过' 
		                    waiting = {false}
		                    disabled = {false} 
		                    onClick = {this.skip.bind(this)} />
            		</Col>
            		</Row>
            	):(
	    			<Button className={styles.checkbtn}
	                	text = '确定' 
	                    waiting = {authCode.waiting}
	                    disabled = {authCode.disable} 
	                    onClick = {this.submit.bind(this)} />
            	)
           }
           </div>
           <div style={{display:closed?'':'none'}}>
           <Button className={styles.checkbtn} 	text = '确定' 
             waiting = {false}   disabled = {false} 
             onClick = {this.submit.bind(this)} />
           </div>
           </Card>
        </Col>
        <Col span = {12} className = {styles.right}  >
          <NumKeyboard onKeyDown={this.onKeyDown.bind(this)} height = {height} />
        </Col>
        <Confirm info = '您输入的手机号不合法，请重新输入！'
          visible = {this.state.showConfirm} 
          buttons = {[{text: '确定', onClick: () => this.setState({showConfirm: false}) },]}
         />
      </Row>
    );
  }
}
  

export default connect(({patient}) => ({patient}))(VerifyAuthCode);



