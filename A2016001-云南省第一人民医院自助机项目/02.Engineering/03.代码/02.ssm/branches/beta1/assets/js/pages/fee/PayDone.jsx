import React, { PropTypes } from 'react';
import InfoComp from '../../components/Info.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import printUtil from '../../utils/printUtil.jsx';
import NavContainer from '../../components/NavContainer.jsx';
class PaidDone extends React.Component {

  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onHome = this.onHome.bind(this);
    this.print = this.print.bind(this);
  }
  componentWillMount () {
	this.print();
  }
  print(){
	var machine = baseUtil.getMachineInfo();
	var patient = baseUtil.getCurrentPatient();
	var  { order,fees  } = this.props;
	try{
		printUtil.printConsumeReceipt(fees,order,patient,machine);
	}catch(e){
		baseUtil.error("打印机异常，打印扣款凭证失败"); 
	} 
  }
  onBack(){
	 baseUtil.goHome('feeDoneBack'); 
  }
  onHome(){
	 baseUtil.goHome('feeDoneHome'); 
  }
  render() {
    let info = '';
    const { order } = this.props;
    const baseInfo =  baseUtil.getCurrentPatient();
    info = (
        <font style = {{lineHeight: '4rem'}} >
          成功缴费&nbsp;<font color = '#BC1E1E' >{order.selfAmt?order.selfAmt.formatMoney():'0'}</font>&nbsp;元<br/>
          <span style = {{fontSize: '2.8rem', lineHeight: '2.8rem'}} >当前账户余额&nbsp;<font color = '#BC1E1E' >{baseInfo.balance?baseInfo.balance.formatMoney():'0'}</font>&nbsp;元</span>
        </font> 
    );
    return (
    <NavContainer title='缴费成功' onBack={this.onBack} onHome={this.onHome} >
      <InfoComp info = {info} autoBack = {true} />
      </NavContainer >
    );
  }
}
module.exports = PaidDone;