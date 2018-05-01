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
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Global from '../../../Global';
import { afterLogin, updateUser } from '../../../actions/base/AuthAction';
import { setCurrPatient } from '../../../actions/base/BaseAction';
import { pay } from '../../../services/payment/ChargeService';
import { filterMoney } from '../../../utils/Filters';
import config from '../../../../Config';

const dismissKeyboard = require('dismissKeyboard');

class PreSettlementBySelf extends Component {
  static displayName = 'PreSettlementBySelf';
  static description = '门诊缴费预结算';
  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.pay = this.pay.bind(this);
  }

  state = {
    doRenderScene: false,
  };
  componentWillMount() {
    // todo
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    this.props.navigation.setParams({
      title: '门诊缴费预结算',
    });
  }
  async pay() {
    const { currProfile: profile } = this.props.base;
    const { user } = this.props.auth;
    const { data } = this.props.navigation.state.params;
    const pro = {};
    pro.hosNo = profile.hosNo;
    pro.hosName = profile.hosName;
    pro.proNo = profile.no;
    pro.proName = profile.name;
    pro.cardNo = profile.cardNo;
    pro.cardType = profile.cardType;
    // pro.actNo = 诊疗活动编号
    pro.miType = profile.type; // 自费，目前只允许自费缴费
    pro.no = data.no;
    pro.chargeUser = user.id;
    pro.tradeChannel = 'F'; // 预缴
    pro.tradeChannelCode = ''; // 预缴编码，没有对应值
    pro.comment = '';
    pro.hisUser = profile.hisUser || user.id;
    pro.appType = config.appType;
    pro.appCode = config.appCode;
    pro.terminalUser = profile.no;
    pro.terminalCode = profile.mobile;
    // pro.chargeUser =
    pro.items = data.items;
    try {
      this.props.screenProps.showLoading(true);
      const payResultData = await pay(pro);
      if (payResultData.success) {
        Toast.show('缴费成功');
        this.props.navigation.goBack();
      } else {
        Toast.show(`缴费失败：${payResultData.msg}`);
        this.props.navigation.goBack();
      }
      this.props.screenProps.hideLoading();
    } catch (e) {
      this.handleRequestException(e);
      this.props.screenProps.hideLoading();
    }
  }
  render() {
    if (!this.state.doRenderScene) { return PreSettlementBySelf.renderPlaceholderView(); }
    const { data } = this.props.navigation.state.params;
    const settlement = (
      <View>
        <View style={{ paddingLeft: 50, paddingRight: 50, marginTop: 30 }} >
          <View style={styles.contain}>
            <Text style={styles.containText}>共需支付</Text>
            <Text style={styles.amt}>{filterMoney(data.amt, 2)}</Text>
          </View>
          <View style={styles.contain}>
            <Text style={styles.containText}>医院优惠</Text>
            <Text style={styles.amt}>{filterMoney(data.reduceAmt, 2)}</Text>
          </View>
          <View style={styles.contain}>
            <Text style={[styles.containText, { color: Global.colors.IOS_BLUE }]}>还需支付</Text>
            <Text style={[styles.amt, { color: Global.colors.IOS_BLUE }]}>{filterMoney(data.myselfAmt, 2)}</Text>
          </View>
        </View>
        <View style={{ margin: 15, marginTop: 40, marginBottom: 40 }}>
          <Button text="去缴费" onPress={() => { this.pay(); }} />
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
