import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';

import InfoComp             from '../../components/Info';

class PaidDone extends React.Component {

  static displayName = 'PaidDone';
  static description = '支付完成-消息';

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
  }

  componentDidMount() {
  }

  componentWillUnmount () {
  }

  render() {
    let info = '';
    const { order } = this.props.order;
    const { account } = this.props.account;
    const { PrepaidBalance } = this.props.inpatient;

    console.log('PaidDone render() order : ', order);

    if (order && order.OrderType == '0') {
      info = (
        <font style = {{lineHeight: '4rem'}} >
          成功预存&nbsp;<font color = '#BC1E1E' >{order.Amt.formatMoney()}</font>&nbsp;元<br/>
          <span style = {{fontSize: '2.8rem', lineHeight: '2.8rem'}} >当前账户余额&nbsp;<font color = '#BC1E1E' >{account.Balance.formatMoney()}</font>&nbsp;元</span>
        </font>
      );
    } else if (order && order.OrderType == '3') {
      info = (
        <font style = {{lineHeight: '4rem'}} >
          成功缴费&nbsp;<font color = '#BC1E1E' >{order.SelfPaid.formatMoney()}</font>&nbsp;元<br/>
        </font>
      );
    } else if (order && order.OrderType == '4') {
      info = (
        <font style = {{lineHeight: '4rem'}} >
          成功预缴&nbsp;<font color = '#BC1E1E' >{order.Amt}</font>&nbsp;元<br/>
          <span style = {{fontSize: '2.8rem', lineHeight: '2.8rem'}} >当前住院预缴余额&nbsp;<font color = '#BC1E1E' >{PrepaidBalance.formatMoney()}</font>&nbsp;元</span>
        </font>
      );
    }

    return (
      <InfoComp info = {info} autoBack = {true} />
    );
    
  }
}

export default connect(({account, order, inpatient}) => ({account, order, inpatient}))(PaidDone);
