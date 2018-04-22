import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './ScanQRCode.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';
import NumKeyboard          from '../../components/keyboard/NumKeyboard';

import weixinImg            from '../../assets/base/weixin.png';
import alipayImg            from '../../assets/base/alipay.png';
import weixinQRC            from '../../assets/base/weixin-QR-Code.png';
import alipayQRC            from '../../assets/base/alipay-QR-Code.png';

class ScanQRCode extends React.Component {

  static displayName = 'ScanQRCode';
  static description = '扫码支付';

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

  goTo () {

    this.props.dispatch({
      type: 'order/paid',
      payload: {}
    });

    const {order} = this.props.order;

    if (order['OrderType'] == '0') { //预存
      this.props.dispatch({
        type: 'account/prepaidDone',
        payload: order
      });
    } else if (order['OrderType'] == '4') { //住院预缴
      this.props.dispatch({
        type: 'inpatient/prepaidDone',
        payload: order
      });
    }

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

    const width       = config.getWS().width,
          height      = config.getWS().height - 10 * config.remSize,
          cardWidth   = (width - 120) / 24 * 10,
          cardHeight  = height * 5 / 7;

    const cardStyle = {
      height: cardHeight + 'px',
      textAlign: 'center',
      paddingTop: '3rem',
    }

    const iconWidth   = cardWidth / 5,
          iconHeight  = iconWidth,
          qrWidth     = cardWidth / 2,
          qrHeight    = qrWidth;

    let amt = 0, settlement = null;
    for (var i = 0 ; order && i < order['Settlements'].length ; i++) {
      settlement = order['Settlements'][i];
      if (settlement['PaidType'] == '30' ) {
        amt = settlement['Amt'];
        break;
      }
    }

    return (
      <WorkSpace fullScreen = {true} >
        <Card shadow = {true} style = {{margin: '2rem', marginBottom: '0', padding: '2rem', fontSize: '3rem'}} >
          <span>{order && order['OrderDesc'] ? order['OrderDesc'] : '交易金额'}：<font style = {{color: '#BC1E1E', fontSize: '4.5rem'}} >{amt}</font>&nbsp;&nbsp;元</span>
        </Card>
        <div style = {{width: width + 'px', height: height + 'px', position: 'relative'}} >
          <div className = {styles.row} style = {{width: width + 'px', height: cardHeight + 'px'}} >
            <Row gutter = {40} >
              <Col span = {2} ></Col>
              <Col span = {10} >
                <Card shadow = {true} className = {styles.cardStyle} style = {cardStyle} onClick = {() => this.next('siCard', '社保卡')} onClick = {this.goTo} >
                  <img src = {weixinImg} width = {iconWidth} height = {iconHeight} />
                  <font>请打开您的微信<br/>扫描下方二维码完成支付</font>
                  <img src = {weixinQRC} width = {qrWidth} height = {qrHeight} />
                </Card>
              </Col>
              <Col span = {10} >
                <Card shadow = {true} className = {styles.cardStyle} style = {cardStyle} onClick = {() => this.next('healthCard', '居民健康卡')} onClick = {this.goTo} >
                  <img src = {alipayImg} width = {iconWidth} height = {iconHeight} />
                  <font>请打开您的支付宝<br/>扫描下方二维码完成支付</font>
                  <img src = {alipayQRC} width = {qrWidth} height = {qrHeight} />
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
  

export default connect(({account, order, inpatient, message}) => ({account, order, inpatient, message}))(ScanQRCode);



