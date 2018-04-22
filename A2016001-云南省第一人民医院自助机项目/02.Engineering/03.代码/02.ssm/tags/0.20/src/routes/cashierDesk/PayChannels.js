import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './PayChannels.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';
import NumKeyboard          from '../../components/keyboard/NumKeyboard';

import weixinImg            from '../../assets/base/weixin.png'; //400*400
import alipayImg            from '../../assets/base/alipay.png'; //400*400
import cashImg              from '../../assets/base/cash.png';   //600*365
import upImg                from '../../assets/base/union-pay.png'; //600*376

class PayChannels extends React.Component {

  static displayName = 'PayChannels';
  static description = '支付渠道';

  static propTypes = {
  };

  static defaultProps = {
  };
  
  channels={
	  balance     : {code:'balance'   ,name:'就诊卡余额',pathname:'/homepage'},
	  wxpay       : {code:'wxpay'     ,name:'微信'      ,pathname:''},
	  cash        : {code:'cash'      ,name:'现金'      ,pathname:''},
	  alipay      : {code:'alipay'    ,name:'支付宝'    ,pathname:''},
	  unionpay    : {code:'unionpay'  ,name:'银联'      ,pathname:'/cashierDesk/unionpay'}
  }
  /**
  * 初始化状态
  */
  state = {
  };

  constructor(props) {
    super(props);
  }
  
  componentWillMount() {
  }
  
  componentWillMount() {
	  const {payChannelCode,canChooseChannel} = this.props.payment.settlement;
	  console.info('payChannelCode: ',payChannelCode);
	  if(payChannelCode && !canChooseChannel ){
		  this.goPayChannel(payChannelCode);
	  }
  }
  
  componentWillReceiveProps(nextProps){
	  const {payChannelCode,canChooseChannel} = nextProps.payment.settlement;
	  console.info('payChannelCode1: ',payChannelCode);
	  if(payChannelCode && !canChooseChannel ){
		  this.goPayChannel(payChannelCode);
	  }
  }
  goPayChannel(code){
	  const channel = this.channels[code];
	  if(!channel)return;
	  this.props.dispatch(routerRedux.push({
		  pathname: channel.pathname,
		  state : {nav:{title:channel.name}}
	  }));
  }
  selectChannel(code){
	  const channel = this.channels[code];
	  if(!channel)return;
	  this.props.dispatch({
		  type: "payment/chooseChannel",
		  payload:{channelCode:code}
	  });
  }
  render() {
	  const { account   } = this.props.patient;
	  const { settlement} = this.props.payment;
	  const width           = config.getWS().width - 2 * config.remSize,
	  		containerHeight = config.getWS().height - 13.5 * config.remSize,
	  		height          = containerHeight * 5 / 7,
	  		cardWidth       = (width - 4 * config.navBar.padding * config.remSize) / 2,
	  		cardHeight      = height / 2 - 2 * config.remSize,
	  		imgHeight       = cardHeight / 4,
	  		upImgWidth      = imgHeight * 600 / 376,  
	  		weixinImgWidth  = imgHeight,
	  		alipayImgWidth  = imgHeight,
	  		cashImgWidth    = imgHeight * 600 / 365,
	  		
	  		cardStyle       = {height: cardHeight + 'px',textAlign: 'center', paddingTop: (cardHeight / 4) + 'px',};
	  if(!account.balance)account.balance=0;
    return (
      <WorkSpace fullScreen = {true} >
        <Card shadow = {true} style = {{margin: '2rem', padding: '2rem', fontSize: '3rem'}} >
          <span>交易金额：<font style = {{color: '#BC1E1E', fontSize: '4.5rem'}} >{settlement.amt}</font>&nbsp;&nbsp;元</span>
        </Card>
        <div style = {{width: config.getWS().width + 'px', height: containerHeight + 'px', position: 'relative'}} >
          <div className = {styles.container} style = {{width: width + 'px', height: height + 'px', padding: '0 ' + config.navBar.padding + 'rem'}} >
            <Row gutter = {2 * config.navBar.padding * config.remSize} type = 'flex' justify = 'center' >
              <Col className = {styles.col} style = {{paddingBottom: 2 * config.navBar.padding * config.remSize + 'px'}} span = {12} >
                <Card shadow = {true} style = {cardStyle} onClick={this.selectChannel.bind(this,'balancepay')}>
                  <span className = {styles.balance} style = {{top: (cardHeight / 7) + 'px'}} >就诊卡账户当前余额<br/><h1>{account.balance.formatMoney()}&nbsp;元</h1></span>
                  <font>就诊卡预存余额支付</font>
                </Card>
              </Col>
              <Col className = {styles.col} style = {{paddingBottom: 2 * config.navBar.padding * config.remSize + 'px'}} span = {12} >
                <Card shadow = {true} style = {cardStyle} onClick={this.selectChannel.bind(this,'unionpay')}>
                  <img src = {upImg} width = {upImgWidth} height = {imgHeight} />
                  <font>银行卡支付</font>
                </Card>
              </Col>
              <Col className = {styles.col} style = {{paddingBottom: 2 * config.navBar.padding * config.remSize + 'px'}} span = {12} >
                <Card shadow = {true} style = {cardStyle} onClick={this.selectChannel.bind(this,'alipay')}>
                  <img src = {alipayImg} width = {alipayImgWidth} height = {alipayImgWidth} />
                  <font>支付宝支付</font>
                </Card>
              </Col>
              <Col className = {styles.col} style = {{paddingBottom: 2 * config.navBar.padding * config.remSize + 'px'}} span = {12} >
                <Card shadow = {true} style = {cardStyle} onClick={this.selectChannel.bind(this,'wxpay')} >
                  <img src = {weixinImg} width = {weixinImgWidth} height = {weixinImgWidth} />
                  <font>微信支付</font>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </WorkSpace>
    );
  }
}
  

export default connect(({patient,payment}) => ({patient,payment}))(PayChannels);



