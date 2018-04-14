/**
 * 预存记录
 */
import React, {
  Component, PureComponent,
} from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Sep from 'rn-easy-separator';
import moment from 'moment';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import EasyIcon from 'rn-easy-icon';
import Global from '../../Global';
import ctrlState from '../../modules/ListState';

import { filterMoney } from '../../utils/Filters';
import { getPreStore } from "../../services/payment/AliPayService";
import { getConsumeRecords, getPreRecords } from "../../services/consume/ConsumeRecordsService";
import config from '../../../Config';


class Item extends PureComponent {
  render() {
    const data = this.props.data;
    let tradeChannel = '';
    if (data.tradeChannel === 'C') {
      tradeChannel = '现金';
    } else if (data.tradeChannel === 'Z') {
      tradeChannel = '支付宝';
    } else if (data.tradeChannel === 'W') {
      tradeChannel = '微信';
    } else if (data.tradeChannel === 'B') {
      tradeChannel = '银行';
    } else {
      tradeChannel = '其他';
    }
    return (
      <TouchableOpacity
        style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15 }]}
        onPress={() => { this.props.onPressItem(); }}
      >
        <View style={{ flex: 1, flexDirection: 'row', marginLeft: 15, marginRight: 15 }} >
          <View style={{ flex: 3 }} >
            <Text style={{ fontSize: 12, color: Global.colors.FONT_LIGHT_GRAY1 }}>{data.tradeTime ? moment(data.tradeTime).format('YYYY-MM-DD HH:mm') : '暂无日期' }</Text>
            <Sep height={6} />
            <Text style={{ fontSize: 15, color: Global.colors.FONT }}>{tradeChannel}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, color: Global.colors.FONT_LIGHT_GRAY1, textAlign: 'right' }}>{filterMoney(data.amt)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}


class OutpatientRefund extends Component {
  static displayName = 'PreRecords';
  static description = '门诊退费';

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderPlaceholderView = this.renderPlaceholderView.bind(this);
  }

  state = {
    ctrlState,
    data: [],
    balance: '',
    doRenderScene: false,
  };

  componentDidMount() {
    // InteractionManager.runAfterInteractions(() => {
    //   this.setState({
    //     ctrlState: {
    //       ...this.state.ctrlState,
    //       refreshing: false,
    //     },
    //   });
    // });
    this.props.navigation.setParams({
      title: '门诊退费',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      afterChooseHospital: this.afterChooseHospital,
      afterChoosePatient: this.afterChoosePatient,
      hideBottomLine: true,
    });
    // const user = Global.getUser();
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      }, () => {
        this.fetchData(
          this.props.base.currHospital,
          this.props.base.currPatient,
          this.props.base.currProfile,
        );
      });
    });
  }
  componentWillReceiveProps(props) {
    console.log('componentWillReceiveProps begin:');
    if (props.base.currProfile !== this.props.base.currProfile) {
      this.fetchData(
        props.base.currHospital,
        props.base.currPatient,
        props.base.currProfile,
      );
    }
  }
  onSearch() {
    // 重新发起按条件查询
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
        requestErr: false,
        requestErrMsg: null,
      },
    }, () => this.fetchData(this.props.base.currHospital, this.props.base.currPatient, this.props.base.currProfile));
  }
  async fetchData(hospital, patient, profile) {
    console.log('fetchData11:');
    if (!profile) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
          requestErr: false,
          requestErrMsg: null,
        },
        data: [],
      });
      return;
    }
    try {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      });
      // const consumeRecordsData = await getConsumeRecords({ proNo: this.state.profile.no, hosNo: this.state.profile.hosNo });
      const preRecordsData = await getPreRecords({
        proNo: profile.no,
        hosNo: profile.hosNo,
        // tradeChannel: "'Z','W'",
        type: '0',
        // bizType: '00', // 门诊
      });
      const responseData = await getPreStore({ no: profile.no, hosNo: profile.hosNo });
      if (preRecordsData.success) {
        console.log('fetchData:aaaaaaaaaaaaaaaaaa');
        console.info(preRecordsData);
        this.setState({
          data: preRecordsData.result ? preRecordsData.result : [],
          // consumeRecords: consumeRecordsData.result ? consumeRecordsData.result : [],
          balance: responseData.result ? responseData.result.balance : 0,
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
          },
        });
      } else {
        this.handleRequestException({ msg: '获取消费数据出错！' });
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
          },
        });
      }
    } catch (e) {
      this.handleRequestException(e);
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
        },
      });
    }
  }

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  renderPlaceholderView() {
    return (
      <SafeAreaView style={[Global.styles.CONTAINER, { backgroundColor: 'white' }]} >
        <View style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }
  /**
   * 渲染行数据
   */
  renderItem({ item, index }) {
    console.log('renderItem111');
    console.info(item);
    if (config.refundedChannelTypes.indexOf(item.tradeChannel) < 0) {
      return null;
    }
    return (
      <Item
        data={item}
        index={index}
        onPressItem={() => {
          console.log('onPressItem:');
          this.props.navigation.navigate('OutpatientRefundDetail', { title: '门诊退费', data: { ...item, balance: this.state.balance } });
        }}
      />
    );
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return this.renderPlaceholderView();
    }
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
        <View>
          <View style={{ paddingTop: 19 / 2, paddingBottom: 19 / 2, flexDirection: 'row', marginLeft: 15, alignItems: 'center' }} >
            <Text style={{ fontSize: 14, color: Global.colors.FONT }}>可用余额</Text>
            <Sep width={10} />
            <Text style={{ fontSize: 16, fontWeight: '600', color: Global.colors.IOS_RED }}>
              { this.state.balance ? filterMoney(this.state.balance) : '0.00' }
              </Text>
          </View>
          <Sep width={19 / 2} />
        </View>
        <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
        <View
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <FlatList
            ref={(c) => { this.listRef = c; }}
            data={this.state.data}
            keyExtractor={(item, index) => `${item}${index + 1}`}
            renderItem={this.renderItem}
            ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
            // 控制下拉刷新
            refreshing={this.state.ctrlState.refreshing}
            onRefresh={this.onSearch}
            ListEmptyComponent={() => {
              return this.renderEmptyView({
                msg: '暂无信息',
                reloadMsg: '点击刷新按钮重新加载',
                reloadCallback: this.onSearch,
                ctrlState: this.state.ctrlState,
              });
            }}
            style={styles.list}
          />
        </View>
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
});

const mapStateToProps = state => ({
  base: state.base,
});
export default connect(mapStateToProps)(OutpatientRefund);