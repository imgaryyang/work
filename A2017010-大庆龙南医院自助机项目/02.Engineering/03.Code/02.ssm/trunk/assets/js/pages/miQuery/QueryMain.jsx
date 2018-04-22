"use strict";

import { Component, PropTypes } from 'react';
import Confirm from '../../components/Confirm.jsx';
import PrintWin from '../../components/PrintWin.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import ReadMiCard from './ReadMiCard.jsx';
import QueryDone from './QueryDone.jsx';
import SelectMiType from './SelectMiType.jsx';

import polyfill from 'babel-polyfill';
import socket from '../../utils/socket.jsx';
import TimerModule from '../../TimerModule.jsx';
/**
 * 医保建档流程
 * 读取社保卡信息，构建查询条件
 * 根据查询条件查询档案信息（查询医保档关联自费档）
 * 如果有档无卡
 * 如果无档案，选择职业，建档
 * 如果有档案有卡 ，提示已经办理过
 * 
 */
class Page extends TimerModule {
	constructor (props) {
		super(props);
		const { miCardType } = props.params||{};
		this.afterMiCardRead = this.bind(this.afterMiCardRead,this);
		this.onSelectMiType = this.bind(this.onSelectMiType,this);
		this.state = {
		  step:1,
		  type:'',
		  cardInfo:{},
		}
	}
	onSelectMiType(type){console.info('onSelectMiType ',type);
		var patient = baseUtil.getCurrentPatient();
		const medicalCardNo = patient.medicalCardNo;
		if((medicalCardNo.substring(0,3) == '01^') && type =='02'){//01油田医保（管局）
			baseUtil.error("您是管局医保，无法查询市政医保信息");
			return;
	    }
	    else if((medicalCardNo.substring(0,3) == '02^') && type == '01'){//02市政医保
	    	baseUtil.error("您是市政医保，无法查询管局医保信息");
	    	return;
	    }
	    else if((medicalCardNo.substring(0,3) != '01^') && (medicalCardNo.substring(0,3) != '02^')){
	    	baseUtil.error("您是自费患者");
	    	return;
	    }
		this.setState({type,step:2});
	}
	afterMiCardRead(cardInfo){
		if(cardInfo == 'undefined' || cardInfo == null){
			return;
		}
		else{
			this.setState({cardInfo,step:3});
		}
		/*this.setState({cardInfo,step:3});*/
	}
	render () { 
		const { step,cardInfo,type} = this.state;
		return (
		  <div>
		  {
		  	step == 1?(
		  	  <SelectMiType onSelect={this.onSelectMiType}/> 
		  	):null	
		  }
		  {
		  	step == 2?(
		  	  <ReadMiCard miCardType ={type} afterMiCardRead={this.afterMiCardRead}/> 
		  	):null	
		  }
		  {
		  	step == 3?(
		  	  <QueryDone cardInfo={cardInfo}/>	
		  	):null	
		  }
		  </div>
	    );
	}
}

module.exports = Page;