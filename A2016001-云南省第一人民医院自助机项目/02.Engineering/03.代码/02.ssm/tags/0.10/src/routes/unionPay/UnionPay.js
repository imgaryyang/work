import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Button,Icon,Alert,Row,Col,Progress}  from 'antd';
import insertCardTipAudio               from '../../assets/audio/insertCardTip.mp3';
class UnionPay extends React.Component {
	 constructor(props) {
		    super(props);
	 }
	start(){
		const {unionpay,dispatch} = this.props;
		 dispatch({
			 type:'unionpay/startPay'
		 });
	}
	ejectCard(){
		const {unionpay,dispatch} = this.props;
		dispatch({
			 type:'unionpay/popCard'
		 });
	}
	pay(){
		const {unionpay,dispatch} = this.props;
		dispatch({
			 type:'unionpay/pay'
		 });
	}
	render(){
		const {unionpay,dispatch} = this.props;
		const {messages,progress} = unionpay;
		return (
				<div style={{textAlign: 'center'}}>
				<audio height="0" width="0" autoPlay={true}>
				  <source src={insertCardTipAudio} type="audio/mp3" />
				  <embed height="0" width="0" src={insertCardTipAudio}/>
				</audio>
				
				<div>
					<Progress type="circle" width={400} percent={progress.percent} format={()=> `${progress.text} ${progress.percent}%`} />
				</div>
				</div>
			);
	}
}

export default connect(({unionpay}) => ({unionpay}))(UnionPay);

//<Row>
//<Col span ={4}>
//<Row><Button onClick={start}><Icon type="forward" />开始</Button></Row>
//<Row><Button onClick={ejectCard}><Icon type="forward" />弹卡</Button></Row>
//<Row><Button onClick={pay}><Icon type="forward" />支付</Button></Row>
//</Col>
//<Col span ={20}>
//    <Row>
//        {
//			messages.map(function(msg,index){
//				var title = index+" "+msg.title;
//				return (
//					<Col span ={6} key={'msg_'+index} style={{marginLeft:'5px'}}>
//						<Alert  showIcon message={title} type={msg.type}  description={msg.description} />
//					</Col>
//				)
//			})
//		}
//    </Row>
//</Col>		
//<Col span ={3}></Col>
//</Row>
//
//
//<div>
//<Progress type="circle" percent={progress.percent} format={()=> progress.text} />
//</div>