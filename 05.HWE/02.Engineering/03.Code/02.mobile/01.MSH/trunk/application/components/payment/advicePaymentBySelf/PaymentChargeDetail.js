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
// import { NavigationActions } from 'react-navigation';
import ctrlState from '../../../modules/ListState';
import Global from '../../../Global';
import Checkbox from '../../../modules/Checkbox';
// import Item from '../../../modules/PureListItem';
// import {getPatientPayment, getPreStore} from '../../../services/payment/AliPayService';
import { filterMoney } from '../../../utils/Filters';
// import { get } from "../../../utils/Request";
// import {patientPayment} from "../../../services/RequestTypes";
// import {getPreRecords} from "../../../services/consume/ConsumeRecordsService";
import { prepay } from '../../../services/payment/ChargeService';

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
    // this.preSettlement = this.preSettlement.bind(this);
    // this.preSettlementByMi = this.preSettlementByMi.bind(this);
    this.renderPromptView = this.renderPromptView.bind(this);
    this.prePay = this.prePay.bind(this);
  }
  state = {
    doRenderScene: false,
    // data: [],
    ctrlState,
    selectRecordIds: [],
  };
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
        },
      });
      const { currProfile } = this.props.base;
      console.log('componentDidMount');
      console.info(currProfile);
      if (currProfile.type === '0') {
        Toast.show('医保用户暂未开通在线缴费服务');
      } else if (currProfile.type === '2') {
        Toast.show('非实名用户暂未开通在线缴费服务');
      } else if (currProfile.type === '3') {
        Toast.show('目前仅开通自费用户在线缴费服务');
      }
    });
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

  // preSettlement() {
  //   const selectIds = this.state.selectRecordIds;
  //   const dataList = this.props.dataProps.chargeDetail;
  //   const selectCharge = [];
  //   if (selectIds && selectIds.length > 0) {
  //     for (const d of dataList) {
  //       const no = d.recordNo;
  //       if (selectIds.indexOf(no) >= 0) {
  //         selectCharge.push(d);
  //       }
  //     }
  //     return (this.props.navigates('PreSettlementBySelf', { title: '门诊缴费预结算', data: selectCharge }));
  //   } else {
  //     Toast.show('请选择待缴费项目');
  //   }
  // }

  async prePay() {
    console.log('prepay begin11');
    const { selectRecordIds } = this.state;
    console.info(selectRecordIds);
    // 如果没有有效的处方号信息
    if (!selectRecordIds || !selectRecordIds.length || selectRecordIds.length < 1) {
      return;
    }
    const { currProfile } = this.props.base;
    const param = {};
    param.hosNo = currProfile.hosNo;
    param.hosName = currProfile.hosName;
    param.proNo = currProfile.no;
    param.proName = currProfile.name;
    param.cardNo = currProfile.cardNo
    param.cardType = currProfile.cardType
    param.miType = '1'; // 自费，目前只允许自费缴费
    param.tradeChannel = 'F'; // 预缴
    param.tradeChannelCode = ''; // 预缴，没有对应值
    param.comment = '';
    param.appChannel = 'APP';
    param.items = [];
    const data = this.props.dataProps.chargeDetail
    for (let idx = 0; idx < data.length; idx += 1) {
      if (selectRecordIds.indexOf(data[idx].recordNo) > -1) {
        param.items.push(data[idx]);
      }
    }
    console.log('prePay begin');
    console.info(param);
    console.log('prePay end');
    const preRecordsData = await prepay(param);
    console.log('preRecordsData1');
    console.info(preRecordsData);
    console.log('preRecordsData2');
    this.props.navigates('PreSettlementBySelf', { title: '门诊缴费预结算', data: { ...preRecordsData.result, items: param.items } });
  }

  //
  // async fetchData(hospital, patient, profile) {
  //   console.log('fetchData11:');
  //   if (!profile) {
  //     this.setState({
  //       ctrlState: {
  //         ...this.state.ctrlState,
  //         refreshing: false,
  //         requestErr: false,
  //         requestErrMsg: null,
  //       },
  //       data: [],
  //     });
  //     return;
  //   }
  //   try {
  //     this.setState({
  //       ctrlState: {
  //         ...this.state.ctrlState,
  //         refreshing: true,
  //       },
  //     });
  //     // const consumeRecordsData = await getConsumeRecords({ proNo: this.state.profile.no, hosNo: this.state.profile.hosNo });
  //     const preRecordsData = await getPreRecords({
  //       proNo: profile.no,
  //       hosNo: profile.hosNo,
  //       tradeChannel: "'Z','W'",
  //       type: '0',
  //       bizType: '00', // 门诊充值
  //     });
  //     const responseData = await getPreStore({ no: profile.no, hosNo: profile.hosNo });
  //     if (preRecordsData.success) {
  //       console.log('fetchData:aaaaaaaaaaaaaaaaaa');
  //       console.info(preRecordsData);
  //       this.setState({
  //         data: preRecordsData.result ? preRecordsData.result : [],
  //         // consumeRecords: consumeRecordsData.result ? consumeRecordsData.result : [],
  //         balance: responseData.result ? responseData.result.balance : 0,
  //         ctrlState: {
  //           ...this.state.ctrlState,
  //           refreshing: false,
  //         },
  //       });
  //     } else {
  //       this.handleRequestException({ msg: '获取消费记录出错！' });
  //       this.setState({
  //         ctrlState: {
  //           ...this.state.ctrlState,
  //           refreshing: false,
  //         },
  //       });
  //     }
  //   } catch (e) {
  //     this.handleRequestException(e);
  //     this.setState({
  //       ctrlState: {
  //         ...this.state.ctrlState,
  //         refreshing: false,
  //       },
  //     });
  //   }
  // }
  //
  // preSettlementByMi() {
  //   const selectIds = this.state.selectRecordIds;
  //   const dataList = this.props.dataProps.chargeDetail;
  //   const selectCharge = [];
  //   if (selectIds && selectIds.length > 0) {
  //     for (const d of dataList) {
  //       const no = d.recordNo;
  //       if (selectIds.indexOf(no) >= 0) {
  //         selectCharge.push(d);
  //       }
  //     }
  //     return (this.props.navigates('PreSettlement', selectCharge));
  //   } else {
  //     Toast.show('请选择数据后再进行结算');
  //   }
  // }

  renderSectionComp(info) {
    // console.log('------- section:', info);
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
    // const { currProfile } = this.props.base;
    const value = PaymentChargeDetail.getSections(this.props.dataProps.chargeDetail ? this.props.dataProps.chargeDetail : []);
    return (
      <View style={Global.styles.CONTAINER}>
        <ScrollView style={styles.scrollView}>
          <View automaticallyAdjustContentInsets={false} >
            <SectionList
              renderSectionHeader={this.renderSectionComp}
              renderItem={PaymentChargeDetail.renderItem}
              SectionSeparatorComponent={this.renderSectionSep}
              sections={value}
              keyExtractor={(item, index) => (1 + index + item)}
              refreshing={this.props.dataProps.ctrlState.refreshing}
              onRefresh={this.onSearch}
              ListEmptyComponent={() => {
                return this.renderEmptyView({
                  msg: '暂无待缴费信息',
                  reloadMsg: '点击刷新按钮重新查询',
                  reloadCallback: this.onSearch,
                  ctrlState: this.props.dataProps.ctrlState,
                });
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', margin: 15, marginTop: 30, marginBottom: 40 }} >
            {/*<Button text="自费结算" disabled={currProfile.type !== '1'} onPress={this.preSettlement} theme={Button.THEME.ORANGE} />*/}
            <Button text="自费结算" onPress={this.prePay} theme={Button.THEME.ORANGE} />
          </View>
        </ScrollView>
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
});
export default connect(mapStateToProps)(PaymentChargeDetail);
