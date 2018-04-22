import React,{ Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row,Col,Card,Modal } from 'antd';
import WorkSpace from '../../components/WorkSpace';
import config from '../../config';
import baseUtil from '../../utils/baseUtil';
import styles from './SelectAccount.css';
import idcard from '../../assets/guide/idcard-read.gif';
import Button               from '../../components/Button';
import b_0103              from '../../assets/bank/0103.png';
import b_0104              from '../../assets/bank/0104.png';
import b_0301              from '../../assets/bank/0301.png';
import b_0306              from '../../assets/bank/0306.png';
import b_0308              from '../../assets/bank/0308.png';
import b_6509              from '../../assets/bank/6509.png';
import alipay              from '../../assets/base/alipay.png';
import weixin              from '../../assets/base/weixin.png';
import unpay  from '../../assets/base/union-pay.png';
const logos={b_0103,b_0104,b_0301,b_0306,b_0308,b_6509};

class SelectAccount extends Component {
	
  constructor (props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onCancelIdCard = this.onCancelIdCard.bind(this);
    this.groupAccounts = this.groupAccounts.bind(this);
    this.loadDetails = this.loadDetails.bind(this);
  }
 
  state={idCardModal:false,confirm:false,account:null};
  
  componentDidMount () {
	  const { baseInfo } = this.props.patient;
	  if(baseInfo.no){
		  this.props.dispatch({
		      type: 'refund/loadAccounts',
		  });
	  }
  }
  componentWillReceiveProps(nextProps){
	const { idCardInfo:oldId } = this.props.patient;
  	const { idCardInfo:nowId } = nextProps.patient;
  	if(!oldId.userName && nowId.userName ){
  	  console.info("身份证读取完毕,加载账户信息");
  	  this.state.account.accName = nowId.userName ;
  	  this.loadDetails(this.state.account);
	  return;
	}
  }
  checkAccName(){
	  
  }
  onSelect(account){
	  if(account.accType=='0'){
		  this.setState({idCardModal:true,account},()=>{
			  this.props.dispatch({
				  type:'patient/listenAccountByIdCard',
			  }); 
		  });
	  }else{
		  this.setState({account},()=>{
			  this.loadDetails(account)
		  });
	  }
  }
  loadDetails(account){
	  const {accType ,cardBank, cardType} = account;
	  // 银行卡->储蓄卡
	  if(accType=='0' && cardType=='1'){
	    this.props.dispatch({
		  type:'refund/getCreditAmt',
		  payload:{account}
	    }); 
		return;
	  }
	  this.props.dispatch({
		  type:'refund/loadRechareDetails',
		  payload:{account}
	  }); 
  }
  onCancelIdCard(){
	  this.setState({idCardModal:false},()=>{
		  this.props.dispatch({
			  type:'patient/closeDevice',
			  payload:{device : 'idCard'},
		  }); 
	  });
  }
  groupAccounts( accts ){
	  var card=[],phone=[];
	  for(var acct of accts){
		var {accType ,cardBank, cardType} = acct;
		//accType    ;//账户类型 0：银行卡，1：支付宝 ，2：微信 
		//cardBank	 ;//卡所属银行
		//cardType   ;//卡类型 0：信用卡 1：非信用卡
		if(accType=='0'){
			card.push(acct);
		}else if(accType=='1' || accType=='2'){
			phone.push(acct);
		}
	  }
	  return {card,phone }
  }
  render () {
	const modalWinTop  = config.navBar.height + config.navBar.padding * 2 + 4;
	var { accounts } = this.props.refund;
	var group = this.groupAccounts(accounts||[]);
	console.info("account groups ",group);
	const { baseInfo } = this.props.patient;
    return (
      <WorkSpace style = {{paddingTop: '1rem'}} >
      <Card  style = {{margin: '0 2rem 0 2rem', padding: '2rem 2rem 0 2rem', fontSize: '3rem'}} >
	      <span>
	      	账户余额：
	      	<font style = {{color: '#BC1E1E', fontSize: '4rem'}} >{(baseInfo.balance||0).formatMoney()}</font>&nbsp;&nbsp;元，
	      	请选择您的退款账户
	      </span>
	  </Card>
      {
    	  this.renderCard(group.card)
      }
      {
    	  this.renderPhone(group.phone)
      }
      	<Modal visible = {this.state.idCardModal} closable = {false} footer = {null} width = {config.getWS().width * 0.6836 + 'px'} style={{top:modalWinTop+'rem'}} >
	      <div style = {{	backgroundColor:'#f5f5f5',marginTop:'-16px',marginBottom:'-50px',marginLeft:'-16px',marginRight:'-16px',}}>
		        <div className = {styles.guideTextContainer} >
					<font className = {styles.guideText} >请将您的身份证放置到身份证读卡器</font>
				</div>	
				<div style = {{height: '30rem', width: '30rem', margin: '3rem auto',backgroundColor:'#f5f5f5'}} >
					<img alt = "" src = {idcard} className = {styles.guidePic} />
				</div>
				<Row style = {{padding : config.navBar.padding + 'rem'}} >
		            <Col span = {8}>&nbsp;</Col>
		            <Col span = {8}><Button text = "取消"  onClick = {this.onCancelIdCard} /></Col>
		            <Col span = {8} >&nbsp;</Col>
	          </Row>
	      </div>
	    </Modal>
      </WorkSpace>
    );	
  }
  renderCard(accounts){
	if(!accounts || accounts.length<=0)return null;
	return(
	  <Row style={{padding:config.navBar.padding + 'rem'}}>
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
					      	<Col span={8}><img style={{height:'60px'}} src={logo}/></Col>
					      	<Col span={16}>
					      		<Row  style={{fontSize:'2rem'}}>{acct.cardType=='0'?'信用卡':'储蓄卡'}</Row>
					      		<Row  style={{fontSize:'1.5rem'}}>{accountNo}</Row>
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
  renderPhone(accounts){
	//accType    ;//账户类型 0：银行卡，1：支付宝 2：微信 
	if(!accounts || accounts.length<=0)return null;
	return(
	  <Row style={{padding:config.navBar.padding + 'rem'}}>
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
			      <Row >
			      	<Col span={6}><img style={{width:'60px',height:'60px'}} src={imgSrc}/></Col>
			      	<Col span={18}>
			      		<Row  style={{fontSize:'2rem'}}>{title}</Row>
			      		<Row  style={{fontSize:'1.5rem'}}>{acct.accNo}</Row>
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
	  <ul className={styles.title}>
	  	<li className={styles.line}></li>
	  	<li className={styles.textwrapper}><span className={styles.text}>{title}</span></li>
	  </ul>
	)
  }
}  

export default  connect(({frame,patient,refund}) => ({frame,patient,refund}))(SelectAccount);
