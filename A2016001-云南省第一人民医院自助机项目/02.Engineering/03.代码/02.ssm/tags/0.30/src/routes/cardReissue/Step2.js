import React,{ Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Card, Row, Col} from 'antd';
import WorkSpace from '../../components/WorkSpace';
import Confirm from '../../components/Confirm';
import VerifyAuthCode from '../base/VerifyAuthCode';
import styles from './Step1.css';
class Step2 extends Component {
  constructor (props) {
    super(props);
    this.next = this.next.bind(this);
    this.onVerfiedMobile = this.onVerfiedMobile.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.createProfile = this.createProfile.bind(this);
  }
  
  state ={showConfirm:false}

  componentWillReceiveProps(nextProps){
	  const {order:oldOrder} = this.props.deposit.consume;
	  const {order:nowOrder} = nextProps.deposit.consume;
	  if(nowOrder.id && oldOrder.id != nowOrder.id){//消费订单请求完毕
		  var rechargeOrder = nextProps.deposit.recharge.order;
		  console.info("补卡消费订单请求完毕,消费订单：",nowOrder.id);
		  if(rechargeOrder.id){//设置限额
			  console.info("需要充值，设置限额为充值订单金额 ： ",rechargeOrder.amt);
			  this.props.dispatch({
			      type: 'payment/setState',
			      payload:{order:rechargeOrder,limit:rechargeOrder.amt,},
			  	  callback:()=>{this.next();}
			  });
		  }else{
			  this.next();
		  }
		  
	  }
  }
  next(){
    if(this.props.onNext)this.props.onNext();
  }
  createProfile(profile){
    this.props.dispatch({ 
      type: 'patient/createProfile',
      payload:{profile},
    });
  }
  onVerfiedMobile(mobile,verfied){
	if(!verfied)return;
	const {idCardInfo,baseInfo} = this.props.patient;
	if(!baseInfo || !baseInfo.no){//无档案
		 this.setState({showConfirm:true});
		 return;
	}
	const {userName, sex, nation,birthday} = idCardInfo;
	const {address,idNo,issuer,effectiveDate} = idCardInfo;
	if(baseInfo && baseInfo.no){
	  this.createOrder();
	  return ;
	}
  }
  createOrder(){
    this.props.dispatch({ //生成消费订单后进入下一步
      type: 'deposit/createReissueCardOrder',
    });  
  }
  render () {
	const { frofile } = this.props.patient;
	const { baseInfo } = this.props.patient;
    return (
    	<WorkSpace style = {{paddingTop: '4rem'}} >
	    	<Card bordered = {true} style = {{margin: '2rem', padding: '2rem', fontSize: '3rem'}} >
		      <Row><Col span = {8} >姓名 ：{baseInfo.name}</Col><Col span = {16} >身份证号 ：{baseInfo.idNo}</Col> </Row>
		    </Card>
    		<VerifyAuthCode onVerfied={this.onVerfiedMobile} type='REP' mobile={baseInfo.telephone || baseInfo.mobile}/>
    		<Confirm info = '您未申请过就诊卡，请到"办理就诊卡"菜单进行操作!' visible = {this.state.showConfirm} 
             buttons = {[{text: '确定', onClick: () =>{
            	 this.setState({showConfirm: false});
            	 this.props.dispatch(routerRedux.push('/homepage'));
             }},]}
            />
    	</WorkSpace>
    );	
  }
}  

export default  connect(({patient,deposit}) => ({patient,deposit}))(Step2);