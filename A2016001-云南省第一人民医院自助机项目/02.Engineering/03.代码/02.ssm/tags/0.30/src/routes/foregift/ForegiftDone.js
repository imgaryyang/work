import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';

import InfoComp             from '../../components/Info';

class PaidDone extends React.Component {

  static displayName = 'ForegiftDone';
  static description = '住院预缴完毕';

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
	    type:'foregift/reloadForegiftOrder',
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
    }); //查询预存余额
    this.props.dispatch({
      type: 'inpatient/reloadInpatient',
  	  payload:{param:{patientNo:baseInfo.no}},
      callback:()=>{
	    	this.inpatientLoaded = true;
	    	this.print();
	  }
    }); //查询预缴余额
  }
  componentDidMount() {
  }

  componentWillUnmount () {
	  
  }
  print(){
	if(!this.balanceLoaded || !this.orderLoaded || !this.inpatientLoaded )return;
	this.props.dispatch({
	    type:'foregift/printForegift',
	}); 
  }
  render() {
    let info = '';
    const { order } = this.props.foregift.foregift;
    const { baseInfo } = this.props.patient;
    const { inpatientInfo } = this.props.inpatient;
    console.log('PaidDone render() order : ', order);

    info = (
        <font style = {{lineHeight: '4rem'}} >
          成功预缴&nbsp;<font color = '#BC1E1E' >{order.amt?order.amt.formatMoney():'0'}</font>&nbsp;元<br/>
          <span style = {{fontSize: '2.8rem', lineHeight: '2.8rem'}} >住院预缴余额&nbsp;<font color = '#BC1E1E' >{(inpatientInfo.payment||0).formatMoney()}</font>&nbsp;元</span><br/>
          <span style = {{fontSize: '2.8rem', lineHeight: '2.8rem'}} >门诊预存余额&nbsp;<font color = '#BC1E1E' >{baseInfo.balance?baseInfo.balance.formatMoney():'0'}</font>&nbsp;元</span>
        </font>
    );
    return (
      <InfoComp info = {info} autoBack = {true} />
    );
  }
}

export default connect(({patient,foregift,inpatient}) => ({patient,foregift,inpatient}))(PaidDone);
