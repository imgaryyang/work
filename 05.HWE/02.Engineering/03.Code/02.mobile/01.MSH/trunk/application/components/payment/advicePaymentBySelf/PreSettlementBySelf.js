/**
 * 用户登录
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  InteractionManager,
} from 'react-native';

import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Separator from 'rn-easy-separator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Global from '../../../Global';
import { afterLogin, updateUser } from '../../../actions/base/AuthAction';
import { setCurrPatient } from '../../../actions/base/BaseAction';
import { getPrePaymentInfo } from '../../../services/payment/ChargeService';
import { filterMoney } from '../../../utils/Filters';

const dismissKeyboard = require('dismissKeyboard');

class PreSettlementBySelf extends Component {
  static displayName = 'PreSettlementBySelf';
  static description = '自费预结算';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.prePay = this.prePay.bind(this);
  }

  state = {
    doRenderScene: false,
    preStoreBalance: 0.00, // 预存账户余额
    prePayBalance: 0.00, // 预缴账户余额
    amt: 0.00, // 充值金额
    cardType: '0',
    type: '0',
    isPreStore: true,
    showLabel: true,
    labelPosition: 'left',
    billTitle: '自费结算',
    appCode: 'appCode',
    terminalCode: 'zhangsan',
    payerNo: 'lisi',
    bizType: '预存',
    showSettlement: false,
    totalAmt: 0,
    reduceAmt: 0,
    myselfAmt: 0,
  };
  componentWillMount() {
    const params = this.props.navigation.state.params;
    this.prePay(params);
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    this.props.navigation.setParams({
      title: '医院预结算',
    });
  }
  onSuccess(item) {
    this.setState({
      showSettlement: true,
    });
  }
  async prePay(params) {
    this.props.screenProps.showLoading();
    try {
      const responseData = await getPrePaymentInfo(params);
      if (responseData.success) {
        const data = responseData.result;
        this.setState({
          totalAmt: data.amt,
          amt: data.myselfAmt,
          reduceAmt: data.reduceAmt,
          myselfAmt: data.myselfAmt,
          chargeId: data.id,
        });
      }
      this.props.screenProps.hideLoading();
    } catch (e) {
      // 隐藏遮罩
      this.props.screenProps.hideLoading();
      this.handleRequestException(e);
    }
  }
  render() {
    if (!this.state.doRenderScene) { return PreSettlementBySelf.renderPlaceholderView(); }
    const settlement = (
      <View>
        <View style={{ paddingLeft: 50, paddingRight: 50, marginTop: 30 }} >
          <View style={styles.contain}>
            <Text style={styles.containText}>共需支付</Text>
            <Text style={styles.amt}>{filterMoney(this.state.totalAmt, 2)}</Text>
          </View>
          <View style={styles.contain}>
            <Text style={styles.containText}>医院优惠</Text>
            <Text style={styles.amt}>{filterMoney(this.state.reduceAmt, 2)}</Text>
          </View>
          <View style={styles.contain}>
            <Text style={[styles.containText, { color: Global.colors.IOS_BLUE }]}>还需支付</Text>
            <Text style={[styles.amt, { color: Global.colors.IOS_BLUE }]}>{filterMoney(this.state.myselfAmt, 2)}</Text>
          </View>
        </View>
        <View style={{ margin: 15, marginTop: 40, marginBottom: 40 }}>
          <Button text="去缴费" onPress={() => { this.props.navigation.navigate('PayCounter', this.state); }} />
        </View>
      </View>
    );

    return (
      <View style={[Global.styles.CONTAINER]}>
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
            {settlement}
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
  logoHolder: {
    height: Global.getScreen().height / 4,
  },
  logo: {
    width: (Global.getScreen().width / 2),
    height: (Global.getScreen().height / 4),
    backgroundColor: 'transparent',
    borderRadius: 2,
  },
  contain: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  containText: {
    flex: 1,
    fontSize: 18,
    color: Global.colors.FONT_LIGHT_GRAY,
    marginRight: 10,
  },
  amt: {
    flex: 1,
    fontSize: 18,
    color: Global.colors.FONT_LIGHT_GRAY,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

PreSettlementBySelf.navigationOptions = {
  headerTitle: '预结算',
};

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  afterLogin: user => dispatch(afterLogin(user)),
  updateUser: user => dispatch(updateUser(user)),
  setCurrPatient: userPatient => dispatch(setCurrPatient(userPatient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PreSettlementBySelf);
