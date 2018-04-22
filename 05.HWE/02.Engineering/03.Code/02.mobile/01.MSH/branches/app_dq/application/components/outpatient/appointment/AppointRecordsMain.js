/**
 * 消费记录
 */
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import PopupDialog, {
  DialogTitle,
  DialogButton,
  FadeAnimation,
} from 'react-native-popup-dialog';
import Toast from 'react-native-root-toast';
import AppointHasCardRecords from './AppointHasCardRecords';
import AppointNoCardRecords from './AppointNoCardRecords';
import PintrestTabBar from '../../../modules/PintrestTabBar';
import ViewText from '../../../modules/ViewText';
import { CompHeight } from '../../common/CurrHospitalAndPatient';
import Global from '../../../Global';
import { forCancel } from '../../../services/outpatient/AppointService';

const fadeAnimation = new FadeAnimation({ animationDuration: 150 });

class AppointRecordsMain extends Component {
  static displayName = 'AppointRecordsMain';
  static description = '我的预约';

  constructor(props) {
    super(props);

    this.onChangeTab = this.onChangeTab.bind(this);
    this.onPressButton = this.onPressButton.bind(this);
    this.submit = this.submit.bind(this);
    this.onRefresh = this.onRefresh.bind(this);

    this.dialog = null;
    this.hasCardList = null;
    this.noCardList = null;
    this.state = {
      tabIndex: 0, // 当前选中的标签页的索引
      selectedItem: null,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      title: '我的预约',
      showCurrHospitalAndPatient: true,
      // allowSwitchHospital: true, // 不同入口此参数不一样，故此处不设置
      allowSwitchPatient: true,
      hideNavBarBottomLine: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { currHospital: hospital, currPatient: patient, currProfile: profile } = nextProps;
    const { currHospital, currProfile } = this.props;
    if (hospital !== currHospital) {
      if (this.hasCardList) this.hasCardList.onRefresh(hospital, patient, profile);
      // 避免卡片未mount
      if (this.noCardList) this.noCardList.onRefresh(hospital, patient, profile);
    } else if (profile !== currProfile) {
      if (this.hasCardList) this.hasCardList.onRefresh(hospital, patient, profile);
    }
  }

  onRefresh() {
    const { tabIndex } = this.state;
    if (tabIndex) {
      this.noCardList.onRefresh();
    } else {
      this.hasCardList.onRefresh();
    }
  }

  onChangeTab({ i: tabIndex }) {
    this.setState({ tabIndex });
  }

  onPressButton(selectedItem) {
    this.setState(
      { selectedItem },
      () => this.dialog.show(),
    );
  }

  async submit() {
    const { showLoading, hideLoading } = this.props.screenProps;
    const { selectedItem } = this.state;
    showLoading();

    try {
      const { success, msg } = await forCancel({ ...selectedItem, hisUser: Global.hisUser });

      if (success) {
        this.dialog.dismiss();
        Toast.show('取消成功');

        this.onRefresh();
      } else {
        Toast.show(`错误：${msg}`);
      }
    } catch (e) {
      this.handleRequestException(e);
    }
    hideLoading();
  }

  render() {
    const { currHospital, currProfile, user, navigation: { setParams } } = this.props;

    return (
      <View style={Global.styles.CONTAINER_BG}>
        <ScrollableTabView
          initialPage={0}
          renderTabBar={() => <PintrestTabBar />}
          onChangeTab={this.onChangeTab}
        >
          <AppointHasCardRecords
            tabLabel="有卡预约"
            ref={(ref) => { this.hasCardList = ref; }}
            onPressButton={this.onPressButton}
            currHospital={currHospital}
            currProfile={currProfile}
          />
          <AppointNoCardRecords
            tabLabel="无卡预约"
            ref={(ref) => { this.noCardList = ref; }}
            onPressButton={this.onPressButton}
            currHospital={currHospital}
            user={user}
          />
        </ScrollableTabView>
        <PopupDialog
          ref={(ref) => { this.dialog = ref; }}
          dialogTitle={<DialogTitle title="取消预约" titleTextStyle={{ fontSize: 15 }} />}
          dialogAnimation={fadeAnimation}
          dismissOnHardwareBackPress
          width={0.9}
          height={200}
          containerStyle={{ height: Global.getScreen().height - Global.navBarHeight - CompHeight }}
          onDismissed={() => setParams({ allowSwitchHospital: true, allowSwitchPatient: true })}
          onShown={() => setParams({ allowSwitchHospital: false, allowSwitchPatient: false })}
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
    fontSize: 14,
  },
  dialogActions: {
    borderTopWidth: Global.lineWidth,
    borderTopColor: Global.colors.LINE,
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 15,
  },
  buttonTextContainer: {
    paddingVertical: 13,
  },
});

const mapStateToProps = state => ({
  currProfile: state.base.currProfile,
  currHospital: state.base.currHospital,
  user: state.auth.user,
});

export default connect(mapStateToProps)(AppointRecordsMain);
