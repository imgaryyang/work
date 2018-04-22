"use strict";

import { Component, PropTypes } from 'react';
import classnames from 'classnames';
import styles from './Homepage.css';
import MenuBlock from '../components/homepage/MenuBlock.jsx';
import { Icon,Row, Col  } from 'antd';
import baseUtil from '../utils/baseUtil.jsx';
import logUtil,{ log } from '../utils/logUtil.jsx';
import printer from '../utils/printUtil.jsx'; 
import cardPrinter from '../utils/cardPrinterUtil.jsx';
import PrintWin from '../components/PrintWin.jsx';
import moment from 'moment';

import lightUtil from '../utils/lightUtil.jsx';
import medicalCard from '../utils/medicalCardUtil.jsx';
import cashBoxUtil from '../utils/cashBoxUtil.jsx';
import idCardUtil from '../utils/idCardUtil.jsx';
import miCardUtil from '../utils/miCardUtil.jsx';
import unionPayUtil from '../utils/unionPayUtil.jsx';

class Page extends Component {
	constructor (props) {
		super(props);
		this.menuSelect = this.menuSelect.bind(this);
		this.goMenu = this.goMenu.bind(this);
		this.loadCommonMenus = this.loadCommonMenus.bind(this);
		this.loadOptMenus = this.loadOptMenus.bind(this);
		this.loadConfig = this.loadConfig.bind(this);
		this.logout = this.logout.bind(this);
		this.closeDevices = this.closeDevices.bind(this);
		this.closeMedicalCard = this.closeMedicalCard.bind(this);
		this.checkCash = this.checkCash.bind(this);
		window.onbeforeunload = ()=>{
			this.closeDevices();
			this.closeMedicalCard();
		} 
		this.state = { menus : [] };
		this.noLoginPaths=[
           '/',
           '/homepage',
           '/card/id/reissue',
           '/card/id/issue',
           '/card/mi/reissue',
           '/card/mi/issue',
           '/guide',
           '/login',
           '/opt/cardPrinter',
        ];
	}
	componentWillMount () {
		this.loadConfig();
		this.closeDevices();
		var patient = baseUtil.getCurrentPatient()||{};
		const { cardType,name } = patient;
		if(cardType && cardType == "operator"){
			this.loadOptMenus();
		}else{
			this.loadCommonMenus();
		}
	}
	componentWillReceiveProps(nextProps){ 	
	  const { patient } = nextProps ;
	  var { cardType,name } = patient;
	  if(this.props.patient.no != patient.no ){
		  if( cardType && cardType == "operator" ){
			 this.loadOptMenus();
		  }
	  }
    }
	closeDevices(){
		//try{ cashBoxUtil.safeClose(); }catch(e){console.info(e)}//关闭钱箱会有问题
		try{ idCardUtil.close(); }catch(e){console.info(e)}
		try{ miCardUtil.safeClose(); }catch(e){console.info(e)}
		try{ unionPayUtil.safeClose(); }catch(e){console.info(e)}
		
		try{ lightUtil.ticket.turnOff(); }catch(e){console.info(e)}
		try{ lightUtil.form.turnOff(); }catch(e){console.info(e)}
		try{ lightUtil.cardPrinter.turnOff(); }catch(e){console.info(e)}
		try{ lightUtil.cash.turnOff(); }catch(e){console.info(e)}
		try{ lightUtil.bankCard.turnOff(); }catch(e){console.info(e)}
		try{ lightUtil.miCard.turnOff(); }catch(e){console.info(e)}
		try{ lightUtil.pin.turnOff(); }catch(e){console.info(e)}
	}
	closeMedicalCard(){
		try{ medicalCard.close() }catch(e){console.info(1)}
		try{ lightUtil.medicalCard.turnOff(); }catch(e){console.info(2)}
		return 1;
	}
	loadOptMenus(){
		log('home-加载运维菜单');
		let fetch = Ajax.get("/api/ssm/base/menu/operator/mylist", null, {catch: 3600});
		fetch.then(res => {
			let menus = res.result||[];
	    	return menus;
		}).then((menus)=>{
			this.setState({menus});
		});
	}
	loadConfig(){
		let fetch = Ajax.get("/api/ssm/base/auth/machine/config", null, {catch: 3600});
		fetch.then(res => {
			let config = res.result||{};
	    	return config;
		}).then((config)=>{
			window.ssmConfig = config;
			log('home-系统参数',config);
		});
	}
	loadCommonMenus(){
		let fetch = Ajax.get("/api/ssm/base/menu/client/mylist", null, {catch: 3600});
		fetch.then(res => {
			let menus = res.result||[];
	    	return menus;
		}).then((menus)=>{
			this.setState({menus});
		});
	}
	logout(){
		baseUtil.logout();
		this.loadCommonMenus();
		this.loadConfig();
	}
	menuSelect(menu){
		if(!this.checkDevice(menu))return;
		if(!this.checkTime(menu))return;
		if(!this.checkCardPrinter(menu))return;
		if(!this.checkCash(menu))return;
		this.goMenu(menu);
	}
	checkDevice(menu){
		var code = menu.code;
		if(!(code == 'rechargeRecords' || code == 'caseHistoryRecords'|| code ==  'checkRecords' || code == 'bloodcheck' || code == 'inpatientDailyBill'  )){
			var mspState =  this.checkMSPrinter();
			if(!mspState)return mspState;
		}
		return true;
	}
	checkTime(menu){
		var code = menu.code;
		if(code == 'pay' ||code == 'bankForegift' ||code == 'refund' ||code == 'balanceForegift' || code == 'prepaidCash'|| code ==  'prepaidBankCard' || code == 'prepaidWX' || code == 'prepaidAli'  ){
			var today =  moment(moment().format('YYYY-MM-DD')).toDate();
			var tomorrow =  moment(moment().add(1,'days').format('YYYY-MM-DD')).toDate();
			var now  = new Date();
			var sub1 = now.getTime() - today.getTime();
			var sub2 = tomorrow.getTime()- now.getTime();
			if(sub1 < 10*60*1000 || sub2 < 10*60*1000 ){//12点前后十分钟
				baseUtil.error("午夜11点50分至凌晨0点10分期间不受理预存、缴费等相关业务，请耐心等待");
				return false;
			}	
		}
		return true;
	}
	checkMSPrinter(){//校验发卡机
	  var json = printer.getMSPrinterStatus();
	  if(json.state != 0 ){
		  baseUtil.error(json.msg);
		  return false;  
	  }
	  return true;
	}
	checkCardPrinter(menu){//校验凭条
	  var code = menu.code;	
	  if(code == 'mCardCreate' || code == 'mCreateProfile'|| code ==  'cardReissue' || code == 'miCardReissue'  ){
		  	this.setState({showPrintWin:true} );
		  	var state  = cardPrinter.checkPrinterStatus();
    		if(state != 0){
    			if(state == '-2' || state == '1024'){
    				baseUtil.error('卡片用完！,请联系管理人员添加');
    			}else if (state == '-3' || state == '769' || state == '772'){
    				baseUtil.error('色带用完！,请联系管理人员添加');
    				this.setState({showPrintWin:false} );
    				return false;
    			}
    			cardPrinter.reset();
    			state  = cardPrinter.checkPrinterStatus();
	    	}
    		if(state != 0){
    			var msg = cardPrinter.getErrorMsg(state)
    			baseUtil.warning(msg);
    		}
    		this.setState({showPrintWin:false} );
    		return state == 0;
	  }
	  return true;
	}
	checkCash(menu){
		if('prepaidCash' == menu.code){
			 if(! baseUtil.isTodayCanCash()){
				 baseUtil.error("现金功能已关闭,现金预存请至窗口、急诊自助机或等待第二天再存！");
				 return false;
			 }
		}
		return true;
	}
	goMenu(menu){
		var history = this.props.history;
		var pathname  = menu.pathname;
		//特殊页面不校验登录
	    for(var path of this.noLoginPaths){
	    	if(path == pathname || path == ('/'+pathname)){
	    		history.push({ pathname: menu.pathname,});
	    		return;
	    	}
	    }
	    var patient = baseUtil.getCurrentPatient();
		if(patient && patient.no){
			history.push({ pathname: menu.pathname,})
		}else{
			history.pushState({dispatch:menu.pathname}, "/login");  
		}
	}
	render () { 
	  var scope = this;
	  var baseSpan = 6;
	  var {menus} = this.state;
	  var bodyHeight = document.body.clientHeight -240;
	  return (
	    <div >
	      <div className = 'homepage_header' >
	        <Row >
	          <Col span = {3} >
	            <img src="./images/logo.png" className = 'homepage_headerLogo' />
	          </Col>
	          <Col span = {16} className = 'homepage_headerTitle' >{this.props.patient.name||'云南省第一人民医院自助服务系统'}</Col>
			  <Col span = {5} className = 'homepage_headerBtn'   onClick = {this.logout}>
			    <div >退卡</div>
			  </Col>
			</Row>
		  </div>
		  
		  <div className = "homepage_container" style={{height:bodyHeight+'px'}} >
			<div className = "homepage_center" >
			  <Row className = "homepage_row" >
			  {
				menus.map(function(menu, index){
					let span = baseSpan * menu.colspan;
					return (
					  <Col span = {span} key = {index} className = 'homepage_col' >
					    <MenuBlock onSelect = {scope.menuSelect} menu = {menu} />
				      </Col>
					)
				})
			  }
		      </Row>
		    </div>
		  </div>
		  <PrintWin visible = {this.state.showPrintWin} msg={"正在检测发卡机，请稍后"} />
		  <div className = 'homepage_footer' >
			<div className = 'homepage_bottomLogo' style = {{backgroundImage: 'url(./images/co-logo.png)'}} ></div>
			<Row >
				<Col span = {10} className = 'homepage_bottomLine' ><span style = {{right: '0px'}} ></span></Col>
				<Col span = {4} className = 'homepage_bottomText' >联想智慧医疗</Col>
				<Col span = {10} className = 'homepage_bottomText' ><span style = {{left: '0px'}} ></span></Col>
			</Row>
		  </div>
		</div>
	  );
	}
}

Page.propTypes = {
  children: PropTypes.any
}

module.exports = Page;


