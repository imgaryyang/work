import React from 'react';
import { connect } from 'dva';
import { Button, WingBlank, Card, Icon, Flex } from 'antd-mobile';
import wximag from '../../assets/images/pay/wxpay.png';
import zfbimag from '../../assets/images/pay/alipay.png';

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
      settleTitle: bill.billTitle,
      amt: bill.amt, // 充值金额
      appCode: bill.appCode, // 应用渠道
      bizType: bill.bizType, // 门诊预存
      bizNo: bill.bizNo, // 门诊预存流水号
      bizUrl: bill.bizUrl,
      bizBean: bill.bizBean,
      bizTime: bill.bizTime,
      payTypeId: openid ? '4028748161098e60016109987e280012' : '4028748161098e60016109987e280022',
      payerNo: openid || userId || '',
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
    console.info('----------this.props--------', this.props);
    const { openid, userId } = this.props.base;
    const { bill } = this.props.payment;
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
          <Card.Header
            title="支付内容"
          />
          <Card.Body>
            <span>业务编号：<font >{bill ? bill.bizNo : ''}</font>&nbsp;&nbsp;</span>
            <span><br />订单名称：<font >{bill ? bill.billTitle : ''}</font></span>
            <span><br /><div style={{ textAlign: 'right' }}>交易金额：<font style={{ color: '#BC1E1E' }} >{bill ? bill.amt : '' || 0.0}</font>&nbsp;元</div></span>
          </Card.Body>
          <div style={{ border: 2 }} />
          <Card.Body>
            <span>支付方式：</span>
            <Flex>
              <Flex.Item>
                <span><div style={{ marginTop: 20 }}><img height="20" width="20" alt="" key="wxIcon" src={payTypeIcon} />&nbsp;<font size="4">{payTypeName}</font></div></span>
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
