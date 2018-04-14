import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { InputItem, Button, WingBlank, WhiteSpace, Toast } from 'antd-mobile';
import classnames from 'classnames';
import style from './Payment2.less';
import config from '../../Config';
import Radios from '../../components/Radios';
import { testAmt } from '../../utils/validation';
import { filterMoney } from '../../utils/Filters';

class Payment2 extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.createBizOrder = this.createBizOrder.bind(this);
    this.getBillTitle = this.getBillTitle.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.gotoCashierDesk = this.gotoCashierDesk.bind(this);
    this.refreshBalance = this.refreshBalance.bind(this);
    this.setBizType = this.setBizType.bind(this);
    this.setAmt = this.setAmt.bind(this);
    this.checkRechargeValid = this.checkRechargeValid.bind(this);
    this.onRechargeClick = this.onRechargeClick.bind(this);
  }
  componentWillMount() {
    const { currProfile } = this.props.base;
    const { bizType } = this.props.payment;
    if (currProfile && currProfile.no !== undefined) {
      this.refreshBalance(bizType);
    }
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
    this.refreshBalance(bizType);
  }
  setAmt(amt) {
    this.props.dispatch({
      type: 'payment/setAmt',
      amt,
    });
  }
  getBillTitle(amt, bizType) {
    const { currProfile: profile } = this.props.base;
    let bizTypeName = '';
    if (bizType === '00') {
      bizTypeName = '门诊充值';
    } else if (bizType === '04') {
      bizTypeName = '住院预缴';
    }
    return `患者${profile.name} ${bizTypeName}金额 ${amt} 元`;
  }
  refreshBalance(bizType) {
    let baseInfoRoute = '';
    if (bizType === '00') { // 门诊充值
      baseInfoRoute = 'deposit/getPreStore';
    } else if (bizType === '04') { // 住院预缴
      baseInfoRoute = 'foregift/getPrePay';
    }
    this.props.dispatch({
      type: baseInfoRoute,
      // payload: { query: bizOrder },
      // callback: () => { this.gotoCashierDesk(); },
    });
  }
  gotoCashierDesk = () => {
    this.props.dispatch(routerRedux.push({
      pathname: 'payCounter',
    }));
  }
  createBizOrder = () => {
    const { amt, bizType } = this.props.payment;
    const bizOrder = {
      amt, // 充值金额
      appCode: config.appCode,
      // billTitle: this.getBillTitle(amt, bizType),
      type: '0', // 充值
      adFlag: '0', // '0',正常;'1',补录
      bizType,
    };
    const { dispatch } = this.props;
    let type = '';
    // 生成业务单数据
    if (bizType === '00') {
      type = 'deposit/create';
    } else {
      type = 'foregift/create';
    }
    // 本地生成交易订单后，跳转到收银台
    dispatch({
      type,
      payload: { query: bizOrder },
      callback: () => { this.gotoCashierDesk(); },
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
    const { bizType } = this.props.payment;
    let { balance } = bizType === '00' ? this.props.deposit.data : this.props.foregift.data;
    balance = balance === undefined ? '' : balance;
    return (
      <div className={style['mainView']}>
        <WingBlank>
          <div className={style.item}>
            <div className={style.label}>可用余额</div>
            <div className={style.value}>
              {balance ? filterMoney(balance) : ''}
            </div>
          </div>
          <WhiteSpace size="lg" />
          <div className={classnames(style.item, style.gender)}>
            <Radios
              data={[
                { label: '门诊充值', value: '00' },
                { label: '住院预缴', value: '04' },
              ]}
              value={bizType}
              onSelect={(item) => {
                this.setBizType(item.value);
              }}
              flexItem
              containerStyle={{ flex: 1 }}
            />
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
          <Button type="primary" onClick={this.onRechargeClick} disabled={this.props.base.currProfile.no === undefined}>马上充值</Button>
        </WingBlank>
      </div>
    );
  }
}
export default connect(({ payment, foregift, deposit, base }) => ({ payment, foregift, deposit, base }))(Payment2);
