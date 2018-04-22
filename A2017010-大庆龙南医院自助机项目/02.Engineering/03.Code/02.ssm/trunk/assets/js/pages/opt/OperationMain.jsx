"use strict";

import { Component, PropTypes } from 'react';
import classnames from 'classnames';
import styles from './OperationMain.css';
import MenuBlock from '../../components/homepage/MenuBlock.jsx';
import { Icon,Row, Col  } from 'antd';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import printer from '../../utils/printUtil.jsx'; 
import cardPrinter from '../../utils/cardPrinterUtil.jsx';
import PrintWin from '../../components/PrintWin.jsx';
import moment from 'moment';

import lightUtil from '../../utils/lightUtil.jsx';
import medicalCard from '../../utils/medicalCardUtil.jsx';
import cashBoxUtil from '../../utils/cashBoxUtil.jsx';
import idCardUtil from '../../utils/idCardUtil.jsx';
import miCardUtil from '../../utils/miCardUtil.jsx';
import unionPayUtil from '../../utils/unionPayUtil.jsx';
import TimerModule from '../../TimerModule.jsx';
import NavContainer from '../../components/NavContainer.jsx';
class Page extends TimerModule {
	constructor (props) {
		super(props);
		this.menuSelect = this.bind(this.menuSelect,this);
		this.goMenu =  this.bind(this.goMenu,this);
		this.loadOptMenus =  this.bind(this.loadOptMenus,this);
		this.logout =  this.bind(this.logout,this);
		this.closeDevices =  this.bind(this.closeDevices,this);
		this.closeMedicalCard =  this.bind(this.closeMedicalCard,this);
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
		this.closeDevices();
		this.loadOptMenus();
	}
	componentWillReceiveProps(nextProps){}
	closeDevices(){
		console.info('----closeDevices');
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
	}
	menuSelect(menu){
		this.goMenu(menu);
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
	onBack(){
		baseUtil.goHome('optBack');
	}
	onHome(){
		baseUtil.goHome('optHome');
	}
	render () { 
	  var scope = this;
	  var baseSpan = 6;
	  var {menus} = this.state;
	  var bodyHeight = document.body.clientHeight -240;
	  return (
		<NavContainer title='运维管理' onBack={this.onBack} onHome={this.onHome} >
		  <div className = "operation_main_container" style={{height:bodyHeight+'px'}} >
			<div className = "operation_main_center" >
			  <Row className = "operation_main_row" >
			  {
				menus.map(function(menu, index){
					let span = baseSpan * menu.colspan;
					return (
					  <Col span = {span} key = {index} className = 'operation_main_col' >
					    <MenuBlock onSelect = {scope.menuSelect} menu = {menu} />
				      </Col>
					)
				})
			  }
		      </Row>
		    </div>
		  </div>
		</NavContainer>
	  );
	}
}

Page.propTypes = {
  children: PropTypes.any
}

module.exports = Page;


