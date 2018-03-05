import React from 'react';
import { connect } from 'dva';
import { Button, WingBlank, WhiteSpace, Card, Icon, Flex, Radio } from 'antd-mobile';
import wximag from '../../assets/images/wxpay.png';

class CashierDesk extends React.Component {
  onBridgeReady = () => {
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
    // WeixinJSBridge.invoke(
    //   'getBrandWCPayRequest',
    //   settlement.variables.packageData,
    //   (res) => {
    //     if (res.err_msg === 'get_brand_wcpay_request:ok') {
    //       // 支付完成// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
    //       alert('支付成功!!');
    //     } else {
    //       alert('支付失败!!');
    //       alert(res.err_msg);
    //     }
    //   },
    // );
  }

  doPay = () => {
    console.info('------------doPay1--------');
    if (typeof WeixinJSBridge === 'undefined') {
      console.info('------------doPay2--------');
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
      }
    } else {
      this.onBridgeReady();
    }
  }

  submit = () => {
    const { bill } = this.props.payment;
    const settlement = {
      billId: bill.id,
      amt: bill.amt,
      payTypeId: '4028748161098e60016109987e280012',
    };

    this.props.dispatch({// 点击保存，支付
      type: 'payment/prePay',
      payload: { settlement },
      callback: () => { this.doPay(); },
    });
  }

  render() {
    const { bill } = this.props.payment;
    return (
      <div >
        <Card full>
          <Card.Header
            title="支付内容"
          />
          <Card.Body>
            <span>支付编号：<font >{bill ? bill.billNo : ''}</font>&nbsp;&nbsp;</span>
            <span><br />订单名称：<font >{bill ? bill.billTitle : ''}</font></span>
            <span><br /><div style={{ textAlign: 'right' }}>交易金额：<font style={{ color: '#BC1E1E' }} >{bill ? bill.amt : '' || 0.0}</font>&nbsp;元</div></span>
          </Card.Body>
          <div style={{ border: 2 }} />
          <Card.Body>
            <span>支付方式：</span>
            <Flex>
              <Flex.Item>
                <span><div style={{ marginTop: 20 }}><img height="20" width="20" alt="" key="wxIcon" src={wximag} />&nbsp;<font size="4">微信支付</font></div></span>
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
export default connect(payment => (payment))(CashierDesk);
