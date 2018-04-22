/**
 * 用户登录
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Image,
  InteractionManager,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Separator from 'rn-easy-separator';
import Toast from 'react-native-root-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Global from '../../../Global';
import Form from '../../../modules/form/EasyForm';
import { sendSecurityCode, verifySecurityCode } from '../../../services/base/BaseService';
import { login } from '../../../services/base/AuthService';
import { afterLogin } from '../../../actions/base/AuthAction';
import { setCurrPatient, setCurrHospital } from '../../../actions/base/BaseAction';
import { testMobile } from '../../../modules/form/Validation';

const dismissKeyboard = require('dismissKeyboard');

class LoginBySMS extends Component {
  static displayName = 'LoginBySMS';
  static description = '用户登录';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
    this.onChange = this.onChange.bind(this);
    this.sendSecurityCode = this.sendSecurityCode.bind(this);
    this.setClock = this.setClock.bind(this);
    this.setCurrInfoFromHabits = this.setCurrInfoFromHabits.bind(this);
    this.setCurrInfoFromPatients = this.setCurrInfoFromPatients.bind(this);
  }

  state = {
    doRenderScene: false,
    value: {},
    buttonDisabled: false,
    sendButtonDisabled: false,
    second: Global.Config.global.authCodeResendInterval,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    this.props.navigation.setParams({
      title: '登录',
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.clockTimer);
  }

  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }

  /**
   * 从用户使用习惯设置当前医院及当前就诊人信息
   */
  setCurrInfoFromHabits(user) {
    let profileHasSet = false;
    if (user.map && user.map.habits && user.map.habits.length > 0) {
      const { habits, userPatients } = user.map;
      let currPatient = null;
      let currProfile = null;
      for (let i = 0; i < habits.length; i++) {
        const { habitType, habitContent } = habits[i];
        // TODO: 需要取完整医院信息
        if (this.props.base.edition === Global.EDITION_MULTI && habitType === Global.habitsType.CURR_HOSPITAL) {
          this.props.setCurrHospital({ id: _.trim(habitContent) });
        } if (habitType === Global.habitsType.CURR_PATIENT) {
          for (let j = 0; j < userPatients.length; j++) {
            if (_.trim(habitContent) === userPatients[j].id) {
              currPatient = userPatients[j];
              break;
            }
          }
        } if (habitType === Global.habitsType.CURR_PROFILE) {
          for (let j = 0; j < userPatients.length; j++) {
            const p = userPatients[j];
            const { profiles } = p;
            for (let k = 0; profiles && k < profiles.length; k++) {
              if (_.trim(habitContent) === profiles[k].id) {
                currProfile = profiles[k];
                profileHasSet = true;
                break;
              }
            }
            if (currProfile) break;
          }
        }
      }
      this.props.setCurrPatient(currPatient, currProfile);
    }
    return profileHasSet;
  }

  /**
   * 从就诊人列表设置当前就诊人及当前档案
   */
  setCurrInfoFromPatients(user) {
    if (user.map && user.map.userPatients && user.map.userPatients.length > 0) {
      const { userPatients } = user.map;
      let currPatient = null;
      let currProfile = null;
      for (let j = 0; j < userPatients.length; j++) {
        const p = userPatients[j];
        const { profiles } = p;
        if (profiles && profiles.length > 0) {
          currPatient = p;
          currProfile = profiles[0];
          break;
        }
      }
      this.props.setCurrPatient(currPatient, currProfile);
    }
  }

  setClock() {
    const interval = Global.Config.global.authCodeResendInterval;
    if (this.state.second === 0) {
      this.setState({ second: interval });
      return;
    }

    const second = this.state.second ? this.state.second - 1 : interval;
    this.clockTimer = setTimeout(
      () => {
        this.setState({ second });
        this.setClock();
      },
      1000,
    );
  }

  form = null;
  timer = null;
  clockTimer = null;

  /**
   * 发送验证码
   * @returns {Promise<boolean>}
   */
  async sendSecurityCode() {
    // console.log('in send auth sm');
    const { value } = this.state;
    if (!value.mobile) {
      this.form.mobile.showError('请填写手机号！');
      return false;
    } else if (!testMobile(value.mobile)) {
      this.form.mobile.showError('您输入的手机号不符合要求，请重新输入！');
      return false;
    } else {
      this.form.mobile.showError('');
      try {
        this.setState({ sendButtonDisabled: true });
        const responseData = await sendSecurityCode({
          type: Global.securityCodeType.REG_APP,
          mobile: value.mobile,
        });
        // console.log('responseData of sendSecurityCode:', responseData);
        if (responseData.success) {
          Toast.show('验证码发送成功，请注意查收！');
          this.setState({ sendButtonDisabled: true }, () => {
            this.setClock();
            this.timer = setTimeout(
              () => {
                this.setState({ sendButtonDisabled: false });
              },
              Global.Config.global.authCodeResendInterval * 1000,
            );
          });
        } else {
          Toast.show(responseData.msg);
          this.setState({ sendButtonDisabled: false });
        }
      } catch (e) {
        this.setState({ sendButtonDisabled: false });
        this.handleRequestException(e);
      }
    }
  }

  /**
   * 登录
   */
  async login() {
    if (this.form.validate()) {
      try {
        const { value } = this.state;
        this.setState({
          buttonDisabled: true,
          sendButtonDisabled: true,
        });
        this.props.screenProps.showLoading();
        const responseData = await verifySecurityCode({
          type: Global.securityCodeType.REG_APP,
          mobile: value.mobile,
          code: value.securityCode,
        });
        // console.log('responseData of verifySecurityCode:', responseData);
        if (responseData.success) {
          Toast.show(`验证码验证成功${'\n'}正在登录系统，请稍候...`);
          // 如果是单医院版，设置当前医院
          // if (Global.edition === Global.EDITION_SINGLE) this.props.setCurrHospital(Global.Config.hospital);
          // 将用户信息放入redux
          const loginResponse = await login({
            mobile: value.mobile,
            token: responseData.result.token,
          });
          console.log('loginResponse:', loginResponse);
          if (loginResponse.success) {
            const { result } = loginResponse;
            // 设置当前登录用户及登录状态
            this.props.afterLogin(result);
            // 单医院版本直接将当前医院设为Config中配置的医院
            if (this.props.base.edition === Global.EDITION_SINGLE) {
              this.props.setCurrHospital(Global.Config.hospital);
            }

            this.setState({
              buttonDisabled: false,
              sendButtonDisabled: false,
            }, () => {
              this.props.screenProps.hideLoading();
              Toast.show('登录成功');
              // 1、如果无就诊人，导向到新建就诊人
              if (!result.map || !result.map.userPatients || result.map.userPatients.length === 0) {
                this.props.screenProps.resetBackNavigate(this.props.nav.index - 1, 'Patients', {
                  title: '常用就诊人',
                  hideNavBarBottomLine: true,
                });
              } else {
                // 2、从用户使用记录取上次医院及上次就诊人
                const hasSet = this.setCurrInfoFromHabits(result);
                if (!hasSet) { // 第 2 步成功取到档案时，不执行第 3 步
                  // 3、如果没有使用记录，则轮询就诊人档案，将第一个档案作为当前档案
                  this.setCurrInfoFromPatients(result);
                }
                this.props.navigation.goBack();
              }
            });
          } else {
            this.setState({
              buttonDisabled: false,
              sendButtonDisabled: false,
            });
            this.props.screenProps.hideLoading();
            Toast.show(loginResponse.msg);
          }
        } else {
          this.setState({
            buttonDisabled: false,
            sendButtonDisabled: false,
          });
          this.props.screenProps.hideLoading();
          Toast.show(responseData.msg);
        }
      } catch (e) {
        this.setState({
          buttonDisabled: false,
          sendButtonDisabled: false,
        });
        this.props.screenProps.hideLoading();
        this.handleRequestException(e);
      }
    }
  }

  render() {
    if (!this.state.doRenderScene) { return LoginBySMS.renderPlaceholderView(); }
    // console.log(this.props);
    return (
      <View style={[Global.styles.CONTAINER]}>
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">
            <Separator height={20} />
            <View style={[Global.styles.CENTER, styles.logoHolder]}>
              <Image source={Global.logo.l} resizeMode="contain" style={styles.logo} />
            </View>
            <View style={styles.form}>
              <Form
                ref={(c) => { this.form = c; }}
                onChange={this.onChange}
                value={this.state.value}
                showLabel={false}
              >
                <Form.TextInput
                  label="登录手机号"
                  name="mobile"
                  dataType="mobile"
                  placeholder="请输入登录手机号"
                  autoFocus
                  required
                  icon="ios-phone-portrait"
                />
                <Form.TextInput
                  label="验证码"
                  name="securityCode"
                  placeholder="请输入短信验证码"
                  dataType="number"
                  maxLength={6}
                  minLength={6}
                  textAlign="center"
                  required
                  icon="ios-chatbubbles"
                  buttonText={`点击免费${'\n'}获取验证码`}
                  buttonOnPress={this.sendSecurityCode}
                  buttonDisabled={this.state.sendButtonDisabled}
                  buttonDisabledText={`${this.state.second}秒钟后可${'\n'}再次发送`}
                />
              </Form>
            </View>
            <Button
              text="登录"
              onPress={this.login}
              disabled={this.state.buttonDisabled}
              style={styles.btn}
            />
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  logoHolder: {
    // height: Global.getScreen().height / 5,
  },
  logo: {
    width: (Global.getScreen().width * 1) / 2,
    height: (Global.getScreen().height / 6),
    backgroundColor: 'transparent',
  },
  form: {
    margin: 15,
  },
  btn: {
    margin: 25,
    marginTop: 0,
  },
});

LoginBySMS.navigationOptions = {
};

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
  nav: state.nav,
});

const mapDispatchToProps = dispatch => ({
  afterLogin: user => dispatch(afterLogin(user)),
  setCurrPatient: (userPatient, profile) => dispatch(setCurrPatient(userPatient, profile)),
  setCurrHospital: hospital => dispatch(setCurrHospital(hospital)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginBySMS);
