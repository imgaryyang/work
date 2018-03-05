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
import { NavigationActions } from 'react-navigation';

import ctrlState from '../../../modules/ListState';
import Global from '../../../Global';
import Checkbox from '../../../modules/Checkbox';
import Item from '../../../modules/PureListItem';
import { getPatientPayment } from '../../../services/payment/AliPayService';
import { filterMoney } from '../../../utils/Filters';

class PaymentChargeDetail extends Component {
  static displayName = 'PaymentChargeDetail';
  static description = '医嘱缴费主界面';

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.renderSectionComp = this.renderSectionComp.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.preSettlement = this.preSettlement.bind(this);
    this.preSettlementByMi = this.preSettlementByMi.bind(this);
  }

  static getSections(list) {
    const sections = [];
    let flag = 0;
    const datas = [];
    for (let i = 0; i < list.length; i++) {
      let az = '';
      for (let j = 0; j < datas.length; j++) {
        if (datas[j][0].recipeNo === list[i].recipeNo) {
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
        sections.push({ key: `${list[i].recipeNo}`, value: `处方 ${list[i].recipeNo}`, data: wdy, department: list[i].department, doctor: list[i].doctor });
      }
    }
    return sections;
  }

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
    );
  }

  state = {
    doRenderScene: false,
    data: [],
    ctrlState,
    selectedIds: [],
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
      const ids = state.selectedIds.concat();
      const idx = _.indexOf(ids, key);
      if (idx === -1) {
        ids[ids.length] = key;
      } else {
        ids.splice(idx, 1);
      }
      return { selectedIds: ids };
    });
  }

  preSettlement() {
    const selectIds = this.state.selectedIds;
    const dataList = this.props.dataProps.chargeDetail;
    const selectCharge = [];
    if (selectIds && selectIds.length > 0) {
      for (const d of dataList) {
        const no = d.recipeNo;
        if (selectIds.indexOf(no) >= 0) {
          selectCharge.push(d);
        }
      }
      return (this.props.navigates('PreSettlementBySelf', selectCharge));
    } else {
      Toast.show('请选择要缴费的处方');
    }
  }

  preSettlementByMi() {
    const selectIds = this.state.selectedIds;
    const dataList = this.props.dataProps.chargeDetail;
    const selectCharge = [];
    if (selectIds && selectIds.length > 0) {
      for (const d of dataList) {
        const no = d.recipeNo;
        if (selectIds.indexOf(no) >= 0) {
          selectCharge.push(d);
        }
      }
      return (this.props.navigates('PreSettlement', selectCharge));
    } else {
      Toast.show('请选择数据后再进行结算');
    }
  }

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
            checked={_.indexOf(this.state.selectedIds, key) !== -1}
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

  render() {
    if (!this.state.doRenderScene) { return PaymentChargeDetail.renderPlaceholderView(); }
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
              // 控制下拉刷新
              refreshing={this.props.dataProps.ctrlState.refreshing}
              onRefresh={this.onSearch}
              // 无数据占位符
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
            <Button text="自费结算" onPress={this.preSettlement} theme={Button.THEME.ORANGE} />
            <View style={{ width: 10 }} />
            <Button text="医保结算" onPress={this.preSettlementByMi} theme={Button.THEME.BLUE} />
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

export default PaymentChargeDetail;
