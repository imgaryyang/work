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

    this.gotoRoot = this.gotoRoot.bind(this);
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

  gotoRoot() {
    // 返回
    // this.props.navigation.goBack(this.props.nav.routes[1].key);
    this.props.navigation.goBack();
  }

  gotoAppointRecords() {
    const { screenProps, hospital } = this.props;
    screenProps.resetBackNavigate(this.props.navigation.state.params.backIndex || 0, 'AppAndRegRecords', { hospital });
  }

  render() {
    const { doRenderScene } = this.state;

    if (!doRenderScene) {
      return <PlaceholderView />; // 场景过渡动画未完成前，先渲染过渡场景
    }

    return (
      <View style={Global.styles.CONTAINER_BG}>
        <View style={styles.info}>
          <Icon name="ios-checkmark-circle-outline" color={Global.colors.IOS_BLUE} size={175} width={175} height={175} />
          <Text style={styles.infoText}>预约成功</Text>
        </View>
        <BottomBar visible>
          <Button text="返回" clear onPress={this.gotoRoot} />
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

// AppointSuccess.navigationOptions = { title: '预约成功' };

const mapStateToProps = state => ({
  nav: state.nav,
  hospital: state.base.currHospital,
});

export default connect(mapStateToProps)(AppointSuccess);
