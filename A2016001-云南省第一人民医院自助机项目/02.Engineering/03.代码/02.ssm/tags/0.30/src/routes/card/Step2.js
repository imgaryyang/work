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
	  const {baseInfo:old} = this.props.patient;
	  const {baseInfo:now} = nextProps.patient;
	  const {order:oldOrder} = this.props.deposit.consume;
	  const {order:nowOrder} = nextProps.deposit.consume;
	  if(!old.no && now.no){//建档完毕
		  console.info("建档完毕");
		  if(now.medicalCardNo != now.no ){//卡号已经存在 
			  this.setState({showConfirm:true});
		  }else{
		    this.createOrder();
		  }
	  }
	  if(nowOrder.id && oldOrder.id != nowOrder.id){//消费订单请求完毕
		  var rechargeOrder = nextProps.deposit.recharge.order;
		  console.info("办卡消费订单请求完毕",nowOrder.id);
		  if(rechargeOrder.id){//设置限额
			  console.info("需要充值，设置支付限额为支付订单金额",rechargeOrder.amt);
			  this.props.dispatch({
			      type: 'payment/setState',
			      payload:{limit:rechargeOrder.amt,order:rechargeOrder},
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
    console.info('准备建档',profile);
    this.props.dispatch({ // 查询档案是否存在，存在，则更新patient信息，不存在，则建档，再更新patient信息
      type: 'patient/createProfile',
      payload:{profile},
    });
  }
  onVerfiedMobile(mobile,verfied){
	if(!verfied)return;
	console.info('手机号码校验成功',mobile);
	const {idCardInfo,baseInfo} = this.props.patient;
	if(baseInfo && baseInfo.no){//有档案
	  if(baseInfo.medicalCardNo != baseInfo.no ){//卡号已经存在 
	    this.setState({showConfirm:true});
	    return;
	  }
	}
	
	const {userName, sex, nation,birthday,careerName,careerCode} = idCardInfo;
	const {address,idNo,issuer,effectiveDate} = idCardInfo;
	
	  if(baseInfo && baseInfo.no){
		  this.createOrder();
		  return ;
	  }
	  var gender = '3';
	  if('男' == sex)gender = '1';
	  if('女' == sex)gender = '2';
	  const profile={
		  name:userName,gender:gender,idNo:idNo,birthday:birthday,
		  mobile:mobile,address:address,unitCode:'0000',medicalCardNo:'',
		  telephone:mobile,opentype:'1',Occupationnum:careerCode,
	  };
	  this.createProfile(profile); 
	
  }
  createOrder(){
	// 判断卡信息是否存在，存在，则提示是否办理新卡，不办理退回首页，办理则收费绑卡 如果不存在，则创建订单收费绑卡，
    this.props.dispatch({ //生成消费订单后进入下一步
      type: 'deposit/createCardOrder',
    });  
  }
  render () {
	const { idCardInfo } = this.props.patient;
	const { baseInfo } = this.props.patient;
    return (
    	<WorkSpace style = {{paddingTop: '4rem'}} >
	    	<Card bordered = {true} style = {{margin: '2rem', padding: '2rem', fontSize: '2.5rem'}} >
		      <Row>
		      	<Col span = {6} >姓名 ：{idCardInfo.userName}</Col>
		      	<Col span = {12} >身份证号 ：{idCardInfo.idNo}</Col>
		      	<Col span = {6} >{idCardInfo.careerName?'职业 : '+idCardInfo.careerName:''}</Col>
		      </Row>
		    </Card>
    		<VerifyAuthCode onVerfied={this.onVerfiedMobile} type='REG'  mobile={baseInfo.mobile || baseInfo.telephone}/>
    		<Confirm info = '您已经申请过就诊卡，如果您需要挂失或者补办就诊卡，请到"就诊卡挂失补办"菜单进行操作!' visible = {this.state.showConfirm} 
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