import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, 
  Modal, message }          from 'antd';

import config               from '../../config';
import styles               from './CreateCard02.css';

import { testMobile }       from '../../utils/validation';
import {
	WorkSpace,Steps,Card,
	Input,Button,Confirm ,
	NumKeyboard     }       from '../../components';
import baseUtil from '../../utils/baseUtil';

const _resendTime = config.timer.resendAuthMsg;
const _authCodeLen = config.authCodeLen;

class CreateCard02 extends React.Component {
	
	static displayName = 'CreateCard02';
	static description = '办理就诊卡-step2';

	static propTypes = {
	};

	static defaultProps = {
	};

	/**
	 * 初始化状态
	 */
	state = {
			keyConfig:{ maxLength:11,stateName:'mobile' },  
			mobile: '',
			authCode: '',
			second: _resendTime,
			timing:false,
			alertVisible: false,
			acWaiting: false,
			submitWaiting: false,
	};

	steps = ['读取身份证', '校验手机号', '发卡'];
	timer = true;
  
	constructor(props) {
		super(props);
		this.onKeyDown = this.onKeyDown.bind(this);
		this.sendAuthCode = this.sendAuthCode.bind(this);
		this.authCodeSended = this.authCodeSended.bind(this)
		this.authCodeVerfied = this.authCodeVerfied.bind(this);
		this.submit = this.submit.bind(this);
		this.setClock = this.setClock.bind(this);
	}

	componentDidMount() {
    //TODO: 播放语音：请输入手机号码
	}
  
	componentWillReceiveProps(nextProps){
		var baseInfo = nextProps.patient.baseInfo;
		if(baseInfo && baseInfo.id){//存在档案信息
			this.timer=false;
			this.props.dispatch(routerRedux.push({
				pathname: '/createCard03',
		        state: {
		          idNo: baseInfo.idNo, 
		          name: baseInfo.name,
		          nav: { backDisabled: true,title: '办理就诊卡',},
		        },
			})
			);
		}
	}
  
	/**
	 * 监听键盘输入
	 */
	onKeyDown(key){
		var {maxLength,stateName} = this.state.keyConfig;
		var old = this.state[stateName];
		if('清空'==key){
			this.state[stateName]="";
		}
		else if('删除'==key){
			this.state[stateName] = old.substr(0, old.length - 1);//删除
		}
		else if(old.length < maxLength){
			this.state[stateName]=old+key;
		}
		this.setState(this.state);
	}
	
	setFocus(maxLength,stateName){
	  var keyConfig = {maxLength:maxLength,stateName:stateName};
	  this.setState({keyConfig:keyConfig});
	}

	setClock () {
		if(!this.timer){
			return;//如果组件已经销毁，则停止
		}
		let second = this.state.second - 1;
		if(second == 0) {
			this.setState({ second: _resendTime + 1, timing:false, });
			return;
		}else{
			this.setState({second: second, timing:true});
			setTimeout(this.setClock,1000);
		}
	}
	
	authCodeSended(){
		this.props.dispatch({
			type: 'message/show',
			payload: {
				msg: (
				  <div style = {{fontSize: '2.5rem', textAlign: 'center', margin: '1.5rem', lineHeight: '4rem', whiteSpace: 'nowrap'}} >
		          短信验证码已成功发送，请注意查收短信<br/>如未收到短信，{config.timer.resendAuthMsg}秒钟后可重新点击发送
		          </div>
				)
			}
		});
		this.setFocus(4,'authCode');
		this.setClock();
	}
	
	/**
	 * 发送验证码
	 */
	sendAuthCode() {
		if(!testMobile(this.state.mobile)) {
			this.setState({alertVisible: true}); //TODO: 播放语音：您输入的手机号不合法，请重新输入
			return;
		}
		this.props.dispatch({
			type: 'patient/sendAuthCode',
			payload: {
				mobile : this.state.mobile,
				callback : this.authCodeSended,
			}
		});
	}
	
	authCodeVerfied(){//校验结束，进入下一个页面
		if(!this.props.location.state)return;
		const {idCardInfo} = this.props.location.state;
		if(!idCardInfo){
			return ;
		}
		const {userName, sex, nation, birthday, address, idNo, issuer, effectiveDate} = idCardInfo;
		this.props.dispatch({
			type: 'patient/createProfile',
			payload: {
				baseInfo:{
					name : userName,
					gender : sex,
					nation : nation,
					birthday : birthday,
					address : address,
					idNo : idNo,
					idIssuer : issuer,
					idEffectiveDate : effectiveDate,
				}
			}
		});
	}
	
	/**
	 * 确认提交
	 */
	submit(){
		this.setState(
			{ submitWaiting: true,acDisabled: true,second:0},
			()=>{
				this.props.dispatch({
					type: 'patient/checkAuthCode',
					payload: {
						mobile : this.state.mobile,
						authCode : this.state.authCode,
						callback : this.authCodeVerfied,
					}
				});
			}
		);
	}

	render() {
		const { mobile, authCode, keyConfig, second, timing, submitWaiting, acWaiting } = this.state;
		const { idCardInfo } = this.props.location.state || {idCardInfo:{uesrName:"",idNo:""}};
	 
		const mobileFocus     = (keyConfig.stateName == 'mobile');
		const authCodeFocus   = (keyConfig.stateName == 'authCode');
		const acDisabled      = !(mobile.length ==11);
		const submitDisabled  = !(authCode.length ==4);
		const sendBtnStyle    = {marginTop: '2rem', marginBottom: '1rem', fontSize: '3rem'};
		const checkBtnStyle   = {marginTop: '2.5rem'};
		const acBtnText       = timing ? (this.state.second + ' 秒钟后可再次发送') : '免费获取验证码';
		let height            = config.getWS().height - (22 + config.navBar.height) * config.remSize;
      
		return (
	      <WorkSpace style = {{paddingTop: '4rem'}} >
	      	<Steps steps = {this.steps} current = {2} />
	      	<Card shadow = {true} style = {{margin: '2rem', padding: '2rem', fontSize: '3rem'}} >
		      <Row><Col span = {8} >姓名 ：{idCardInfo.userName}</Col><Col span = {16} >身份证号 ：{idCardInfo.idNo}</Col> </Row>
		    </Card>
	        <Row>
	          <Col span = {12} style = {{padding: '2rem', paddingTop: '0'}} >
	            <Card shadow = {true} style = {{padding: '1rem', height: height + 'px'}} >{/* title = '请输入手机号码及验证码'*/}
	              
	              <div span = {8} className = {styles.label} >手机号：</div>
	              <Input value = {mobile} placeholder = '请输入手机号码' focus = {mobileFocus} onClick = {this.setFocus.bind(this,11,'mobile')} />
	              <Button text = {acBtnText} style={sendBtnStyle} waiting = {acWaiting} disabled = {acDisabled} onClick = {this.sendAuthCode} />
	              
	              <div span = {8} className = {styles.label} >验证码：</div>
	              <Input value = {authCode} placeholder = '请输入验证码' focus = {false} style = {{textAlign: 'center'}} focus = {authCodeFocus} onClick = {this.setFocus.bind(this,4,'authCode')} />
	              <Button text = '确定' style = {checkBtnStyle} waiting = {submitWaiting} disabled = {submitDisabled} onClick = {this.submit} />
	
	            </Card>
	          </Col>
	          <Col span = {12} style = {{paddingRight: '2rem'}}  >
	            <NumKeyboard onKeyDown={this.onKeyDown} height = {height} />
	          </Col>
	        </Row>
	        <Confirm 
	          visible = {this.state.alertVisible} info = '您输入的手机号不合法，请重新输入！'
	          buttons = {[{text: '确定', onClick: () => this.setState({alertVisible: false}) },]}/>
	      </WorkSpace>
		);
	}
}
  

export default connect(({patient}) => ({patient}))(CreateCard02);



