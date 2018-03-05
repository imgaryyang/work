/**
 * 用户登录
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  InteractionManager,
  Alert,
} from 'react-native';

import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Separator from 'rn-easy-separator';
import Toast from 'react-native-root-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Global from '../../../Global';
import Form from '../../../modules/form/EasyForm';
import { login } from '../../../services/base/AuthService';
import { afterLogin, updateUser } from '../../../actions/base/AuthAction';
import { setCurrPatient, setCurrHospital } from '../../../actions/base/BaseAction';

const dismissKeyboard = require('dismissKeyboard');

class Login extends Component {
  static displayName = 'Login';
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
    this.refresh = this.refresh.bind(this);
  }

  state = {
    doRenderScene: false,
    value: {},
    buttonDisabled: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    this.props.navigation.setParams({
      title: '登录',
    });
  }

  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }

  refresh() {
    this.form = null;
    this.setState({
      buttonDisabled: false,
    });
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
          // 如果是单医院版，设置当前医院
          // if (Global.edition === Global.EDITION_SINGLE) this.props.setCurrHospital(Global.Config.hospital);
          // 将用户信息放入redux
          const currPatient = responseData.result.map.currPatient ? responseData.result.map.currPatient : {};
          this.props.setCurrPatient(currPatient);
          this.props.updateUser(responseData.result);
          this.props.afterLogin(responseData.result);
          this.setState({
            buttonDisabled: false,
          });
          this.props.screenProps.hideLoading();
          Toast.show('登录成功');
          this.props.navigation.goBack();
        } else {
          this.setState({
            buttonDisabled: false,
          });
          this.props.screenProps.hideLoading();
          Toast.show(responseData.msg);
        }
      } catch (e) {
        this.setState({
          buttonDisabled: false,
        });
        this.props.screenProps.hideLoading();
        this.handleRequestException(e);
      }
    } else {
      this.setState({
        buttonDisabled: false,
      });
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

  render() {
    if (!this.state.doRenderScene) { return Login.renderPlaceholderView(); }
    // console.log(this.props);
    return (
      <View style={[Global.styles.CONTAINER]}>
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
            <Separator height={20} />
            <View style={[Global.styles.CENTER, styles.logoHolder]}>
              <Image source={Global.logo.l} resizeMode="contain" style={styles.logo} />
            </View>
            <Form ref={(c) => { this.form = c; }} onChange={this.onChange} value={this.state.value} showLabel={false}>
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
                label="登录密码"
                name="password"
                placeholder="请输入登录密码"
                maxLength={16}
                minLength={6}
                password
                required
                secureTextEntry
                icon="md-lock"
              />
            </Form>

            <View style={{ flexDirection: 'row', margin: 10 }} >
              <Button text="忘记密码？" onPress={() => { this.props.navigation.navigate('ResetPwd'); }} />
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
              <Button text="注册" onPress={() => { this.props.navigation.navigate('Register'); }} theme={Button.THEME.ORANGE} />
            </View>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  logoHolder: {
    height: Global.getScreen().height / 5,
  },
  logo: {
    width: (Global.getScreen().width * 1) / 2,
    height: (Global.getScreen().height / 8),
    backgroundColor: 'transparent',
  },
});

Login.navigationOptions = {
};

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  afterLogin: user => dispatch(afterLogin(user)),
  updateUser: user => dispatch(updateUser(user)),
  setCurrPatient: userPatient => dispatch(setCurrPatient(userPatient)),
  setCurrHospital: hospital => dispatch(setCurrHospital(hospital)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
