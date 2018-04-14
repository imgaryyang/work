/**
 * 充值缴费
 */

import React, { Component } from 'react';
import moment from 'moment';
import {
  InteractionManager,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  View,
  TouchableOpacity,
} from 'react-native';

import Card from 'rn-easy-card';
import Button from 'rn-easy-button';
import Portrait from 'rn-easy-portrait';
import XPay from 'react-native-puti-pay';
import Icon from 'rn-easy-icon';
import Global from '../../Global';
import { createBill, createSettlement } from '../../services/payment/AliPayService';

const orderMap = {
  '00': '门诊预存',
  '01': '预约',
  '02': '挂号',
  '03': '缴费（诊间结算）',
  '04': '住院预缴',
  '05': '办理就诊卡',
};
class PayCounter extends Component {
  static displayName = 'PayCounter';
  static description = '收银台';

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.subPayInfo = this.subPayInfo.bind(this);
    this.payCreateSettle = this.payCreateSettle.bind(this);
  }

  state = {
    payInfo: {
      amt: 0,
      billTitle: '预存缴费',
      appCode: 'appCode',
      terminalCode: 'zhangsan',
      payerNo: 'lisi',
      bizType: '预存',
      bizNo: '000001',
      bizBean: 'aliPay',
      bizTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    doRenderScene: false,
    value: '1',
    showLabel: true,
    checked: true,
    payType: 'aliPay',
    wxPay:
        {
          PayChannelCode: 'wxpay',
          payTypeId: '4028748161098e60016109987e280011',
        },
    aliPay:
        {
          PayChannelCode: 'alipay',
          payTypeId: '4028748161098e60016109987e280021',
        },
  };
  componentWillMount() {
    const param = this.props.navigation.state.params;
    const payInfo = {
      ...param,
      // will modify 改成实际值
      // amt: param.amt,
      amt: 0.01,
    };
    this.setState({
      payInfo,
    });
    this.props.navigation.setParams({
      title: '支付订单',
    });
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
  }

  onPress() {
    this.state.checked = !this.state.checked;
  }

  subPayInfo() {
    this.payCreateSettle();
  }

  // async payCreateOrder(param) {
  //   try {
  //     const responseData = await createBill(param);
  //     const data = responseData.result;
  //     if (responseData.success) {
  //       this.setState({
  //         payInfo: {
  //           ...this.state.payInfo,
  //           billNo: data.billNo,
  //           billTitle: data.billTitle,
  //           billId: data.id,
  //         },
  //       });
  //       return responseData;
  //     }
  //   } catch (e) {
  //     this.handleRequestException(e);
  //   }
  // }

  async payCreateSettle() {
    try {
      this.props.screenProps.showLoading();
      const paytype = this.state.payType;
      let subParams = {};
      if (paytype === 'wxPay') {
        subParams = {
          ...this.state.payInfo,
          // bizTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          PayChannelCode: this.state.wxPay.PayChannelCode,
          payTypeId: this.state.wxPay.payTypeId,
        };
      } else if (paytype === 'aliPay') {
        subParams = {
          ...this.state.payInfo,
          // bizTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          PayChannelCode: this.state.aliPay.PayChannelCode,
          payTypeId: this.state.aliPay.payTypeId,
        };
      }
      console.log('payCreateSettle');
      console.info(this.state.payInfo);
      console.log('payCreateSettle');
      // 生成结算单，并且调用第三方接口
      const responseData = await createSettlement(subParams);
      if (responseData.success) {
        const data = responseData.result;
        const req = data.respText;
        if (paytype === 'wxPay') {
          XPay.setWxId('wxea8d05829786a52d');
          XPay.wxPay(data.variables, (res) => {
            this.props.navigation.navigate('CompletePaySuccess');
          });
        } else if (paytype === 'aliPay') {
          XPay.alipay(req, (res) => {
            if (res && res.resultStatus === '9000') {
              this.props.navigation.navigate('CompletePaySuccess');
            } else if (res && res.resultStatus === '6001') {
              return false;
            } else {
              this.props.navigation.navigate('CompletePayFailure');
            }
          });
        }
      } else {
        Alert.alert(
          '提示',
          '支付失败请联系管理员或重新支付？',
          [
            { text: '确定', style: 'cancel' },
          ],
        );
      }
      this.props.screenProps.hideLoading();
    } catch (e) {
      this.props.screenProps.hideLoading();
      this.handleRequestException(e);
    }
  }

  render() {
    if (!this.state.doRenderScene) {
      return PayCounter.renderPlaceholderView();
    }
    const checked = !this.state.checked;
    const iconName = checked ? 'ios-checkmark-circle' : 'ios-checkmark-circle-outline';
    const aliIconName = !checked ? 'ios-checkmark-circle' : 'ios-checkmark-circle-outline';
    const iconColor = checked ? 'rgba(255,102,0,1)' : 'rgba(130,130,130,1)';
    const aliIconColor = !checked ? 'rgba(255,102,0,1)' : 'rgba(130,130,130,1)';
    return (
      <View style={{ flex: 1, flexDirection: 'column' }} >
        <ScrollView style={styles.scrollView} >
          <Card>
            <Text style={{ color: 'black', marginLeft: 10 }}>支付编号：{this.state.payInfo.settleTitle}</Text>
            <Text style={{ color: 'black', marginLeft: 10, marginTop: 5 }}>订单类型：{orderMap[this.state.payInfo.bizType]}</Text>
            <Text style={{ color: 'black', marginLeft: 10, marginTop: 5 }} >需要支付金额：<Text style={{ color: 'red' }}>{this.state.payInfo.amt}元</Text><Text style={{ fontSize: 10 }} > ( 演示版将支付金额固定为 0.01 )</Text></Text>
          </Card>
          <Card style={{ marginTop: 15 }} >
            <Text style={{ color: 'black', marginLeft: 10, fontSize: 15, fontWeight: '600' }}>选择支付方式</Text>
          </Card>
          <Card>
            <TouchableOpacity
              onPress={() => this.setState({ checked: !this.state.checked, payType: 'aliPay' })}
              style={[Global.styles.CENTER, { flexDirection: 'row', paddingLeft: 10, paddingTop: 5 }]}
            >
              <Portrait imageSource={Global.Config.imgPayChannel.alipay} width={25} height={25} radius={5} />
              <View style={{ flex: 1, flexDirection: 'row', marginLeft: 10 }} >
                <Text style={{ color: 'black', flex: 1 }} >支付宝支付</Text>
              </View>
              <Icon name={aliIconName} color={aliIconColor} size={20} width={30} />
            </TouchableOpacity>
          </Card>
          <Card fullWidth >
            <TouchableOpacity
              onPress={() => this.setState({ checked: !this.state.checked, payType: 'wxPay' })}
              style={[Global.styles.CENTER, { flexDirection: 'row', paddingLeft: 10, paddingTop: 5 }]}
            >
              <Portrait imageSource={Global.Config.imgPayChannel.wxpay} width={25} height={25} radius={5} />
              <View style={{ flex: 1, flexDirection: 'row', marginLeft: 10 }} >
                <Text style={{ color: 'black', flex: 1 }} >微信支付</Text>
              </View>
              <Icon name={iconName} color={iconColor} size={20} width={30} onPress={this.check} />
            </TouchableOpacity>
          </Card>
          <Button
            style={styles.button}
            text="确认支付"
            onPress={this.payCreateSettle}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  button: {
    flex: 0,
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 40,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

PayCounter.navigationOptions = {
  title: '充值缴费',
};

export default PayCounter;
