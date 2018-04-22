import React,{ Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import WorkSpace from '../../components/WorkSpace';
import Consume from '../cashierDesk/DepositConsume';
import Recharge from '../cashierDesk/DepositRecharge';
import PrintWin from '../../components/PrintWin';
class Step3 extends Component {
  constructor (props) {
    super(props);
    this.next = this.next.bind(this);
    this.afterRecharge = this.afterRecharge.bind(this);
    this.afterConsume = this.afterConsume.bind(this);
    this.reIssueCard = this.reIssueCard.bind(this);
  }
  state ={ showPrintWin : false,printerMsg : '正在制卡，请勿离开'}
  componentWillMount() {
  }
  componentWillReceiveProps(nextProps){
	  const { medicalCardNo:oldCard } = this.props.patient.baseInfo;
	  const { medicalCardNo:newCard } = nextProps.patient.baseInfo;
	  if(newCard && oldCard != newCard){//办卡成功
		  console.info("办卡成功,进入下一步");
		  this.next();
	  }
	  const { order:oldOrder } = this.props.deposit.consume;
	  const { order:newOrder} = nextProps.deposit.consume;
	  
	  if(oldOrder.status != newOrder.status ){//消费订单变化
		 if(newOrder.status == '0' ){
			 console.info('社保卡绑定，消费完毕');
			 this.afterConsume();//消费完毕
		 } 
	  }
  }
  afterRecharge(){
	  console.info('社保卡绑定，充值结束，调用消费接口');
	  const { baseInfo } = this.props.patient;
	  const { order } = this.props.deposit.consume;
	  this.props.dispatch({
	      type: 'deposit/consume',
	      payload:{order,patient:baseInfo}
	  }); 
  }
  afterConsume(){//绑卡
	  console.info('社保卡绑定，扣款结束，调用发就诊卡接口');
	  const { baseInfo } = this.props.patient;
//	  this.props.dispatch({
//	      type:'patient/loadPatientInfo',
//	      payload:{ patient : baseInfo },
//	  }); //查询余额
	  this.setState({showPrintWin:true,printerMsg : '正在制卡，请勿离开'},()=>{
		  this.props.dispatch({
		      type: 'patient/issueCard',
		      payload:{patient:baseInfo},
		      callback:(success,retry)=>{
		    	  if(success){
		    		  this.setState({showPrintWin:false});
			    	  this.next(); 
		    	  }else if(retry){
		    		  this.reIssueCard();//第一次不成功，重新制卡
		    	  }else{
		    		  this.setState({showPrintWin:false});
		    	  }
		      }
		  });  
	  });
  }
  reIssueCard(){
	  const { baseInfo } = this.props.patient;
	  this.setState({showPrintWin:true,printerMsg : '尝试重新制卡，请耐心等待'},()=>{
		  this.props.dispatch({
		      type: 'patient/reIssueCard',
		      payload:{patient:baseInfo},
		      callback:(success)=>{
		    	  this.setState({showPrintWin:false});
		    	  if(success)this.next();
		      }
		  });  
	  });  
  }
  next(){
	    if(this.props.onNext)this.props.onNext();
  }
  render () {
    const { baseInfo } = this.props.patient;
    const { order } = this.props.deposit.consume;
    const needRecharge = baseInfo.balance < order.amt;
    return (
      <WorkSpace style = {{paddingTop: '4rem'}} >
      { 
    	  needRecharge?<Recharge afterPay={this.afterRecharge} />	:<Consume />	  
      }
      <PrintWin visible = {this.state.showPrintWin} msg={this.state.printerMsg } /> 
      </WorkSpace>
    );	
  }
}  

export default  connect(({patient,deposit}) => ({patient,deposit}))(Step3);