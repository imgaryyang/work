/**
 * 充值缴费
 */

import React, { Component } from 'react';
import { InteractionManager,
  View } from 'react-native';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Toast from 'react-native-root-toast';

import PintrestTabBar from '../../modules/PintrestTabBar';
import Online from './OnlineRecharge';
import Payment from '../payment/advicePaymentBySelf/PaymentChargeDetail';
import Global from '../../Global';
import { getPreStore, getPatientPayment, getPrePay } from '../../services/payment/AliPayService';


class PaymentMain extends Component {
  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.afterChooseHospital = this.afterChooseHospital.bind(this);
    this.afterChoosePatient = this.afterChoosePatient.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.callback = this.callback.bind(this);
  }

  state = {
    doRenderScene: false,
    profile: {},
  };

  async componentDidMount() {
    // const user = Global.getUser();
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      }, () => this.getProfile(this.props.base.currHospital, this.props.base.currPatient));
    });
    this.props.navigation.setParams({
      title: '充值缴费',
      showCurrHospitalAndPatient: true, // !!user,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      afterChooseHospital: this.afterChooseHospital,
      afterChoosePatient: this.afterChoosePatient,
      hideNavBarBottomLine: true,
    });
  }

  getProfile(hospital, patient) {
    if (hospital !== null && patient !== null) {
      const { profiles } = patient;
      if (profiles !== null) {
        const length = profiles.length ? profiles.length : 0;
        for (let i = 0; i < length; i++) {
          const pro = profiles[i];
          if (pro.status === '1' && pro.hosId === hospital.id) {
            this.setState({
              profile: pro,
            }, () => this.fetchData());
          }
        }
      } else {
        Toast.show('当前就诊人在当前医院暂无档案！');
        return null;
      }
    }
  }

  afterChooseHospital(hospital) {
    this.getProfile(hospital, this.props.base.currPatient);
  }

  afterChoosePatient(patient, profile) {
    if (typeof profile !== 'undefined' && profile !== null) {
      this.setState({
        profile,
      }, () => this.fetchData());
    }
  }

  callback() {
    this.fetchData();
  }

  async fetchData() {
    try {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      });
      const patientPayment = await getPatientPayment({ proNo: this.state.profile.no, hosNo: this.state.profile.hosNo });
      const preStore = await getPreStore({ no: this.state.profile.no });
      const prePay = await getPrePay({ no: this.state.profile.no });
      if (patientPayment.success) {
        this.setState({
          chargeDetail: patientPayment.result ? patientPayment.result : 0,
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
          },
        });
      } else {
        this.handleRequestException({ msg: '获取待缴费项目出错！' });
      }
      if (preStore.success) {
        this.setState({
          preStoreBalance: preStore.result.balance ? preStore.result.balance : 0,
        });
      } else {
        this.handleRequestException({ msg: '获取门诊预存余额出错！' });
      }
      if (preStore.success) {
        this.setState({
          prePayBalance: prePay.result.balance ? prePay.result.balance : 0,
        });
      } else {
        this.handleRequestException({ msg: '获取住院预缴余额出错！' });
      }
    } catch (e) {
      this.handleRequestException(e);
    }
  }

  render() {
    if (!this.state.doRenderScene) { return PaymentMain.renderPlaceholderView(); }
    return (
      <ScrollableTabView
        initialPage={0}
        renderTabBar={() => <PintrestTabBar />}
      >
        <Online
          tabLabel="在线充值"
          dataProps={this.state}
          navigates={this.props.navigation.navigate}
        />
        <Payment
          tabLabel="医嘱缴费"
          navigates={this.props.navigation.navigate}
          dataProps={this.state}
        />
      </ScrollableTabView>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});
export default connect(mapStateToProps)(PaymentMain);
