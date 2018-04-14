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
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet, Alert,
} from 'react-native';
import Sep from 'rn-easy-separator';
import moment from 'moment';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import EasyIcon from 'rn-easy-icon';
import Button from 'rn-easy-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Global from '../../Global';
import Form from '../../modules/form/EasyForm';
import ctrlState from '../../modules/ListState';
import { getPreStore } from '../../services/payment/AliPayService';
import { getConsumeRecords, getPreRecords } from '../../services/consume/ConsumeRecordsService';
import FormConfig from '../../modules/form/config/LineInputsConfigForPayment';
import OnlineRecharge from '../pay/OnlineRecharge';
import { filterMoney } from '../../utils/Filters';
import Toast from 'react-native-root-toast';
import { createDeposit, refund } from '../../services/payment/ChargeService';
import config from '../../../Config';


const dismissKeyboard = require('dismissKeyboard');

class OutpatientRefundDetail extends Component {
  static displayName = 'OutpatientRefundDetail';
  static description = '门诊退费';

  constructor(props) {
    super(props);
    // this.onSearch = this.onSearch.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    // this.fetchData = this.fetchData.bind(this);
    // this.renderItem = this.renderItem.bind(this);
    // this.renderPlaceholderView = this.renderPlaceholderView.bind(this);
    this.onRefundButtonClick = this.onRefundButtonClick.bind(this);
    this.callRefund = this.callRefund.bind(this);
    this.onChange = this.onChange.bind(this);
    this.validRefund = this.validRefund.bind(this);
  }

  state = {
    ctrlState,
    // data: [],
    // balance: '',
    doRenderScene: false,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: false,
      allowSwitchPatient: false,
      afterChooseHospital: this.afterChooseHospital,
      afterChoosePatient: this.afterChoosePatient,
      hideBottomLine: true,
    });
    // InteractionManager.runAfterInteractions(() => {
    //   this.setState({
    //     doRenderScene: true,
    //   }, () => {
    //     this.fetchData(
    //       this.props.base.currHospital,
    //       this.props.base.currPatient,
    //       this.props.base.currProfile,
    //     );
    //   });
    // });
  }
  componentWillReceiveProps(props) {
    // console.log('componentWillReceiveProps begin:');
    // if (props.base.currProfile !== this.props.base.currProfile) {
    //   this.fetchData(
    //     props.base.currHospital,
    //     props.base.currPatient,
    //     props.base.currProfile,
    //   );
    // }
  }

  onChange(name, fValue, formValue) {
    if (name === 'amt') {
      this.setState({
        amt: fValue,
      });
    }
  }
  onSearch() {
    // // 重新发起按条件查询
    // this.setState({
    //   ctrlState: {
    //     ...this.state.ctrlState,
    //     refreshing: true,
    //     requestErr: false,
    //     requestErrMsg: null,
    //   },
    // }, () => this.fetchData(this.props.base.currHospital, this.props.base.currPatient, this.props.base.currProfile));
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
      proId: currProfile.id,
      proNo: currProfile.no,
      proName: currProfile.name,
      hosName: currProfile.hosName,
      hosId: currProfile.hosId,
      hosNo: currProfile.hosNo,
      cardNo: currProfile.cardNo,
      acccount: currProfile.acctNo,
      accountName: currProfile.name,
      accountType: '9',
      appChannel: 'APP',
      userId: user.id,
      cardType: '2',
      // oriTradeNo: data.tradeNo,
      // oriAmt: data.amt,
      amt: this.state.amt,
      tradeChannel: data.tradeChannel,
      tradeChannelCode: data.tradeChannelCode,
      adFlag: data.adFlag,
      appType: config.appType, // 审计字段
      appCode: config.appCode, // 审计字段
      bizType: '00', // 门诊预存，这个字段
      payType: data.tradeChannel === 'Z' ? 'aliPay' : 'wxPay',
      PayChannelCode: data.tradeChannel === 'Z' ? 'alipay' : 'wxpay',
      payTypeId: data.tradeChannel === 'Z' ? '4028748161098e60016109987e280021' : '4028748161098e60016109987e280011',
      // settleNo: data.settleNo,
      tradeNo: data.tradeNo,
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
    const refundedAmt = data.refundedAmt ? data.refundedAmt : 0;
    const maxReturnableAmt = (balance < (amt - refundedAmt)) ? balance : (amt - refundedAmt);
    if (maxReturnableAmt < this.state.amt) {
      result.success = false;
      result.msg = `最大可退款金额为：${filterMoney(maxReturnableAmt)} 元`;
      return result;
    }
    result.success = true;
    return result;
  }
  async callRefund(param) {
    console.log('callRefund begin');
    console.info(param);
    console.log('callRefund end');
    try {
      const responseData = await refund(param);
      if (responseData.success) {
        // Toast.show(responseData.msg);
        // this.props.navigation.goBack();
        this.props.navigation.navigate('CompleteRefundSuccess', { title: '退款成功' });
      } else {
        // Toast.show(responseData.msg);
        this.props.navigation.navigate('CompleteRefundSuccess', { title: '退款失败' });
      }
    } catch (e) {
      this.handleRequestException(e);
    }
  }

  async fetchData(hospital, patient, profile) {
    // console.log('fetchData11:');
    // if (!profile) {
    //   this.setState({
    //     ctrlState: {
    //       ...this.state.ctrlState,
    //       refreshing: false,
    //       requestErr: false,
    //       requestErrMsg: null,
    //     },
    //     data: [],
    //   });
    //   return;
    // }
    // try {
    //   this.setState({
    //     ctrlState: {
    //       ...this.state.ctrlState,
    //       refreshing: true,
    //     },
    //   });
    //   // const consumeRecordsData = await getConsumeRecords({ proNo: this.state.profile.no, hosNo: this.state.profile.hosNo });
    //   const preRecordsData = await getPreRecords({ proNo: profile.no, hosNo: profile.hosNo });
    //   const responseData = await getPreStore({ no: profile.no, hosNo: profile.hosNo });
    //   if (preRecordsData.success) {
    //     this.setState({
    //       data: preRecordsData.result ? preRecordsData.result : [],
    //       // consumeRecords: consumeRecordsData.result ? consumeRecordsData.result : [],
    //       balance: responseData.result ? responseData.result.balance : 0,
    //       ctrlState: {
    //         ...this.state.ctrlState,
    //         refreshing: false,
    //       },
    //     });
    //   } else {
    //     this.handleRequestException({ msg: '获取消费记录出错！' });
    //     this.setState({
    //       ctrlState: {
    //         ...this.state.ctrlState,
    //         refreshing: false,
    //       },
    //     });
    //   }
    // } catch (e) {
    //   this.handleRequestException(e);
    //   this.setState({
    //     ctrlState: {
    //       ...this.state.ctrlState,
    //       refreshing: false,
    //     },
    //   });
    // }
  }

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  renderPlaceholderView() {
    // console.log('111111111111');
    // return (
    //   <SafeAreaView style={[Global.styles.CONTAINER, { backgroundColor: 'white' }]} >
    //     <View style={{ flex: 1 }} />
    //   </SafeAreaView>
    // );
  }
  // /**
  //  * 渲染行数据
  //  */
  // renderItem({ item, index }) {
  //   return (
  //     <Item
  //       data={item}
  //       index={index}
  //       onPressItem={() => {
  //         console.log('onPressItem:');
  //         // this.props.navigates('Symptom', {
  //         // });
  //         // this.props.navigation.navigate('SelSymptomsList', {
  //         // });
  //       }}
  //     />
  //   );
  // }

  render() {
    // // 场景过渡动画未完成前，先渲染过渡场景
    // if (!this.state.doRenderScene) {
    //   return this.renderPlaceholderView();
    // }
    const { data } = this.props.navigation.state.params;
    const balance = data.balance ? data.balance : 0;
    const amt = data.amt ? data.amt : 0;
    const refundedAmt = data.refundedAmt ? data.refundedAmt : 0;
    const maxReturnableAmt = (balance < (amt - refundedAmt)) ? balance : (amt - refundedAmt);
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
                <Text style={{ fontSize: 15, color: Global.colors.FONT_GRAY, paddingTop: 15, paddingLeft: 5 }} >可用余额：{ filterMoney(balance) } 元</Text>
                <Text style={{ fontSize: 15, color: Global.colors.FONT_GRAY, paddingTop: 15, paddingLeft: 5 }} >充值金额：{ filterMoney(amt) } 元</Text>
                <Text style={{ fontSize: 15, color: Global.colors.FONT_GRAY, paddingTop: 15, paddingLeft: 5 }} >已退金额：{ filterMoney(refundedAmt) } 元</Text>
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
