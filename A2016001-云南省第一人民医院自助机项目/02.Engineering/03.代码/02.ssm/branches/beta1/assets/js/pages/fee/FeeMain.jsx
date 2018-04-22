"use strict";

import { Component, PropTypes } from 'react';
import Confirm from '../../components/Confirm.jsx';
import baseUtil from '../../utils/baseUtil.jsx';

import NeedPay from './NeedPay.jsx';
import PaymentConfirm from './PaymentConfirm.jsx';
import PayDone from './PayDone.jsx';
import PayFee from './PayFee.jsx';
/**
 */
class Page extends Component {
	constructor (props) {
		super(props);
		this.afterConfirm = this.afterConfirm.bind(this);
		this.cancelConfirm = this.cancelConfirm.bind(this);
		this.afterConsume = this.afterConsume.bind(this);
		this.cancelConsume = this.cancelConsume.bind(this);
		this.afterPreCreate = this.afterPreCreate.bind(this);
		this.state = {
			step:1,
			consume:{},
			recharge:{},
			fees:[],
		}
	}
	go(step){
		this.setState({step});
	}
	afterPreCreate(order,fees ){
		this.setState({consume:order,fees,step:2});//包含fees
	}
	afterConfirm(consume,recharge){
		this.setState({consume,recharge,step:3});
	}
	cancelConfirm(){
		this.setState({consume:{},fees:[],step:1});
	}
	afterConsume(consume){
		this.setState({consume,step:4});
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
		  	  <NeedPay afterPreCreate = {this.afterPreCreate} />
		  	):null	
		  }
		  {
		  	step == 2?(
		  	  <PaymentConfirm 
		  	  	order = { this.state.consume }
		  	  	onCancel = {this.cancelConfirm}
		  	  	afterConfirm= {this.afterConfirm}/>
		  	):null	
		  }
		  {
			step == 3?(
			 <PayFee 
			 	order={this.state.consume}
			 	patient={patient}
			 	cancelPay = {this.cancelConsume}
			 	afterPay={this.afterConsume} />
		  	):null	
		  }
		  {
		  	step == 4?(
		  	  <PayDone order = { this.state.consume } fees= {this.state.fees}/>
		  	):null	
		  }
		  </div>
	    );
	}
}
module.exports = Page;