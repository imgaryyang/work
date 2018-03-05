/**
 * 预约/挂号记录
 */
import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  FlatList,
  View,
} from 'react-native';
import Sep from 'rn-easy-separator';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import PopupDialog, {
  DialogTitle,
  DialogButton,
  FadeAnimation,
} from 'react-native-popup-dialog';
import Global from '../../../Global';
import AppointRecord from './AppointRecord';
import PatientInfo from './PatientInfo';
import ViewText from '../../../modules/ViewText';
import PlaceholderView from '../../../modules/PlaceholderView';
import listState, { initPage } from '../../../modules/ListState';
import { forReservedList, forCancel } from '../../../services/outpatient/AppointService';
import { CompHeight } from '../../common/CurrHospitalAndPatient';

const fadeAnimation = new FadeAnimation({ animationDuration: 150 });

class AppAndRegRecords extends Component {
  static displayName = 'AppAndRegRecords';
  static description = '预约/挂号记录';

  constructor(props) {
    super(props);

    this.handleFetchException = this.handleFetchException.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onInfiniteLoad = this.onInfiniteLoad.bind(this);
    this.cancelAppoint = this.cancelAppoint.bind(this);
    this.submit = this.submit.bind(this);

    this.dialog = null;
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
      title: '预约记录',
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

  cancelAppoint(data) {
    this.setState(
      { selectedItem: data },
      () => this.dialog.show(),
    );
  }

  async submit() {
    const { showLoading, hideLoading } = this.props.screenProps;
    const { selectedItem } = this.state;
    showLoading();

    try {
      const responseData = await forCancel(selectedItem);

      if (responseData.success) {
        this.dialog.dismiss();
        Toast.show('取消成功');
        this.onRefresh();
      } else {
        this.handleRequestException({ msg: responseData.msg });
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
      <View style={[Global.styles.CONTAINER_BG, { paddingTop: 10 }]}>
        <FlatList
          ref={(ref) => { this.listRef = ref; }}
          data={data}
          initialNumToRender={10}
          keyExtractor={(item, index) => `${item}${index + 1}`}
          renderItem={({ item }) => <AppointRecord data={item} onPress={this.cancelAppoint} />}
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
        <PopupDialog
          ref={(ref) => { this.dialog = ref; }}
          dialogTitle={<DialogTitle title="取消预约" />}
          dialogAnimation={fadeAnimation}
          dismissOnHardwareBackPress
          width={0.9}
          height={200}
          containerStyle={{ height: Global.getScreen().height - Global.navBarHeight - CompHeight }}
          onDismissed={() => this.props.navigation.setParams({ allowSwitchHospital: true, allowSwitchPatient: true })}
          onShown={() => this.props.navigation.setParams({ allowSwitchHospital: false, allowSwitchPatient: false })}
          actions={[
            <View style={styles.dialogActions} key="1">
              <DialogButton
                text="返回"
                onPress={() => this.dialog.dismiss()}
                buttonStyle={styles.dialogBackButton}
                textStyle={styles.buttonText}
                textContainerStyle={styles.buttonTextContainer}
              />
              <DialogButton
                text="确定"
                onPress={this.submit}
                buttonStyle={styles.dialogConfirmButton}
                textStyle={styles.buttonText}
                textContainerStyle={styles.buttonTextContainer}
              />
            </View>,
          ]}
        >
          <ViewText style={styles.dialogContentView} textStyle={styles.dialogText} text="预约一旦取消，无法恢复。确定取消吗？" />
        </PopupDialog>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dialogContentView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  dialogBackButton: {
    flex: 1,
    borderBottomLeftRadius: 8,
  },
  dialogConfirmButton: {
    flex: 1,
    borderLeftWidth: Global.lineWidth,
    borderLeftColor: Global.colors.LINE,
    borderBottomRightRadius: 8,
  },
  dialogText: {
    fontSize: 16,
  },
  dialogActions: {
    borderTopWidth: Global.lineWidth,
    borderTopColor: Global.colors.LINE,
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 16,
    // color: 'white',
  },
  buttonTextContainer: {
    paddingVertical: 13,
  },
});

// AppAndRegRecords.navigationOptions = ({ navigation }) => ({
//   title: navigation.state.params.hospital.name || '预约查询',
// });

const mapStateToProps = state => ({
  currPatient: state.base.currPatient,
  currHospital: state.base.currHospital,
});

export default connect(mapStateToProps)(AppAndRegRecords);
