/**
 * 预约/挂号记录
 */
import React, { Component } from 'react';
import {
  InteractionManager,
  FlatList,
  View,
} from 'react-native';
import Sep from 'rn-easy-separator';
import geolib from 'geolib';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import Global from '../../../Global';
import SignInRecord from './SignInRecord';
import PatientInfo from './PatientInfo';
import PlaceholderView from '../../../modules/PlaceholderView';
import listState, { initPage } from '../../../modules/ListState';
import { forReservedList, forSign } from '../../../services/outpatient/AppointService';

class SignIn extends Component {
  static displayName = 'SignIn';
  static description = '预约/挂号记录';

  constructor(props) {
    super(props);

    this.handleFetchException = this.handleFetchException.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
    this.submit = this.submit.bind(this);
    this.sign = this.sign.bind(this);
    this.gotoReceipt = this.gotoReceipt.bind(this);

    this.state = {
      doRenderScene: false,
      ctrlState: listState,
      page: initPage,
      selectedItem: null,
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
    this.props.navigation.setParams({
      title: '来院签到',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      afterChooseHospital: this.onRefresh,
      afterChoosePatient: this.onRefresh,
      hideNavBarBottomLine: false,
    });
  }

  onRefresh() {
    // 滚动到列表顶端
    this.listRef.scrollToOffset({ x: 0, y: 0, animated: true });
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
    }, () => this.fetchData());
  }

  // 列表滑动到底部自动触发
  onEndReached() {
    if (this.state.ctrlState.refreshing ||
      this.state.ctrlState.infiniteLoading ||
      this.state.ctrlState.noMoreData ||
      this.state.ctrlState.requestErr) {
      return;
    }
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

  gotoReceipt(data) {
    this.props.navigation.navigate('SignInReceipt', { data });
  }

  submit(item) {
    this.setState(
      { selectedItem: item },
      this.props.screenProps.getCurrentLocation(this.sign),
    );
  }

  async sign(currPosition) {
    const { currHospital, navigation, screenProps } = this.props;
    const { selectedItem } = this.state;
    const { showLoading, hideLoading } = screenProps;
    const hosPosition = { latitude: currHospital.latitude, longitude: currHospital.longitude };

    showLoading();
    try {
      if (currPosition && currPosition.longitude !== null && currPosition.latitude !== null) {
        const distance = geolib.getDistance(currPosition, hosPosition);
        if (distance <= 2000) {
          const responseData = await forSign(selectedItem);
          if (responseData.success) {
            Toast.show('签到成功');
            this.onRefresh();
            navigation.navigate('SignInReceipt', { data: selectedItem });
          } else {
            this.handleRequestException({ msg: responseData.msg });
          }
        } else {
          Toast.show('定位不在医院范围内，无法签到！');
        }
      } else {
        Toast.show('获取位置信息出错，无法签到！');
      }
    } catch (e) {
      this.handleRequestException(e);
    }
    hideLoading();
  }

  handleFetchException(e) {
    this.setState({
      ctrlState: {
        ...this.state.ctrlState,
        refreshing: false,
        infiniteLoading: false,
        noMoreData: true,
        requestErr: true,
        requestErrMsg: e,
      },
    });
    this.handleRequestException(e);
  }

  async fetchData() {
    const { ctrlState, page, data, allData } = this.state;
    const { currPatient, currHospital } = this.props;
    const currProfile = PatientInfo.filterProfile(currPatient, currHospital);

    try {
      if (ctrlState.refreshing) {
        const { result, success, msg } = await forReservedList({
          hosNo: currHospital.no,
          proNo: currProfile ? currProfile.no : null,
          mobile: currProfile ? (currProfile.mobile || currPatient.mobile) : currPatient.mobile,
          idNo: currProfile ? (currProfile.idNo || currPatient.idNo) : currPatient.idNo,
        });
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
          this.handleFetchException({ msg });
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
      this.handleFetchException(e);
    }
  }

  render() {
    const { doRenderScene, data, ctrlState } = this.state;

    if (!doRenderScene) {
      return <PlaceholderView />; // 场景过渡动画未完成前，先渲染过渡场景
    }

    return (
      <View style={[Global.styles.CONTAINER_BG, { paddingTop: 10 }]} >
        <FlatList
          ref={(ref) => { this.listRef = ref; }}
          data={data}
          initialNumToRender={10}
          keyExtractor={(item, index) => `${item}${index + 1}`}
          renderItem={({ item }) => <SignInRecord data={item} onPress={this.gotoReceipt} signIn={this.submit} />}
          ItemSeparatorComponent={() => (<Sep height={Global.lineWidth} bgColor={Global.colors.LINE} />)}
          refreshing={ctrlState.refreshing} // 控制下拉刷新
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached} // 控制无限加载
          onEndReachedThreshold={0.05}
          无数据占位符
          ListEmptyComponent={() => {
            return this.renderEmptyView({
              ctrlState,
              msg: '暂无预约记录',
              reloadMsg: '点击刷新按钮重新查询',
              reloadCallback: this.onRefresh,
            });
          }}
          // 列表底部
          ListFooterComponent={() => { return this.renderFooter({ data, ctrlState, callback: this.onInfiniteLoad }); }}
        />
      </View>
    );
  }
}

// SignIn.navigationOptions = ({
//   title: '来院签到',
// });

const mapStateToProps = state => ({
  currPatient: state.base.currPatient,
  currHospital: state.base.currHospital,
});

export default connect(mapStateToProps)(SignIn);
