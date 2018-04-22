import React, { PropTypes } from 'react';
import NavContainer from '../../components/NavContainer.jsx';
import InfoComp from '../../components/Info.jsx';
import printUtil from '../../utils/printUtil.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import TimerPage from '../../TimerPage.jsx';
class PaidDone extends TimerPage {
  constructor(props) {
    super(props);
    this.onBack = this.bind(this.onBack,this);
    this.onHome = this.bind(this.onHome,this);
    this.print = this.bind(this.print,this);
  }
  componentWillMount () {
	this.print();
  }
  onBack(){
	 baseUtil.goHome('refundDoneBack'); 
  }
  onHome(){
	 baseUtil.goHome('refundDoneHome'); 
  }
  print(){
	var patient = baseUtil.getCurrentPatient();
	var machine = baseUtil.getMachineInfo();
	const { order,settlement } = this.props;
	try{
		printUtil.printRefundReceipt(settlement,order,patient,machine);
	}catch(e){
		console.info(e);
		baseUtil.error("打印机异常，打印退款凭证失败"); 
	}
  }
  render() {
    let info = '';
    const { order } = this.props;
    var patient = baseUtil.getCurrentPatient();
    var tip="";
    if(order.status == '5'){
    	tip="由于退款有一定周期，请密切关注您的就诊卡账户余额"
    }
    info = (
        <font style = {{lineHeight: '4rem'}} >
          成功退款&nbsp;<font color = '#BC1E1E' >{order.amt?order.amt.formatMoney():'0'}</font>&nbsp;元<br/>
          <span style = {{fontSize: '2.8rem', lineHeight: '2.8rem'}} >当前就诊卡账户余额&nbsp;<font color = '#BC1E1E' >{patient.balance?patient.balance.formatMoney():'0'}</font>&nbsp;元</span>
          <br/>
          <span style = {{fontSize: '2.8rem', lineHeight: '2.8rem'}} >{tip} </span>
        </font>
    );
    return (
    	<NavContainer title='退款成功' onBack={this.onBack} onHome={this.onHome} >
	      <InfoComp info = {info} autoBack = {true} />
	    </NavContainer >
    );
  }
}
module.exports = PaidDone;