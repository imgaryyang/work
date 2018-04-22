import React from 'react';
import { connect } from 'dva';
import { Button, WhiteSpace, Modal, Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import styles from './PaymentRecordPrePay.less';
import { filterMoney } from '../../utils/Filters';

class PaymentRecordPrePay extends React.Component {
  constructor(props) {
    super(props);
    this.onPay = this.onPay.bind(this);
    this.callBackPay = this.callBackPay.bind(this);
    this.resetPaymentInfo = this.resetPaymentInfo.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '门诊缴费预结算',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: null,
      },
    });
  }
  onPay() {
    console.log('onPay1');
    const { dispatch } = this.props;
    console.log('onPay3');
    console.info(dispatch);
    // Toast.loading('正在处理...');
    dispatch({
      type: 'paymentRecord/pay',
      callback: () => {
        this.callBackPay();
        // Toast.hide();
      },
    });
    console.log('onPay2');
  }

  callBackPay() {
    const { payData } = this.props.paymentRecord;
    if (payData.success) {
      Modal.alert('提示', '缴费成功', [
        { text: '确认', onPress: () => { this.props.dispatch(routerRedux.go(-1)); } }, // 返回到待缴费明细界面
      ]);
    } else {
      Modal.alert('提示', `缴费失败：${payData.msg}`, [
        { text: '确认', onPress: () => { this.props.dispatch(routerRedux.go(-1)); } }, // 返回到待缴费明细界面
      ]);
    }
  }

  resetPaymentInfo() {
    this.props.dispatch({
      type: 'paymentRecord/reset',
    });
  }
  render() {
    const { prePayData } = this.props.paymentRecord;
    return (
      <div className={styles.container}>
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <div className={styles.itemPayTotal}>共需支付：{ prePayData.amt ? filterMoney(prePayData.amt) : ''} 元</div>
        <div className={styles.itemPayReduce}>医院优惠：{ prePayData.reduceAmt ? filterMoney(prePayData.reduceAmt) : ''} 元</div>
        <div className={styles.itemPayRemained}>还需支付：{ prePayData.myselfAmt ? filterMoney(prePayData.myselfAmt) : ''} 元</div>
        <div style={{ border: 2 }} />
        <Button type="primary" onClick={this.onPay} className={styles.button}> 去缴费 </Button>
      </div>
    );
  }
}

PaymentRecordPrePay.propTypes = {
};
export default connect(({ payment, base, paymentRecord }) => ({ payment, base, paymentRecord }))(PaymentRecordPrePay);
