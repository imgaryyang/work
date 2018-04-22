import React,{ Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import WorkSpace from '../../components/WorkSpace';
import Steps from '../../components/Steps';
import Card  from '../../components/Card';
import config from '../../config';
import PrepaidOrder  from './PrepaidOrder';
import PrepaidDone  from './PrepaidDone';
import Recharge from '../cashierDesk/DepositRecharge';
//import VerifyAuthCode from '../base/VerifyAuthCode';
import Confirm from '../../components/Confirm';
import RealNameCheck from './RealNameCheck';
import baseUtil from '../../utils/baseUtil';

class PrepaidMain extends Component {
	
  constructor (props) {
    super(props);
    this.afterRealCheck = this.afterRealCheck.bind(this);
    this.preStep = this.preStep.bind(this);
    this.afterRecharge = this.afterRecharge.bind(this);
    this.selectPayChannel = this.selectPayChannel.bind(this);
    this.createCashOrder  = this.createCashOrder.bind(this);
    this.goHome = this.goHome.bind(this);
    this.setLimit = this.setLimit.bind(this);
  }
  
  state = { paydone : false ,realChecked:true};
  
  channels = {'unionpay':'银行卡预存','9999':'支付宝预存','9998':'微信预存','0000':'现金预存',}
  
  componentWillMount () {//初始化，接管nav的返回按钮
	  const { baseInfo } = this.props.patient;
	  if(!baseInfo.no)return;
	  
	  const { nav } = this.props.frame;
	  const { channel } = this.props.params;
	  
	  let title= this.channels[channel] || "预存充值";
	  const newNav = { ...nav,onBack:this.preStep,onHome:this.goHome,title:title};
	  
	  this.props.dispatch({//接管返回按钮
		  type:'frame/setState',
		  payload:{nav:newNav},
	  });
  }
  componentDidMount(){
	  console.info('componentDidMount');
	  const { baseInfo } = this.props.patient;
	  if(!baseInfo.no)return;
	  console.info('componentDidMount1');
	  const { ktfs,balance } = baseInfo;
	  var isRealName = (ktfs == '1' || ktfs == '2');//预存开通方式 0：未任何身份验证 1：身份证2：短信    
	  var total = isRealName?config.prepaid.limit:config.prepaid.limit_unReal;
	  console.info(total,balance,total > balance);
	  if(total > balance){
		  var limit = (total*10000-balance*10000)/10000;
		  setTimeout(()=>{
			this.setLimit(limit);
		  },200)
	  }
  }
  setLimit(limit){
      this.props.dispatch({
        type: 'payment/setState',
        payload:{ limit:limit,},
	    callback:()=>{
		  console.info("限额设置完毕 ");
		  const { channel } = this.props.params;
	      if(channel == '0000')this.createCashOrder();
	    }
	  });
  }
  componentWillReceiveProps(nextProps){
	  const { order:old } = this.props.deposit.recharge;
	  const { order:now } = nextProps.deposit.recharge;
	  if(now.id != old.id){//订单已经生成
		 console.info("充值订单已完成 ",now);
		 const { channel } = this.props.params;
		 this.selectPayChannel(channel,now);
	  }
  }
  goHome(){
	  const { paydone } = this.state;
	  if(paydone){
		  this.props.dispatch( routerRedux.push('/homepage'));
		  return;
	  }
	  const { recharge } = this.props.deposit;
	  const { order } = recharge;
	  if( order && order.id){
		  const { channel } = this.props.params;
		  if("0000" == channel){
			  if(! baseUtil.isTodayCanCash()){
				  this.props.dispatch( routerRedux.push('/homepage'));
				  return;
			  }
			  baseUtil.notice('请点击确定完成您的充值'); 
			  if(! baseUtil.isTodayCanCash()){console.info('cash closed ');
			  return;
		  }
			  return;//现金不允许返回
		  }
	  }
	  this.props.dispatch( routerRedux.push('/homepage'));
  }
  preStep(){//步骤条+页面切换
	  const { paydone } = this.state;
	  if(paydone){
		  this.props.dispatch( routerRedux.push('/homepage'));
		  return;
	  }
	  const { recharge } = this.props.deposit;
	  const { order } = recharge;
	  if( order && order.id){
		  const { channel } = this.props.params;
		  if("0000" == channel){
			  baseUtil.notice('请点击确定完成您的充值'); 
			  return;//现金不允许返回
		  }else{
			  this.props.dispatch({//订单存在，清空订单信息，页面返回充值金额
			      type: 'deposit/reset',
			  }); 
		  }
		  return;
	  }
//	  if(this.state.realChecked){
//		  const { baseInfo } = this.props.patient;
//		  const { mobile,telephone,idNo,no } = baseInfo;
//		  if((mobile ||telephone ) && idNo ){
//			  this.props.dispatch( routerRedux.push('/homepage'));
//		  }else{
//			  this.setState({realChecked:false});
//		  }
//		  return;
//	  }
	  this.props.dispatch( routerRedux.push('/homepage'));
  }
  afterRealCheck(){
    console.info("实名验证完成");
    this.setState({realChecked:true},()=>{
    	const { channel } = this.props.params;
        if(channel == '0000')this.createCashOrder();
    })
  }
  createCashOrder(){
	//现金不经过输入直接生成订单；
	const { order } = this.props.deposit.recharge;
	const {deposit, patient} 		= this.props;
	const {baseInfo}				= patient;
	if((!order || !order.id) && baseInfo.no){
		const order = {
			amt: 0,
			patientNo:baseInfo.no,// 病人姓名
			patientName:baseInfo.name,// 病人姓名
			patientIdNo:baseInfo.idNo,// 病人身份证号
			patientCardNo:baseInfo.medicalCardNo,// 病人卡号
			patientCardType:baseInfo.cardType,// 就诊卡类型 TODO 就诊卡
		};
		console.info('直接生成现金订单：',order);
		this.props.dispatch({
			type: 'deposit/createRechargeOrder',
			payload: {order : order,},
		});
	}
	return;// 现金预支付在现金页面中单独处理
  }
  selectPayChannel(channel,order){
	  var payload;
	  console.info("选择支付渠道 ",channel);
	  if('0000' == channel){
		  payload = {order:order,payChannel:"0000", payType:'cash'}
	  }else if('unionpay' == channel){
		  var { machine } = this.props.frame;
		  payload = {order:order,payChannel:machine.mngCode, payType:'ssm'}; 
	  }else if('9998' == channel || '9999' == channel){
		  payload = {order:order,payChannel:channel, payType:'scan'}; 
	  }
	  this.props.dispatch({//确认结算方式
		  type:'payment/setState',
		  payload:payload
	  });
  }
  
  afterRecharge(){
	  this.setState({paydone:true})
  }
  
  
  render () {
	const { channel } = this.props.params;
	const { baseInfo } = this.props.patient;
	const { mobile,telephone,idNo,no,ktfs,balance } = baseInfo;
	const { order } = this.props.deposit.recharge;
	const { paydone,realChecked } = this.state;
	var phone = telephone ||mobile;
	
	var isRealName = (ktfs == '1' || ktfs == '2');//预存开通方式 0：未任何身份验证 1：身份证2：短信    
	 
    const needVerfy = no && !realChecked;
    const createOrder = !needVerfy && !order.id && channel !='0000' ;//有订单或者现金渠道不需要生成订单
    const showCashDesk = !paydone && !createOrder && !needVerfy ;//订单生成完毕并且未支付完毕，显示收银台
    
    const height = config.getWS().height - 11 * config.remSize+ 'px';
    
    return (
      <WorkSpace style = {{paddingTop: '4rem'}} >
      {
    	  needVerfy ? <RealNameCheck afterRealCheck={this.afterRealCheck} canSkip={true} mobile={phone}/> :null
      }
      {
    	  createOrder ? <PrepaidOrder />:null
      }
      {
    	  showCashDesk ? <Recharge afterPay={this.afterRecharge} />	:null
      }
      {
    	   paydone ? <PrepaidDone /> : null
      }
      
      {
	    	isRealName?(
	    		<Confirm
			    	info = {'预存金额已超过限额'+(config.prepaid.limit.formatMoney())+'元'} 
			    	visible = {balance>=config.prepaid.limit} 
				    buttons = {[
				     {text: '确定', onClick: () =>{ this.props.dispatch(routerRedux.push('/homepage'));}}
				    ]}
				   />
	    	):(<Confirm
	    			info = {'预存金额已超过限额'+(config.prepaid.limit_unReal.formatMoney())+'元'} 
			    	visible = {balance>=config.prepaid.limit_unReal} 
				    buttons = {[
				     {text: '确定', onClick: () =>{ this.props.dispatch(routerRedux.push('/homepage'));}}
				    ]}
				   />
	    	)
	    }
      </WorkSpace>
    );	
  }
}  

export default  connect(({deposit,patient,payment,frame}) => ({deposit,patient,payment,frame}))(PrepaidMain);
