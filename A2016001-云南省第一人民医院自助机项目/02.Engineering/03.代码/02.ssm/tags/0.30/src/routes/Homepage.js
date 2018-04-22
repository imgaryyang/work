import moment from 'moment';
import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import { Icon,Row, Col  } from 'antd';
import { MenuBlock } from '../components';

import styles from './Homepage.css';
import logo from '../assets/logo.png'
import coLogo from '../assets/co-logo.png'
import config from '../config';
import lightUtil from '../utils/lightUtil';
import { log } from '../utils/logUtil'; 
import baseUtil from '../utils/baseUtil'; 
import Printer from '../utils/printUtil'; 
import CardPrinter from '../utils/cardPrinterUtil';
import PrintWin from '../components/PrintWin';
class HomePage extends Component {

	constructor(props) {
	  super(props);
	  this.checkDevice = this.checkDevice.bind(this);
	  this.checkTime  = this.checkTime.bind(this);
	}
	state = {showPrintWin:false}
	componentWillMount () {
		const { cardType } = this.props.patient.baseInfo;
		if(cardType && cardType == "operator"){
			console.info("登录用户为管理员，加载特殊菜单");
			this.props.dispatch({type: 'frame/loadOperatorMenus'});
		}else{
			this.props.dispatch({type: 'frame/loadMenus'});
		}
	}
	componentDidMount () {
		const { dispatch,frame } = this.props;
		const { cardType } = this.props.patient.baseInfo;
		if(cardType && cardType == "operator"){
			console.info("登录用户为管理员，不作处理");
			return;
		}
//		const { nav } = frame;
//		const newNav = { ...nav,onBack:null,title:''}
//		this.props.dispatch({
//		  type:'frame/setState',
//		  payload:{nav:newNav},
//		}); 
		const lights = ['ticket','form','cardPrinter','miCard','pin'];
		
		for(var light of lights){
			try {
				console.info('close light ',light);
				lightUtil[light].turnOff();
			} catch (e) {
				console.info('close light ',light,'出错');
				console.info(e);
			}
		}
		const models = [
		  'appoint',
		  'assay',
		  'medicalCase',
		  'patient',
		  'inpatient',
		  'deposit',
		  'foregift',
		  'payment',
		  'refund',
		];
		for(var model of models){
			this.props.dispatch({//保证无残存信息
				type: model+'/reset',
			});
		}
	}
	menuSelect (e, menu) {
		if(!this.checkDevice(menu))return;
		if(!this.checkTime(menu))return;
		const {home, patient} = this.props;
		
		this.checkCardPrinter(menu,()=>{
			this.props.dispatch(routerRedux.push({
				pathname: menu.pathname,
				state : {nav:{title:menu.alias}}
			}));
		});
	}
	// mCardCreate	mCreateProfile	appointDoctor	todayAppiont	appiontSign	cardReissue	myAppiont	pay	paymentRecords	prepaidCash	prepaidBankCard
	// prepaidWX	rechargeRecords	caseHistoryRecords	prepaidAli	checkRecords	refund	bloodcheck	balanceForegift	bankForegift	inpatientDailyBill
	
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
	checkMSPrinter(){
	  var json = Printer.getMSPrinterStatus();
	  if(json.state != 0 ){
		  baseUtil.error(json.msg);
		  log(json.exception);
		  return false;  
	  }
	  return true;
	}
	checkCardPrinter(menu,callback){
	  var code = menu.code;	
	  if(code == 'mCardCreate' || code == 'mCreateProfile'|| code ==  'cardReissue'   ){
		  this.setState({showPrintWin:true},()=>{
			  this.props.dispatch({//保证无残存信息
					type: 'patient/cardPrinterState',
					callback:(success)=>{
						this.setState({showPrintWin:false},()=>{
							if(success)callback();
						});
					}
				});
		  });
	  }else{
		  callback();
	  }
	  return true;
	}
	render(){

		const {menus} = this.props.frame;
		const scope = this;

		let headerStyle = {
			width: '100%',
			height: config.home.header.height + 'rem',
			padding: config.home.header.padding + 'rem',
		};

		let rowHeight = (config.home.header.height - config.home.header.padding * 2); //rem

		let headerLogoStyle = {
			width: rowHeight + 'rem',//(rowHeight * config.remSize) + 'px',
			height: rowHeight + 'rem',
		}

		let headerTitleStyle = {
			lineHeight: rowHeight + 'rem',
			fontSize: '3rem',
		}

		let headerBtnStyle = {
			lineHeight: rowHeight + 'rem',
		}

		let menuStyle = {
			width: '100%',
			height: (_screenHeight - config.home.header.height * config.remSize - config.home.footer.height * config.remSize) + 'px',
		};

		let footerStyle = {
			width: '100%',
			height: config.home.footer.height + 'rem',
		};

		let baseSpan = 24 / config.home.menu.colsPerRow;

		return (
			<div>

				<div className = {styles.header} style = {headerStyle} >
					<Row >
						<Col span = {3} className = {styles.headerLogo} >
							<img src = {logo} className = {styles.bottomLogo} style = {headerLogoStyle}  onClick = {() => {
								this.props.dispatch( routerRedux.push('/login'));
							}} />
						</Col>
						<Col span = {16} className = {styles.headerTitle} style = {headerTitleStyle} >{config.title}</Col>
						<Col span = {5} className = {styles.headerBtn} style = {headerBtnStyle} ><div onClick = {() => {
							this.props.dispatch({type: 'patient/logout'});
							this.props.dispatch({type: 'frame/loadMenus'});
						}} >退卡</div></Col>
					</Row>
				</div>

				<div className = {styles.container} style = {menuStyle} >
					<div className = {styles.center} >
						<Row className = {styles.row} >
							{
								menus.map(function(menu, index){
									let span = baseSpan * menu.colspan;
									return (
										<Col span = {span} key = {index} className = {styles.col} >
								    	<MenuBlock onSelect = {scope.menuSelect.bind(scope)} menu = {menu} />
								    </Col>
									)
								})
							}
				    </Row>
				  </div>
				</div>

				<div className = {styles.footer} style = {footerStyle} >
					{/*<img src = {coLogo} className = {styles.bottomLogo} />*/}
					<div className = {styles.bottomLogo} style = {{backgroundImage: 'url(' + coLogo + ')'}} ></div>
					<Row >
						<Col span = {10} className = {styles.bottomLine} ><span style = {{right: '0'}} ></span></Col>
						<Col span = {4} className = {styles.bottomText} >联想智慧医疗</Col>
						<Col span = {10} className = {styles.bottomLine} ><span style = {{left: '0'}} ></span></Col>
					</Row>
				</div>
				<PrintWin visible = {this.state.showPrintWin} msg={"正在检测发卡机，请稍后"} />
			</div>
		);

	}
}

export default connect(({frame, patient}) => ({frame, patient}))(HomePage);
 


