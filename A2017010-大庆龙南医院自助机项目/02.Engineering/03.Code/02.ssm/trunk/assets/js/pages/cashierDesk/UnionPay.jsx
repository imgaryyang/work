import React, { PropTypes } from 'react';
import { Row, Col, Icon,Rate}   from 'antd';
import NavContainer from '../../components/NavContainer.jsx';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import Input from '../../components/Input.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{log} from '../../utils/logUtil.jsx';
import unionPay from '../../utils/unionPayUtil.jsx';
import TimerPage from '../../TimerPage.jsx';
class UnionPay extends TimerPage {
	
	constructor(props) {
		super(props);
		this.onHome = this.bind(this.onHome,this);
		this.onBack = this.bind(this.onBack,this);
		this.startPay = this.bind(this.startPay,this);
		this.listenCard = this.bind(this.listenCard,this);
		this.readPin = this.bind(this.readPin,this);
		this.pay = this.bind(this.pay,this);
		this.payDone = this.bind(this.payDone,this);
		this.afterPay = this.bind(this.afterPay,this);
		this.payError = this.bind(this.payError,this);
		
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
		baseUtil.goHome('unionpayHome');//不考虑安全性
	}
	onBack(){
		log('unionpayBack');
		if(this.props.cancelPay)this.props.cancelPay();
	}
	startPay(){
		try{
			unionPay.initEnv(()=>{
				this.listenCard();
			});
		}catch(e){
			log('检查支付环境异常',e);
			baseUtil.error('检查支付环境失败');
		}
	}
	listenCard(){
		this.setState({step:2},()=>{
			unionPay.listenCard(()=>{
				this.readPin();
			});
		})
	}
	readPin(){
		this.setState({step:3},()=>{
			unionPay.listenPin({ 
				onChange:this.pinChange,
				onTimeout:this.pinTimeout,
				onCancel:this.pinCancel,
				onEnter:this.pinEnter,
				onError:this.pinError,	
			});
		})
	}
	pinChange(pin){
		this.setState({pin});
	}
	pinTimeout(){
		baseUtil.speak('unionpay_pinTimeout');//TODO 提示 超时，取走银行卡
		unionPay.safeClose();
		baseUtil.error('键盘超时，取消支付');
	}
	pinCancel(){
		unionPay.safeClose();//TODO 提示 超时，取走银行卡
		baseUtil.error('用户取消支付');
	}
	pinEnter(){
		unionPay.readPin(()=>{
			this.pay();
		});
	}
	pinError(){
		unionPay.safeClose();//TODO 提示 超时，取走银行卡
		baseUtil.error('密码键盘错误，取消支付');
	}
	pay(){
		baseUtil.speak('unionpay_paying');// 正在支付语音
		this.setState({step:4},()=>{
			this.request();
		})
	}
	request(){
		var { settlement } = this.state;
		var req = this.getReqText();
		try{
			var payResp = unionPay.pay(req);
			settlement = {...settlement,respText : payResp.result.responseText,}
		}catch(e){
			log('银联支付异常',e);
			unionPay.safeClose();
			settlement = {...settlement,respText : "" }
		}
		// 调用后台
		log('银联支付回调，settlement:',settlement);
		let fetch = Ajax.post('/api/ssm/payment/pay/callback/unionpay/'+settlement.id,settlement,{catch: 3600});
		fetch.then(res => {
			log('银联支付回调返回:',res);
			if(res && res.success){
				var settle = res.result;
				if(!settle || !settle.order){
					log('银联支付回调返回不存在订单');
					this.payError("支付失败，请稍后再试");
				}else{
					var order = settle.order;
					if(order.status !=  '0'){
						log('银联支付回调返回状态异常',order.status);
						if(settle.tradeRspCode != '00' && settle.tradeRspMsg != ''){
							this.payError(settle.tradeRspMsg);
						} else {
							this.payError("支付失败，请稍后再试");
						}
					}else{
						baseUtil.speak('unionpay_payAndTakeCard');// 播放语音
						unionPay.safeClose();
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
		unionPay.safeClose();
	}
	getReqText(){
		var { settlement } = this.state;
		var machine = baseUtil.getMachineInfo();
		var strCounterId = "12345678".leftPad(8,"0");// 	8	款台号
		console.info('unionpay.req.款台号['+strCounterId+'] ',strCounterId.length+'位');
		var strOperId	= machine.hisUser.leftPad(8,"0");//8	操作员号
		console.info('unionpay.req.操作员号['+strOperId+'] ',strOperId.length+'位');//01，0000
		var strTransType ="00".leftPad(2,"0");//2	交易编号 传统类交易：00:消费 POS通：01：消费
		console.info('unionpay.req.交易编号['+strTransType+'] ',strTransType.length+'位');
		var strAmount = (""+(settlement.amt*100)).leftPad(12,"0");//	12	金额
		console.info('unionpay.req.金额['+strAmount+'] ',strAmount.length+'位');
		var strOldTrace = "".leftPad(6,"0");	//6	原流水号
		console.info('unionpay.req.原流水号['+strOldTrace+'] ',strOldTrace.length+'位');
		var strOldDate = "".leftPad(8,"0");	//8	原交易日期YYYYMMDD
		console.info('unionpay.req.原交易日期['+strOldDate+'] ',strOldDate.length+'位');
		var strOldRef = "".leftPad(12,"0");	//12	原系统参考号
		console.info('unionpay.req.原系统参考号['+strOldRef+'] ',strOldRef.length+'位');
		var strOldAuth = "".leftPad(6,"0");	//6	原授权号
		console.info('unionpay.req.原授权号['+strOldAuth+'] ',strOldAuth.length+'位');
		var strOldBatch = "".leftPad(6,"0");//6	原批次号
		console.info('unionpay.req.原批次号['+strOldBatch+'] ',strOldBatch.length+'位');
		var strMemo = "".leftPad(1024,"20");//1024	见第4章说明
		console.info('unionpay.req.1024[] ',strMemo.length+'位');
		var strLrc = "123"	;//3	3个校验字符
		console.info('unionpay.req.校验字符['+strLrc+'] ',strLrc.length+'位');
		var req = strCounterId+strOperId+strTransType+strAmount+strOldTrace+strOldDate+strOldRef+strOldAuth+strOldBatch+strMemo+strLrc;
		console.info('unionpay.req  ',req.length+'位');
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
		
		return (
			<NavContainer title='银联' onBack={this.onBack} onHome={this.onHome} >
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
module.exports = UnionPay;