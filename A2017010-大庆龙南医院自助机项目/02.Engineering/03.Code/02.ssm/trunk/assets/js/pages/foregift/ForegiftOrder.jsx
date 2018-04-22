import React, { PropTypes } from 'react';
import { Row, Col, Icon  }   from 'antd';
import moment from 'moment';
import styles from './ForegiftOrder.css';
import NavContainer from '../../components/NavContainer.jsx';
import NumKeyboard from '../../components/keyboard/NumKeyboard.jsx';
import Input from '../../components/Input.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import CommonModal from '../../components/CommonModal.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{log} from '../../utils/logUtil.jsx';
import TimerPage from '../../TimerPage.jsx';
class ForegiftOrder extends TimerPage {

  /**
	 * 初始化状态
	 */
  
  constructor(props) {
    super(props);
    this.onBack = this.bind(this.onBack,this);
    this.onHome = this.bind(this.onHome,this);
    this.onKeyDown = this.bind(this.onKeyDown,this);
    this.submit = this.bind(this.submit,this);
    this.buildOrder = this.bind(this.buildOrder,this);
    
	//var limit = baseUtil.getSysConfig('inpatientPrepaid.limit',100);
	
	const patient = baseUtil.getCurrentPatient();
	const { balance } = patient;
	
	this.state = {
		amt: '0',
		buttonDisabled: true,
		keyConfig:{maxLength:8,stateName:'amt'},
		cashModal:true,
	};
    
  }
  componentWillMount() {
	   
  }
  componentDidMount() {
	 const { channel } = this.props;
	 if( channel == '0000'){
		 this.submit();
	 }
  }
  onBack(){
	  baseUtil.goHome('ForegiftOrderBack'); 
  }
  onHome(){
	  baseUtil.goHome('ForegiftOrderHome'); 
  }
  buildOrder(){
	const patient = baseUtil.getCurrentPatient();
	const { inpatientInfo } = this.props;
	const { amt } = this.state;
	return {
		amt,
		patientNo:patient.no,//病人姓名
		patientName:patient.name,//病人姓名	
		patientIdNo:patient.idNo,//病人身份证号
		patientCardNo:patient.medicalCardNo,//病人卡号	
		patientCardType:patient.cardType,//就诊卡类型 TODO 就诊卡
		inpatientId:inpatientInfo.inpatientId,
	}; 
  }
  submit(){
	var order = this.buildOrder();	
	let fetch = Ajax.post("/api/ssm/treat/foregift/order/foregift",order,{catch: 3600});
	fetch.then(res => {
	  log('预缴订单创建返回 ', res);
	  if(res && res.success){
		  var newOrder = res.result;
		  this.setState({cashModal:false},()=>{
			  this.afterOrderCreate(newOrder);
		  })
	  }else if( res && res.msg ){
		  this.setState({cashModal:false},()=>{
			  baseUtil.error(res.msg);
		  })
	  }else{
		  this.setState({cashModal:false},()=>{
			  baseUtil.error("无法创建预缴订单");
		  })
	  }
	}).catch((ex) =>{
		this.setState({cashModal:false},()=>{
		  baseUtil.error("无法创建预缴订单");
		})
	})  
  }
  afterOrderCreate(order){
	  if(this.props.afterOrderCreate )this.props.afterOrderCreate(order);
  }
  onKeyDown(key){
	 var patient = baseUtil.getCurrentPatient();
	 const { balance } = patient;
	 const { amt} = this.state;
	 const { channel } = this.props;
	 
	 var {maxLength,stateName} = this.state.keyConfig;
	 var old = this.state[stateName];
	 if('0' == key && old.length == 0 )return;
	 if('清空'==key)this.state[stateName]="0";
	 else if('删除'==key){
		 if(old.length > 1)this.state[stateName]=old.substr(0, old.length - 1);//删除
		 else this.state[stateName]="0";
	 }else if(old.length < maxLength){
		var value = parseFloat(old+key);
		if( value > balance && channel=='balance' ){
			baseUtil.warning('您最多可以转账'+balance+'元');
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
	const { amt,cashModal } = this.state;
	const { channel,inpatientInfo } = this.props;
	if('0000' == channel && (limit ==0 || limit > balance) ){
		return(
			<NavContainer title='预缴订单' onBack={this.onBack} onHome={this.onHome} >
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
      <NavContainer title='预缴订单' onBack={this.onBack} onHome={this.onHome} >
	      <Card style = {{margin: '0 2rem 2rem 2rem', textAlign:'center',fontSize: '3rem'}} >
	      {
	    	  (channel == 'balance' )?(
	    	    <span className = 'fgOrder_balance' >当前病人{inpatientInfo.patientName},转出金额不能超出您的预存余额&nbsp;<font>{(balance||0).formatMoney()}</font>&nbsp;元</span>
	          ):(
	           <span className = 'fgOrder_balance' >当前病人{inpatientInfo.patientName},住院预缴金额不可以在门诊使用</span>
	          )
	      }
		  </Card>	
		  
	    <Row>
	      <Col span = {12} style = {{paddingRight: '1rem'}} >
	        <Card style={cardStyle}>
	          <span className = 'porder_balance' >住院预缴余额&nbsp;<font>{inpatientInfo.payment||0}</font>&nbsp;元</span>
	          {
	        	    channel == 'balance' ?(<span className = 'porder_balance' >最多可预缴&nbsp;<font>{balance}</font>&nbsp;元</span>):null
	          }
	          <Input focus = {true} value = {amt.formatMoney()} placeholder = "请输入您要预存的金额" />
	          <Button text = "确定" disabled = {(parseFloat(amt)<=0)} style={buttonStyle} onClick = {this.submit} />
	          <span className = 'porder_tip' >填写完金额后，请按“确定”键并按照引导提示完成预缴。</span>
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
module.exports = ForegiftOrder;
