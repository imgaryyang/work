import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './InpatientPrepaidNav.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';
import NumKeyboard          from '../../components/keyboard/NumKeyboard';

import weixinImg            from '../../assets/base/weixin.png'; //400*400
import alipayImg            from '../../assets/base/alipay.png'; //400*400
import cashImg              from '../../assets/base/cash.png';   //600*365
import upImg                from '../../assets/base/union-pay.png'; //600*376

class InpatientPrepaidNav extends React.Component {

  static displayName = 'InpatientPrepaidNav';
  static description = '住院预缴功能导航';

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

  goTo (type, title) {
    this.props.dispatch(routerRedux.push({
      pathname: '/inpatientPrepaid/' + type,
      state: {
        nav: {
          title: title,
          backDisabled: false,
        },
      },
    }));

  }

  render() {

    const width           = config.getWS().width,
          height          = config.getWS().height * 5 / 7,
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
	
    return (
      <WorkSpace fullScreen = {true} >
        <div className = {styles.container} style = {{width: width + 'px', height: height + 'px', padding: '0 ' + config.navBar.padding + 'rem'}} >
          <Row gutter = {2 * config.navBar.padding * config.remSize} type = 'flex' justify = 'center' >
            <Col className = {styles.col} style = {{paddingBottom: 2 * config.navBar.padding * config.remSize + 'px'}} span = {12} >
              <Card shadow = {true} style = {cardStyle} onClick = {() => this.goTo('00', '就诊卡预存转预缴')} >
                <span className = {styles.balance} style = {{top: (cardHeight / 6) + 'px'}} >就诊卡账户当前余额<br/><h1>
                {
                this.props.patient.account.balance == 'undefined' ? 0 : this.props.patient.account.balance
                /*this.props.patient.account.balance.formatMoney()*/
                }&nbsp;元</h1></span>
                <font>就诊卡预存转预缴</font>
              </Card>
            </Col>
            <Col className = {styles.col} style = {{paddingBottom: 2 * config.navBar.padding * config.remSize + 'px'}} span = {12} >
              <Card shadow = {true} style = {cardStyle} onClick = {() => this.goTo('20', '银行卡预缴')} >
                <img src = {upImg} width = {upImgWidth} height = {imgHeight} />
                <font>银行卡预缴</font>
              </Card>
            </Col>
            <Col className = {styles.col} style = {{paddingBottom: 2 * config.navBar.padding * config.remSize + 'px'}} span = {12} >
              <Card shadow = {true} style = {cardStyle} onClick = {() => this.goTo('30', '支付宝/微信预缴')} >
                <Row type = 'flex' justify = 'center' >
                  <Col span = {7} ><img src = {alipayImg} width = {alipayImgWidth} height = {imgHeight} /></Col>
                  <Col span = {7} style = {{borderLeft: '1px solid #D8D8D8'}} ><img src = {weixinImg} width = {weixinImgWidth} height = {imgHeight} /></Col>
                </Row>
                <font>支付宝/微信预缴</font>
              </Card>
            </Col>
          </Row>
        </div>
      </WorkSpace>
    );
  }
}
  

export default connect(({patient, message}) => ({patient, message}))(InpatientPrepaidNav);



