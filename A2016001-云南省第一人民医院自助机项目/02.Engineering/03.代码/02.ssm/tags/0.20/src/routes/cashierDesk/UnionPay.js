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
import bcrImg               from '../../assets/guide/bank-card-read.png';
import ipImg                from '../../assets/guide/input-password.png';

const tips={
}
class UnionPay extends React.Component {
	static displayName = 'UnionPay';
	static description = '银联支付';
	
	constructor(props) {
		super(props);
	}
	
	componentWillMount() {
		const {settlement}=this.props.payment;
		if(!settlement)this.props.dispatch(routerRedux.push('/homepage'));
	}
	
	componentWillReceiveProps(nextProps){ 	
	}
	
	componentDidMount(){
		this.props.dispatch({
			type: "payment/initUnionPay",
		});
	}
	
	render() {
		const {settlement,unionpay}=this.props.payment;
		return (
			<WorkSpace style = {{paddingTop: '0'}} >
			<Card shadow = {true} style = {{margin: '2rem', padding: '2rem', fontSize: '3rem'}} >
	          <span>交易金额：<font style = {{color: '#BC1E1E'}} >{settlement.amt}</font>&nbsp;元</span>
	        </Card>
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
			        <div style = {{fontSize: '4rem', lineHeight: '10rem', marginBottom: '4rem'}} >请输入密码</div>
			        <img src = {ipImg} width = {guideImgWidth} height = {guideImgHeight} />
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
				<img src = {upImg} width = {iconWidth} height = {iconHeight} />
		        <div style = {{fontSize: '4rem', lineHeight: '10rem', marginBottom: '4rem'}} >{text}</div>
		        {imgSrc?(<img src = {imgSrc} width = {guideImgWidth} height = {guideImgHeight} />):null}
		    </div>
		);
	}
}
  

export default connect(({payment}) => ({payment}))(UnionPay);



