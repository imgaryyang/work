import React from 'react';
import { connect } from 'dva';
import { Button, WingBlank, Card, Icon, Flex, Modal } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import wximag from '../../assets/images/pay/wxpay.png';
import zfbimag from '../../assets/images/pay/alipay.png';

const orderMap = {
  '00': '门诊预存',
  '01': '预约',
  '02': '挂号',
  '03': '缴费（诊间结算）',
  '04': '住院预缴',
  '05': '办理就诊卡',
};
class CashierDesk extends React.Component {
  constructor(props) {
    super(props);
    this.gotoSuccess = this.gotoSuccess.bind(this);
    this.gotoFailure = this.gotoFailure.bind(this);
  }
  componentWillMount() {

    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '支付订单',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: null,
      },
    });
  }
  onWeixinJSBridgeReady = () => {
    const { settlement } = this.props.payment;
    /**
     * {
            "appId": serverResult.appid,                 //公众号名称，由商户传入
            "timeStamp": serverResult.timeStamp,         //时间戳，自1970年以来的秒数
            "nonceStr": serverResult.nonce_str,          //随机串
            "package": "prepay_id="+serverResult.prepay_id,
            "signType": "MD5",                           //微信签名方式：
            "paySign": serverResult.sign                 //微信签名
        }
     */
    WeixinJSBridge.invoke(// eslint-disable-line
      'getBrandWCPayRequest',
      settlement.variables.packageData,
      (res) => {
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          // // 支付完成// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          // alert('支付成功!!');
          // Modal.alert('提示', '支付成功', [
          //   { text: '确定', onPress: () => this.props.dispatch(routerRedux.goBack()) },
          // ]);
          this.props.dispatch(routerRedux.push({
            pathname: 'completePaySuccess',
          }));
        } else if (res.err_msg === 'get_brand_wcpay_request:fail') { // 交易失败
          this.props.dispatch(routerRedux.push({
            pathname: 'completePayFailure',
          }));
        } else if (res.err_msg === 'get_brand_wcpay_request:cancel') { // 交易关闭
          this.props.dispatch(routerRedux.push({
            pathname: 'completePayFailure',
          }));
        } else { // 未知状态先按照失败来处理
          this.props.dispatch(routerRedux.push({
            pathname: 'completePayFailure',
          }));
        }
      },
    );
  }

  onAlipayJSBridgeReady = () => {
    const { settlement } = this.props.payment;
    /**
     * {
           "appId": serverResult.appid,                 //公众号名称，由商户传入
            "timeStamp": serverResult.timeStamp,         //时间戳，自1970年以来的秒数
            "nonceStr": serverResult.nonce_str,          //随机串
            "package": "prepay_id="+serverResult.prepay_id,
            "signType": "MD5",                           //微信签名方式：
            "paySign": serverResult.sign                 //微信签名
        }
     */
    // 1.支付成功：
    // ‘9000’：订单支付成功;
    // 2. 支付结果未知(可能已支付成功)：
    // ‘8000’：后台获取支付结果超时，暂时未拿到支付结果;
    // ‘6004’：支付过程中网络出错， 暂时未拿到支付结果;
    // 3. 支付失败或者支付中途退出：
    // ‘7001’：客户端-钱包中止快捷支付;
    // ‘6002’: 普通网络出错;
    // ‘6001’: 用户中途取消;
    // ‘4000’: 订单支付失败;
    // ‘99’: 用户点击忘记密码快捷界面退出(only iOS since 9.5);
    // 其他: 其他支付异常;
    AlipayJSBridge.call('tradePay', {// eslint-disable-line
      tradeNO: settlement.variables.tradeNo,
    }, (result) => {
      console.info('支付宝支付返回', result);
      if (result.resultCode === '9000') { // 支付成功
        this.props.dispatch(routerRedux.push({
          pathname: 'completePaySuccess',
        }));
      } else if (result.resultCode === '8000' || // 交易结果未知
        result.resultCode === '6004') {
        this.props.dispatch(routerRedux.push({
          pathname: 'completePayFailure',
        }));
      } else if (result.resultCode === '7001' || // 支付失败
        result.resultCode === '6002' ||
        result.resultCode === '6001' ||
        result.resultCode === '4000' ||
        result.resultCode === '99') {
        this.props.dispatch(routerRedux.push({
          pathname: 'completePayFailure',
        }));
      } else {
        this.props.dispatch(routerRedux.push({
          pathname: 'completePayFailure',
        }));
      }
    });
  }

  doWxPay = () => {
    console.info('------------doWxPay1--------' + (typeof WeixinJSBridge));
    if (typeof WeixinJSBridge === 'undefined') {
      console.info('------------doWxPay2--------');
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', this.onWeixinJSBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', this.onWeixinJSBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', this.onWeixinJSBridgeReady);
      }
    } else {
      this.onWeixinJSBridgeReady();
    }
  }

  doZfbPay = () => {
    console.info('------------doZfbPay1--------');
    if (typeof AlipayJSBridge === 'undefined') {
      console.info('------------doZfbPay2--------');
      if (document.addEventListener) {
        document.addEventListener('AlipayJSBridgeReady', this.onAlipayJSBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('AlipayJSBridgeReady', this.onAlipayJSBridgeReady);
      }
    } else {
      this.onAlipayJSBridgeReady();
    }
  }

  gotoSuccess() {
    this.props.dispatch(routerRedux.push({
      pathname: 'completePaySuccess',
    }));
  }

  gotoFailure() {
    this.props.dispatch(routerRedux.push({
      pathname: 'completePayFailure',
    }));
  }

  submit = () => {
    const { openid, userId } = this.props.base;
    const { bill } = this.props.payment;
    // const userId = '2088602198268947';
    const settlement = {
      settleTitle: bill.billTitle,
      amt: bill.amt, // 充值金额
      appCode: bill.appCode, // 应用渠道
      bizType: bill.bizType, // 门诊预存/住院预缴
      bizNo: bill.bizNo, // 门诊预存流水号
      bizUrl: bill.bizUrl,
      bizBean: bill.bizBean,
      bizTime: bill.bizTime,
      payTypeId: openid ? '4028748161098e60016109987e280012' : '4028748161098e60016109987e280022',
      payerNo: openid || userId || '',
    };
    this.props.dispatch({ // 点击保存，支付
      type: 'payment/prePay',
      payload: { settlement },
      callback: () => {
        if (openid) {
          this.doWxPay();
        } else if (userId) {
          this.doZfbPay();
        }
      },
    });
  }

  render() {
    console.info('PayCounter----------this.props--------', this.props);
    const { openid, userId } = this.props.base;
    const { bill, bizType } = this.props.payment;
    let payTypeName = '';
    let payTypeIcon = '';
    if (openid) {
      payTypeName = '微信支付';
      payTypeIcon = wximag;
    } else if (userId) {
      payTypeName = '支付宝';
      payTypeIcon = zfbimag;
    }
    return (
      <div >
        <Card full>
          <Card.Body>
            <div>
              <div style={{ paddingBottom: '10px', fontSize: 14 }}>支付编号：{bill ? bill.bizNo : ''}</div>
              <div style={{ paddingBottom: '10px', fontSize: 14 }}>订单类型：{orderMap[bizType]}</div>
              <div style={{ paddingBottom: '10px', fontSize: 14 }}>需要支付金额：{bill && bill.amt ? bill.amt : 0}元</div>
              <div style={{ border: 2 }} />
            </div>
          </Card.Body>
          <Card.Body>
            <span>支付方式：</span>
            <Flex>
              <Flex.Item>
                <div style={{ fontSize: 15 }}><img height="25" align="absmiddle" width="25" alt="" key="wxIcon" src={payTypeIcon} />&nbsp;&nbsp;{payTypeName}</div>
              </Flex.Item>
              <Flex.Item>
                <div style={{ marginTop: 20, textAlign: 'right' }}><Icon type="check-circle" size="md" color="green" /></div>
              </Flex.Item>
            </Flex>
          </Card.Body>
        </Card>
        <WingBlank style={{ marginTop: 10 }}>
          <Button type="primary" onClick={this.submit} > 确定支付 </Button>
        </WingBlank>
      </div>
    );
  }
}

CashierDesk.propTypes = {
};
export default connect(({ payment, base }) => ({ payment, base }))(CashierDesk);
