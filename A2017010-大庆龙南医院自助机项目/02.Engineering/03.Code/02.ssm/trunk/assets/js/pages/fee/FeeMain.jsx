"use strict";

import { Component, PropTypes } from 'react';
import Confirm from '../../components/Confirm.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{log} from '../../utils/logUtil.jsx';
import NeedPay from './NeedPay.jsx';
import PaymentConfirm from './PaymentConfirm.jsx';
import ReadMiCard from './ReadMiCard.jsx';
import PayDone from './PayDone.jsx';
import PayFee from './PayFee.jsx';
import TimerModule from '../../TimerModule.jsx';
/**
 */
class Page extends TimerModule {
	constructor (props) {
		super(props);
		this.afterMiCardRead = this.bind(this.afterMiCardRead,this);
		this.afterConfirm = this.bind(this.afterConfirm,this);
		this.cancelConfirm = this.bind(this.cancelConfirm,this);
		this.afterConsume = this.bind(this.afterConsume,this);
		this.cancelConsume = this.bind(this.cancelConsume,this);
		this.afterPreCreate = this.bind(this.afterPreCreate,this);
		this.loadGuides = this.bind(this.loadGuides,this);
		var patient = baseUtil.getCurrentPatient();
		var step = 2;
		var flag = patient.unitCode.substring(0,2) ;
		if(flag == 'YB' || flag == 'NB'){
			step = 1;
		} 
		this.state = {
			step:step,
			miInfo:{password:''},
			consume:{},
			recharge:{},
			fees:[],
			actives:[],
			clinicals:[],
		}
	}
	afterMiCardRead(miInfo){
		log('缴费-医保卡读取完毕 ',miInfo);
		this.setState({step:2,miInfo});//请求代缴费列表
	}
	afterPreCreate(order,fees,actives ){
		this.setState({consume:order,fees,actives,step:3});//包含fees
	}
	afterConfirm(consume,recharge){
		this.setState({consume,recharge,step:4});
	}
	cancelConfirm(){
		this.setState({consume:{},fees:[],step:2});
	}
	afterConsume(consume,recMsg){
		this.setState({consume},()=>{
			baseUtil.reloadPatient((patient)=>{
				this.loadGuides(recMsg);
			});
		});
	}
	loadGuides(recMsg){
		//this.setState({clinicals:[],step:5});//暂不加载就医指南
		const { jyid_items } = recMsg;
		var tradeIds = [];
		for(var jyids of jyid_items){
			tradeIds.push(jyids.jyid);
		}
		log("缴费-就医指南查询 ",tradeIds);
		var clinicals = [];
		if(tradeIds && tradeIds.length >0){
			let fetch = Ajax.get("/api/ssm/treat/guide/tradeContents",tradeIds,{catch: 3600});
			fetch.then(res => {
				log("缴费-就医指南返回成功 ",res);
				if(res && res.success){
					clinicals = res.result||[];
				}else{
					log("缴费-就医指南查询失败： ",res);
				}
				this.setState({clinicals,step:5});
			}).catch((ex) =>{
				log("缴费-就医指南异常： ",ex);
				this.setState({clinicals,step:5});
			})
		}
//		const actives = this.state.actives;
//		log("缴费-就医指南查询 ",actives);
//		var clinicals = [];
//		if(actives && actives.length >0){
//			let fetch = Ajax.get("/api/ssm/treat/guide/contents",actives,{catch: 3600});
//			fetch.then(res => {
//				log("缴费-就医指南返回成功 ",res);
//				if(res && res.success){
//					clinicals = res.result||[];
//				}else{
//					log("缴费-就医指南查询失败： ",res);
//				}
//				this.setState({clinicals,step:4});
//			}).catch((ex) =>{
//				log("缴费-就医指南异常： ",ex);
//				this.setState({clinicals,step:4});
//			})
//		}
	}
	cancelConsume(){
		this.setState({recharge:{},step:2});//包含fees
	}
	render () { 
		const patient = baseUtil.getCurrentPatient();
		if(!patient.no)return null;
		
		const { step,type } = this.state;
		return (
		  <div>
		  {
		  	step == 1?(
		  	  <ReadMiCard afterMiCardRead = {this.afterMiCardRead} />
		  	):null	
		  }
		  {
		  	step == 2?(
		  	  <NeedPay miInfo={this.state.miInfo} afterPreCreate = {this.afterPreCreate} />
		  	):null	
		  }
		  {
		  	step == 3?(
		  	  <PaymentConfirm 
		  	  	order = { this.state.consume }
		  	  	onCancel = {this.cancelConfirm}
		  	  	afterConfirm= {this.afterConfirm}/>
		  	):null	
		  }
		  {
			step == 4?(
			 <PayFee 
			 	order={this.state.consume}
			 	patient={patient}
			 	cancelPay = {this.cancelConsume}
			 	afterPay={this.afterConsume} />
		  	):null	
		  }
		  {
		  	step == 5?(
		  	  <PayDone 
		  	  	order = { this.state.consume }
		  	  	fees= {this.state.fees}
		  	  	clinicals = {this.state.clinicals}/>
		  	):null	
		  }
		  </div>
	    );
	}
}
module.exports = Page;