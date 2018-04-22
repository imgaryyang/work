import React, { PropTypes } from 'react';
import baseUtil from '../../utils/baseUtil.jsx';
import printUtil from '../../utils/printUtil.jsx';
import InfoComp from '../../components/Info.jsx';
import NavContainer from '../../components/NavContainer.jsx';
class ForegiftDone extends React.Component {

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
	const { settlement,order,inpatientInfo } = this.props;
	const baseInfo = baseUtil.getCurrentPatient();
	const machine = baseUtil.getMachineInfo();
	try{
		printUtil.printForegift(order,baseInfo,inpatientInfo,machine,settlement.payChannelCode);
	}catch(e){
		console.info(e);
		baseUtil.error("打印机异常，打印充值凭证失败"); 
	}
  }
  onBack(){
	baseUtil.goHome('preForegiftDoneBack');  
  }
  onHome(){
	baseUtil.goHome('preForegiftDoneHome');  
  }
  render() {
    let info = '';
    const { settlement,order,inpatientInfo } = this.props;
    const baseInfo = baseUtil.getCurrentPatient();
    info = (
	  <font style = {{lineHeight: '4rem'}} >
         成功预缴&nbsp;<font color = '#BC1E1E' >{order.amt?order.amt.formatMoney():'0'}</font>&nbsp;元<br/>
         <span style = {{fontSize: '2.8rem', lineHeight: '2.8rem'}} >住院预缴余额&nbsp;<font color = '#BC1E1E' >{(inpatientInfo.payment||0).formatMoney()}</font>&nbsp;元</span><br/>
         <span style = {{fontSize: '2.8rem', lineHeight: '2.8rem'}} >门诊预存余额&nbsp;<font color = '#BC1E1E' >{baseInfo.balance?baseInfo.balance.formatMoney():'0'}</font>&nbsp;元</span>
       </font>
    );
    return (
      <NavContainer title='充值成功' onBack={this.onBack} onHome={this.onHome} >
        <InfoComp info = {info} autoBack = {true} />
      </NavContainer>
    );
  }
}
module.exports = ForegiftDone;