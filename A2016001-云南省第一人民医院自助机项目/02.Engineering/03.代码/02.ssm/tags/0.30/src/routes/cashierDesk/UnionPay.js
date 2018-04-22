import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon,Rate}   from 'antd';

import config               from '../../config';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';
import NumKeyboard          from '../../components/keyboard/NumKeyboard';

import upImg                from '../../assets/base/union-pay.png';
import bcrImg               from '../../assets/guide/bank-card-read.gif';
import ipImg                from '../../assets/guide/input-password.png';
import baseUtil from '../../utils/baseUtil';
const tips={
}
class UnionPay extends React.Component {
	static displayName = 'UnionPay';
	static description = '银联支付';
	
	constructor(props) {
		super(props);
		this.startPay = this.startPay.bind(this);
	}
	
	componentWillMount() {
	}
	
	componentWillReceiveProps(nextProps){ 	
		/*const { closed } = nextProps.payment.unionpay;
		if(closed){
			console.info('已经取走银行卡');
			if(this.props.afterPay)this.props.afterPay();
		}*/
		const {settlement:old} = this.props.payment;
		const {settlement:now} = nextProps.payment;
		if(!old.id && now.id){console.info("银联结算单创建完毕 开始支付 ",now.id);
			this.startPay();
		}
		
		const {order:oldOrder} = this.props.payment;
		const {order:nowOrder} = nextProps.payment;
		if( oldOrder.status != nowOrder.status && nowOrder.status == '0'){console.info("订单支付完毕, status",nowOrder.status);
			if(this.props.afterPay)this.props.afterPay();
		}
		const {pinTimeOut} = this.props.payment.unionpay;
		if(pinTimeOut){//密码超时
			baseUtil.speak('unionpay_pinTimeout');
			this.props.dispatch( routerRedux.push('/homepage'));
		}
	}
	
	componentDidMount(){
		const {settlement} = this.props.payment;
		if(settlement.id){console.info("结算单已存在直接进入支付",settlement.id);
			this.startPay();
		}
	}
	
	startPay(){
		this.props.dispatch({
			type: "payment/initUnionPay",
		});
	}
	render() {
		const {settlement,unionpay}=this.props.payment;
		return (
			<WorkSpace fullScreen = {true} >
	        {this.renderGuide()}
	      </WorkSpace>
		);
	}
	renderGuide(){
		const iconWidth       = config.getWS().width / 6,
			iconHeight        = iconWidth * 376 / 600,
			guideImgWidth     = config.getWS().width / 4,
			guideImgHeight    = guideImgWidth * 1962 / 1856;
		const {settlement,unionpay}            = this.props.payment;
		const {inited,cardReaded,pinReaded,payed,password,} = unionpay;
		if(cardReaded && !pinReaded){
			return (
				<div style = {{margin: '6rem auto', textAlign: 'center'}} >
					<Input value={password} style={{width:'60rem',margin:'auto',fontSize: '8rem', lineHeight: '11rem',height: '8rem'}} focus={true}/>
			        <div style = {{fontSize: '4rem', lineHeight: '10rem', marginBottom: '2rem'}} >请输入密码</div>
			        <img src = {ipImg} width = {guideImgWidth} height = {guideImgHeight-30} />
			    </div>
			)
		}
		
		let imgSrc,text;
		if(!inited){
			text="正在准备支付环境，请等待";
		}else if(!cardReaded){//未读卡，显示插卡
			imgSrc = bcrImg;
			text="请插入银行卡";
		}else if(!pinReaded){//未输入密码 显示密码键盘
		}else if(!payed){//正在支付
			text="正在支付，请勿离开";
		}else{//支付完成
			text="支付完成，请取走您的银行卡";
		}
		
		return(
			<div style = {{margin: '6rem auto', textAlign: 'center'}} >
				{
					(bcrImg == imgSrc)? null:<img src = {upImg} width = {iconWidth} height = {iconHeight} />
				}
		        <div style = {{fontSize: '4rem', lineHeight: '10rem', marginBottom: '2rem'}} >{text}</div>
		        {imgSrc?(<img src = {imgSrc} width = {guideImgWidth} height = {guideImgHeight} />):null}
		    </div>
		);
	}
}
  

export default connect(({payment}) => ({payment}))(UnionPay);

//<Card  style = {{margin: '2rem', padding: '2rem', fontSize: '3rem'}} >
//<span>交易金额：<font style = {{color: '#BC1E1E'}} >{settlement.amt}</font>&nbsp;元</span>
//</Card>

