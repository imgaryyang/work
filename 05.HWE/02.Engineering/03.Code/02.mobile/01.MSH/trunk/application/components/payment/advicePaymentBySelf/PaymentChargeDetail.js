import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  SectionList,
  InteractionManager,
} from 'react-native';

import _ from 'lodash';
import Button from 'rn-easy-button';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import ctrlState from '../../../modules/ListState';
import Global from '../../../Global';
import Checkbox from '../../../modules/Checkbox';
import { filterMoney } from '../../../utils/Filters';
import { prepay } from '../../../services/payment/ChargeService';
import { getPatientPayment } from '../../../services/payment/AliPayService';
// import { getCurrProfile } from "../../../utils/Storage";
import config from '../../../../Config';

class PaymentChargeDetail extends Component {
  static displayName = 'PaymentChargeDetail';
  static description = '医嘱缴费主界面';
  static getSections(list) {
    const sections = [];
    let flag = 0;
    const datas = [];
    for (let i = 0; i < list.length; i++) {
      let az = '';
      for (let j = 0; j < datas.length; j++) {
        if (datas[j][0].recordNo === list[i].recordNo) {
          flag = 1;
          az = j;
          break;
        }
      }
      if (flag === 1) {
        datas[az].push(list[i]);
        flag = 0;
      } else if (flag === 0) {
        const wdy = [];
        wdy.push(list[i]);
        datas.push(wdy);
        sections.push({ key: `${list[i].recordNo}`, value: `处方 ${list[i].recordNo}`, data: wdy, department: list[i].department, doctor: list[i].doctor });
      }
    }
    return sections;
  }
  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
    );
  }
  /**
   * 渲染行数据
   */
  static renderItem({ item }) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', marginBottom: 8, paddingLeft: 20, paddingRight: 20 }} >
        <Text style={[styles.item, styles.black, styles.strong]}>{item.name}</Text>
        <Text style={[styles.qty, styles.gray]}>{item.num}</Text>
        <Text style={[styles.price, styles.gray]}>{filterMoney(item.price)}</Text>
        <Text style={[styles.total, styles.gray]}>{filterMoney(item.amount)}</Text>
      </View>
    );
  }
  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.renderSectionComp = this.renderSectionComp.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.renderPromptView = this.renderPromptView.bind(this);
    this.prePay = this.prePay.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }
  state = {
    doRenderScene: false,
    ctrlState,
    selectRecordIds: [],
    chargeDetail: [],
  };
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
        },
      }, () => {
        const { currProfile } = this.props.base;
        if (!currProfile) {
          Toast.show('请选择就诊人');
          return;
        }
        this.fetchData();
      });
    });
    this.props.navigation.setParams({
      title: '自费缴费',
      showCurrHospitalAndPatient: true, // !!user,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      afterChooseHospital: this.afterChooseHospital,
      afterChoosePatient: this.afterChoosePatient,
      hideNavBarBottomLine: false,
    });
  }
  componentWillReceiveProps(props) {
    if (props.base.currProfile !== this.props.base.currProfile) {
      this.fetchData(props.base.currProfile);
    }
  }
  onSearch() {
    const { callback } = this.props;
    if (typeof callback === 'function') {
      callback();
    }
  }

  // 选择行项目
  onSelect(info) {
    const { key } = info.section;
    this.setState((state) => {
      const ids = state.selectRecordIds.concat();
      const idx = _.indexOf(ids, key);
      if (idx === -1) {
        ids[ids.length] = key;
      } else {
        ids.splice(idx, 1);
      }
      return { selectRecordIds: ids };
    });
  }
  async fetchData(profile) {
    try {
      let profileData = {};
      profileData = profile || this.props.base.currProfile;
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      });
      const patientPayment = await getPatientPayment({proNo: profileData.no, hosNo: profileData.hosNo});
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
    } catch (e) {
      this.handleRequestException({ msg: '获取待缴费项目出错！' });
    }
  }
  async prePay() {
    const { selectRecordIds } = this.state;
    // 如果没有有效的处方号信息
    if (!selectRecordIds || !selectRecordIds.length || selectRecordIds.length < 1) {
      return;
    }
    const { currProfile } = this.props.base;
    const { user } = this.props.auth;
    const param = {};
    param.hosNo = currProfile.hosNo;
    param.hosName = currProfile.hosName;
    param.proNo = currProfile.no;
    param.proName = currProfile.name;
    param.cardNo = currProfile.cardNo;
    param.cardType = currProfile.cardType;
    // param.actNo =
    param.miType = currProfile.type; // 自费，目前只允许自费缴费
    param.chargeUser = user.id;
    param.tradeChannel = 'F'; // 预缴
    param.tradeChannelCode = ''; // 预缴，没有对应值
    param.comment = '';
    param.hisUser = currProfile.hisUser || user.id;
    param.appType = config.appType;
    param.appCode = config.appCode;
    param.terminalUser = currProfile.terminalCode || user.id;
    param.terminalCode = '';
    param.items = [];
    const data = this.state.chargeDetail
    for (let idx = 0; idx < data.length; idx += 1) {
      if (selectRecordIds.indexOf(data[idx].recordNo) > -1) {
        param.items.push(data[idx]);
      }
    }
    try {
      const preRecordsData = await prepay(param);
      if (preRecordsData.success) {
        this.props.navigation.navigate('PreSettlementBySelf', { title: '门诊缴费预结算', data: { ...preRecordsData.result, items: param.items } });
      }
    } catch (e) {
      this.handleRequestException(e);
    }
  }
  renderSectionComp(info) {
    const { value, key } = info.section;
    return (
      <View >
        <View style={styles.header}>
          <Text style={styles.headerText} >
            {value}
          </Text>
          <Checkbox
            checked={_.indexOf(this.state.selectRecordIds, key) !== -1}
            onPress={() => this.onSelect(info)}
          />
        </View>
        <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 20, paddingBottom: 8, alignItems: 'center' }} >
          <Text style={[styles.item, styles.lightgray]} >项目</Text>
          <Text style={[styles.qty, styles.lightgray]} >数量</Text>
          <Text style={[styles.price, styles.lightgray]} >单价</Text>
          <Text style={[styles.total, styles.lightgray]} >总价</Text>
        </View>
      </View>
    );
  }

  renderSectionSep() {
    return <View style={{ height: 10 }} />;
  }
  /**
   * 渲染提示信息
   */
  renderPromptView() {
    return (
      <View style={Global.styles.CONTAINER}>暂未开通非自费患者缴费</View>
    );
  }
  render() {
    if (!this.state.doRenderScene) { return PaymentChargeDetail.renderPlaceholderView(); }
    const { currProfile } = this.props.base;
    const value = PaymentChargeDetail.getSections(this.state.chargeDetail ? this.state.chargeDetail : []);
    let content = {};
    if (!currProfile) {
      content = this.renderEmptyView({
        msg: '请选择就诊用户',
        ctrlState: { refreshing: false },
        style: { marginTop: 15 },
      });
    } else {
      content = currProfile.type !== '1' ? (
        this.renderEmptyView({
          msg: '暂未开通非自费用户在线缴费服务',
          ctrlState: {refreshing: false},
          style: {marginTop: 15},
        })
        // <Text style={{ fontSize: 15, color: Global.colors.FONT_GRAY, padding: 15 }}>暂未开通非自费用户在线缴费服务</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View automaticallyAdjustContentInsets={false}>
            <SectionList
              renderSectionHeader={this.renderSectionComp}
              renderItem={PaymentChargeDetail.renderItem}
              SectionSeparatorComponent={this.renderSectionSep}
              sections={value}
              keyExtractor={(item, index) => (1 + index + item)}
              refreshing={this.state.ctrlState.refreshing}
              onRefresh={this.onSearch}
              ListEmptyComponent={() => {
                return this.renderEmptyView({
                  msg: '暂无待缴费信息',
                  reloadMsg: '点击刷新按钮重新查询',
                  reloadCallback: this.onSearch,
                  ctrlState: this.state.ctrlState,
                });
              }}
            />
          </View>
          <View style={{flexDirection: 'row', margin: 15, marginTop: 30, marginBottom: 40}}>
            <Button text="自费结算" onPress={this.prePay} disabled={currProfile.type !== '1'} theme={Button.THEME.ORANGE}
                    screenProps={this.props.screenProps}/>
          </View>
        </ScrollView>
      );
    }
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    borderTopWidth: 1 / Global.pixelRatio,
    borderTopColor: Global.colors.LINE,
  },
  headerText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Global.colors.FONT_GRAY,
  },

  item: {
    flex: 1,
    fontSize: 13,
  },
  qty: {
    width: 45,
    textAlign: 'right',
    fontSize: 12,
  },
  price: {
    width: 70,
    textAlign: 'right',
    fontSize: 12,
  },
  total: {
    width: 70,
    textAlign: 'right',
    fontSize: 12,
  },
  strong: {
    fontWeight: '600',
  },
  black: {
    color: 'black',
  },
  gray: {
    color: Global.colors.FONT_GRAY,
  },
  lightgray: {
    color: Global.colors.FONT_LIGHT_GRAY,
  },

  inforMain: {
    fontSize: 13,
    color: 'black',
    fontWeight: '600',
    paddingBottom: 5,
  },
  info: {
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
    fontWeight: '600',
    paddingBottom: 5,
  },
});

PaymentChargeDetail.navigationOptions = {
};

const mapStateToProps = state => ({
  base: state.base,
  auth: state.auth,
});
export default connect(mapStateToProps)(PaymentChargeDetail);
