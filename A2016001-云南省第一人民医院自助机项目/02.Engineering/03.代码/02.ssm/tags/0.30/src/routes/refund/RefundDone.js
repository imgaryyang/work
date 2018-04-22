import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';

import InfoComp             from '../../components/Info';

class PaidDone extends React.Component {

  static displayName = 'PrePaidDone';
  static description = '预存完毕';

  static propTypes = {
  };

  static defaultProps = {
  };

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
	const { order,settlement } = this.props.refund;
    const { baseInfo } = this.props.patient;
	this.props.dispatch({
	    type:'refund/printRefund',
	    payload:{ 
	    	baseInfo : baseInfo,
	    	order : order,
	    	settlement:settlement
	    }
	}); 
  }
  render() {
    let info = '';
    const { order } = this.props.refund;
    const { baseInfo } = this.props.patient;
    console.log('PaidDone render() order : ', order);
    var tip="";
    if(order.status == '5'){
    	tip="由于退款有一定周期，请密切关注您的账户余额"
    }
    info = (
        <font style = {{lineHeight: '4rem'}} >
          成功退款&nbsp;<font color = '#BC1E1E' >{order.amt?order.amt.formatMoney():'0'}</font>&nbsp;元<br/>
          <span style = {{fontSize: '2.8rem', lineHeight: '2.8rem'}} >当前账户余额&nbsp;<font color = '#BC1E1E' >{baseInfo.balance?baseInfo.balance.formatMoney():'0'}</font>&nbsp;元</span>
          <br/>
          <span style = {{fontSize: '2.8rem', lineHeight: '2.8rem'}} >{tip} </span>
        </font>
    );
    return (
      <InfoComp info = {info} autoBack = {true} />
    );
  }
}

export default connect(({patient,refund}) => ({patient,refund}))(PaidDone);
