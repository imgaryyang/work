import React, { PropTypes } from 'react';
import baseUtil from '../../utils/baseUtil.jsx';
import printUtil from '../../utils/printUtil.jsx';
import InfoComp from '../../components/Info.jsx';
import NavContainer from '../../components/NavContainer.jsx';
class PaidDone extends React.Component {

  constructor(props) {
    super(props);
    this.print = this.print.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onHome = this.onHome.bind(this);
  }
  componentWillMount() {
	   this.print();
  }
  print(){
	const { settlement,order } = this.props;
	const baseInfo = baseUtil.getCurrentPatient();
	const machine = baseUtil.getMachineInfo();
	try{
		printUtil.printRechargeReceipt(order,baseInfo,machine,settlement.payChannelCode);
	}catch(e){
		baseUtil.error("打印机异常，打印充值凭证失败"); 
	}
  }
  onBack(){
	baseUtil.goHome('prepaidDoneBack');  
  }
  onHome(){
	baseUtil.goHome('prepaidDoneHome');  
  }
  render() {
    let info = '';
    const { settlement,order  } = this.props;
    const baseInfo = baseUtil.getCurrentPatient();
    info = (
        <font style = {{lineHeight: '4rem'}} >
          成功预存&nbsp;<font color = '#BC1E1E' >{order.realAmt?order.realAmt.formatMoney():'0'}</font>&nbsp;元<br/>
          <span style = {{fontSize: '2.8rem', lineHeight: '2.8rem'}} >当前账户余额&nbsp;<font color = '#BC1E1E' >{baseInfo.balance?baseInfo.balance.formatMoney():'0'}</font>&nbsp;元</span>
        </font>
    );
    return (
      <NavContainer title='充值成功' onBack={this.onBack} onHome={this.onHome} >
        <InfoComp info = {info} autoBack = {true} />
      </NavContainer>
    );
  }
}
module.exports = PaidDone;