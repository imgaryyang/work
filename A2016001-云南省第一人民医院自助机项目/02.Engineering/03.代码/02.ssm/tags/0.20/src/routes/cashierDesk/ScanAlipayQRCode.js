import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './ScanAlipayQRCode.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';
import NumKeyboard          from '../../components/keyboard/NumKeyboard';

import weixinImg            from '../../assets/base/weixin.png';
import alipayImg            from '../../assets/base/alipay.png';
import weixinQRC            from '../../assets/base/weixin-QR-Code.png';
import alipayQRC            from '../../assets/base/alipay-QR-Code.png';

class ScanAlipayQRCode extends React.Component {

  static displayName = 'ScanAlipayQRCode';
  static description = '支付宝扫码支付';

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
    this.goTo = this.goTo.bind(this);
  }

  componentWillMount() {
  }

  goTo() {

    this.props.dispatch({
      type: 'order/paid',
      payload: {}
    });

    this.props.dispatch(routerRedux.push({
      pathname: '/paidDone',
      state: {
        nav: {
          title: this.props.location.state.nav.title,
          backDisabled: true,
        },
      },
    }));
  }

  render() {

    const {order} = this.props.order;

    let amt = 0, settlement = null;
    for (var i = 0 ; order && i < order['Settlements'].length ; i++) {
      settlement = order['Settlements'][i];
      if (settlement['PaidType'] == '32' ) {
        amt = settlement['Amt'];
        break;
      }
    }

    const width       = config.getWS().width,
          height      = config.getWS().height - 10 * config.remSize,
          cardWidth   = (width - 120) / 24 * 10,
          cardHeight  = height * 5 / 7;

    const cardStyle = {
      height: cardHeight + 'px',
      textAlign: 'center',
      paddingTop: '3rem',
    }

    const iconWidth   = cardWidth / 4,
          iconHeight  = iconWidth,
          qrWidth     = cardWidth * .8,
          qrHeight    = qrWidth;

    return (
      <WorkSpace >
        <Card shadow = {true} style = {{margin: '2rem', padding: '2rem', fontSize: '3rem'}} >
          <span>{order && order['OrderDesc'] ? order['OrderDesc'] : '交易金额'}：<font style = {{color: '#BC1E1E', fontSize: '4.5rem'}} >{amt.formatMoney()}</font>&nbsp;&nbsp;元</span>
        </Card>
        <div style = {{width: width + 'px', height: height + 'px', position: 'relative'}} >
          <div className = {styles.cardStyle} style = {cardStyle} onClick = {this.goTo} >
            <img src = {alipayImg} width = {iconWidth} height = {iconHeight} />
            <font>请打开您的支付宝<br/>扫描下方二维码完成支付</font>
            <img src = {alipayQRC} width = {qrWidth} height = {qrHeight} />
          </div>
        </div>
      </WorkSpace>
    );
  }
}
  

export default connect(({account, order, message}) => ({account, order, message}))(ScanAlipayQRCode);



