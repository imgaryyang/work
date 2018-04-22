import React, { PropTypes } from 'react';
import { Row, Col, Icon,Modal  }   from 'antd';
import moment from 'moment';
import styles from './CashPay.css';
import NavContainer from '../../components/NavContainer.jsx';
import Confirm from '../../components/Confirm.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import cashBox from '../../utils/cashBoxUtil.jsx';


/**
 * 钱箱流程
 * --监听钱箱，进入空闲状态，取消提示，
 * --循环拉币，
 * ----塞入纸币，提示进钞 ，
 * ----获取一张纸币，
 * ------停止循环，调用success记录结算单，
 * -------达到限额提交订单
 * -------未达到限额，进入下一次钱箱监听
 * ----吐出纸币，提示出钞,出钞结束，进入空闲，取消提示，继续循环
 * ----未塞入纸币，超时，停止循环，调用stop函数提交订单。 
 * ----处理异常，停止循环，调用strop函数提交订单。
 */
const cashTimeout = 60*1000;
class PrepaidCash extends React.Component {

  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onHome = this.onHome.bind(this);
    this.submit = this.submit.bind(this);
    this.listenCash = this.listenCash.bind(this);
    this.recordError = this.recordError.bind(this);
    
    this.successHandler= this.successHandler.bind(this);
    this.errorHandler= this.errorHandler.bind(this);
    this.unConfirmHandler= this.unConfirmHandler.bind(this);
    this.fullHandler= this.fullHandler.bind(this);
    this.acceptHandler= this.acceptHandler.bind(this);
	this.returningHandler= this.returningHandler.bind(this);
	this.idleHandler= this.idleHandler.bind(this);
	this.stopHandler = this.stopHandler.bind(this);
	
	this.mask= this.mask.bind(this);
	this.unMask= this.unMask.bind(this);
	this.submitOrder = this.submitOrder.bind(this);
	this.clickButton = this.clickButton.bind(this);
	this.afterPay = this.afterPay.bind(this);
	this.renderInfoConfirm = this.renderInfoConfirm.bind(this);
	this.startPay = this.startPay.bind(this);
	var order = props.order;
	
	var limit_real = baseUtil.getSysConfig('prepaid.limit',1000000);
	var limit_unreal =  baseUtil.getSysConfig('prepaid.limit_unReal',100);
	var limit_cash =  baseUtil.getSysConfig('prepaid.limit_cash',1000);
	const patient = baseUtil.getCurrentPatient();
	const { ktfs } = patient;
	const realName = (ktfs == '1' || ktfs == '2');//预存开通方式 0：未任何身份验证 1：身份证2：短信
	var limit = realName?limit_real:limit_unreal;
	if(limit > limit_cash || limit == 0 )limit = limit_cash ;
	this.state = {
      showModal:false,
      limit,
      msg:'',
      order:order,
      settlement:{},
      infoConfirm:true,
	};
    
  }
  componentWillMount() {
	   
  }
  componentWillUnmount() {
	  log('现金-现金页面离开'); 
  }
  componentDidMount() {
	 
  }
  startPay(){
	 if(! baseUtil.isTodayCanCash())return;
	 try{
		 cashBox.prepare(()=>{
			baseUtil.speak('pay_pushCash');// 播放语音
			this.listenCash();
		 },(state)=>{
			 log('现金-钱箱准备异常',state);
			 if(954 == state){
				 baseUtil.closeTodayCash();//钱箱离位，关闭现金功能
				 baseUtil.error("钱箱已经银行被取走，现金预存请更换自助机");
			 }
			 else  baseUtil.error("钱箱异常，现金预存请更换自助机");
		 }); 
	 }catch(e){
		 log('现金-钱箱准备异常',e);
		 baseUtil.error("钱箱异常，现金预存请更换自助机");
	 } 
  }
  listenCash(){
	  this.setState({showModal:false,msg:''},()=>{//消除遮罩
		  cashBox.listenCash({
			  success:this.successHandler,
			  error:this.errorHandler,
			  unConfirm:this.unConfirmHandler,
			  full:this.fullHandler,
			  accept:this.acceptHandler,
			  returning:this.returningHandler,
			  idle:this.idleHandler,
			  stop:this.stopHandler,
		  },cashTimeout)  
	  })
  }
  successHandler(amt){
	  //收币成功，循环结束 创建结算单
	  var patient = baseUtil.getCurrentPatient();
	  var { order,limit } = this.state;
	  log("现金-提交现金结算单",order );
	  const settlement = {amt,order,payChannelCode:'0000',payTypeCode:'cash',};
	  let fetch = Ajax.post("/api/ssm/payment/pay/preCreate",settlement,{catch: 3600});
	  fetch.then(res => {
		log("现金-现金结算单提交返回",res);
		if(res && res.success){
			var settle = res.result ||{};
			const result = res.result||{amt:0};
			const newOrder = result.order||order;
			if(newOrder.realAmt >= limit && limit != 0 ){//超过限额
				log("现金-超过限额"+limit+"，提交订单");
				this.setState({order:newOrder,settlement:settle},()=>{
					this.submit();
				})
				return;
			}
			this.setState({order:newOrder,settlement:settle},()=>{
				this.listenCash();//开启下一次监听
			});
		}else{
			var msg = (res && res.msg)?res.msg:'无法创建结算单';
			this.errorHandler(amt,msg);
		} 
	  }).catch((ex) =>{
		  var msg = "无法创建结算单"+JSON.stringify(ex);;
		  this.errorHandler(amt,msg);
	  }) 
  }
  errorHandler(ret,msg){
	  //报错，提交订单
	  this.setState({showModal:false,msg:''},()=>{
		  this.submit();
		  this.recordError(ret,msg);
		  baseUtil.warning(msg);
	  });
  }
  unConfirmHandler(ret){
	  //报错，提交订单 记录不确认金额
	  this.setState({showModal:false,msg:''},()=>{
		  this.submit();
		  this.recordError(ret,"压币异常");
		  baseUtil.warning("入钞异常，请联系工作人员");
	  });
  }
  fullHandler(){
	  //钱箱满，报错，提交订单
	  this.setState({showModal:false,msg:''},()=>{
		  this.submit();
		  this.recordError('',"钱箱已满");
		  baseUtil.warning('钱箱已满，不可以继续预存');
	  });
  }
  acceptHandler(){
	//正在进钞票  ，提示信息
	this.mask("正在进钞.........");
  }
  returningHandler(){
	 //正在退钞 ，提示信息
	  this.mask("正在退钞.........");
  }
  idleHandler(){
	 //进入空闲 ，关闭提示信息
	 this.unMask();
  }
  stopHandler(){//钱箱停止监听，提交订单。
	  this.submit();
  }
  recordError(ret,msg){
	const patient = baseUtil.getCurrentPatient();
	const { order } = this.state;
	var error = {
	  ret,
	  msg,
	  patientName:patient.name,
	  patientNo :patient.no,
	  orderId:order.id,
	  orderNo:order.orderNo,
	}
	log("现金-记录异常信息",error);
	let fetch = Ajax.post("/api/ssm/pay/cash/error/create",error,{catch: 3600});
	fetch.then(res => {
		if(res && res.success){
		}else{
			baseUtil.warning('无法记录错误信息');
		}
	}).catch((ex) =>{
		baseUtil.warning('记录错误信息异常');
	}) 
  }
  mask(msg){
	  this.setState({showModal:true,msg});
  }
  unMask(){
	  this.setState({showModal:false,msg:''});
  }
  onBack(){
	  if(baseUtil.isTodayCanCash()){
		  this.clickButton(); 
	  }else{
		  baseUtil.goHome('cashCloseBack');
	  }
  }
  onHome(){
	  if(baseUtil.isTodayCanCash()){
		  this.clickButton(); 
	  }else{
		  baseUtil.goHome('cashCloseHome');
	  }
  }
  submit(){
	  this.setState({showModal:true,msg:'正在提交.........'},()=>{
		  this.submitOrder();
	  });
  }
  submitOrder(){
	  const { settlement,order } = this.state;
	  if( !settlement.id ){
		  log("现金-结算单无效,不提交订单");
		  this.setState({showModal:false,msg:''},()=>{
			//this.afterPay(settlement,order);
			  baseUtil.goHome('cashNoSettle');
		  });
		  return;
	  }
	  if( order.realAmt < 0 ) {
		  log('现金-订单金额为0,不提交订单');
		  this.setState({showModal:false,msg:''},()=>{
			//this.afterPay(settlement,order);
			  baseUtil.goHome('cashOrderZero');
		  });
		  return;
	  }
	  log('现金-提交订单,结算单',settlement);
	  log('现金-提交订单,订单',order);
	  let fetch = Ajax.post("/api/ssm/payment/pay/callback/cash/"+settlement.id,settlement,{catch: 3600});
	  fetch.then(res => {
		log('现金-提交订单返回',res);
		if(res && res.success){
			var settle = res.result||{};
			var order = settle.order;
			if(!settle || !order){
				baseUtil.error("支付失败，请联系管理人员'");
				this.recordError('','订单支付返回为空');
				return;
			}else if(order.status ==  '3'){
				baseUtil.error("调用his核心失败，请联系管理人员");
				this.recordError('','订单支付状态为3');
				return;
			}else if(order.status !=  '0'){
				baseUtil.error("充值错误，请联系管理人员'");
				this.recordError('','订单支付状态为'+order.status);
				return;
			}else{
				this.setState({order,settlement:settle,showModal:false,msg:''},()=>{
					this.afterPay(settle,order);
				});
			}
		}else{
			var msg = (res && res.msg)?res.msg:'充值失败，请联系管理人员';
			baseUtil.error(msg);
		} 
	  }).catch((ex) =>{
		  var msg = "支付异常，请稍后再试"+JSON.stringify(ex);
		  baseUtil.error(msg);
	  }) 
  }
  clickButton(){
	  try{
		  cashBox.stopListenCash();
	  }catch(e){
		  this.recordError('','钱箱关闭出错'+JSON.stringify(e));
		  baseUtil.error("钱箱关闭出错，请联系管理人员'");
	  }
  }
  afterPay(settle,order){
	  if(this.props.afterPay)this.props.afterPay(settle,order);
  }
  render() {
	const patient = baseUtil.getCurrentPatient();
	const { name,balance } = patient;
	const { order,limit } = this.state;
	
	var height = document.body.clientHeight - 600;
	const cardStyle = {
        height: height+'px',
        padding: '4rem 2rem 4rem 2rem',
    };
	const  buttonStyle = {marginTop: '3rem', marginBottom: '3rem', };
	 
	  if(! baseUtil.isTodayCanCash()){
		  return (
			<NavContainer title='现金' onBack={this.onBack} onHome={this.onHome} >
		        <div style = {{ padding: '0 0 3rem 0'}} >
		          <Card  style = {{height: '100%'}} >
		            <Row className = 'cash_tip' >
		              <Col span = {3} >提示</Col>
		              <Col span = {21} >
		                <li><Icon type="caret-right" />&nbsp;&nbsp;本机器现金功能已关闭，如果您需要现金充值,可以到收费窗口办理</li>
		              </Col>
		            </Row>
		          </Card>
		        </div>
	        </NavContainer>  
		  )
		}
	  
    return (
      <NavContainer title='现金' onBack={this.onBack} onHome={this.onHome} >
      	<div style = {{ padding: '3rem 0 3rem 0',height:'20rem'}} >
	      <Card  style = {{height: '100%', textAlign: 'center'}} >
	        <div className = 'cash_payAmt' >本次预存金额&nbsp;<font>{order ? order.realAmt : 0}</font>&nbsp;元</div>
	        </Card>
	    </div>
        <Card  style = {cardStyle} >
            <Row className = 'cash_tip' >
              <Col span = {3} >提示</Col>
              <Col span = {21} >
	              {
	            	 (order.amt && order.amt != 0 ) ? (
	            		<li style = {{color:'red'}}><Icon type="caret-right" />&nbsp;&nbsp;您可以插入超过<font>{order ? order.realAmt : 0}</font>&nbsp;元的纸币，剩余金额会存进您的余额账户中</li>
	            	  ):null
	              }
            	<li><Icon type="caret-right" />&nbsp;&nbsp;本机支持面额<font style= {{color: '#DB5A5A', fontSize: '3.5rem'} }>&nbsp;100、50、20、10&nbsp;</font>元的人民币纸币</li>
            	<li><Icon type="caret-right" />&nbsp;&nbsp;本次次最高预存<font style= {{color: '#DB5A5A', fontSize: '3.5rem'} }>&nbsp;{limit}&nbsp;</font>元的人民币纸币</li>
                <li><Icon type="caret-right" />&nbsp;&nbsp;请将纸币整理平整按提示<font style= {{color: '#DB5A5A', fontSize: '3.5rem'} }>&nbsp;一张一张&nbsp;</font>放入现金入钞口</li>
              </Col>
            </Row>
        </Card>
        <div style = {{ padding: '0 0 0 0'}} >
          <Button text = "存入" onClick = {this.clickButton} />
        </div>
        <Modal visible = {this.state.showModal} closable = {false} footer = {null} width = {document.body.clientWidth*0.6836 + 'px'} style = {{top: '18rem',heigth:'6rem'}} >
        	<div  style = {{ fontSize:'3rem'}} > {this.state.msg} </div>
        </Modal>
        <Confirm   visible = {this.state.infoConfirm}   width = {document.body.clientWidth*0.95}
        buttons = {[
          {text: '没看明白', outline: true, onClick:()=>{baseUtil.goHome('cashConfirm');}},
          {text: '我知道了', onClick: ()=>{
        	  this.setState({infoConfirm:false},()=>{
        	    this.startPay() ;
        	  });	        	 
          }},
        ]}
    info = {this.renderInfoConfirm()} />
      </NavContainer>
    );
  }
  renderInfoConfirm() {
	    const patient = baseUtil.getCurrentPatient();
	    const { limit }  = this.state;
	    let btnStyle = {marginTop: '2rem', /*width: '56rem',*/};
	    var txtStyle = {
	    	textAlign: 'left',
	    	paddingLeft:'2rem',
	    	fontWeight: '400',
	    	fontSize: '2.5rem',
	    	lineHeight: '7rem',
	    };
		var fontStyle={
			color: '#DB5A5A',
			fontSize: '4.5rem',
		}
	    return (
	      <div style = {{padding: '1rem',marginTop:'-3rem'}} >
	        <Card >
	          <Row>
		          <Col span = {24} style = {txtStyle} >
		            <font style={fontStyle}>1、</font>当前患者<font style={fontStyle}>{patient.name}</font>,&nbsp;&nbsp;<font style={fontStyle}>右侧红灯变绿</font>后存入。
		          </Col>
	          </Row>
	          <Row>
		          <Col span = {24} style = {txtStyle} >
		            <font style={fontStyle}>2、</font>每次最多预存<font style={fontStyle}>{limit}</font>元,
		            &nbsp;&nbsp;<font style={fontStyle}>大额</font>现金建议到<font style={fontStyle}>窗口</font>办理
		          </Col>
	          </Row>
	          <Row>
		          <Col span = {24} style = {txtStyle}>
		            <font style={fontStyle}>3、</font><font style={fontStyle}>每次</font>只可以塞入 <font style={fontStyle}>一张</font>,&nbsp;&nbsp;
		          	可以<font style={fontStyle}>多次</font>塞入后，点击<font style={fontStyle}>存入</font>提交
		          </Col>
	          </Row>
	          <Row>
		          <Col span = {24} style = {txtStyle}>
		            <font style={fontStyle}>4、</font>只接受<font style={fontStyle}>10元</font>以上纸币
		          </Col>
	          </Row>
	          <Row>
		          <Col span = {24} style = {txtStyle}>
		            <font style={fontStyle}>5、</font>以上注意事项阅读完毕后，点击<font style={fontStyle}>我知道了</font>开始存钱
		          </Col>
	          </Row>
	        </Card>
	      </div>
	    );
	  } 
}
module.exports = PrepaidCash;