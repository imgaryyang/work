import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './PrepaidCash.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';
import NumKeyboard          from '../../components/keyboard/NumKeyboard';

class PrepaidCash extends React.Component {

  static displayName = 'PrepaidCash';
  static description = '预存-现金';

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
  * 初始化状态
  */
  state = {
    stepMsg: '请将纸币插入入钞口',
  };

  //临时记录预存现金次数
  i = 0;

  constructor(props) {
    super(props);

    this.pay        = this.pay.bind(this);
    this.submit     = this.submit.bind(this);
  }

  componentWillMount() {
//    this.i = 0;
//    if (!this.props.account.account.Balance)
//      this.props.dispatch({
//        type: 'account/loadAcctInfo',
//        payload: {
//          userId: this.props.user.UserId
//        },
//      });
//
//    this.props.dispatch({
//      type: 'order/setState',
//      payload: {
//        order: null,
//      }
//    });
  }
  componentDidMount() {
	  this.props.dispatch({
	        type: 'payment/listenCashBox',
	  });
  }
  pay () {
    //TODO: 临时模拟，正式版应连硬件读取
    let account = this.props.account.account;
    let order = this.props.order.order;
    //测试多次插入纸币
    this.i += 1;

    this.props.dispatch({
      type: 'order/prepaidCash',
      payload: {
        OrderId: order && order.OrderId ? order.OrderId : null,
        Amt: 100,
        count: this.i,
      }
    });

    account.Balance = account.Balance + 100;
    this.props.dispatch({
      type: 'account/setState',
      payload: {
        account: account,
      }
    });

  }

  submit () {

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

    const { account } = this.props.patient;
    const { order } = this.props.payment;

    return (
      <WorkSpace fullScreen = {true} style = {{padding: '1.5rem 1.5rem 3rem 1.5rem'}} >
        <div style = {{height: '65%', padding: '0 0 3rem 0'}} >
          <Card shadow = {true} style = {{height: '100%', textAlign: 'center'}} >
            <div className = {styles.stepMsg} onClick = {this.pay} >{this.state.stepMsg}</div>
            <div className = {styles.payAmt} >本次预存金额&nbsp;<font>{order ? order.amt : 0}</font>&nbsp;元</div>
            <div className = {styles.balance} >账户余额&nbsp;<font>{account.balance}</font>&nbsp;元</div>
          </Card>
        </div>
        <div style = {{height: '25%', padding: '0 0 3rem 0'}} >
          <Card shadow = {true} style = {{height: '100%'}} >
            <Row className = {styles.tip} >
              <Col span = {3} >提示</Col>
              <Col span = {21} >
                <li><Icon type="caret-right" />&nbsp;&nbsp;本机支持面额&nbsp;100、50、20、10、5&nbsp;元的人民币纸币</li>
                <li><Icon type="caret-right" />&nbsp;&nbsp;请将纸币整理平整按提示逐张放入现金入钞口</li>
              </Col>
            </Row>
          </Card>
        </div>
        <div style = {{height: '10%', padding: '0 0 0 0'}} >
          <Button text = "确定" onClick = {this.submit} />
        </div>
      </WorkSpace>
    );
  }
}
  

export default connect(({patient,payment}) => ({patient,payment}))(PrepaidCash);



