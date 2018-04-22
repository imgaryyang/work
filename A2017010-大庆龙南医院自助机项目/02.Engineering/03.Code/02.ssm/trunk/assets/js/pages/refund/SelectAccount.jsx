import React, { PropTypes } from 'react';
import { Row, Col, Icon ,Modal }   from 'antd';
import moment from 'moment';
import styles from './SelectAccount.css';
import NavContainer from '../../components/NavContainer.jsx';
import Button from '../../components/Button.jsx';
import IdType from '../../components/IdType.jsx';
import Empty from '../../components/Empty.jsx';
import Card from '../../components/Card.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import idCardUtil from '../../utils/idCardUtil.jsx';
import TimerPage from '../../TimerPage.jsx';
const b_0103 = './images/bank/0103.png';
const b_0104 = './images/bank/0104.png';
const b_0301 = './images/bank/0301.png';
const b_0306 = './images/bank/0306.png';
const b_0308 = './images/bank/0308.png';
const b_6509 = './images/bank/6509.png';
const alipay = './images/base/alipay.png';
const weixin = './images/base/weixin.png';
const unpay = './images/base/union-pay.png';
const logos={b_0103,b_0104,b_0301,b_0306,b_0308,b_6509};
class Page extends TimerPage {

  constructor(props) {
    super(props);
    this.onBack = this.bind(this.onBack,this);
    this.onHome = this.bind(this.onHome,this);
	this.loadAccounts = this.bind(this.loadAccounts,this);
	this.groupAccounts = this.bind(this.groupAccounts,this);
	this.onSelectIdType = this.bind(this.onSelectIdType,this);
	this.listenIdCard = this.bind(this.listenIdCard,this);
	this.afterSelect = this.bind(this.afterSelect,this);
	this.onCancelIdCard = this.bind(this.onCancelIdCard,this);
	this.state = {
	  accounts:[],
	  showIdConfirm:false,
	  idCardModal:false,
	};
    
  }
  componentDidMount() {
	  this.loadAccounts();
  }
  loadAccounts(){
	var patient = baseUtil.getCurrentPatient();
	let fetch = Ajax.get("/api/ssm/treat/deposit/accounts",patient,{catch: 3600});
	fetch.then(res => {console.info(res);
	  if(res && res.success){
		  var accounts = res.result||[];
		  this.setState({accounts});
	  }
	});
  }
  groupAccounts( accts ){
	  var card=[],app=[];
	  for(var acct of accts){
		var {accType ,cardBank, cardType} = acct;
		/**
		 * accType  账户类型 0：银行卡，1：支付宝 ，2：微信
		 * cardBank 卡所属银行
		 * cardType 卡类型 0：信用卡 1：非信用卡
		 */
		if(accType=='0'){
			card.push(acct);
		}else if(accType=='1' || accType=='2'){
			app.push(acct);
		}
	  }
	  return {card,app }
  }
  onBack(){
	  baseUtil.goHome('refundAcctBack'); 
  }
  onHome(){
	  baseUtil.goHome('refundAcctHome'); 
  }
  onSelect(account){
	const {accType } = account;
	if(accType=='0'){// 银行卡
		console.info('选择银行卡');
		this.setState({showIdConfirm:true,account});
	}else{
		console.info('选择非银行卡');
		 this.afterSelect(account)
	}
  }
  onCancelIdCard(){
	this.setState({idCardModal:false});
  }
  onSelectIdType(type){
	var patient = baseUtil.getCurrentPatient();
	if(type.code == '1'){//本人银行卡
		console.info('本人银行卡');
		this.setState({showIdConfirm:false},()=>{
			this.state.account.accName = patient.name ;
			this.afterSelect(this.state.account);
		});
	}else{//他人人银行卡
		console.info('他人人银行卡');
		this.setState({showIdConfirm:false,idCardModal:true},()=>{
			 this.listenIdCard();
		});
	}
  }
  listenIdCard(){
	baseUtil.speak('card_putAcctHolder');// 播放语音：请将您的身份证放置到身份证读卡器
	idCardUtil.listenCard((idCardInfo)=>{
		console.info('idCardInfo',idCardInfo);
		this.state.account.accName = idCardInfo.userName ;
		this.afterSelect(this.state.account);
	});
  }
  afterSelect(account){
	if(this.props.afterSelect)this.props.afterSelect(account);  
  }
  render() {
	const patient = baseUtil.getCurrentPatient();
	const { name,balance } = patient;
	const { accounts } = this.state;
	const group = this.groupAccounts( accounts );
	return(
	  <NavContainer title='退款账户' onBack={this.onBack} onHome={this.onHome} >
	    <Card  style = {{margin: '0 2rem 0 2rem', padding: '2rem 2rem 0 2rem', fontSize: '3rem'}} >
	      <span>就诊卡账户余额：
	      	<font style = {{color: '#BC1E1E', fontSize: '4rem'}} >{(balance||0).formatMoney()}</font>&nbsp;&nbsp;元，
	      	请选择您的退款账户
	      </span>
	    </Card>
	  	{
	  		(!accounts || accounts.length<=0)?(this.renderEmpty()):null
	  	}
	    {
	      this.renderPhone(group.app)
	    }
	    <Modal visible = {this.state.showIdConfirm} closable = {false} footer = {null} width = {document.body.clientWidth * 0.6836 + 'px'} style = {{top:'17rem'}} >
		  <div style = {{margin: '-16px'}}>
		 	  <IdType width = {document.body.clientWidth * 0.6836 + 'px'} onSelectType={this.onSelectIdType} />
		  </div>
		</Modal>
		<Modal visible = {this.state.idCardModal} closable = {false} footer = {null} width = {document.body.clientWidth * 0.6836 + 'px'} style={{top:'17rem'}} >
	      <div style = {{	backgroundColor:'#f5f5f5',marginTop:'-16px',marginBottom:'-50px',marginLeft:'-16px',marginRight:'-16px',}}>
		        <div className = 're_act_guideTextContainer' >
					<font className = 're_act_guideText' >谁的银行卡放谁的身份证!!!</font>
				</div>	
				<div style = {{height: '30rem', width: '30rem', margin: '3rem auto',backgroundColor:'#f5f5f5'}} >
					<img alt = "" src = './images/guide/idcard-read.gif' className = 're_act_guidePic' />
				</div>
				<Row style = {{padding : '1.5rem'}} >
		            <Col span = {8}>&nbsp;</Col>
		            <Col span = {8}><Button text = "取消"  onClick = {this.onCancelIdCard} /></Col>
		            <Col span = {8} >&nbsp;</Col>
	          </Row>
	      </div>
	    </Modal>
	  </NavContainer>
	)
  }
  renderEmpty(){
	  return <Empty info = '暂无可退款账户' />;
  }
  renderCard(accounts){
	if(!accounts || accounts.length<=0)return null;
	return(
	  <Row style={{padding:'1.5rem'}}>
	  {this.renderTitle('银行卡')}
	  {
		  accounts.map((acct,index)=>{
			  var logo = logos['b_'+acct.cardBank] ||unpay;
			  var accountNo = acct.accNo.substr(0,4)+"******"+acct.accNo.substr(acct.accNo.length-4,acct.accNo.length)
			  //console.info('accountNo ', acct.accNo,accountNo,);
			  return (
				<Col key={index} span={8}>
				      <Card style={{margin:'5px',height:'100px',borderRadius:".6rem"}} onClick={this.onSelect.bind(this,acct)}>
					      <Row >
					      	<Col span={8}  style={{marginTop:'20px'}}><img style={{height:'60px'}} src={logo}/></Col>
					      	<Col span={16} style={{marginTop:'20px'}}>
					      		<Row style={{fontSize:'2rem'}}><Col span={24}>{acct.cardType=='0'?'信用卡':'储蓄卡'}</Col></Row>
					      		<Row style={{fontSize:'1.5rem'}}><Col span={24}>{accountNo}</Col></Row>
					      	</Col>
					      </Row>
				      </Card>
			      </Col>
			  )
		  })
	  }
      </Row>
	)  
  }
  renderPhone(accounts){//accType 账户类型 0：银行卡，1：支付宝 2：微信 
	if(!accounts || accounts.length<=0)return null;
	return(
	  <Row style={{padding:'1.5rem'}}>
	  {this.renderTitle("手机")}
	  {
		  accounts.map((acct,index)=>{
		    var title='微信',imgSrc = weixin;
			if(acct.accType == '1'){
				title='支付宝';
				imgSrc = alipay;
			}
			return (
			<Col key={index} span={8}>
			      <Card style={{margin:'5px',height:'100px',borderRadius:".6rem"}} onClick={this.onSelect.bind(this,acct)}>
			      <Row>
			      	<Col span={6} style={{marginTop:'20px'}}><img style={{width:'60px',height:'60px'}} src={imgSrc}/></Col>
			      	<Col span={18} style={{marginTop:'20px'}}>
			      		<Row  style={{fontSize:'2rem'}}><Col span={24}>{title}</Col></Row>
			      		<Row  style={{fontSize:'1.5rem'}}><Col span={24}>{acct.accNo}</Col></Row>
			      	</Col>
			      </Row>
		      </Card>
	      </Col>
		  )})
	  }
      </Row>
	)  
  }
  renderTitle(title){
	return (
	  <ul className='re_act_title'>
	  	<li className='re_act_line'></li>
	  	<li className='re_act_textwrapper'><span className='re_act_text'>{title}</span></li>
	  </ul>
	)
  }
}
module.exports = Page;

//
//{
//	  this.renderCard(group.card)
//	}