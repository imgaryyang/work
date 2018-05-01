import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { InputItem, Button, WingBlank, WhiteSpace, Toast } from 'antd-mobile';
import style from './OutpatientOnlineRecharge.less';
import config from '../../Config';
import { testAmt } from '../../utils/validation';
import { filterMoney } from '../../utils/Filters';
import baseStyles from '../../utils/base.less';

class OutpatientOnlineRecharge extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.createBizOrder = this.createBizOrder.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.gotoCashierDesk = this.gotoCashierDesk.bind(this);
    this.refreshBalance = this.refreshBalance.bind(this);
    this.setBizType = this.setBizType.bind(this);
    this.setAmt = this.setAmt.bind(this);
    this.checkRechargeValid = this.checkRechargeValid.bind(this);
    this.onRechargeClick = this.onRechargeClick.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.refreshBalanceCallback = this.refreshBalanceCallback.bind(this);
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '就诊卡预存',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: true,
        headerRight: null,
      },
    });
    this.setBizType('00');
  }
  componentDidMount() {
    this.refreshBalance();
  }
  onChange = (amt) => {
    this.setAmt(amt);
  }
  onRechargeClick() {
    if (!this.checkRechargeValid()) {
      return;
    }
    this.createBizOrder();
  }
  setBizType(bizType) {
    this.props.dispatch({
      type: 'payment/setBizType',
      bizType,
    });
  }
  setAmt(amt) {
    this.props.dispatch({
      type: 'payment/setAmt',
      amt,
    });
  }
  refreshBalanceCallback() {
    const { status } = this.props.deposit.data;
    if (status !== '0') {
      Toast.info('未查询到当前就诊人有效档案信息', 3);
    }
  }
  refreshBalance() {
    this.props.dispatch({
      type: 'deposit/getPreStore',
      // payload: { query: bizOrder },
      callback: () => { this.refreshBalanceCallback(); },
    });
  }
  gotoCashierDesk = () => {
    this.props.dispatch(routerRedux.push({
      pathname: 'payCounter',
    }));
  }
  createBizOrder = () => {
    Toast.loading('正在处理...');
    const { amt, bizType } = this.props.payment;
    const bizOrder = {
      amt, // 充值金额
      appCode: config.appCode,
      type: '0', // 充值
      adFlag: '0', // '0',正常;'1',补录
      bizType,
    };
    const { dispatch } = this.props;
    // 本地生成交易订单后，跳转到收银台
    dispatch({
      type: 'deposit/create',
      payload: { query: bizOrder },
      callback: () => {
        this.gotoCashierDesk();
        Toast.hide();
      },
    });
  }
  // 检查充值金额的合法性
  checkRechargeValid() {
    // 1.校验是否为空
    if (!this.props.payment.amt) {
      Toast.info('请填写充值金额');
      return false;
    }
    // 2.校验格式是否正确
    if (!testAmt(this.props.payment.amt)) {
      Toast.info('金额格式不正确');
      return false;
    }
    // 3.金额是否为0
    if (this.props.payment.amt <= 0) {
      Toast.info('充值金额需大于0');
      return false;
    }
    return true;
  }

  render() {
    let { balance } = this.props.deposit.data;
    const { status } = this.props.deposit.data;
    const { currProfile } = this.props.base;
    balance = balance === undefined ? '' : balance;
    // 1.判断是否选择就诊人档案
    if (!currProfile.id) {
      return (
        <div className={style.container}>
          <div className={baseStyles.emptyView}>请先选择就诊人
            <Button
              type="ghost"
              inline
              style={{ marginTop: 10, width: 200 }}
              onClick={() => this.props.dispatch(routerRedux.push({ pathname: 'choosePatient' }))}
            >选择就诊人
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className={style['mainView']}>
        <WingBlank>
          <WhiteSpace size="md" />
          <div className={style.item}>
            <div className={style.label}>当前余额</div>
            <div className={style.value}>
              {balance ? filterMoney(balance) : '0.00'}
            </div>
          </div>
          <WhiteSpace size="lg" />
          <div className={style.recharge}>
            充值金额
          </div>
          <InputItem
            type="money"
            placeholder="请输入充值金额"
            onChange={this.onChange}
            clear
            moneyKeyboardAlign="left"
            disabled={this.props.base.currProfile.no === undefined}
            maxLength={10}
          />
          <WhiteSpace size="lg" />
          <Button type="primary" onClick={this.onRechargeClick} disabled={this.props.base.currProfile.no === undefined || status !== '0'}>马上充值</Button>
        </WingBlank>
      </div>
    );
  }
}
export default connect(({ payment, deposit, base, user }) => ({ payment, deposit, base, user }))(OutpatientOnlineRecharge);
