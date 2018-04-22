"use strict";

import { Component, PropTypes } from 'react';
import Confirm from '../components/Confirm.jsx';
import Notice from '../components/Notice.jsx';
import styles from'./Framework.css';
import Audio from './Audio.jsx';
import baseUtil from '../utils/baseUtil.jsx';
import logUtil,{log} from '../utils/logUtil.jsx';
import medicalCard from '../utils/medicalCardUtil.jsx';
var LOAD_COUNT = 0;
class Page extends Component {
	constructor (props) {
		super(props);
		baseUtil.scope = this;
		this.state = {
		  showConfirm:false,
		  errorMsg:'',
		  noticeMsg:'',
		  warningMsg:'',
		  patient:{},
		  machine:{},
		  loadCount:0,
		}
		this.confirm = this.confirm.bind(this);
		this.error = this.error.bind(this);
		this.warning = this.warning.bind(this);
		this.notice = this.notice.bind(this);
		this.goHome = this.goHome.bind(this);
		this.getCurrentPatient = this.getCurrentPatient.bind(this);
		this.getMachineInfo = this.getMachineInfo.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.startMedicalCard = this.startMedicalCard.bind(this);
		this.machineLogin = this.machineLogin.bind(this);
		this.reloadPatient = this.reloadPatient.bind(this);
		this.mask = this.mask.bind(this);
		this.unmask = this.unmask.bind(this);
		
		baseUtil.register('confirm',this.confirm);
		baseUtil.register('error',this.error);
		baseUtil.register('notice',this.notice);
		baseUtil.register('warning',this.warning);
		baseUtil.register('getCurrentPatient',this.getCurrentPatient);
		baseUtil.register('getMachineInfo',this.getMachineInfo);
		baseUtil.register('login',this.login);
		baseUtil.register('logout',this.logout);
		baseUtil.register('goHome',this.goHome);
		baseUtil.register('machineLogin',this.machineLogin);
		baseUtil.register('reloadPatient',this.reloadPatient);
		baseUtil.register('mask',this.mask);
		baseUtil.register('unmask',this.unmask);
		const { pathname } = props.location;
		if(pathname && pathname!='/homepage' && pathname!='/'){
			props.history.push({ pathname: '/homepage',});
			return;
		}
		
	}
	componentWillMount () {
		logUtil.startLogLoop();
		this.startMedicalCard();//开启就诊卡监听
		this.machineLogin();
	}
	startMedicalCard(){
		var login = this.login;
		medicalCard.on("cardPushed",function(eventKey,cardInfo){//监听插卡事件
			const loginInfo = {
	    	  medicalCardNo:cardInfo.cardNo,
	    	}			
			login(loginInfo);
		});
		medicalCard.on("cardPoped",function(eventKey,cardInfo){//监听弹卡事件
		});
		medicalCard.listenCard();
	}
	confirm(){
		this.setState({showConfirm:true});
	}
	error(msg){
		this.setState({errorMsg:msg});
	}
	warning(msg){
		this.setState({warningMsg:msg});
	}
	goHome(mark){
		mark = mark||'none';
		const { location } =  this.props;
		log('gohome ',{mark,location});
		this.props.history.push({ pathname: '/homepage',})
	}
	getCurrentPatient(){
		return this.state.patient;
	}
	getMachineInfo(){
		return this.state.machine;
	}
	machineLogin(){
		let fetch = Ajax.get("/api/ssm/base/auth/machine/info", {catch: 3600});
		fetch.then(res => {
			if(res && res.success){
				log('frame-机器信息：',res.result);
				this.setState({machine:res.result||{}});
			}else if( res && res.msg ){
	    		baseUtil.error(res.msg );
	    	}else{
	    		baseUtil.error("未授权的自助机");
	    	}
		}).catch((ex) =>{
			baseUtil.error("未授权的自助机");
		})
	}
	login(loginInfo){
		log('frame-登录参数',loginInfo);
		let fetch = Ajax.post("/api/ssm/treat/patient/login", loginInfo, {catch: 3600});
		fetch.then(res => {
			let patient = res.result||{};
	    	return patient;
		}).then((patient)=>{
			log('frame-登录结果',patient);
			if(!patient || !patient.no){
				baseUtil.error('未注册的患者');
				return;
			}
			if(patient.cardType != "operator" && patient.accStatus != '1'){
				baseUtil.error('您的账户已经'+patient.accStatusName+',禁止在自助机操作');
				return;
			}
			this.setState({patient:patient||{}},()=>{
				baseUtil.fireEvents('login');
			});
		}).catch((ex) =>{
			log('frame-登录异常!',ex); 
			baseUtil.error('登录异常!');
			return;
		})
	}
	reloadPatient(callback){
		const loginInfo = this.state.patient;
		log('frame-重新加载患者信息',loginInfo);
		let fetch = Ajax.post("/api/ssm/treat/patient/login", loginInfo, {catch: 3600});
		fetch.then(res => {
			let patient = res.result||{};
	    	return patient;
		}).then((patient)=>{
			log('frame-重新加载患者信息结果',patient);
			if(!patient || !patient.no){
				baseUtil.error('未注册的患者');
				return;
			}
			this.setState({patient},()=>{
				if(callback)callback(patient);
			});
		}).catch((ex) =>{
			log('frame-重新加载患者信息异常!',ex); 
			baseUtil.error('加载患者信息异常!');
			return;
		})
	}
	logout(){
		this.setState({patient:{}},()=>{
			medicalCard.safeClose();
		});
	}
	mask(url){
		LOAD_COUNT = LOAD_COUNT+1;
		log('frame-mask',url,LOAD_COUNT);
		this.setState({loadCount:LOAD_COUNT});
//		this.setState({loadCount:1});
	}
	unmask(url){
		LOAD_COUNT = LOAD_COUNT-1;
		log('frame-unmask',url,LOAD_COUNT);
		this.setState({loadCount:LOAD_COUNT});
//		this.setState({loadCount:0});
	}
	notice(msg){
		this.setState({noticeMsg:msg},()=>{
			Notice.showMsg();
		});
	}
	render () { 
		var loadingDisplay =( this.state.loadCount > 0 )?'':'none' 
		return (
		  <div >
		   { React.cloneElement(this.props.children, { patient : this.state.patient }) }
		  	<div id="ssm_audio_dom">
	        {
	          Object.keys(Audio).map(function(key,index){
	            return (
	              <audio id={"audio_"+key} key={"audio_"+key} height="0" width="0">
	                <source src={Audio[key]} type="audio/mp3" />
	              </audio>
	            )
	          })
	        }
	        </div>
	        <Notice msg={this.state.noticeMsg}/>
	        <div className='fm_modal' style={{display:loadingDisplay,backgroundImage:"url('./images/loading06.gif')"}}>
	        </div>
	        <Confirm info = {this.state.errorMsg||'' } 
	          visible = { this.state.errorMsg?true:false } 
	          buttons = {[
	            {text: '确定', onClick: () =>{
	            	this.setState({errorMsg:''},()=>{
	            		this.goHome();
	            	});
	            }}
	          ]}
		    />
			<Confirm info = {this.state.warningMsg||'' } 
		        visible = { this.state.warningMsg?true:false } 
	            buttons = {[
	              {text: '确定', onClick: () =>{
	            	  this.setState({warningMsg:'',});
	              }},
	            ]}
	        />
		 
	     </div>
	    );
	}
}

Page.propTypes = {
  children: PropTypes.any
}

module.exports = Page;