import React,{ Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Card, Row, Col} from 'antd';
import WorkSpace from '../../components/WorkSpace';
import Confirm from '../../components/Confirm';
import VerifyAuthCode from '../base/VerifyAuthCode';
import styles from './Step1.css';
/**
 * 手机验证-判断是否有卡-
 * 1- 有卡号 直接绑卡
 * 2- 无卡号 收费办卡 -绑卡
 */
class Step2 extends Component {
  constructor (props) {
    super(props);
    this.next = this.next.bind(this);
    this.onVerfiedMobile = this.onVerfiedMobile.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.createProfile = this.createProfile.bind(this);
    this.goStep = this.goStep.bind(this);
    this.bindMiCard = this.bindMiCard.bind(this);
  }
  
  state ={showConfirm:false}
  
  componentWillReceiveProps(nextProps){
	  const {order:oldOrder} = this.props.deposit.consume;
	  const {order:nowOrder} = nextProps.deposit.consume;
	  if(nowOrder.id && oldOrder.id != nowOrder.id){//消费订单请求完毕
		  const {order:rechargeOrder} = nextProps.deposit.recharge;
		  console.info('社保卡绑定，消费订单请求完毕',nowOrder.id,"充值订单 ： ",rechargeOrder.id);
		  if(rechargeOrder.id){//设置限额
			  console.info("设置限额 ",rechargeOrder.amt);
			  this.props.dispatch({
			      type: 'payment/setState',
			      payload:{order:rechargeOrder,limit:rechargeOrder.amt,},
			      callback:()=>{ this.next();}
			  });
		  }else{
			  this.next(); 
		  }
	  }
  }
  next(){
    if(this.props.onNext)this.props.onNext();
  }
  goStep(n){
	  if(this.props.goStep)this.props.goStep(n);
  }
  createProfile(profile){
    this.props.dispatch({ 
      type: 'patient/createProfile',
      payload:{profile},
      callback:(p)=>{
    	  console.info('社保卡绑定，建档完毕',p.no,'准备绑定');
    	  this.bindMiCard();
      }
    });
  }
  onVerfiedMobile(mobile,verfied){
	if(!verfied)return;
	const {profile,baseInfo} = this.props.patient;
	console.info("手机校验成功，当前档案为 ：",baseInfo);
	if(baseInfo.no ){//卡号已经存在  直接绑定 // && baseInfo.medicalCardNo != baseInfo.no
	  console.info('社保卡绑定，自费档案已经存在  直接绑定',baseInfo.medicalCardNo);
      this.bindMiCard();
	}else {
	  console.info('社保卡绑定，自费档案不存在 需要建档');
	  this.createProfile({...profile,mobile:mobile,telephone:mobile});//建档
	}
  }
  bindMiCard(){
	const {profile,baseInfo} = this.props.patient;
	this.props.dispatch({ 
      type: 'patient/bindMiCard',
      callback:(p)=>{
    	  console.info('社保卡绑定完毕');
    	  if(baseInfo.no && baseInfo.medicalCardNo != baseInfo.no ){//卡号已经存在  直接绑定
    		  console.info('社保卡绑定完毕，卡号已经存在，结束');
    		  this.goStep(4);
    		  return;
    	  }else{
    		  console.info('社保卡绑定完毕，卡号不存在，创建订单 ');
    		  this.createOrder(); 
    	  }
      }
    });  
  }
  createOrder(){
    this.props.dispatch({ //生成消费订单后进入下一步
      type: 'deposit/createCardOrder',
    });  
  }
  render () {
	const { profile } = this.props.patient;
	const { baseInfo } = this.props.patient;
    return (
    	<WorkSpace style = {{paddingTop: '4rem'}} >
	    	<Card bordered = {true} style = {{margin: '2rem', padding: '2rem', fontSize: '2.5rem'}} >
		      <Row><Col span = {6} >姓名 ：{profile.name}</Col><Col span = {12} >身份证号 ：{profile.idNo || profile.sfzh}</Col> <Col span = {6} >{profile.careerName?'职业 : '+profile.careerName:''}</Col></Row>
		    </Card>
    		<VerifyAuthCode onVerfied={this.onVerfiedMobile} type='REG' mobile={baseInfo.mobile || baseInfo.telephone}/>
    	</WorkSpace>
    );	
  }
}  

export default  connect(({patient,deposit}) => ({patient,deposit}))(Step2);