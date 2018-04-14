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

const BlankScene = () => {
  return (<View style={{ flex: 1, backgroundColor: 'white' }} />);
};

class PaymentMain extends Component {
  constructor(props) {
    super(props);
    // this.afterChooseHospital = this.afterChooseHospital.bind(this);
    // this.afterChoosePatient = this.afterChoosePatient.bind(this);
    // this.getProfile = this.getProfile.bind(this);
    this.fetchData = this.fetchData.bind(this);
    // this.callback = this.callback.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.fetchPatientPayment = this.fetchPatientPayment.bind(this);
    this.fetchPreStore = this.fetchPreStore.bind(this);
    this.fetchPrePay = this.fetchPrePay.bind(this);
    this.refreshData = this.refreshData.bind(this);
  }

  state = {
    doRenderScene: false,
    chargeDetail: [],
    preStoreBalance: 0,
    prePayBalance: 0,
    // profile: {},
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
      }, () => this.refreshData());
    });
    this.props.navigation.setParams({
      // title: '充值缴费',
      showCurrHospitalAndPatient: true, // !!user,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      afterChooseHospital: this.afterChooseHospital,
      afterChoosePatient: this.afterChoosePatient,
      hideNavBarBottomLine: true,
    });
  }
  componentWillReceiveProps(props) {
    console.log('componentWillReceiveProps:');
    console.info(props.base.currProfile.no);
    console.info(this.props.base.currProfile.no);
    if (props.base.currProfile !== this.props.base.currProfile) {
      console.log('componentWillReceiveProps1');
      this.refreshData(props.base.currProfile);
    }
  }
  // getProfile(hospital, patient) {
  //   if (hospital !== null && patient !== null) {
  //     const { profiles } = patient;
  //     if (profiles !== null) {
  //       const length = profiles.length ? profiles.length : 0;
  //       for (let i = 0; i < length; i++) {
  //         const pro = profiles[i];
  //         if (pro.status === '1' && pro.hosId === hospital.id) {
  //           this.setState({
  //             profile: pro,
  //           }, () => this.fetchData());
  //         }
  //       }
  //     } else {
  //       Toast.show('当前就诊人在当前医院暂无档案！');
  //       return null;
  //     }
  //   }
  // }

  // afterChooseHospital(hospital) {
  //   this.getProfile(hospital, this.props.base.currPatient);
  // }
  //
  // afterChoosePatient(patient, profile) {
  //   if (typeof profile !== 'undefined' && profile !== null) {
  //     this.setState({
  //       profile,
  //     }, () => this.fetchData());
  //   }
  // }

  // callback() {
  //   this.fetchData();
  // }

  async fetchPatientPayment(profile) {
    let profileData = {};
    profileData = profile || this.props.base.currProfile;
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
      },
    });
    const patientPayment = await getPatientPayment({ proNo: profileData.no, hosNo: profileData.hosNo });
    if (patientPayment.success) {
      this.setState({
        chargeDetail: patientPayment.result ? patientPayment.result : [],
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
        },
      });
    } else {
      this.handleRequestException({ msg: '获取待缴费项目出错！' });
    }
  }
  async fetchPreStore(profile) {
    let profileData = {};
    console.log('fetchPreStore');
    console.info(profile);
    profileData = profile || this.props.base.currProfile;
    const preStore = await getPreStore({ no: profileData.no });
    console.log('fetchPreStore:', profileData.no);
    console.info(preStore);
    if (preStore.success) {
      this.setState({
        preStoreBalance: preStore.result.balance ? preStore.result.balance : 0,
      });
    } else {
      this.handleRequestException({ msg: '获取门诊预存余额出错！' });
    }
  }
  async fetchPrePay(profile) {
    let profileData = {};
    profileData = profile || this.props.base.currProfile;
    const prePay = await getPrePay({ no: profileData.no });
    if (prePay.success) {
      this.setState({
        prePayBalance: prePay.result.balance ? prePay.result.balance : 0,
      });
    } else {
      this.handleRequestException({ msg: '获取住院预缴余额出错！' });
    }
  }
  async refreshData(profile) {
    console.log('refreshData1');
    this.setState({
      chargeDetail: [],
      preStoreBalance: 0,
      prePayBalance: 0,
    }, () => this.fetchData(profile));
    console.log('refreshData2');
  }
  async fetchData(profile) {
    console.log('fetchData');
    console.info('profile');
    this.fetchPreStore(profile);
    this.fetchPrePay(profile);
    this.fetchPatientPayment(profile);
  }
  renderPlaceholderView() {
    return (
      <ScrollableTabView
        initialPage={0}
        renderTabBar={() => <PintrestTabBar />}
      >
        <BlankScene
          tabLabel="在线充值"
        />
        <BlankScene
          tabLabel="门诊缴费"
        />
      </ScrollableTabView>
    );
  }

  render() {
    if (!this.state.doRenderScene) { return this.renderPlaceholderView(); }
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
          tabLabel="门诊缴费"
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
