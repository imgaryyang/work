import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';

import InfoComp             from '../../components/Info';

class PaidDone extends React.Component {

  /**
  * 初始化状态
  */
  state = {
  };

  constructor(props) {
    super(props);
    this.print = this.print.bind(this);
  }
  
  componentWillMount() {
    const { baseInfo } = this.props.patient;
    this.props.dispatch({
	    type:'deposit/reloadRechargeOrder',
	    callback:()=>{
	    	this.orderLoaded = true;
	    	this.print();
	    }
	});
    this.props.dispatch({
      type:'patient/reloadPatientInfo',
      payload:{ patient : baseInfo },
      callback:()=>{
	    	this.balanceLoaded = true;
	    	this.print();
	  }
    }); //查询余额
  }
  componentWillUnmount () {
	 
  }
  print(){
	if(!this.balanceLoaded || !this.orderLoaded )return;
	this.props.dispatch({
	    type:'deposit/printConsume',
	}); 
  }
  render() {
    let info = '';
    const { order } = this.props.deposit.consume;
    const { baseInfo } = this.props.patient;
    console.log('PaidDone render() order : ', order);

    info = (
        <font style = {{lineHeight: '4rem'}} >
          成功缴费&nbsp;<font color = '#BC1E1E' >{order.selfAmt?order.selfAmt.formatMoney():'0'}</font>&nbsp;元<br/>
          <span style = {{fontSize: '2.8rem', lineHeight: '2.8rem'}} >当前账户余额&nbsp;<font color = '#BC1E1E' >{baseInfo.balance?baseInfo.balance.formatMoney():'0'}</font>&nbsp;元</span>
        </font> 
    );
    return (
      <InfoComp info = {info} autoBack = {true} />
    );
  }
}

export default connect(({patient,deposit}) => ({patient,deposit}))(PaidDone);
