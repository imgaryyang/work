import React, { PropTypes } from 'react';
import { Row, Col, Icon,Rate}   from 'antd';
import NavContainer from '../../components/NavContainer.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import Input from '../../components/Input.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{log} from '../../utils/logUtil.jsx';
import singleePay from '../../utils/singleePayUtil.jsx';
import TimerPage from '../../TimerPage.jsx';
class SingleePay extends TimerPage {
	
	constructor(props) {
		super(props);
		this.onHome = this.bind(this.onHome,this);
		this.onBack = this.bind(this.onBack,this);
		this.startPay = this.bind(this.startPay,this);
		this.listenCard = this.bind(this.listenCard,this);
		this.startTran = this.bind(this.startTran,this);
		this.pay = this.bind(this.pay,this);
		this.payDone = this.bind(this.payDone,this);
		this.afterPay = this.bind(this.afterPay,this);
		this.payError = this.bind(this.payError,this);
		
		this.pinStart = this.bind(this.pinStart,this);;
		this.pinChange = this.bind(this.pinChange,this);
		this.pinTimeout = this.bind(this.pinTimeout,this);
		this.pinCancel = this.bind(this.pinCancel,this);
		this.pinEnter = this.bind(this.pinEnter,this);
		this.pinError = this.bind(this.pinError,this);	
		
		this.request = this.bind(this.request,this);
		this.state={
		  step:1,
		  pin:0,
		  settlement : props.settlement
		}
	}
	componentDidMount(){
		const {settlement} = this.state;
		if(settlement.id){
			baseUtil.speak('unionpay_checkEnv');// 播放语音 ,
			setTimeout(this.startPay,2000);
		}
	}
	onHome(){
		baseUtil.goHome('singlepayHome');//不考虑安全性
	}
	onBack(){
		log('singlepayBack');
		if(this.props.cancelPay)this.props.cancelPay();
	}
	startPay(){
		singleePay.initEnv(()=>{
			this.listenCard();
		}); 
	}
	listenCard(){
		this.setState({step:2},()=>{
			baseUtil.speak('unionpay_insertCard');
			singleePay.listenCard((cardInfo)=>{
				const { retCode,retMsg } = cardInfo;
				if('000000' == retCode){
					this.startTran();
				}else if(retMsg){
					baseUtil.error(retMsg);
				}else{
					baseUtil.error('读卡失败');
				}
			});
		})
	}
	pinStart(){//开始输入密码
		this.setState({step:3},()=>{
			console.info('pinStart')
			baseUtil.speak('unionpay_enterPass');// 播放语音
		});
	}
	pinChange(pin){
		this.setState({pin});
	}
	pinTimeout(){
		baseUtil.speak('unionpay_pinTimeout');//TODO 提示 超时，取走银行卡
		singleePay.safeClose();
		baseUtil.error('键盘超时，取消支付');
	}
	pinCancel(){
		singleePay.safeClose();//TODO 提示 超时，取走银行卡
		baseUtil.error('用户取消支付');
	}
	pinEnter(){
		baseUtil.speak('unionpay_paying');// 正在支付语音
		this.setState({step:4});
	}
	pinError(){
		singleePay.safeClose();//TODO 提示 超时，取走银行卡
		baseUtil.error('密码键盘错误，取消支付');
	}
	startTran(){
		var { settlement } = this.state;
		var req = this.getReqText();
		
		try{
			var payResp = singleePay.startTran(req,{
				onStart:this.pinStart,
				onChange:this.pinChange,
				onTimeout:this.pinTimeout,
				onCancel:this.pinCancel,
				onEnter:this.pinEnter,
				onError:this.pinError,
			});
			log('银行卡支付返回-payResp.result.responseText ',payResp.result.responseText);
			settlement = {...settlement,respText : payResp.result.responseText,}
		}catch(e){
			log('银行卡支付异常',e);
			singleePay.safeClose();
			settlement = {...settlement,respText : "" }
		}
		log('银行卡支付回调-settlement.respTextt ',settlement.respText);
		// 调用后台
		log('银行卡支付回调，settlement:',settlement);
		let fetch = Ajax.post('/api/ssm/payment/pay/callback/singleepay/'+settlement.id,settlement,{catch: 3600});
		fetch.then(res => {
			log('银行卡支付回调返回:',res);
			if(res && res.success){
				var settle = res.result;
				if(!settle || !settle.order){
					log('银行卡支付回调返回不存在订单');
					this.payError("支付失败，请稍后再试");
				}else{
					var order = settle.order;
					if(order.status !=  '0'){
						log('银行卡支付回调返回状态异常',order.status);
						if(settle.tradeRspCode != '00' && settle.tradeRspMsg != ''){
							this.payError(settle.tradeRspMsg);
						} else {
							this.payError("支付失败，请稍后再试");
						}
					}else{
						baseUtil.speak('unionpay_payAndTakeCard');// 播放语音
						singleePay.safeClose();
						this.payDone(settle,order);
					}
				}
			}else if( res && res.msg ){
				this.payError(res.msg);
	    	}else{
	    		this.payError("支付失败，请稍后再试");
	    	}
		}).catch((ex) =>{
			this.payError("支付异常，请稍后再试");
		});
	}
	payError(msg){
		baseUtil.error(msg);
		baseUtil.speak('unionpay_payFailure');// 播放语音
		singleePay.safeClose();
	}
	getReqText(){
		var { settlement } = this.state;
		var machine = baseUtil.getMachineInfo();
		
		var strAmount = (""+(settlement.amt*100)).leftPad(12,"0");/*交易金额 12*/
		console.info('singlepay.req.交易金额['+strAmount+'] ',strAmount.length+'位');
		var strPOSSeq = "".leftPad(6," ");/*POS 流水号 6*/
		console.info('singlepay.req.POS流水号['+strPOSSeq+'] ',strPOSSeq.length+'位');
		var strCounterId = "".leftPad(10," ");/*收款机号 10*///TODO 
		console.info('singlepay.req.收款机号 ['+strCounterId+'] ',strCounterId.length+'位');
		var strOperId = "".leftPad(10," ");/*收款员号 10*/
		console.info('singlepay.req.收款员号['+strOperId+'] ',strOperId.length+'位');
		var strRef = "".leftPad(15," ");/*参考号 15*/
		console.info('singlepay.req.参考号 ['+strRef+'] ',strRef.length+'位');
		var strAuth = "".leftPad(6," ");/*授权号 6*/
		console.info('singlepay.req.授权号  ['+strAuth+'] ',strAuth.length+'位');
		var strOldDate = "".leftPad(8," ");/*原交易日期 8*/
		console.info('singlepay.req.原交易日期  ['+strOldDate+'] ',strOldDate.length+'位');
		var strCardType = "H";/*卡片类型  1*/ 
		console.info('singlepay.req.卡片类型  ['+strCardType+'] ',strCardType.length+'位');
		var strTranIndex = settlement.settleNo.leftPad(76," ");/*交易索引号  传入订单号76*/
		console.info('singlepay.req.交易索引号  ['+strTranIndex+'] ',strTranIndex.length+'位');
		var strSecond = "".leftPad(37," ");/*二磁道 37*/
		console.info('singlepay.req.二磁道  ['+strSecond+'] ',strSecond.length+'位');
		var strOldTranCode = "".leftPad(2," ");/*原交易代码 2*/
		console.info('singlepay.req.原交易代码   ['+strOldTranCode+'] ',strOldTranCode.length+'位');
		var strOldTermalId = "".leftPad(15," ");/*原终端号 15*/
		console.info('singlepay.req.原终端号    ['+strOldTermalId+'] ',strOldTermalId.length+'位');
		var strOldAuth = "".leftPad(6," ");/*原授权号 6*/
		console.info('singlepay.req.原授权号    ['+strOldAuth+'] ',strOldAuth.length+'位');
		var strAcctCode = "".leftPad(3," ");/*缴 费 账 号 编号 3*/
		console.info('singlepay.req.缴费账号编号    ['+strAcctCode+'] ',strAcctCode.length+'位');
		var strStoreNo = "".leftPad(20," ");/*门店号 20*/
		console.info('singlepay.req.缴费账号编号    ['+strStoreNo+'] ',strStoreNo.length+'位');
		var strBillNo = "".leftPad(30," ");/*单据号 30*/
		console.info('singlepay.req.单据号 ['+strBillNo+'] ',strBillNo.length+'位');
		var strOrderNo = "".leftPad(15," ");/*订单号 15*/
		console.info('singlepay.req.订单号 ['+strOrderNo+'] ',strOrderNo.length+'位');
		var strBatchNo = "".leftPad(6," ");/*原批次号 6*/
		console.info('singlepay.req.原批次号 ['+strBatchNo+'] ',strBatchNo.length+'位');
		var strOldTranTime = "".leftPad(6," ");/*原交易时间 6*/
		console.info('singlepay.req.原交易时间 ['+strOldTranTime+'] ',strOldTranTime.length+'位');
		var strOldTranAmt = "".leftPad(12," ");/*原交易金额 12*/
		console.info('singlepay.req.原交易金额  ['+strOldTranAmt+'] ',strOldTranAmt.length+'位');
		var strIP = "".leftPad(15," ");/*服务器 IP 15*/
		console.info('singlepay.req.原交易金额  ['+strIP+'] ',strIP.length+'位');
		var strPort = "".leftPad(6," ");/*侦听端口 6*/
		console.info('singlepay.req.原交易金额  ['+strPort+'] ',strPort.length+'位');
		
		var req = strAmount+strPOSSeq+strCounterId+strOperId+strRef+strAuth+strOldDate+strCardType+strTranIndex+strSecond+strOldTranCode
					+strOldTermalId+strOldAuth+strAcctCode+strStoreNo+strBillNo+strOrderNo+strBatchNo+strOldTranTime+strOldTranAmt+strIP+strPort 
		console.info('singlepay.req  ',req.length+'位');
		return req;
	}
	payDone(settlement,order){
		this.setState({settlement,order,step:5},()=>{
			this.afterPay(settlement,order);
		})
	}
	afterPay(settlement,order){
		if(this.props.afterPay){
			setTimeout(()=>{
				this.props.afterPay(settlement,order)
			},1*1000);//2s后调用返回
		};
	}
	render() {
		const {settlement,step,pin }=this.state;
		console.info('render ',step);
		return (
			<NavContainer title='银行卡' onBack={this.onBack} onHome={this.onHome} >
	        {
	          step == 1?(
	        	this.renderGuideText('正在准备支付环境，请等待')
	          ):null
	        }
	        {
	          step == 2?(
	        	this.renderGuideCard('请插入银行卡')
	          ):null
	        }
	        {
	          step == 3?(
	        	this.renderGuidePwd('请输入密码')
	          ):null
	        }
	        {
	          step == 4?(
	        	this.renderGuideText('正在支付，请勿离开')
	          ):null
	        }
	        {
	          step == 5?(
	        	this.renderGuideText('支付完成，请取走您的银行卡')
	          ):null
	        }
	        </NavContainer>
		);
	}
	renderGuideText(text){
		const iconWidth  =  document.body.clientWidth / 6;
		const iconHeight = iconWidth * 376 / 600;
		return(
			<div style = {{margin: '6rem auto', textAlign: 'center'}} >
				<img src = './images/base/union-pay.png' width = {iconWidth} height = {iconHeight} />
		        <div style = {{fontSize: '4rem', lineHeight: '10rem', marginBottom: '2rem'}} >{text}</div>
		    </div>
		)
	}
	renderGuideCard(text){
		const iconWidth  =  document.body.clientWidth / 6;
		const iconHeight = iconWidth * 376 / 600;
		const guideImgWidth = document.body.clientWidth / 4;
		const guideImgHeight = guideImgWidth * 1962 / 1856;
		return(
			<div style = {{margin: '6rem auto', textAlign: 'center'}} >
		        <div style = {{fontSize: '4rem', lineHeight: '10rem', marginBottom: '2rem'}} >{text}</div>
				<img src = './images/guide/bank-card-read.gif' width = {guideImgWidth} height = {guideImgHeight} />
		    </div>
		)
	}
	renderGuidePwd(text){
		const iconWidth  =  document.body.clientWidth / 6;
		const iconHeight = iconWidth * 376 / 600;
		const guideImgWidth = document.body.clientWidth / 4;
		const guideImgHeight = guideImgWidth * 1962 / 1856;
		var password = '';
		var { pin } = this.state;
		for(var i=0;i<pin;i++){
			password = password+'*';
		}
		return(
			<div style = {{margin: '6rem auto', textAlign: 'center'}} >
				<Input value={password} style={{width:'60rem',margin:'auto',fontSize: '8rem', lineHeight: '11rem',height: '8rem'}} focus={true}/>
		        <div style = {{fontSize: '4rem', lineHeight: '10rem', marginBottom: '2rem'}} >请输入密码</div>
		        <img src = './images/guide/input-password.png' width = {guideImgWidth} height = {guideImgHeight-30} />
		    </div>
		)
	}
}
module.exports = SingleePay;