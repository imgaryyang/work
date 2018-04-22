import React, { Component } from 'react';
import { Row, Col, Modal, message } from 'antd';
import TimerPage from '../../TimerPage.jsx';
import NumKeyboard from '../../components/keyboard/NumKeyboard.jsx';
import Input from '../../components/Input.jsx';
import styles from './PinKeyboard.css';
import baseUtil from '../../utils/baseUtil.jsx';

class PinKeyboard extends TimerPage {
	
  constructor(props){
	  super(props);
	  this.onKeyDown = this.bind(this.onKeyDown,this);
	  this.state = { password : '',maxLength:6 }
  }
  
  componentDidMount() {
	  
  }
  componentWilUnMount() {
  }
  onKeyDown(key){
	  var { password } = this.state; 
	  const { maxLength } = this.props;
	  if('清空'==key) password="";
	  else if('删除'==key) password = password.substr(0, password.length - 1);//删除
	  else if( password.length < maxLength) password = password +key;
	  console.info("...",key,password,password.length, password.length < maxLength);
	  this.setState({ password },()=>{
		 if(password.length == maxLength) {
			 this.submit();//长度够了就提交
		 }
	  });
  }
  submit(){
	  var { password } = this.state; 
	if(this.props.onSubmit)this.props.onSubmit(password);
  }
  render() {
	  
	let height = document.body.clientHeight - 530;
	  
	const { password } = this.state;
	var maskedPwd = '';
	console.info('password : ',password);
	for(var i=0;i<password.length;i++){
		maskedPwd = maskedPwd+'*';
	}
	console.info('maskedPwd : ',maskedPwd);
    return (
    	<div>
    		<Row style={{marginLeft:'auto',marginRight:'auto',marginBottom:'20px',marginTop:'20px',width:'50%'}}>
    		  <Input value = {maskedPwd} focus = {true} style = {{textAlign: 'center',fontSize:'8rem',height:'8rem'}}  />
    		</Row>
    		<Row style={{marginLeft:'auto',marginRight:'auto',marginBottom:'10px',marginTop:'10px',width:'80%'}}>
    		  <div style = {{textAlign: 'center',height:'5rem',fontSize:'4rem'}}>请输入密码！</div>
    		</Row>
	    	<Row style={{marginLeft:'auto',marginRight:'auto',width:'80%'}}>
	    	  <NumKeyboard onKeyDown={this.onKeyDown} hasDot={false} height = {height} />
	    	</Row>
    	</div>
    );
  }
}
module.exports = PinKeyboard;

