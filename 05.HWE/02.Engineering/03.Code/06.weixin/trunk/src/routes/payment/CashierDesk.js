import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';


class CashierDesk extends React.Component {
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
          // 支付完成// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          alert('支付成功!!');
        } else {
          alert('支付失败!!');
          alert(res.err_msg);
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
    AlipayJSBridge.call('tradePay', {// eslint-disable-line
      tradeNO: settlement.variables.tradeNo,
    }, (result) => {
      console.info('支付宝支付返回', result);
      alert('支付成功!!');
    });
  }

  doWxPay = () => {
    console.info('------------doWxPay1--------');
    if (typeof WeixinJSBridge === 'undefined') {
      console.info('------------doWxPay2--------');
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', this.onWeixinJSBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', this.onWeixinJSBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', this.onWeixinJSBridgeReady);
      }
    } else {
      this.onBridgeReady();
    }
  }

  doZfbPay = () => {
    console.info('------------doZfbPay1--------');
    if (typeof AlipayJSBridge === 'undefined') {
      console.info('------------doZfbPay2--------');
      if (document.addEventListener) {
        document.addEventListener('AlipayJSBridgeReady', this.onAlipayJSBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', this.onAlipayJSBridgeReady);
      }
    } else {
      this.onAlipayJSBridgeReady();
    }
  }

  submit = () => {
    const { openid, userId } = this.props.base;
    const { bill } = this.props.payment;
    // const userId = '2088602198268947';
    const settlement = {
      billId: bill.id,
      amt: bill.amt,
      payTypeId: openid ? '4028748161098e60016109987e280012' : '4028748161098e60016109987e280022',
      payerNo: openid || (userId || ''),
    };

    this.props.dispatch({// 点击保存，支付
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
    const { openid, userId } = this.props.base;
    const { bill } = this.props.payment;
    // const userId = '2088602198268947';
    return (
      <div >
        <span><br />交易金额：<font style={{ color: '#BC1E1E', fontSize: '4.5rem' }} >{bill.amt || 0.0}</font>&nbsp;&nbsp;元</span>
        <span><br />订单号为：<font >{bill.billNo}</font>&nbsp;&nbsp;</span>
        <span><br />支付方式：{openid ? '微信' : userId ? '支付宝' : '未知'}</span>
        <Button onClick={this.submit} > 确定支付 </Button>
      </div>
    );
  }
}

CashierDesk.propTypes = {
};

export default connect(payment => (payment))(CashierDesk);
