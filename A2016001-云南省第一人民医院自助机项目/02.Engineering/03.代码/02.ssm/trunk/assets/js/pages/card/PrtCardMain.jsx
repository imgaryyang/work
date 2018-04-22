"use strict";

import React, { PropTypes } from 'react';
import { Row, Col, Modal }  from 'antd';
import moment               from 'moment';
import NavContainer from '../../components/NavContainer.jsx';
import printUtil from '../../utils/printUtil.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import lightUtil from '../../utils/lightUtil.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import Empty from '../../components/Empty.jsx';
import cardPrinter from '../../utils/cardPrinterUtil.jsx';
import PrintWin from '../../components/PrintWin.jsx';
import styles               from './PrtCardMain.css';

class PrtCardMain extends React.Component {
	constructor(props) {
	    super(props);
	    this.onBack = this.onBack.bind(this);
	    this.onHome = this.onHome.bind(this);
	    this.nextPage = this.nextPage.bind(this);
	    this.prePage = this.prePage.bind(this);
	    this.issueCard = this.issueCard.bind(this);
	    this.printOperatorCard = this.printOperatorCard.bind(this);
	    this.state = {
	    	operators: [],
	    	operator: null,
	    	showPrintWin: '',
	    	printMsg: '',
	    	pageNo:1,
			pageSize: 6,
	    }
	}
	componentDidMount() {
		const {pageNo,pageSize} = this.state;
		//let fetch = Ajax.get("/api/ssm/base/operator/page/"+pageNo+"/"+pageSize,{},{catch: 3600});
		let fetch = Ajax.get("/api/ssm/base/operator/list",{},{catch: 3600});
		fetch.then(res => {
			if(res && res.success && res.result ){
				var operators = res.result||[];
				this.setState({operators});
			}else{
				console.log('错误');
			}
		})   
	}
	onBack(){
		  baseUtil.goHome('caseBack'); 
	}
	onHome(){
		  baseUtil.goHome('caseHome'); 
	}
	prePage(){
		  const { pageNo } =this.state;
		  this.setState({pageNo:pageNo-1});
	}
	nextPage(){
		  const { pageNo } =this.state;
		  this.setState({pageNo:pageNo+1});
	}
	printOperatorCard(row){
		log("运维卡办卡中");
		this.setState({showPrintWin:true,printMsg:'正在制卡，请勿离开'},()=>{
			setTimeout(()=>{
				this.issueCard(false,row);
			},200);
		});
	}
	cardErrorHandler(retry,msg,patient){
		log("办卡-制卡错误,是否重试["+retry+"]",msg);
		if(retry){
			baseUtil.error(msg);
			try{
				lightUtil.cardPrinter.turnOff();
			}catch(e){
				console.info('关灯失败')
			}
			this.setState({showPrintWin:false,printMsg:''});
		}else{
			this.setState({showPrintWin:true,printMsg:'尝试重新制卡，请耐心等待'},()=>{
				setTimeout(()=>{
					this.issueCard(true,patient);
				},200);
			});
		}
	}
	printCard(baseInfo,patient){
		try{//如果有关联医保卡号，打医保卡号
			var {no} = patient;
			var miPatientNo = no;
			var type = '运维';
			cardPrinter.printCard(baseInfo.name, miPatientNo||baseInfo.no, type);
		}catch(e){
			console.info(e);
			this.cardErrorHandler(true,'发送打印指令异常,请更换自助机');// 6 发送打印指令异常  不重新制卡
			return;
		}
		baseUtil.speak('card_tackMdeicalCard');// 
		try{
			lightUtil.cardPrinter.turnOn();
		}catch(e){
			console.info('开灯异常');
		} 		
		try{
			lightUtil.cardPrinter.turnOff();
		}catch(e){
			console.info('关灯异常');
		} 
	}
	issueCard(retry,patient){
		//async
		const { no } = patient;
		console.info('发卡 ： ' , patient);
		console.info('no ： ' , no);
		try{
			lightUtil.cardPrinter.blink();
			//await baseUtil.sleep(100);
		}catch(e){
			console.info('闪灯异常');
		}
		if(retry){
			// 尝试排卡
			try{
				cardPrinter.moveToBasket();
			}catch(e){
				this.cardErrorHandler(true,'无法排卡，请联系运维人员',patient);
				return;
			}
			// 尝试重启
			try{
				cardPrinter.reset();
			}catch(e){
				this.cardErrorHandler(true,'无法重启打印机，请联系运维人员',patient);
				return;
			}
		}
    	try{
    		const state  = cardPrinter.checkPrinterStatus();
    		if(state == 0){
    			console.info('当前状态'+state);
	    	}else{
	    		console.info('证卡打印机状态异常');
	    		var msg = cardPrinter.getErrorMsg(state);
	    		this.cardErrorHandler(retry,msg);// 1 状态错误 重新制卡
	    		return;
	    	}
		}catch(e){
			console.info('无法读取打印机状态');
			this.cardErrorHandler(retry,'无法读取打印机状态，请联系运维人员',patient);// 1 状态错误 重新制卡
    		return;
		} 
    	try{
    		cardPrinter.moveToReader();
    		console.info('移动至非接读卡区成功');
		}catch(e){
			console.info('移动至非接读卡区异常');
			this.cardErrorHandler(retry,'卡箱内无卡，请联系管理人员',patient);// 2 移动至非接错误 重新制卡
			return;
		} 
		var medicalCardNo = null;
		try{
    		medicalCardNo  = cardPrinter.readCardNo();
    		console.info('读取卡号成功：'+medicalCardNo);
		}catch(e){
			console.info('读取卡号异常');
			this.cardErrorHandler(retry,'读取卡号异常,请更换自助机',patient);// 3 读卡错误  重新制卡
			return;
		}
		if(!medicalCardNo){
			lightUtil.cardPrinter.turnOff();
			this.cardErrorHandler(retry,'无效卡片,请更换自助机',patient);// 4 卡号错误  重新制卡
			return;
		}
		try{
			cardPrinter.setStandbyParameter();
			console.info('设置基本参数成功');
		}catch(e){
			console.info('设置基本参数异常');
			this.cardErrorHandler(retry,'设置基本参数异常,请更换自助机',patient);// 5 设置参数错误  重新制卡
			return;
		}
		log("办卡-准备绑卡，卡号： ",medicalCardNo);
		let fetch = Ajax.post("/api/ssm/base/operator/card/issue",{...patient,medicalCardNo},{catch: 3600});
		fetch.then(res => {
			log("办卡-绑卡返回： ",res);
			if(res && res.success){
				var baseInfo = res.result||{};
				this.printCard(baseInfo,patient);
				try{
					baseUtil.speak('card_tackMdeicalCard');// 
					lightUtil.cardPrinter.turnOff();
				}catch(e){
					console.info('关灯失败')
				}
				this.setState({showPrintWin:false,printMsg:'打印成功'});
			}else if( res && res.msg ){
				this.cardErrorHandler(retry,res.msg);
	    	}else{
	    		this.cardErrorHandler(retry,'绑定卡异常,请更换自助机',patient);//  6  可能卡号被占用 重新制卡
	    	}
		}).catch((ex) =>{
			this.cardErrorHandler(retry,'绑定卡异常,请更换自助机',patient);//  6  可能卡号被占用 重新制卡
		})
	}
	
	render(){
		const {operators,pageSize,pageNo} = this.state;
		let start = pageSize*(pageNo-1);
	    let limit = pageSize*pageNo;
		console.log('operators长度',operators.length);
		return (
			<NavContainer title='颁发运维卡' onBack={this.onBack} onHome={this.onHome} >	
			<Row>
            <Col span = {6} className = 'list_title' >姓名</Col>
            <Col span = {6} className = 'list_title' >电话</Col>
            <Col span = {6} className = 'list_title' >角色</Col>
            <Col span = {6} className = 'list_title list_center' >操作</Col>
            </Row>
            <Card  radius = {false} className = 'case_rows' >
            {this.renderItems()}
            </Card>
            {
            	operators.length > pageSize ? (
    	        	<Row style = {{padding : '1.5rem'}} >
    		            <Col span = {8}><Button text = "上一页" disabled={start== 0} onClick = {this.prePage} /></Col>
    		            <Col span = {8}>&nbsp;</Col>
    		            <Col span = {8}><Button text = "下一页" disabled={limit >= operators.length } onClick = {this.nextPage} /></Col>
    	            </Row>
                ):null
            }
            <PrintWin msg={this.state.printMsg} visible={this.state.showPrintWin} />
			</NavContainer> 
		)
	}
	renderItems () {
		  const { pageNo,pageSize,operators} = this.state;
		  const hasRecords = (operators && operators.length > 0 );
		  
	      let start = pageSize*(pageNo-1);
	      let limit = pageSize*pageNo;
	      const filteredRecords = operators.slice(start,limit); // 输出：2
		  if( !hasRecords ){
			  let height = document.body.clientHeight - 138;
			  return (
			  	<Row style = {{height: height + 'px', paddingLeft:  '1.5rem'}} >
			    	<Empty info = '暂无记录' />
			   	</Row>
			  );
		  }
		  return filteredRecords.map ( (row, idx) => {
	        const { name,mobile,cardType } = row;
	        console.log('row',row);
	        return (
	          <div key = {'_case_his_items_' + idx} className = 'case_row' >
	            <Row type="flex" align="middle" >
	              <Col span = {6} className = 'list_item' >
	              {name}
	              </Col>
	              <Col span = {6} className = 'list_item' >
	                {mobile}
	              </Col>
	              <Col span = {6} className = 'list_item' >
	              	{cardType}
	              </Col>
	              <Col span = {6} className = 'list_item list_center' >
	                {
	                	<Button text = "发卡" style = {{fontSize: '2.5rem'}} onClick = {() => this.printOperatorCard(row)} />
	                }
	              </Col>
	            </Row>
	          </div>
	        );
	      }
	    );
	  }
}
module.exports = PrtCardMain;