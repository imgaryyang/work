/**
 * 说明
 */

import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
// import Toast from 'react-native-root-toast';

import Global from '../Global';
import RootNavigation from './RootNavigation';
import LoadingView from '../modules/Loading';
import { showLoading, setCurrLocation, setScreen, setOrientation, resetBackNavigate, setCurrPatient } from '../actions/base/BaseAction';

class MainView extends Component {
  constructor(props) {
    super(props);
    this.onLayout = this.onLayout.bind(this);
    this.onOrientationChange = this.onOrientationChange.bind(this);
    this.getPatient = this.getPatient.bind(this);
    this.setCurrPatient = this.setCurrPatient.bind(this);
  }
  componentDidMount() {
    // 如果不是pad，锁定为竖屏模式
    if (!Global.device.isTablet()) Orientation.lockToPortrait();
    // 注册屏幕方向改变的监听事件
    Orientation.addOrientationListener(this.onOrientationChange);
  }
  componentWillUnmount() {
    Orientation.getOrientation((err, orientation) => {
      console.log(`Current Device Orientation: ${orientation}`);
    });
    // 移除屏幕方向改变的监听事件
    Orientation.removeOrientationListener(this.onOrientationChange);
  }
  // 监听屏幕方向变化
  onOrientationChange(orientation) {
    // console.log('onOrientationChange() in MainView:', orientation);
    this.props.setOrientation(orientation);
  }
  // 取布局参数获取屏幕尺寸
  onLayout(e) {
    // console.log('onLayout() in MainView:', e.nativeEvent.layout);
    this.props.setScreen(e.nativeEvent.layout);
  }
  // 根据住院号取患者信息
  getPatient(inpatientNo) {
    const { currInpatientArea, patients } = this.props.base;
    if (currInpatientArea) {
      const patientsInArea = patients[currInpatientArea.id];
      for (let i = 0; i < patientsInArea.length; i++) {
        if (patientsInArea[i].inpatientNo === inpatientNo) {
          return patientsInArea[i];
        }
      }
    }
    return null;
  }
  // 根据住院号将患者放置到Store中的当前患者
  setCurrPatient(inpatientNo) {
    const patient = this.getPatient(inpatientNo);
    if (patient) this.props.setCurrPatient(patient);
    else Toast.show('未找到对应患者信息');
    return patient;
  }
  render() {
    return (
      <View style={{ flex: 1, height: Global.getScreen().height }} onLayout={this.onLayout} >
        <RootNavigation
          showLoading={this.props.showLoading}
          getCurrentLocation={compCallBack => this.getCurrentLocation(this.props.setCurrLocation, compCallBack)}
          resetBackNavigate={this.props.resetBackNavigate}
          getPatient={this.getPatient}
          setCurrPatient={this.setCurrPatient}
        />
        <LoadingView visible={this.props.base.loadingVisible} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  showLoading: visible => dispatch(showLoading(visible)),
  setCurrLocation: location => dispatch(setCurrLocation(location)),
  setScreen: screen => dispatch(setScreen(screen)),
  setOrientation: orientation => dispatch(setOrientation(orientation)),
  resetBackNavigate: (backIndex, routeName, params) => dispatch(resetBackNavigate(backIndex, routeName, params)),
  setCurrPatient: patient => dispatch(setCurrPatient(patient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
