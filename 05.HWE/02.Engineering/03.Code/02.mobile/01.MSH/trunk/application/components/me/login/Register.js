/**
 * 用户注册
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  InteractionManager, Alert,
} from 'react-native';

import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Separator from 'rn-easy-separator';
import Toast from 'react-native-root-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Global from '../../../Global';
import Form from '../../../modules/form/EasyForm';
import { login, register } from '../../../services/base/AuthService';
import { afterLogin, updateUser } from '../../../actions/base/AuthAction';
import { setCurrPatient } from '../../../actions/base/BaseAction';

const dismissKeyboard = require('dismissKeyboard');

class Register extends Component {
  static displayName = 'Register';
  static description = '用户注册';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.onChange = this.onChange.bind(this);
    this.navigate = this.navigate.bind(this);
    this.register = this.register.bind(this);
    this.sendAuthSM = this.sendAuthSM.bind(this);
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
      title: '注册',
    });
  }

  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }

  async register() {
    if (this.form.validate()) {
      try {
        this.setState({
          buttonDisabled: true,
        });
        this.props.screenProps.showLoading();
        const responseData = await register({ ...this.state.value, encpswd: this.state.value.password });
        if (responseData.success) {
          const response = await login({
            ...this.state.value,
            encpswd: this.state.value.password,
            username: this.state.value.mobile,
          });
          if (response.success) {
            this.props.screenProps.hideLoading();
            const currPatient = response.result.map ? response.result.map.currPatient : {};
            this.props.setCurrPatient(currPatient);
            this.props.updateUser(response.result);
            this.props.afterLogin(response.result);
            this.props.screenProps.resetBackNavigate(0, 'EditProfile');
          } else {
            this.props.screenProps.hideLoading();
            this.props.navigation.goBack();
          }
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

  refresh() {
    this.form = null;
    this.setState({
      buttonDisabled: false,
    });
  }

  sendAuthSM() {
    console.log('in send auth sm');
    console.log(this);
  }

  navigate({ title, component, passProps }) {
    if (component !== null) {
      this.props.navigate({ component, params: passProps });
    } else {
      Toast.show(`${title}即将开通`);
    }
  }
  form = null;

  render() {
    if (!this.state.doRenderScene) {
      return Register.renderPlaceholderView();
    }

    return (
      <View style={[Global.styles.CONTAINER]} >
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
            <Separator height={20} />
            <Form ref={(c) => { this.form = c; }} onChange={this.onChange} value={this.state.value} showLabel={false} >
              <Form.TextInput
                label="登录手机号"
                name="mobile"
                dataType="mobile"
                placeholder="请输入手机号码"
                autoFocus
                required
                icon="ios-phone-portrait"
              />
              <Form.TextInput
                label="密码"
                name="password"
                placeholder="密码（8-16位字母，数字，特殊字符）"
                maxLength={16}
                minLength={6}
                required
                secureTextEntry
                icon="md-lock"
              />
              <Form.TextInput
                label="短信验证码"
                name="smscode"
                placeholder="请输入收到的短信验证码"
                maxLength={16}
                minLength={6}
                smscode
                required
                buttonText={'点击免费' + '\n' + '获取验证码'}
                buttonOnPress={this.sendAuthSM}
              />
            </Form>

            <View style={{
              flexDirection: 'row', margin: 10, marginBottom: 40,
            }}
            >
              <Button text="注册" onPress={this.register} disabled={this.state.buttonDisabled} />
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
});

const mapDispatchToProps = dispatch => ({
  register: user => dispatch(register(user)),
  afterLogin: user => dispatch(afterLogin(user)),
  updateUser: user => dispatch(updateUser(user)),
  setCurrPatient: userPatient => dispatch(setCurrPatient(userPatient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
