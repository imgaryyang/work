/**
 * 预存记录
 */
import React, {
  Component,
} from 'react';
import {
  InteractionManager,
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet, Alert,
} from 'react-native';
import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Global from '../../Global';
import Form from '../../modules/form/EasyForm';
import FormConfig from '../../modules/form/config/LineInputsConfigForPayment';
import { filterMoney } from '../../utils/Filters';
import { refund } from '../../services/payment/ChargeService';
import config from '../../../Config';
import PlaceholderView from '../../modules/PlaceholderView';

const dismissKeyboard = require('dismissKeyboard');

class OutpatientRefundDetail extends Component {
  static displayName = 'OutpatientRefundDetail';
  static description = '门诊退费';

  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onRefundButtonClick = this.onRefundButtonClick.bind(this);
    this.callRefund = this.callRefund.bind(this);
    this.onChange = this.onChange.bind(this);
    this.validRefund = this.validRefund.bind(this);
  }

  state = {
    doRenderScene: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => this.setState({ doRenderScene: true }));
    this.props.navigation.setParams({
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: false,
      allowSwitchPatient: false,
      afterChooseHospital: this.afterChooseHospital,
      afterChoosePatient: this.afterChoosePatient,
      hideBottomLine: true,
    });
  }
  // componentWillReceiveProps(props) {
  // }

  onChange(name, fValue) {
    if (name === 'amt') {
      this.setState({
        amt: fValue,
      });
    }
  }

  onRefundButtonClick() {
    const { data } = this.props.navigation.state.params;
    const result = this.validRefund();
    if (!result.success) {
      Alert.alert(
        '提示',
        result.msg,
        [
          {
            text: '确定',
          },
        ],
      );
      return;
    }
    const { currProfile } = this.props.base;
    const { user } = this.props.auth;
    const bill = {
      hosId: currProfile.hosId,
      hosNo: currProfile.hosNo,
      hosName: currProfile.hosName,
      proId: currProfile.id,
      proNo: currProfile.no,
      proName: currProfile.name,
      cardNo: currProfile.cardNo,
      cardType: currProfile.cardType,
      type: '1', // 退款
      oriNo: data.no,
      amt: this.state.amt,
      tradeNo: data.tradeNo, // 原交易流水
      // tradeTime
      userId: user.id,
      acccount: currProfile.acctNo,
      accountName: currProfile.name,
      accountType: '9',
      tradeChannel: data.tradeChannel,
      tradeChannelCode: data.tradeChannelCode,
      // accountBankCode:
      // terminalCode
      // batchNo
      adFlag: data.adFlag,
      // comment
      hisUser: currProfile.hisUser || user.id,
      appType: config.appType, // 审计字段
      appCode: config.appCode, // 审计字段
      terminalUser: currProfile.hisUser || user.id,
      // terminalCode:
      appChannel: 'APP',
      // oriTradeNo: data.tradeNo,
      // oriAmt: data.amt,
      bizType: '00', // 门诊预存，这个字段
      payType: data.tradeChannel === 'Z' ? 'aliPay' : 'wxPay',
      PayChannelCode: data.tradeChannel === 'Z' ? 'alipay' : 'wxpay',
      payTypeId: data.tradeChannel === 'Z' ? '4028748161098e60016109987e280021' : '4028748161098e60016109987e280011',
      // settleNo: data.settleNo,
      no: data.no,
      // comment
    };
    this.callRefund(bill);
  }
  validRefund() {
    const result = {};
    if (!this.state.amt) {
      result.success = false;
      result.msg = '请输入退款金额';
      return result;
    }
    if (this.state.amt === 0) {
      result.success = false;
      result.msg = '退款金额不能为0';
      return result;
    }
    const { data } = this.props.navigation.state.params;
    const balance = data.balance ? data.balance : 0;
    const amt = data.amt ? data.amt : 0;
    const refunded = data.refunded ? data.refunded : 0;
    const maxReturnableAmt = (balance < (amt - refunded)) ? balance : (amt - refunded);
    if (maxReturnableAmt < this.state.amt) {
      result.success = false;
      result.msg = `最大可退款金额为：${filterMoney(maxReturnableAmt)} 元`;
      return result;
    }
    result.success = true;
    return result;
  }
  async callRefund(param) {
    try {
      this.props.screenProps.showLoading(true);
      const responseData = await refund(param);
      this.props.screenProps.hideLoading();
      if (responseData.success) {
        // Toast.show(responseData.msg);
        // this.props.navigation.goBack();
        this.props.navigation.navigate('CompleteRefundSuccess', { title: '退款成功' });
      } else {
        // Toast.show(responseData.msg);
        this.props.navigation.navigate('CompleteRefundFailure', { title: '退款失败' });
      }
    } catch (e) {
      this.handleRequestException(e);
      this.props.screenProps.hideLoading();
    }
  }

  render() {
    const { doRenderScene } = this.state;

    if (!doRenderScene) {
      return <PlaceholderView />; // 场景过渡动画未完成前，先渲染过渡场景
    }

    const { data } = this.props.navigation.state.params;
    const balance = data.balance ? data.balance : 0;
    const amt = data.amt ? data.amt : 0;
    const refunded = data.refunded ? data.refunded : 0;
    const maxReturnableAmt = (balance < (amt - refunded)) ? balance : (amt - refunded);
    return (
      <View style={[Global.styles.CONTAINER, {}]}>
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
            <View style={{ paddingLeft: 15, paddingRight: 15 }} >
              <Form
                ref={(c) => { this.form = c; }}
                config={FormConfig}
                showLabel={false}
                labelWidth={100}
                onChange={this.onChange}
                value={this.state.patient}
              >
                <Text style={{ fontSize: 15, color: Global.colors.FONT_GRAY, paddingTop: 15, paddingLeft: 5 }} >当前余额：{ filterMoney(balance) } 元</Text>
                <Text style={{ fontSize: 15, color: Global.colors.FONT_GRAY, paddingTop: 15, paddingLeft: 5 }} >充值金额：{ filterMoney(amt) } 元</Text>
                <Text style={{ fontSize: 15, color: Global.colors.FONT_GRAY, paddingTop: 15, paddingLeft: 5 }} >已退金额：{ filterMoney(refunded) } 元</Text>
                <Text style={{ fontSize: 15, color: Global.colors.FONT_GRAY, paddingTop: 15, paddingLeft: 5 }} >最大可退金额：{ filterMoney(maxReturnableAmt) } 元</Text>
                <Form.TextInput
                  style={{ height: 76 }}
                  name="amt"
                  label="充值金额:"
                  placeholder="请输入退款金额"
                  dataType="bankAcct"
                  required
                  minLength={6}
                  maxLength={20}
                />
              </Form>
            </View>
            <Button
              style={styles.button}
              text="退款"
              onPress={() => {
                this.onRefundButtonClick();
              }}
            />
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  list: {
    borderBottomWidth: 1,
    borderBottomColor: Global.colors.LINE,
  },
  button: {
    flex: 0,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 15,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

const mapStateToProps = state => ({
  base: state.base,
  auth: state.auth,
});

export default connect(mapStateToProps)(OutpatientRefundDetail);
