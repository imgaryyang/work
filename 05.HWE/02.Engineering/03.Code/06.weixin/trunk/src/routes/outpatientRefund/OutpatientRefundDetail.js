import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, WingBlank, WhiteSpace, InputItem, Toast } from 'antd-mobile';
import styles from './OutpatientRefundDetail.less';
import config from '../../Config';
import { testAmt } from '../../utils/validation';
import {filterMoney} from "../../utils/Filters";

class OutpatientRefundDetail extends React.Component {
  constructor(props) {
    super(props);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.onRefundClick = this.onRefundClick.bind(this);
    this.refundCallback = this.refundCallback.bind(this);
    this.refund = this.refund.bind(this);
    this.onChange = this.onChange.bind(this);
    this.checkRefundAmtValid = this.checkRefundAmtValid.bind(this);
    this.gotoSuccess = this.gotoSuccess.bind(this);
    this.gotoFailure = this.gotoFailure.bind(this);
  }
  state = {
    refundAmt: 0, // 待退款金额
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '退款',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: null,
      },
    });
  }
  onRefundClick() {
    // 1.校验输入退款金额的合法性
    if (!this.checkRefundAmtValid()) {
      return;
    }
    // 2.退款
    const { refundDetailData } = this.props.outpatientReturn;
    this.refund({ ...refundDetailData, refundAmt: this.state.refundAmt });
  }
  onChange = (amt) => {
    this.setState({ refundAmt: amt});
  }
  gotoSuccess() {
    this.props.dispatch(routerRedux.push({
      pathname: 'completeRefundSuccess',
    }));
  }

  gotoFailure() {
    this.props.dispatch(routerRedux.push({
      pathname: 'completeRefundFailure',
    }));
  }
  refreshData() {
    const { currProfile } = this.props.base;
    if (currProfile && currProfile.no) {
      this.props.dispatch({
        type: 'deposit/getPreStore',
      });
    }
  }
  refund(item) {
    const { dispatch } = this.props;
    const bill = {
      // oriTradeNo: item.tradeNo,
      // oriAmt: item.refundAmt,
      amt: this.state.refundAmt,
      tradeChannel: item.tradeChannel,
      tradeChannelCode: item.tradeChannelCode,
      adFlag: item.adFlag,
      appCode: config.appCode,
      appType: config.appType,
      settleNo: item.settleNo,
      tradeNo: item.tradeNo
      // comment
    };
    dispatch({
      type: 'deposit/refund',
      payload: { bill },
      callback: () => { this.refundCallback(); },
    });
  }
  refundCallback() {
    console.log('OutpatientRefundDetail:refundCallback');
    const { refundResult } = this.props.deposit;
    console.info(refundResult);
    if (!refundResult.success) {
      // Modal.alert('提示', `退款失败[${refundResult.msg}]`, [
      //   { text: '确认' },
      // ]);
      this.gotoFailure();
    } else {
      // Modal.alert('提示', '已成功发起退款申请', [
      //   { text: '确认' },
      // ]);
      this.gotoSuccess();
    }
  }
  // 检查充值金额的合法性
  checkRefundAmtValid() {
    const { refundAmt } = this.state;
    console.log('checkRefundAmtValid:', refundAmt);
    // 1.校验是否为空
    if (!refundAmt) {
      Toast.info('请填写充值金额');
      return false;
    }
    // 2.校验格式是否正确
    if (!testAmt(refundAmt)) {
      Toast.info('金额格式不正确');
      return false;
    }
    // 3.金额是否为0
    if (refundAmt <= 0) {
      Toast.info('充值金额需大于0');
      return false;
    }
    const { refundDetailData } = this.props.outpatientReturn;
    const { data } = this.props.deposit;
    const balance = data.balance ? data.balance : 0;
    const amt = refundDetailData.amt ? refundDetailData.amt : 0;
    const refundedAmt = refundDetailData.refundedAmt ? refundDetailData.refundedAmt : 0;
    const maxReturnableAmt = (balance < (amt - refundedAmt)) ? balance : (amt - refundedAmt);
    if (refundAmt > maxReturnableAmt) {
      Toast.info(`退款金额不得大于${filterMoney(maxReturnableAmt)}元`);
      return false;
    }
    return true;
  }

  render() {
    const { refundDetailData } = this.props.outpatientReturn;
    const { data } = this.props.deposit;
    const balance = data.balance ? data.balance : 0;
    const amt = refundDetailData.amt ? refundDetailData.amt : 0;
    const refundedAmt = refundDetailData.refundedAmt ? refundDetailData.refundedAmt : 0;
    const maxReturnableAmt = (balance < (amt - refundedAmt)) ? balance : (amt - refundedAmt);
    return (
      <div className={styles.container}>
        <WhiteSpace size="md" />
        <WingBlank size="lg" className={styles.content}>
          可用余额：{ balance.formatMoney() }元
        </WingBlank>
        <WhiteSpace size="lg" />
        <WingBlank size="lg" className={styles.content}>
          充值金额：{ amt.formatMoney() }元
        </WingBlank>
        <WhiteSpace size="lg" />
        <WingBlank size="lg" className={styles.content}>
          已退金额：{ refundedAmt.formatMoney() }元
        </WingBlank>
        <WhiteSpace size="lg" />
        <WingBlank size="lg" className={styles.content}>
          最大可退金额：{ maxReturnableAmt.formatMoney() }元
        </WingBlank>
        <WhiteSpace size="lg" />
        <WingBlank size="lg">
          <InputItem
            type="money"
            placeholder="请输入退款金额"
            onChange={this.onChange}
            clear
            moneyKeyboardAlign="left"
            style={{ fontSize: 13 }}
            disabled={this.props.base.currProfile.no === undefined}
          />
        </WingBlank>
        <WhiteSpace size="lg" />
        <WingBlank size="lg">
          <Button
            type="primary"
            className={styles.button}
            onClick={() => { this.onRefundClick(); }}
          >退费
          </Button>
        </WingBlank>
      </div>
    );
  }
}
export default connect(({ outpatientReturn, deposit, base }) => ({ outpatientReturn, deposit, base }))(OutpatientRefundDetail);
