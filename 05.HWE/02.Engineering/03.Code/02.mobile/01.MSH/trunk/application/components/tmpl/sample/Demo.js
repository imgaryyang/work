/**
 * 用户登录
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  InteractionManager,
  Alert,
} from 'react-native';

import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Separator from 'rn-easy-separator';
import Toast from 'react-native-root-toast';

import Global from '../../../Global';
// import RSAUtils from '../../utils/RSAUtils';
import ChangePatient from '../../me/patients/ChangePatient';
import HosPatient from '../../me/HosPatient';
import Form from '../../../modules/form/EasyForm';
import { login } from '../../../services/base/AuthService';
import { afterLogin, updateUser } from '../../../actions/base/AuthAction';
import { setCurrPatient } from '../../../actions/base/BaseAction';


// import JPush from 'react-native-jpush';

class Demo extends Component {
  static displayName = 'Demo';
  static description = '用户登录';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);

    this.register = this.register.bind(this);
    this.findPwd = this.findPwd.bind(this);
    this.login = this.login.bind(this);
    this.onChange = this.onChange.bind(this);
    this.refresh = this.refresh.bind(this);
    this.register = this.register.bind(this);
    this.callback = this.callback.bind(this);
    this.renderProfile = this.renderProfile.bind(this);
    // this.jPushSetAliasAndTags = this.jPushSetAliasAndTags.bind(this);
  }

  state = {
    doRenderScene: false,
    value: {},
    buttonDisabled: false,
    patient: this.props.base.currPatient ? this.props.base.currPatient : {},
    hospital: this.props.base.currHospital ? this.props.base.currHospital : {},
    profile: {},
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true }, () => this.renderProfile(this.state.hospital, this.state.patient));
    });
    this.props.navigation.setParams({
      title: 'Demo to Misson',
    });
  }

  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }
  callback(patient, profile) {
    console.log('item>>>>>>>>>>>>>111111', patient);
    console.log('item>>>>>>>>>>>>>222222', profile);
  }
  refresh() {
    this.form = null;
    this.setState({
      value: {},
      buttonDisabled: false,
    });
  }

  /**
   * 跳转到注册场景
   */
  register({ title, component, passProps }) {
    if (component !== null) {
      this.props.navigate({ component, params: passProps });
    } else {
      Toast.show(`${title}即将开通`);
    }
  }

  /**
   * 跳转到重置密码场景
   */
  findPwd({ title, component, passProps }) {
    if (component !== null) {
      this.props.navigate({ component, params: passProps });
    } else {
      Toast.show(`${title}即将开通`);
    }
  }

  /**
   * 推送,设置别名和标签
   */
  // jPushSetAliasAndTags() {
  //   let {id} = this.state.userInfo;
  //   JPush.setTags(['el','elh','elp','els'], id);
  //   console.log('设置别名和标签');
  // }

  /**
   * 登录
   */
  async login() {
    if (this.form.validate()) {
      try {
        this.setState({
          buttonDisabled: true,
        });
        this.props.screenProps.showLoading();
        const responseData = await login({ ...this.state.value, encpswd: this.state.value.password, username: this.state.value.mobile });
        if (responseData.success) {
          // 将用户信息放入redux
          const currPatient = responseData.result.map.currPatient ? responseData.result.map.currPatient : {};
          this.props.afterLogin(responseData.result);
          this.props.updateUser(responseData.result);
          this.props.setCurrPatient(currPatient);
          this.setState({
            buttonDisabled: false,
          });
          this.props.screenProps.hideLoading();
          Toast.show('登录成功');
          this.props.navigation.goBack();
        } else {
          this.props.screenProps.hideLoading();
          Toast.show(responseData.msg);
          this.setState({
            buttonDisabled: false,
          });
        }
      } catch (e) {
        this.setState({
          buttonDisabled: false,
        });
        this.props.screenProps.hideLoading();
        this.handleRequestException(e);
      }
    } else {
      Alert.alert(
        '提示',
        '手机号码或登录密码格式不正确,请确认后重新输入!',
        [
          {
            text: '确定',
            onPress: () => {
              this.refresh();
            },
          },
        ],
      );
    }
  }

  form = null;
  renderProfile(hospital, item) {
    const { profiles } = item;
    if (profiles !== null) {
      const length = profiles.length ? profiles.length : 0;
      for (let i = 0; i < length; i++) {
        const pro = profiles[i];
        if (pro.status === '1' && pro.hosId === hospital.id) {
          this.setState({
            profile: pro,
          });
        }
      }
    }
  }
  render() {
    if (!this.state.doRenderScene) { return Demo.renderPlaceholderView(); }
    const doSwitchHos = true;
    const doSwitchPat = true;
    return (
      <View style={[Global.styles.CONTAINER]}>
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
          <Separator height={20} />
          <HosPatient doSwitchHos={doSwitchHos} doSwitchPat={doSwitchPat} />
          <ChangePatient callback={this.callback} navigates={this.props.navigation.navigate} />
          <Form ref={(c) => { this.form = c; }} onChange={this.onChange} value={this.state.profile} showLabel={false}>
            <Form.TextInput
              label="姓名"
              name="name"
              placeholder="请输入登录手机号"
              autoFocus
              required
              icon="ios-phone-portrait"
            />
            <Form.TextInput
              label="就诊卡"
              name="no"
              placeholder="请输入登录密码"
              required
              icon="md-lock"
            />
          </Form>

          <View style={{ flexDirection: 'row', margin: 10 }} >
            <Button text="忘记密码？" onPress={() => { this.findPwd({ title: '重置密码', component: 'ResetPwd' }); }} />
            <Separator width={20} />
            <Button text="登录" onPress={this.login} disabled={this.state.buttonDisabled} />
          </View>

          <Text style={[{
            flex: 1, textAlign: 'center', margin: 10, color: Global.colors.IOS_GRAY_FONT, fontSize: 12,
          }]}
          >
            还未注册？点击“注册”按钮免费注册。
          </Text>
          <View style={{ margin: 10, marginBottom: 40 }}>
            <Button text="注册" onPress={() => { this.register({ title: '用户注册', component: 'Register' }); }} theme={Button.THEME.ORANGE} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  logoHolder: {
    height: Global.getScreen().height / 4,
  },
  logo: {
    width: (Global.getScreen().width * 2) / 3,
    height: (Global.getScreen().height / 8),
    backgroundColor: 'transparent',
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  afterLogin: user => dispatch(afterLogin(user)),
  updateUser: user => dispatch(updateUser(user)),
  setCurrPatient: userPatient => dispatch(setCurrPatient(userPatient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Demo);
