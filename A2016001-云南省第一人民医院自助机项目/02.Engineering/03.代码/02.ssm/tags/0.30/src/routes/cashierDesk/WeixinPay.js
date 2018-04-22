import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './WeixinPay.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';

import weixinImg            from '../../assets/base/weixin.png';

class WeixinPay extends React.Component {

  state = {
  };
  
  timing = true;
  
  constructor(props) {
    super(props);
    this.listenSettlement = this.listenSettlement.bind(this);
    this.afterPay = this.afterPay.bind(this);
  }
  componentDidMount() {
    const {settlement} = this.props.payment;
    if(settlement.id){console.info("微信结算单已存在监听结算单状态：",settlement.id);
      this.listenSettlement();
    }
  }
  componentWillReceiveProps(nextProps){
	  const {settlement:old} = this.props.payment;
	  const {settlement:now} = nextProps.payment;
	  if(!old.id && now.id){console.info("微信结算单创建完毕 开始监听结算单状态 ",now.id);
	  		this.listenSettlement();
	  }
  }
  componentWillUnmount() {
    this.timing=false;
  }
  listenSettlement () {
	  if(this.timing){
		  const { settlement } = this.props.payment;
		  console.info("微信结算单"+settlement.id+"状态 ",settlement.status);
		  if(settlement.status=='0'){
			  this.timing = false;
			  this.afterPay();
			  return;
		  }
		  this.props.dispatch({type: "payment/querySettlement",});  
		  setTimeout(this.listenSettlement,500);
	  }
  }
  afterPay(){
	  if(this.props.afterPay)this.props.afterPay();
  }
  render() {
    const width       = config.getWS().width,
          height      = config.getWS().height - 10 * config.remSize,
          cardWidth   = (width - 120) / 24 * 10,
          cardHeight  = height * 6 / 7;

    const cardStyle = {
      height: cardHeight + 'px',
      textAlign: 'center',
      paddingTop: '3rem',
    }

    const iconWidth   = cardWidth / 5,
          iconHeight  = iconWidth,
          qrWidth     = (cardWidth / 2) + 40,
          qrHeight    = qrWidth;
    
    const {settlement,unionpay}=this.props.payment;
    const amt = settlement.amt||0;
    const QRC = "/api/ssm/payment/pay/showQrCode/"+settlement.id+"/256"
    return (
      <WorkSpace fullScreen = {true} >
        <div style = {{width: width + 'px', height: height + 'px', position: 'relative'}} >
          <div className = {styles.row} style = {{width: width + 'px', height: cardHeight + 'px'}} >
            <Row gutter = {40} >
              <Col span = {2} ></Col>
              <Col span = {20} >
                <Card  className = {styles.cardStyle} style = {cardStyle} >
                  <img src = {weixinImg} width = {iconWidth} height = {iconHeight} />
                  <font>请打开您的微信<br/>扫描下方二维码完成支付</font>
                  <img src = {QRC} width = {qrWidth} height = {qrHeight} />
                </Card>
              </Col>
              <Col span = {2} ></Col>
            </Row>
          </div>
        </div>
      </WorkSpace>
    );
  }
}
  

export default connect(({payment}) => ({payment}))(WeixinPay);
