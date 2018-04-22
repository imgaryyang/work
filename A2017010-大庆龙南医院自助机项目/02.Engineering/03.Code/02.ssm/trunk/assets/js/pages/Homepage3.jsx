"use strict";

import { Component, PropTypes } from 'react';
import styles from './Homepage.css';
import { Icon, Row, Col, Modal } from 'antd';
import baseUtil from '../utils/baseUtil.jsx';
import logUtil, { log } from '../utils/logUtil.jsx';
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
import NavContainer from '../components/NavContainer.jsx';

import MenuTemplate from './templates/MenuTemplate.jsx';
import MenuMain from './templates/MenuMain.jsx';

class Page extends Component {
	constructor(props) {
		super(props);
		this.onBack = this.onBack.bind(this);
		this.onHome = this.onHome.bind(this);
		this.logout = this.logout.bind(this);
		this.loadConfig  = this.loadConfig.bind(this);
		this.closeDevices = this.closeDevices.bind(this);
		this.closeMedicalCard = this.closeMedicalCard.bind(this);
		this.getTemplate = this.getTemplate.bind(this);
		this.loadMenus = this.loadMenus.bind(this);
		this.menusToTree = this.menusToTree.bind(this);
		this.selectMenu = this.selectMenu.bind(this);
	    this.goMenu = this.goMenu.bind(this);
	    this.validate = this.validate.bind(this);
	    this.checkRuleLink = this.checkRuleLink.bind(this);
	    this.needCardPrinter = this.needCardPrinter.bind(this);
	    this.needMSPrinter = this.needMSPrinter.bind(this);
	    this.needAccount = this.needAccount.bind(this);
	    this.needLogin = this.needLogin.bind(this);
		this.renderHome = this.renderHome.bind(this);
		this.state = {
			menus: [],
			menu: {},
		}
	}
	componentWillMount() {
		this.loadConfig();
		this.closeDevices();
		this.loadMenus();
	}
	componentWillReceiveProps(nextProps){ 	
	  const { patient } = nextProps ;
	  var { cardType,name } = patient;
	  if(this.props.patient.no != patient.no ){
		  if( cardType && cardType == "operator" ){
			  this.props.history.push("/opt/main"); 
		  }
	  }
    }
	getTemplate(){
		const template = "common";
		return template;
	}
	closeDevices(){
		//try{ cashBoxUtil.safeClose(); }catch(e){console.info(e)}//关闭钱箱会有问题
		try{ idCardUtil.close(); }catch(e){console.info(e)}
		try{ miCardUtil.safeClose(); }catch(e){console.info(e)}
		try{ unionPayUtil.safeClose(); }catch(e){console.info(e)}
		try{ cardPrinter.closeCardBackIn(); }catch(e){console.info(e)}
		
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
	onBack(){
		const { menu,menus } = this.state;
		if(menu.parent){
			this.setState({menu:menu.parent});
		}else{
			this.onHome();
		}
	}
	onHome(){
		const { menus } = this.state;
		const template = this.getTemplate();
		var menu = {
			template: template,
			children: menus,
		}
		this.setState({menu});
	}
	loadMenus() {
		let fetch = Ajax.get("/api/ssm/base/menu/client/mylist", null, { catch: 3600 });
		fetch.then(res => {
			let menus = res.result || [];
			return menus;
		}).then((menus) => {
			var menuTree = this.menusToTree(menus);
			const template = this.getTemplate();
			var menu = {
				template: template,
				children: menuTree,
			}
			this.setState({ menus: menuTree,menu });
		});
	}
	menusToTree(menus) {
		var root = [], map = {};
		for (menu of menus) {
			map[menu.id] = menu;
		}
		for (var menu of menus) {
			if (!menu.parent) {
				root.push(menu);
			} else {
				var parent = map[menu.parent];
				if (!parent) {
					root.push(menu);
				} else {
					parent.children = parent.children || [];
					parent.children.push(menu);
				}
			}
		}
		return root;
	}
	selectMenu(menu) {
		const { children } = menu || {};
		if (children && children.length > 0) {
			this.setState({menu});
		} else {
			this.validate(menu, {
				success: () => {
					this.goMenu(menu);
				},
				failure: () => {

				}
			});
		}
	}
	goMenu(menu) {
		var history = this.props.history;
		var pathname = menu.pathname;
		history.push({ pathname: menu.pathname, })
	}
	validate(menu, { success, failure }) {
		const expression = menu.rules || "";
		const rules = expression.split(";");

		//将登录校验放置到最后
		var newRules = [], needLogin = false;
		for (var rule of rules) {
			if ("needLogin" != rule) newRules.push(rule);
			else needLogin = true;
		}
		if (needLogin) newRules.push("needLogin");

		this.checkRuleLink({
			index: 0,
			rules: newRules,
			menu,
			success,
			failure,
		})
	}
	checkRuleLink({menu, index, rules, success, failure }) {
		if (index >= rules.length) {
			success();
			return;
		}
		var rule = rules[index];
		var checker = this[rule];
		var cb = () => {
			this.checkRuleLink({
				menu,index: index + 1, rules, success, failure,
			});
		}
		if (checker) {
			checker(cb,menu)
		} else {
			cb();
		}
	}
	needCardPrinter(callback) {//需要证卡打印机
		this.setState({ showPrintWin: true });
		var state = cardPrinter.checkPrinterStatus();
		if (state != 0) {
			if (state == '-2' || state == '1024') {
				baseUtil.error('卡片用完！,请联系管理人员添加');
			} else if (state == '-3' || state == '769' || state == '772') {
				baseUtil.error('色带用完！,请联系管理人员添加');
				this.setState({ showPrintWin: false });
				return false;
			}
			cardPrinter.reset();
			state = cardPrinter.checkPrinterStatus();
		}
		if (state != 0) {
			var msg = cardPrinter.getErrorMsg(state)
			baseUtil.warning(msg);
		} else {
			this.setState({ showPrintWin: false });
			if (callback) callback();
		}
	}
	needMSPrinter(callback) {//需要凭条打印机
		var json = printer.getMSPrinterStatus();
		if (json.state != 0) {
			baseUtil.error(json.msg);
			return false;
		}
		if (callback) callback();
	}
	needReportPrinter(menu) {//校验报告打印机
		var json = printer.getReportPrinterStatus();
		if (json.state != 0) {
			baseUtil.error(json.msg);
			return false;
		}
		if (callback) callback();
	}
	needAccount(callback) {//需要开通预存
	}
	notAtMidnight(callback) {//午夜不允许办理业务
		var today = moment(moment().format('YYYY-MM-DD')).toDate();
		var tomorrow = moment(moment().add(1, 'days').format('YYYY-MM-DD')).toDate();
		var now = new Date();
		var sub1 = now.getTime() - today.getTime();
		var sub2 = tomorrow.getTime() - now.getTime();
		if (sub1 < 10 * 60 * 1000 || sub2 < 10 * 60 * 1000) {//12点前后十分钟
			baseUtil.error("午夜11点50分至凌晨0点10分期间不受理预存、缴费等相关业务，请耐心等待");
			return false;
		}
		if (callback) callback();
	}
	needLogin(callback,menu) {//需要患者登录 最后一个校验 后续所有校验逻辑应移植到react-router的onEnter中。
		var history = this.props.history;
		var pathname = menu.pathname;
		var patient = baseUtil.getCurrentPatient();
		if (patient && patient.no) {
			if (callback) callback();
		} else {
			history.pushState({ dispatch: menu.pathname }, "/login");
		}
	}
	needCash() {
		if (!baseUtil.isTodayCanCash()) {
			baseUtil.error("现金功能已关闭,现金预存请至窗口、急诊自助机或等待第二天再存！");
			return false;
		}
		if (callback) callback();
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
	logout(){
		baseUtil.logout();
		//this.loadCommonMenus();
		//this.loadConfig();
	}
	render() {
		const { menu } = this.state;
		//TODO 打印机弹窗
		if(menu.name){
			return <MenuMain
				  menu={menu} 
				  onSelect={this.selectMenu}
				  onHome = {this.onHome}
				  onBack = {this.onBack} />
		}else{
			return this.renderHome( menu );
		}
	}
	renderHome( menu ) {
		var bodyHeight = document.body.clientHeight - 240;
		return (
			<div >
				<div className='homepage_header' >
					<Row >
						<Col span={3} > <img src="./images/logo.png" className='homepage_headerLogo' /> </Col>
						<Col span={16} className='homepage_headerTitle' >{this.props.patient.name || '云南省第一人民医院自助服务系统'}</Col>
						<Col span={5} className='homepage_headerBtn' onClick={this.logout}><div >退卡</div></Col>
					</Row>
				</div>
				<div className="homepage_container" style={{ height: bodyHeight + 'px' }} >
					<div className="homepage_center" >
						<Row className="homepage_row" >
							<MenuTemplate menu={this.state.menu} onSelect={this.selectMenu}/>
						</Row>
					</div>
				</div>
				<div className='homepage_footer' >
					<div className='homepage_bottomLogo' style={{ backgroundImage: 'url(./images/co-logo.png)' }} ></div>
					<Row >
						<Col span={10} className='homepage_bottomLine' ><span style={{ right: '0px' }} ></span></Col>
						<Col span={4} className='homepage_bottomText' >联想智慧医疗</Col>
						<Col span={10} className='homepage_bottomText' ><span style={{ left: '0px' }} ></span></Col>
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


