/**
 * 充值缴费
 */
import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Button from 'rn-easy-button';
import Toast from 'react-native-root-toast';
import Form from '../../../modules/form/EasyForm';
import { testAmt } from '../../../modules/form/Validation';
import Global from '../../../Global';
import FormConfig from '../../../modules/form/config/LineInputsConfigForPayment';
import { filterMoney } from '../../../utils/Filters';
import { createDeposit } from '../../../services/payment/ChargeService';
import { patientPayment } from '../../../services/RequestTypes';
import config from '../../../../Config';
import { getPreStore } from '../../../services/payment/AliPayService';


const dismissKeyboard = require('dismissKeyboard');

class OutpatientOnlineRecharge extends Component {
  static displayName = 'OutpatientOnlineRecharge';
  static description = '就诊卡预存';

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
    );
  }

  constructor(props) {
    super(props);
    this.toPay = this.toPay.bind(this);
    this.onChange = this.onChange.bind(this);
    this.createDeposit = this.createDeposit.bind(this);
    this.checkAmtValid = this.checkAmtValid.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  state = {
    doRenderScene: false,
    amt: 0.00, // 充值金额
    balance: 0.00,
    isPermitPay: false,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      title: '就诊卡预存',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      afterChooseHospital: this.afterChooseHospital,
      afterChoosePatient: this.afterChoosePatient,
      hideBottomLine: true,
    });
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      }, () => {
        const { currProfile } = this.props.base;
        if (!currProfile) {
          Toast.show('请选择就诊人');
          return;
        }
        this.fetchData();
      });
    });
  }

  componentWillReceiveProps(props) {
    if (props.base.currProfile !== this.props.base.currProfile) {
      this.fetchData(props.base.currProfile);
    }
  }
  onChange(name, fValue) {
    if (name === 'amt') {
      this.setState({
        amt: fValue,
      });
    }
  }
  async fetchData(profile) {
    try {
      const currProfile = profile || this.props.base.currProfile;
      const preStore = await getPreStore({ no: currProfile.no, hosNo: currProfile.hosNo });
      console.info('fetchData:preStore', preStore);
      if (preStore.success) {
        if (preStore.result.status === '0') {
          this.setState({
            balance: preStore.result.balance ? preStore.result.balance : 0,
            isPermitPay: true,
          });
        } else {
          this.setState({
            balance: '',
            isPermitPay: false,
          });
          Toast.show('未查询到当前就诊人有效档案信息');
        }
      } else {
        this.setState({
          isPermitPay: false,
        });
        Toast.show('未查询到当前就诊人有效档案信息');
      }
    } catch (e) {
      this.setState({
        isPermitPay: false,
      });
      this.handleRequestException(e);
    }
  }
  // 校验金额的合法性
  checkAmtValid() {
    if (!this.state.amt) {
      Toast.show('请输入充值金额');
      return false;
    }
    if (this.state.amt === 0) {
      Toast.show('充值金额不能为0');
      return false;
    }
    if (!testAmt(this.state.amt)) {
      Toast.show('金额格式不正确');
      return false;
    }
    return true;
  }
  /*
  *选择常用就诊人之后回调
  *
  */
  toPay() {
    const { currProfile } = this.props.base;
    const { user } = this.props.auth;
    // 1.校验金额合法性
    if (!this.checkAmtValid()) {
      return;
    }
    // 2.生成预存单
    const params = {
      hosId: currProfile.hosId,
      hosNo: currProfile.hosNo,
      hosName: currProfile.hosName,
      proId: currProfile.id,
      proNo: currProfile.no,
      proName: currProfile.name,
      cardNo: currProfile.cardNo,
      cardType: currProfile.cardType,
      type: '0', // 充值
      amt: this.state.amt,
      // tradeNo: 第三方支付接口返回
      // tradeTime: 第三方支付接口返回
      userId: user.id,
      acccount: currProfile.acctNo,
      accountName: currProfile.name,
      accountType: '9',
      // accountBankCode: '',
      // tradeChannel: 进入收银台才会确定
      // tradeChannelCode:
      // terminalCode
      // batchNo
      adFlag: '0',
      // comment
      hisUser: currProfile.hisUser || user.id,
      appType: config.appType, // 审计字段
      appCode: config.appCode, // 审计字段
      terminalUser: currProfile.hisUser || user.id,
      // terminalCode: '';
      status: 'A', // 初始状态
    };
    this.createDeposit(params);
  }

  async createDeposit(param) {
    const { user } = this.props.auth;
    const bizUrl = patientPayment().depositCallback;
    try {
      this.props.screenProps.showLoading(true);
      const responseData = await createDeposit(param);
      const data = responseData.result;
      if (responseData.success) {
        const settle = {
          settleTitle: '门诊预存',
          amt: data.amt,
          bizType: '00',
          settleType: 'SP',
          bizNo: data.id,
          bizTime: data.createdAt,
          appType: config.appType, // 审计字段
          appCode: config.appCode, // 审计字段
          bizUrl,
          userId: user.id,
          title: '支付订单',
        };
        this.props.navigation.navigate('PayCounter', settle);
      }
      this.props.screenProps.hideLoading();
    } catch (e) {
      this.handleRequestException(e);
      this.props.screenProps.hideLoading();
    }
  }

  render() {
    if (!this.state.doRenderScene) {
      return OutpatientOnlineRecharge.renderPlaceholderView();
    }
    const { currProfile } = this.props.base;
    // 场景过渡动画未完成前，先渲染过渡场景
    return (
      <View style={[Global.styles.CONTAINER, {}]}>
        <View style={{ height: 5 }} />
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
            <View style={{ backgroundColor: 'white', paddingLeft: 20, paddingTop: 15, flexDirection: 'row', alignItems: 'center', height: 30 }} >
              <Text style={{ fontSize: 15, color: Global.colors.FONT_GRAY }}>当前余额</Text>
              <Text style={{ fontSize: 15, fontWeight: '600', color: Global.colors.IOS_RED, paddingLeft: 15 }}>{this.state.balance ? filterMoney(this.state.balance) : '0.00'}</Text>
            </View>
            <View style={{ paddingLeft: 15, paddingRight: 15 }} >
              <Form
                ref={(c) => { this.form = c; }}
                config={FormConfig}
                showLabel={false}
                labelWidth={100}
                onChange={this.onChange}
                value={this.state.patient}
              >
                <Text style={{ fontSize: 15, color: Global.colors.FONT_GRAY, paddingTop: 15, paddingLeft: 5 }} >充值金额</Text>
                <Form.TextInput
                  style={{ height: 76 }}
                  name="amt"
                  label="充值金额:"
                  placeholder="请输入充值金额"
                  dataType="bankAcct"
                  required
                  minLength={6}
                  maxLength={20}
                />
              </Form>
            </View>
            <Button
              style={styles.button}
              text="马上充值"
              disabled={!this.state.isPermitPay || !currProfile}
              onPress={this.toPay}
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
  margin: {
    marginLeft: 50,
    marginRight: 50,
  },
  button: {
    margin: 15,
    marginTop: 30,
    marginBottom: 40,
  },
});

const mapStateToProps = state => ({
  base: state.base,
  auth: state.auth,
});
export default connect(mapStateToProps)(OutpatientOnlineRecharge);
