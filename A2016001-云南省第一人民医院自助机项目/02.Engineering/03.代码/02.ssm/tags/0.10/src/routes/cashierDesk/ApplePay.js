import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './InsertBankCard.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';
import NumKeyboard          from '../../components/keyboard/NumKeyboard';

import upImg                from '../../assets/base/union-pay.png';
import bcrImg               from '../../assets/guide/bank-card-read.png';

class InsertBankCard extends React.Component {

  static displayName = 'InsertBankCard';
  static description = '插入银行卡';

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
    this.props.dispatch(routerRedux.push({
      pathname: '/inputPassword',
      state: {
        bizType: this.props.location.state.bizType,
        nav: {
          title: this.props.location.state.nav.title,
        },
      },
    }));
  }

  render() {
    const bizType           = this.props.location.state.bizType;
    
    const iconWidth         = config.getWS().width / 6,
          iconHeight        = iconWidth * 376 / 600,
          guideImgWidth     = config.getWS().width / 4,
          guideImgHeight    = guideImgWidth * 1962 / 1856;

    let amt = 0;
    if (bizType == 'prepaid') amt = this.props.account.prepaidBill.amt;
    else if (bizType == 'inpatientPrepaid') amt = this.props.inpatient.prepaidBill.amt;

    return (
      <WorkSpace style = {{paddingTop: '0'}} >
        <Card shadow = {true} style = {{margin: '2rem', padding: '2rem', fontSize: '3rem'}} >
          <span>交易金额：<font style = {{color: '#BC1E1E'}} >{amt}</font>&nbsp;元</span>
        </Card>
        <div style = {{margin: '6rem auto', textAlign: 'center'}} >
          <img src = {upImg} width = {iconWidth} height = {iconHeight} />
          <div style = {{fontSize: '4rem', lineHeight: '10rem', marginBottom: '4rem'}} >请插入银行卡</div>
          <img src = {bcrImg} width = {guideImgWidth} height = {guideImgHeight} onClick = {this.goTo} />
        </div>
      </WorkSpace>
    );
  }
}
  

export default connect(({account, inpatient, message}) => ({account, inpatient, message}))(InsertBankCard);



