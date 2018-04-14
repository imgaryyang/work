/**
 * 有卡签到记录
 */
import React, { Component } from 'react';
import {
  InteractionManager,
  FlatList,
} from 'react-native';
import Sep from 'rn-easy-separator';
import Toast from 'react-native-root-toast';
import Global from '../../../Global';
import SignRecord from './SignRecord';
import PlaceholderView from '../../../modules/PlaceholderView';
import listState, { initPage } from '../../../modules/ListState';
import { forReservedNoCardList } from '../../../services/outpatient/AppointService';

const SignReceiptParams = {
  title: '签到小票',
  showCurrHospitalAndPatient: true,
  allowSwitchHospital: false,
  allowSwitchPatient: false,
  hideNavBarBottomLine: false,
};

class SignNoCardRecords extends Component {
  static displayName = 'SignNoCardRecords';
  static description = '有卡签到记录';

  constructor(props) {
    super(props);

    this.fetchData = this.fetchData.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
    this.onPressItem = this.onPressItem.bind(this);

    this.state = {
      doRenderScene: false,
      ctrlState: listState,
      page: initPage,
      data: [],
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState(
        {
          doRenderScene: true,
          ctrlState: { ...this.state.ctrlState, refreshing: true },
        },
        () => { this.fetchData(); },
      );
    });
  }

  onRefresh(hospital, patient, profile) {
    // 重新发起按条件查询
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: true,
        infiniteLoading: false,
        noMoreData: false,
        requestErr: false,
        requestErrMsg: null,
      },
    }, () => this.fetchData(hospital, patient, profile));
  }

  // 列表滑动到底部自动触发
  onEndReached() {
    const { refreshing, infiniteLoading, noMoreData, requestErr } = this.state.ctrlState;
    if (refreshing || infiniteLoading || noMoreData || requestErr) return;
    this.onInfiniteLoad();
  }

  // 无限加载请求
  onInfiniteLoad() {
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: false,
        infiniteLoading: true,
        noMoreData: false,
        requestErr: false,
        requestErrMsg: null,
      },
    }, () => this.fetchData());
  }

  onPressItem(data) {
    this.props.navigation.navigate('SignReceipt', { data, ...SignReceiptParams });
  }

  async fetchData(hospital) {
    const { ctrlState, page, data, allData } = this.state;
    const { currHospital, user: { id: terminalUser } } = this.props;
    const { no: hosNo } = hospital || currHospital || {};

    try {
      if (ctrlState.refreshing) {
        const { result, success, msg } = await forReservedNoCardList({ hosNo, terminalUser });
        const { start, limit } = initPage;
        if (success) {
          const total = result.length;
          this.setState({
            allData: result,
            data: result.slice(start, start + limit),
            page: { ...page, total, start: start + limit },
            ctrlState: { ...ctrlState, refreshing: false, infiniteLoading: false, noMoreData: (start + limit >= total) },
          });
        } else {
          this.setState({
            ctrlState: {
              ...ctrlState,
              refreshing: false,
              infiniteLoading: false,
              noMoreData: true,
              requestErr: true,
              requestErrMsg: { msg },
            },
          });
          Toast.show(`错误：${msg}`);
        }
      } else {
        const { start, limit, total } = page;
        this.setState({
          data: data.concat(allData.slice(start, start + limit)),
          page: { ...page, start: start + limit },
          ctrlState: { ...ctrlState, refreshing: false, infiniteLoading: false, noMoreData: (start + limit >= total) },
        });
      }
    } catch (e) {
      this.setState({
        ctrlState: {
          ...ctrlState,
          refreshing: false,
          infiniteLoading: false,
          noMoreData: true,
          requestErr: true,
          requestErrMsg: e,
        },
      });
      this.handleRequestException(e);
    }
  }

  render() {
    const { doRenderScene, data, ctrlState } = this.state;

    if (!doRenderScene) return <PlaceholderView />; // 场景过渡动画未完成前，先渲染过渡场景

    return (
      <FlatList
        data={data}
        style={{ marginTop: 10 }}
        initialNumToRender={10}
        keyExtractor={(item, index) => `${item}${index + 1}`}
        renderItem={({ item }) => <SignRecord data={item} onPress={this.onPressItem} noCard />}
        ItemSeparatorComponent={() => (<Sep height={Global.lineWidth} bgColor={Global.colors.LINE} />)}
        refreshing={ctrlState.refreshing} // 控制下拉刷新
        onRefresh={this.onRefresh}
        onEndReached={this.onEndReached} // 控制无限加载
        onEndReachedThreshold={0.05}
        // 无数据占位符
        ListEmptyComponent={() => {
            return this.renderEmptyView({
              ctrlState,
              msg: '暂无签到记录',
              reloadMsg: '点击刷新按钮重新查询',
              reloadCallback: this.onRefresh,
            });
          }}
          // 列表底部
        ListFooterComponent={() => { return this.renderFooter({ data, ctrlState, callback: this.onInfiniteLoad }); }}
      />
    );
  }
}

export default SignNoCardRecords;
