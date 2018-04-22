import React, { PropTypes } from 'react';
import { Row, Col, Icon }   from 'antd';
import moment from 'moment';
import styles from './AliPay.css';
import Card from '../../components/Card.jsx';
import TimerPage from '../../TimerPage.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
class AliPay extends TimerPage {
  constructor(props) {
    super(props);
    this.listenSettlement =  this.bind(this.listenSettlement,this);
    this.afterPay = this.bind(this.afterPay,this);
    this.onHome = this.bind(this.onHome,this);
    this.onBack = this.bind(this.onBack,this);
    this.timing = false;
    this.state={
    	count:0,
    }
  }
  componentDidMount() {
    const {settlement} = this.props;
    if(settlement.id){
      console.info("支付宝结算单已存在监听结算单状态：",settlement.id);
      this.timing = true;
      this.listenSettlement();
    }
  }
  componentWillUnmount() {
    this.timing=false;
  }
  listenSettlement () {
	  if(this.timing){
		  const { settlement } = this.props;
		  let fetch = Ajax.get('/api/ssm/pay/settle/info/'+settlement.id,{},{quiet:true,catch: 3600});
		  fetch.then(res => {
			if(res && res.success){
				var newSettle = res.result||{};
				console.info("支付宝结算单"+newSettle.id+"状态 ",newSettle.status);
				if(newSettle.status=='0'){
					this.timing = false;
					this.afterPay(newSettle);
					return;
				}
				setTimeout(()=>{
					this.listenSettlement();
				},200);
			}else if( res && res.msg ){
				baseUtil.error(res.msg);
			}else{
				baseUtil.error("查询支付结果失败");
			}
		  }).catch((ex) =>{
			  baseUtil.error("查询支付结果失败");
		  });
	  }
  }
  afterPay(settle){
	  if(this.props.afterPay)this.props.afterPay(settle);
  }
  onBack(){
	  if(this.props.cancelPay)this.props.cancelPay();  
  }
  onHome(){
	  baseUtil.goHome('aliHome');
  }
  render() {

    const width       = document.body.clientWidth,
          height      = document.body.clientHeight - 120,
          cardWidth   = (width - 120) / 24 * 10,
          cardHeight  = (height * 6 / 7);

    const cardStyle = {
      height: cardHeight + 'px',
      textAlign: 'center',
      paddingTop: '1.5rem',
    }

    const iconWidth   = cardWidth / 5,
          iconHeight  = iconWidth,
          qrWidth     = (cardWidth / 2) + 40,
          qrHeight    = qrWidth;
    const {settlement,order}=this.props;
    const amt = settlement.amt||0;
    const aliQRC = "/api/ssm/payment/pay/showQrCode/"+settlement.id+"/256"
    return (
    	<NavContainer title='支付宝' onBack={this.onBack} onHome={this.onHome} >
		    <Card  style = {{marginBottom: '2rem',fontSize: '3rem'}} >
		  	  <span>当前患者<font style = {{color: '#DB5A5A', fontSize: '4.5rem'}} >{order.patientName}</font>,请在充值前确认身份，以免您的财产损失！！</span>
		    </Card>
	        <div style = {{width: width + 'px', height: height + 'px', position: 'relative'}} >
	          <div className = 'alipay_row' style = {{width: width + 'px', height: cardHeight + 'px'}} >
	            <Row gutter = {40} >
	              <Col span = {2} ></Col>
	              <Col span = {20} >
	                <Card  className = 'alipay_cardStyle' style = {cardStyle} >
	                  <img src = './images/base/alipay.png' width = {iconWidth} height = {iconHeight} />
	                  <font>请打开您的支付宝<br/>扫描下方二维码完成支付</font>
	                  <img src = {aliQRC} width = {qrWidth} height = {qrHeight} />
	                </Card>
	              </Col>
	              <Col span = {2} ></Col>
	            </Row>
	          </div>
	        </div>
      </NavContainer>
    );
  }
}
module.exports = AliPay;