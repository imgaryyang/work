/**
 * 说明
 */

import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';

import Global from '../Global';
import RootNavigation from './RootNavigation';
import LoadingView from '../modules/Loading';
import { showLoading, setCurrLocation, resetBackNavigate } from '../actions/base/BaseAction';
import { updateUser, updateReloadUserCtrlState } from '../actions/base/AuthAction';
import { reloadUserInfo } from '../services/base/AuthService';
import ctrlState from "../modules/ListState";

class MainView extends Component {
  constructor(props) {
    super(props);
    this.reloadUser = this.reloadUser.bind(this);
    this.getPatientById = this.getPatientById.bind(this);
  }

  /**
   * 根据就诊人id取就诊人信息
   * @param id
   * @returns {*}
   */
  getPatientById(id) {
    const { auth } = this.props;
    const { map } = auth.user;
    for (let i = 0; map && map.userPatients && i < map.userPatients.length; i++) {
      if (id === map.userPatients[i].id) return map.userPatients[i];
    }
    return null;
  }

  /**
   * 重新载入当前登录用户信息
   * @returns {Promise<void>}
   */
  async reloadUser() {
    const { auth } = this.props;
    const { reloadUserCtrlState } = auth;
    try {
      if (auth.isLoggedIn) {
        this.props.updateReloadUserCtrlState({
          ...reloadUserCtrlState,
          refreshing: true,
        });
        const responseData = await reloadUserInfo(auth.user.id);
        // console.log('responseData in reloadUserInfo:', responseData);
        if (responseData.success) {
          this.props.updateReloadUserCtrlState({
            ...reloadUserCtrlState,
            refreshing: false,
            requestErr: false,
            requestErrMsg: '',
          });
          this.props.updateUser(responseData.result);
        } else {
          this.props.updateReloadUserCtrlState({
            ...reloadUserCtrlState,
            refreshing: false,
            requestErr: true,
            requestErrMsg: responseData.msg,
          });
          Toast.show(responseData.msg);
        }
      }
    } catch (e) {
      console.log(e);
      this.props.updateReloadUserCtrlState({
        ...reloadUserCtrlState,
        refreshing: false,
        requestErr: true,
        requestErrMsg: e,
      });
      Toast.show('重新获取用户信息出错');
    }
  }

  render() {
    // console.log('>>>>> this.props.base in MainView:', this.props.base);
    return (
      <View style={{ flex: 1, height: Global.getScreen().height }} >
        <RootNavigation
          showLoading={this.props.showLoading}
          resetBackNavigate={this.props.resetBackNavigate}
          getCurrentLocation={compCallBack => this.getCurrentLocation(this.props.setCurrLocation, compCallBack)}
          // switchEdition={this.switchEdition}
          reloadUserInfo={this.reloadUser}
          getPatientById={this.getPatientById}
        />
        <LoadingView visible={this.props.base.loadingVisible} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  base: state.base,
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  showLoading: visible => dispatch(showLoading(visible)),
  setCurrLocation: location => dispatch(setCurrLocation(location)),
  resetBackNavigate: (backIndex, routeName, params) => dispatch(resetBackNavigate(backIndex, routeName, params)),
  updateUser: user => dispatch(updateUser(user)),
  updateReloadUserCtrlState: reloadUserCtrlState => dispatch(updateReloadUserCtrlState(reloadUserCtrlState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
