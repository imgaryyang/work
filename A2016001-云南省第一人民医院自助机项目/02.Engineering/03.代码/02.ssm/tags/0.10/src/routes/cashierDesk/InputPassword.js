import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './InputPassword.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';
import NumKeyboard          from '../../components/keyboard/NumKeyboard';

import upImg                from '../../assets/base/union-pay.png';
import ipImg                from '../../assets/guide/input-password.png';

class InputPassword extends React.Component {

  static displayName = 'InputPassword';
  static description = '输入密码';

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

  book () {
    //TODO: 输入密码支付完成后记账
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
    
    const iconWidth         = config.getWS().width / 6,
          iconHeight        = iconWidth * 376 / 600,
          guideImgWidth     = config.getWS().width / 4,
          guideImgHeight    = guideImgWidth * 160 / 241;

    let amt = 0, settlement = null;
    for (var i = 0 ; order && i < order['Settlements'].length ; i++) {
      settlement = order['Settlements'][i];
      if (settlement['PaidType'] == '20' ) {
        amt = settlement['Amt'];
        break;
      }
    }

    return (
      <WorkSpace style = {{paddingTop: '0'}} >
        <Card shadow = {true} style = {{margin: '2rem', padding: '2rem', fontSize: '3rem'}} >
          <span>{order && order['OrderDesc'] ? order['OrderDesc'] : '交易金额'}：<font style = {{color: '#BC1E1E', fontSize: '4.5rem'}} >{amt.formatMoney()}</font>&nbsp;&nbsp;元</span>
        </Card>
        <div style = {{margin: '6rem auto', textAlign: 'center'}} >
          <img src = {upImg} width = {iconWidth} height = {iconHeight} />
          <div style = {{fontSize: '4rem', lineHeight: '10rem', marginBottom: '4rem'}} >请输入密码</div>
          <img src = {ipImg} width = {guideImgWidth} height = {guideImgHeight} onClick = {this.goTo} />
        </div>
      </WorkSpace>
    );
  }
}
  

export default connect(({account, order, inpatient, message}) => ({account, order, inpatient, message}))(InputPassword);



