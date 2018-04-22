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
import baseUtil          from '../../utils/baseUtil';
class PayChannels extends React.Component {

 /* channels={
	  wxpay       : {code:'9998'     ,name:'微信'      ,pathname:''},
	  //cash        : {code:'0000'      ,name:'现金'      ,pathname:''},
	  alipay      : {code:'9999'    ,name:'支付宝'    ,pathname:''},
	  unionpay    : {code:'unionpay'  ,name:'银联'      ,pathname:'/cashierDesk/unionpay'}
  }*/
  
  state = {};
  
  constructor(props) {
    super(props);
  }
  
  componentWillMount() {
	  
  }
  
  componentWillMount() {
  }
  
  componentWillReceiveProps(nextProps){
  }
  goPayChannel(code){
  }
  selectChannel(channel,type){
	 if(this.props.onSelect)this.props.onSelect(channel,type);
  }
  render() {
	  const { baseInfo   } = this.props.patient;
	  const { order } = this.props.deposit.recharge;
	  const { machine } = this.props.frame;
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
	  if(!baseInfo.balance)baseInfo.balance=0;
	  
    return (
      <WorkSpace fullScreen = {true} >
        <div style = {{width: config.getWS().width + 'px', height: containerHeight + 'px', position: 'relative'}} >
          <div className = {styles.container} style = {{width: width + 'px', height: height + 'px', padding: '0 ' + config.navBar.padding + 'rem'}} >
            <Row gutter = {2 * config.navBar.padding * config.remSize} type = 'flex' justify = 'center' >
              <Col className = {styles.col} style = {{paddingBottom: 2 * config.navBar.padding * config.remSize + 'px'}} span = {12} >
                <Card  style = {cardStyle} onClick={this.selectChannel.bind(this,machine.mngCode,'ssm')}>
                  <img src = {upImg} width = {upImgWidth} height = {imgHeight} />
                  <font>银行卡支付</font>
                </Card>
              </Col>
              <Col className = {styles.col} style = {{paddingBottom: 2 * config.navBar.padding * config.remSize + 'px'}} span = {12} >
                <Card style = {cardStyle} onClick={this.selectChannel.bind(this,'9999','scan')}>
                  <img src = {alipayImg} width = {alipayImgWidth} height = {alipayImgWidth} />
                  <font>支付宝支付</font>
                </Card>
              </Col>
              <Col className = {styles.col} style = {{paddingBottom: 2 * config.navBar.padding * config.remSize + 'px'}} span = {12} >
                <Card style = {cardStyle} onClick={this.selectChannel.bind(this,'9998','scan')} >
                  <img src = {weixinImg} width = {weixinImgWidth} height = {weixinImgWidth} />
                  <font>微信支付</font>
                </Card>
              </Col>
             {
            	 baseUtil.isTodayCanCash?(
	            	 <Col className = {styles.col} style = {{paddingBottom: 2 * config.navBar.padding * config.remSize + 'px'}} span = {12} >
	            	   	<Card style = {cardStyle} onClick={this.selectChannel.bind(this,'0000','scan')} >
	            	   		<img src = {cashImg} width = {weixinImgWidth} height = {weixinImgWidth} />
	            	   		<font>现金支付</font>
	            	   	</Card>
	                 </Col>
            	 ):null
             }
            </Row>
          </div>
        </div>
      </WorkSpace>
    );
  }
}
  

export default connect(({patient,deposit,frame}) => ({patient,deposit,frame}))(PayChannels);


