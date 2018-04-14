/**
 * 预约挂号4
 */
import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';
import Global from '../../../Global';
import PlaceholderView from '../../../modules/PlaceholderView';
import BottomBar from '../../../modules/BottomBar';

class AppointSuccess extends Component {
  static displayName = 'AppointSuccess';
  static description = '预约挂号完成';

  constructor(props) {
    super(props);

    this.goBack = this.goBack.bind(this);
    this.gotoAppointRecords = this.gotoAppointRecords.bind(this);

    this.state = {
      doRenderScene: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => this.setState({ doRenderScene: true }));
    this.props.navigation.setParams({
      title: '预约成功',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: false,
      allowSwitchPatient: false,
      afterChooseHospital: null,
      afterChoosePatient: null,
      hideNavBarBottomLine: false,
    });
  }

  goBack() {
    this.props.navigation.goBack();
  }

  gotoAppointRecords() {
    const { screenProps: { resetBackNavigate }, hospital } = this.props;
    resetBackNavigate(this.props.navigation.state.params.backIndex || 0, 'AppointRecordsMain', {
      hospital,
      title: '预约记录',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: false,
      allowSwitchPatient: true,
      hideNavBarBottomLine: true,
    });
  }

  render() {
    const { doRenderScene } = this.state;
    const { type } = this.props.navigation.state.params;

    if (!doRenderScene) {
      return <PlaceholderView />; // 场景过渡动画未完成前，先渲染过渡场景
    }

    return (
      <View style={Global.styles.CONTAINER_BG}>
        <View style={styles.info}>
          <Icon name="ios-checkmark-circle-outline" color={Global.colors.IOS_BLUE} size={175} width={175} height={175} />
          <Text style={styles.infoText}>预约成功</Text>
          {
            type === '1' ? <Text style={styles.noCardTip}>无卡预约请去医院现场签到</Text> : null
          }
        </View>
        <BottomBar visible>
          <Button text="返回" clear onPress={this.goBack} />
          <Button text="查看预约" clear onPress={this.gotoAppointRecords} />
        </BottomBar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  info: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 18,
    color: Global.colors.IOS_BLUE,
  },
  noCardTip: {
    fontSize: 18,
    color: Global.colors.ORANGE,
    marginTop: 15,
  },
  buttonContainer: {
    flex: 0,
    flexDirection: 'row',
  },
  button: {
    height: 45,
    borderRadius: 0,
  },
  buttonText: {
    fontSize: 15,
  },
});

const mapStateToProps = state => ({
  nav: state.nav,
  hospital: state.base.currHospital,
});

export default connect(mapStateToProps)(AppointSuccess);
