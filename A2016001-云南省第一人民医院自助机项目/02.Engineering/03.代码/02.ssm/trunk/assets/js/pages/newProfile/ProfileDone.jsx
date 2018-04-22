"use strict";

import { Component, PropTypes } from 'react';
import baseUtil from '../../utils/baseUtil.jsx';
 import printUtil from '../../utils/printUtil.jsx';
import { Row, Col,  Modal, Icon }    from 'antd';
import NavContainer from '../../components/NavContainer.jsx';
import Steps from '../../components/Steps.jsx';
import Card from '../../components/Card.jsx';
import BackTimer from '../../components/BackTimer.jsx';
import styls from './ProfileDone.css';
class Page extends Component {
	constructor (props) {
		super(props);
		this.onBack = this.onBack.bind(this);
		this.onHome = this.onHome.bind(this);
		this.state = {
			steps : ['读取医保卡', '校验手机号', '收费','发卡'],
		}
	}
	componentWillMount () {
		const { type,profile,consumeOrder,rechargeOrder} = this.props;
		var machine = baseUtil.getMachineInfo();
		if(consumeOrder)console.info("扣费金额  ： ", consumeOrder.realAmt);
		if(rechargeOrder)console.info("充值金额  ： ", rechargeOrder.realAmt);
		console.info("账户余额  ： ", profile.balance);
//		//打印办卡凭条
		if(!consumeOrder)return;//没扣钱，没办卡，不打印凭条
		try{
			if(type == 'reissue'){
				console.info("打印补卡凭条");
				printUtil.printMakeUpCardFees(rechargeOrder,consumeOrder,profile,machine);
			}else{
				console.info("打印办卡凭条");
				printUtil.printDoCardFees(rechargeOrder,consumeOrder,profile,machine);
			}
		}catch(e){
			console.info(e);
			baseUtil.error("打印机异常，打印办卡凭证失败"); 
		}
	}
	onBack(){
		 baseUtil.goHome('miDoneBack'); 
	}
	onHome(){
		 baseUtil.goHome('miDoneHome'); 
	}
	render () { 
		var  width = document.body.clientWidth - 48;
		var  careerWidth = width - 36;
		var  modalWinTop  = 13;
		const { type,profile,consumeOrder,rechargeOrder} = this.props;
		return (
		  <NavContainer title='发卡' onBack={this.onBack} onHome={this.onHome} >
		      <Steps steps = {this.state.steps} current = {4} />
			 {
		    	  consumeOrder?(
		    			  <div className = 'card_done_guideTextContainer' >
					        <font className = 'card_done_guideText' >请取卡</font><br/>
					        <font style = {{fontSize: '3rem'}} >请在就诊卡发卡口领取您的就诊卡并妥善保管</font>
					      </div>  
				  ):(
						  <div className = 'card_done_guideTextContainer' >
					        <font className = 'card_done_guideText' >绑卡成功</font><br/>
					        <font style = {{fontSize: '3rem'}} >您的医保卡已经绑定成功，您可以使用之前的就诊卡进行医保结算</font>
					      </div>  	  
				  )
			 } 
		      
		      <BackTimer style = {{marginTop: '2rem'}} />
		      <div style = {{height: '30rem', width: '25rem', margin: '3rem auto'}} >
		        <img alt = "请在就诊卡发卡口领取您的就诊卡并妥善保管" src = './images/guide/med-card-issue.gif' className = 'card_done_guidePic' />
		      </div>
		  </NavContainer>
	    );
	}
}

module.exports = Page;