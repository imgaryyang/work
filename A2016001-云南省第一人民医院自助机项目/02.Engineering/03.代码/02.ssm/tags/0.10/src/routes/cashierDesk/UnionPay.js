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

import checkEnvTipAudio                from '../../assets/audio/checkEnvTip.mp3';
import insertCardTipAudio           from '../../assets/audio/insertCardTip.mp3';
import enterPassTipAudio               from '../../assets/audio/enterPassTip.mp3';
import payedAndTakeCardTipAudio        from '../../assets/audio/payedAndTakeCardTip.mp3';
import payingTipAudio                  from '../../assets/audio/payingTip.mp3';

const tips={
	checkEnv :checkEnvTipAudio,
	insertCard : insertCardTipAudio,
	enterPassword : enterPassTipAudio,
	payedAndTakeCard : payedAndTakeCardTipAudio,
	paying : payingTipAudio,
}
class UnionPay extends React.Component {
	static displayName = 'UnionPay';
	static description = '银联支付';
	constructor(props) {
		super(props);
	}
	componentWillMount() {
	}
	componentDidMount(){console.info('componentDidMount');
		const {step} = this.props.unionPay;
		if(step.stepName == 'init'){
			this.props.dispatch({
				type:'unionPay/checkEnv' 
			});
		}
	}
	componentDidUpdate(){
		const {step} = this.props.unionPay;
		const{stepName,stepText,audioKey} = step;
		if(audioKey != this.audioKey){
			this.audioKey = audioKey;
			var audioDom = document.getElementById("audio_"+audioKey);
			if(audioDom && audioDom.play)audioDom.play();
		}
	}
	render() {
		//    const {settlement,}          = this.props.location.state.;
		const settlement={amt:23.5};
		
		const {step,password} = this.props.unionPay;
		const {stepName,stepText,audioKey} = step;
		
		const iconWidth         = config.getWS().width / 6,
			iconHeight        = iconWidth * 376 / 600,
			guideImgWidth     = config.getWS().width / 4,
			guideImgHeight    = guideImgWidth * 1962 / 1856;
		    console.info(step);
		return (
			<WorkSpace style = {{paddingTop: '0'}} >
			{
				Object.keys(tips).map(function(key,index){
					return (
						<audio id={"audio_"+key} key={"audio_"+key} height="0" width="0">
							<source src={tips[key]} type="audio/mp3" />
						</audio>
					)
				})
			}
			
			<Card shadow = {true} style = {{margin: '2rem', padding: '2rem', fontSize: '3rem'}} >
	          <span>交易金额：<font style = {{color: '#BC1E1E'}} >{settlement.amt}</font>&nbsp;元</span>
	        </Card>
	        <div style = {{margin: '6rem auto', textAlign: 'center'}} >
	          {
	        	(stepName !== 'enterPassword')?(
	        		<img src = {upImg} width = {iconWidth} height = {iconHeight} />
	        	):(
	        		<Input value={password.value} style={{width:'60rem',margin:'auto',fontSize: '8rem', lineHeight: '11rem',height: '8rem'}} focus={true}/>
	        	)  
	          }
	          <div style = {{fontSize: '4rem', lineHeight: '10rem', marginBottom: '4rem'}} >{stepText}</div>
	          <img src = {bcrImg} width = {guideImgWidth} height = {guideImgHeight} onClick = {this.goTo} />
	        </div>
	      </WorkSpace>
		);
	}
}
  

export default connect(({unionPay}) => ({unionPay}))(UnionPay);



