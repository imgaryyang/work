import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './PaymentChannels.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';
import NumKeyboard          from '../../components/keyboard/NumKeyboard';

import weixinImg            from '../../assets/base/weixin.png'; //400*400
import alipayImg            from '../../assets/base/alipay.png'; //400*400
import cashImg              from '../../assets/base/cash.png';   //600*365
import upImg                from '../../assets/base/union-pay.png'; //600*376

class PaymentChannels extends React.Component {

  static displayName = 'PaymentChannels';
  static description = '支付渠道';

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
  * 初始化状态
  */
  state = {
  };

  constructor(props) {
    super(props);
    this.goToPay = this.goToPay.bind(this);
    this.acctPay = this.acctPay.bind(this);
  }

  componentWillMount() {
    if (!this.props.user.user)
      this.props.dispatch({type: 'user/login'});
    if (!this.props.account.account.Balance)
      this.props.dispatch({
        type: 'account/loadAcctInfo',
        payload: {
          //userId: this.props.user.UserId
        },
      });
  }

  acctPay (type, title) {

    let {orderPreSettlement} = this.props.order;

    if (orderPreSettlement.SelfPay > this.props.account.account.Balance) {
      this.props.dispatch({
        type: 'message/show',
        payload: {
          msg: (
            <div style = {{fontSize: '2.5rem', textAlign: 'center', margin: '1.5rem', lineHeight: '4rem', whiteSpace: 'nowrap'}} >
              就诊卡预存账户余额不足<br/>
              您此次最多只能转入&nbsp;<font style = {{color: '#BC1E1E'}} >{this.props.account.account.Balance.formatMoney()}</font>&nbsp;元
            </div>
          ),
        }
      });
      return;
    }

    this.props.dispatch({
      type: 'account/acctPay', 
      payload:{
        amt: orderPreSettlement.SelfPay
      }
    });

    this.props.dispatch({
      type: 'order/accountPay',
      payload: {
        type: type
      },
    });

    this.props.dispatch(routerRedux.push({
      pathname: '/paidDone',
      state: {
        nav: {
          title: '缴费成功',
          backDisabled: true,
        },
      },
    }));
  }

  goToPay (type, title) {
    if (type == '00') {
      this.acctPay(type, title);
      return;
    }

    this.props.dispatch({
      type: 'order/goToPay',
      payload: {
        type: type,
        typeName: title,
      },
    });

    let path;
    if (type == '20')  path = 'bankCard';
    else if (type == '32')  path = 'scanAlipayQRCode';
    else if (type == '31')  path = 'scanWeixinQRCode';

    this.props.dispatch(routerRedux.push({
      pathname: path,
      state: {
        nav: {
          title: title,
          backDisabled: false,
        },
      },
    }));
  }

  render() {

    console.log('PaymentChannels.render():', this.props.order);

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

          cardStyle       = {
            height: cardHeight + 'px',
            textAlign: 'center',
            paddingTop: (cardHeight / 4) + 'px',
          };

    let {orderPreSettlement} = this.props.order;

    return (
      <WorkSpace fullScreen = {true} >
        <Card shadow = {true} style = {{margin: '2rem', padding: '2rem', fontSize: '3rem'}} >
          <span>交易金额：<font style = {{color: '#BC1E1E', fontSize: '4.5rem'}} >{orderPreSettlement && orderPreSettlement.SelfPay ? orderPreSettlement.SelfPay.formatMoney() : 0}</font>&nbsp;&nbsp;元</span>
        </Card>
        <div style = {{width: config.getWS().width + 'px', height: containerHeight + 'px', position: 'relative'}} >
          <div className = {styles.container} style = {{width: width + 'px', height: height + 'px', padding: '0 ' + config.navBar.padding + 'rem'}} >
            <Row gutter = {2 * config.navBar.padding * config.remSize} type = 'flex' justify = 'center' >
              <Col className = {styles.col} style = {{paddingBottom: 2 * config.navBar.padding * config.remSize + 'px'}} span = {12} >
                <Card shadow = {true} style = {cardStyle} onClick = {() => this.goToPay('00', '就诊卡预存余额支付')} >
                  <span className = {styles.balance} style = {{top: (cardHeight / 7) + 'px'}} >就诊卡账户当前余额<br/><h1>{this.props.account.account.Balance.formatMoney()}&nbsp;元</h1></span>
                  <font>就诊卡预存余额支付</font>
                </Card>
              </Col>
              <Col className = {styles.col} style = {{paddingBottom: 2 * config.navBar.padding * config.remSize + 'px'}} span = {12} >
                <Card shadow = {true} style = {cardStyle} onClick = {() => this.goToPay('20', '银行卡支付')} >
                  <img src = {upImg} width = {upImgWidth} height = {imgHeight} />
                  <font>银行卡支付</font>
                </Card>
              </Col>
              <Col className = {styles.col} style = {{paddingBottom: 2 * config.navBar.padding * config.remSize + 'px'}} span = {12} >
                <Card shadow = {true} style = {cardStyle} onClick = {() => this.goToPay('32', '支付宝支付')} >
                  <img src = {alipayImg} width = {alipayImgWidth} height = {alipayImgWidth} />
                  <font>支付宝支付</font>
                </Card>
              </Col>
              <Col className = {styles.col} style = {{paddingBottom: 2 * config.navBar.padding * config.remSize + 'px'}} span = {12} >
                <Card shadow = {true} style = {cardStyle} onClick = {() => this.goToPay('31', '微信支付')} >
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
  

export default connect(({order, account, user, message}) => ({order, account, user, message}))(PaymentChannels);



