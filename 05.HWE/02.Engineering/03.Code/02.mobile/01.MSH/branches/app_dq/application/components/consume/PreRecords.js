/**
 * 预存记录
 */
import React, {
  Component,
} from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text,
  FlatList,
} from 'react-native';
import Sep from 'rn-easy-separator';
import moment from 'moment';
import { connect } from 'react-redux';

import Global from '../../Global';
import Item from '../../modules/PureListItem';
import ctrlState from '../../modules/ListState';

import { filterMoney } from '../../utils/Filters';
// import { getPreStore } from '../../services/payment/AliPayService';
import { getPreRecords } from '../../services/consume/ConsumeRecordsService';

class PreRecords extends Component {
  static displayName = 'PreRecords';
  static description = '就诊卡预存记录查询';

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.afterChooseHospital = this.afterChooseHospital.bind(this);
    this.afterChoosePatient = this.afterChoosePatient.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.callback = this.callback.bind(this);
  }

  state = {
    doRenderScene: false,
    profile: {},
    preRecords: [],
    balance: 0,
    ctrlState,
  };

  componentDidMount() {
    const user = Global.getUser();
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      }, () => this.getProfile(
        this.props.base.currHospital,
        this.props.base.currPatient,
        this.props.base.currProfile,
      ));
    });
    this.props.navigation.setParams({
      title: '就诊卡预存记录查询',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      afterChooseHospital: this.afterChooseHospital,
      afterChoosePatient: this.afterChoosePatient,
      hideNavBarBottomLine: false,
    });
  }

  componentWillReceiveProps(props) {
    if (props.base.currProfile !== this.props.base.currProfile) {
      this.getProfile(
        props.base.currHospital,
        props.base.currPatient,
        props.base.currProfile,
      );
    }
  }
  onSearch() {
    console.log('refresh');
    this.getProfile(
      this.props.base.currHospital,
      this.props.base.currPatient,
      this.props.base.currProfile,
    );
    // if (typeof callback === 'function') {
    //   callback();
    // }
  }
  getProfile(currHospital, currPatient, currProfile) {
    if (!currProfile) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
          requestErr: false,
          requestErrMsg: null,
        },
        data: {},
      });
      return;
    }
    this.setState({
    }, () => this.fetchData(currHospital, currPatient, currProfile));
  }

  afterChooseHospital(hospital) {
    // this.getProfile(hospital, this.props.base.currPatient);
  }
  afterChoosePatient(patient, profile) {
    // if (typeof profile !== 'undefined' && profile !== null) {
    //   this.setState({
    //     profile,
    //   }, () => this.fetchData());
    // }
  }
  callback() {
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
      },
    });
    this.getProfile(
      this.props.base.currHospital,
      this.props.base.currPatient,
      this.props.base.currProfile,
    );
  }

  async fetchData(currHospital, currPatient, profile) {
    try {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      });
      const endDate = moment().format('YYYY-MM-DD');
      const startDate = moment().subtract(365, 'days').format('YYYY-MM-DD');
      const preRecordsData = await getPreRecords({
        proNo: profile.no,
        hosNo: profile.hosNo,
        startDate,
        endDate,
        // tradeChannel: "'Z','W'",
        // type: '0',
      });
      // const responseData = await getPreStore({
      //   no: this.state.profile.no,
      //   hosNo: this.state.profile.hosNo,
      // });
      if (preRecordsData.success) {
        this.setState({
          preRecords: preRecordsData.result ? preRecordsData.result : [],
          // balance: responseData.result ? responseData.result.balance : 0,
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
          },
        });
      } else {
        this.handleRequestException({ msg: '获取预存记录出错！' });
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
   * 渲染行数据
   */
  renderItem({ item, index }) {
    // let tradeChannel = '';
    // if (item.tradeChannel === 'C') {
    //   tradeChannel = '现金';
    // } else if (item.tradeChannel === 'Z') {
    //   tradeChannel = '支付宝';
    // } else if (item.tradeChannel === 'W') {
    //   tradeChannel = '微信';
    // } else if (item.tradeChannel === 'B') {
    //   tradeChannel = '银行';
    // } else {
    //   tradeChannel = '其他';
    // }
    // const typeMap = { 0: '充值', 1: '退款', 2: '冻结' };
    const statusMap = { A: '未处理', 0: '交易成功', 1: '受理中', 9: '交易关闭' };
    return (
      <Item
        data={item}
        index={index}
        chevron={null}
        contentStyle={{ padding: 0 }}
      >
        <View style={{ flex: 1, flexDirection: 'row', margin: 15 }} >
          <View style={{ flex: 3 }} >
            <Text style={{ fontSize: 13, color: Global.colors.FONT_LIGHT_GRAY1 }}>{item.tradeTime ? moment(item.tradeTime).format('YYYY-MM-DD HH:mm') : '暂无日期' }</Text>
            <Sep height={6} />
            <Text style={{ fontSize: 15, color: Global.colors.FONT_GRAY }}>{item.type}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: Global.colors.FONT_LIGHT_GRAY1, textAlign: 'right' }}>{filterMoney(item.amt)}</Text>
            <Sep height={6} />
            <Text style={{ fontSize: 13, color: Global.colors.IOS_RED, textAlign: 'right' }}>{statusMap[item.status]}</Text>
          </View>
        </View>
      </Item>
    );
  }

  renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  render() {
    if (!this.state.doRenderScene) { return this.renderPlaceholderView(); }

    const { currProfile } = this.props.base;
    if (!currProfile) {
      return this.renderEmptyView({
        msg: '请选择就诊人',
        ctrlState: { refreshing: false },
        style: { marginTop: 15 },
      });
    }
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        {/*<View style={{ backgroundColor: 'white' }} >*/}
          {/*<View style={{ paddingTop: 19 / 2, paddingBottom: 19 / 2, flexDirection: 'row', marginLeft: 15, alignItems: 'center' }} >*/}
            {/*<Text style={{ fontSize: 14, color: Global.colors.FONT }}>可用余额</Text>*/}
            {/*<Sep width={10} />*/}
            {/*<Text style={{ fontSize: 16, fontWeight: '600', color: Global.colors.IOS_RED }}>{filterMoney(this.props.balance)}</Text>*/}
          {/*</View>*/}
          {/*<Sep width={19 / 2} />*/}
        {/*</View>*/}
        {/*<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />*/}
        <View
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <FlatList
            ref={(c) => { this.listRef = c; }}
            data={this.state.preRecords}
            keyExtractor={(item, index) => `${item}${index + 1}`}
            renderItem={this.renderItem}
            ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
            // 控制下拉刷新
            refreshing={this.state.ctrlState.refreshing}
            onRefresh={this.onSearch}
            ListEmptyComponent={() => {
              return this.renderEmptyView({
                msg: '未查询到就诊卡预存信息',
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
export default connect(mapStateToProps)(PreRecords);
