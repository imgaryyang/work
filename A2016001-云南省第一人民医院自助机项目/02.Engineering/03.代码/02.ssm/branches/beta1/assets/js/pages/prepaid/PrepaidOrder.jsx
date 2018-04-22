import React, { PropTypes } from 'react';
import { Row, Col, Icon  }   from 'antd';
import moment from 'moment';
import styles from './PrepaidOrder.css';
import NavContainer from '../../components/NavContainer.jsx';
import NumKeyboard from '../../components/keyboard/NumKeyboard.jsx';
import Input from '../../components/Input.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import CommonModal from '../../components/CommonModal.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
class PrepaidOrder extends React.Component {

  /**
	 * 初始化状态
	 */
  
  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onHome = this.onHome.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.submit = this.submit.bind(this);
    this.buildOrder = this.buildOrder.bind(this);
    
    var limit_real = baseUtil.getSysConfig('prepaid.limit',100000);
	var limit_unreal = baseUtil.getSysConfig('prepaid.limit_unReal',100);
	
	const patient = baseUtil.getCurrentPatient();
	const { ktfs } = patient;
	const realName = (ktfs == '1' || ktfs == '2');//预存开通方式 0：未任何身份验证 1：身份证2：短信
	const limit = realName?limit_real:limit_unreal;
	
	this.state = {
		limit,
		realName,
		amt: '0',
		buttonDisabled: true,
		keyConfig:{maxLength:8,stateName:'amt'},
		cashModal:true,
	};
    
  }
  componentWillMount() {
	   
  }
  componentDidMount() {
	 const patient = baseUtil.getCurrentPatient();
	 const { limit,realName, } = this.state ;
	 const { balance } = patient;
	 if( limit !=0 && limit < balance  ){
		 var msg = (realName?"实名用户":"非实名用户")+"最多预存"+limit+"元";
		 baseUtil.error(msg);
	 }else{
		 const { channel } = this.props;
		 if( channel == '0000'){
			 this.submit();
		 }
	 }
  }
  onBack(){
	  baseUtil.goHome('prepaidOrderNext'); 
  }
  onHome(){
	  baseUtil.goHome('prepaidHomeNext'); 
  }
  buildOrder(){
	var patient = baseUtil.getCurrentPatient();
	const { amt } = this.state;
	return {
		amt,
		patientNo:patient.no,//病人姓名
		patientName:patient.name,//病人姓名	
		patientIdNo:patient.idNo,//病人身份证号
		patientCardNo:patient.medicalCardNo,//病人卡号	
		patientCardType:patient.cardType,//就诊卡类型 TODO 就诊卡
	}; 
  }
  submit(){
	var order = this.buildOrder();	
	let fetch = Ajax.post("/api/ssm/treat/deposit/order/recharge",order,{catch: 3600});
	fetch.then(res => {
	  if(res && res.success){
		  var newOrder = res.result;
		  console.info('预存订单创建成功 ', newOrder);
		  this.setState({cashModal:false},()=>{
			  this.afterOrderCreate(newOrder);
		  })
	  }else if( res && res.msg ){
		  this.setState({cashModal:false},()=>{
			  baseUtil.error(res.msg);
		  })
	  }else{
		  this.setState({cashModal:false},()=>{
			  baseUtil.error("无法创建预存订单");
		  })
	  }
	}).catch((ex) =>{
		this.setState({cashModal:false},()=>{
		  baseUtil.error("无法创建预存订单");
		})
	})  
  }
  afterOrderCreate(order){
	  if(this.props.afterOrderCreate )this.props.afterOrderCreate(order);
  }
  onKeyDown(key){
	 var patient = baseUtil.getCurrentPatient();
	 const { balance } = patient;
	 const { limit ,amt} = this.state;
		
	 var {maxLength,stateName} = this.state.keyConfig;
	 var old = this.state[stateName];
	 if('0' == key && old.length == 0 )return;
	 if('清空'==key)this.state[stateName]="0";
	 else if('删除'==key){
		 if(old.length > 1)this.state[stateName]=old.substr(0, old.length - 1);//删除
		 else this.state[stateName]="0";
	 }else if(old.length < maxLength){
		var value = parseFloat(old+key);
		if(limit < (value+balance) && limit !== 0 ){
			baseUtil.warning('您最多可以再存'+(limit-balance)+'元');
			return;
		}else{
			this.state[stateName]=value+'';
		}
	 }
	 //console.info('value : ',this.state[stateName]);
	 this.setState(this.state);
  }
  render() {
	const patient = baseUtil.getCurrentPatient();
	const { name,balance } = patient;
	const { limit,amt,cashModal } = this.state;
	const { channel } = this.props;
	if('0000' == channel && (limit ==0 || limit > balance) ){
		return(
			<NavContainer title='充值订单' onBack={this.onBack} onHome={this.onHome} >
				<CommonModal msg={'正在检查现金环境,请耐心等待'} visible={cashModal} />
			</NavContainer>
		);
	}
	
	var height = document.body.clientHeight - 400;
	const cardStyle = {
        height: height+'px',
        padding: '4rem 2rem 4rem 2rem',
    };
	const  buttonStyle = {marginTop: '3rem', marginBottom: '3rem', };
	 
    return (
      <NavContainer title='充值订单' onBack={this.onBack} onHome={this.onHome} >
	    <Card  style = {{marginBottom: '2rem',fontSize: '3rem'}} >
	  	  <span>当前患者<font style = {{color: '#DB5A5A', fontSize: '4.5rem'}} >{name}</font>,请在充值前确认身份，以免您的财产损失！！</span>
	    </Card>
	    <Row>
	      <Col span = {12} style = {{paddingRight: '1rem'}} >
	        <Card style={cardStyle}>
	          <span className = 'porder_balance' >账户余额&nbsp;<font>{balance}</font>&nbsp;元</span>
	          {
	        	  limit == 0 ?null:(<span className = 'porder_balance' >最多可再存&nbsp;<font>{limit}</font>&nbsp;元</span>)
	          }
	          <Input focus = {true} value = {amt.formatMoney()} placeholder = "请输入您要预存的金额" />
	          <Button text = "确定" disabled = {(parseFloat(amt)<=0)} style={buttonStyle} onClick = {this.submit} />
	          <span className = 'porder_tip' >填写完金额后，请按“确定”键并按照引导提示完成预存。</span>
	        </Card>
	      </Col>
	      <Col span = {12} style = {{paddingLeft: '1rem'}} >
	        <NumKeyboard onKeyDown = {this.onKeyDown} maxLength={4} height = {height} />
	      </Col>
	    </Row>
      </NavContainer>
    );
  }
}
module.exports = PrepaidOrder;
