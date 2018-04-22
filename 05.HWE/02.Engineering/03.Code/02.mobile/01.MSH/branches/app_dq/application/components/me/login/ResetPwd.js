/**
 * 重置密码
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
import Toast from 'react-native-root-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Global from '../../../Global';
import Form from '../../../modules/form/EasyForm';
import { resetPwd } from '../../../services/base/AuthService';

const dismissKeyboard = require('dismissKeyboard');

class ResetPwd extends Component {
  static displayName = 'ResetPwd';
  static description = '重置密码';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
    this.onChange = this.onChange.bind(this);
    this.resetPwd = this.resetPwd.bind(this);
    this.navigate = this.navigate.bind(this);
    this.sendAuthSM = this.sendAuthSM.bind(this);
  }

  state = {
    doRenderScene: false,
    value: {},
    buttonDisabled: false,
    second: 30,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    // this.props.navigation.setParams({
    //   title: '重置密码',
    // });
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.clockTimer);
  }
  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }

  async resetPwd() {
    if (this.form.validate()) {
      try {
        this.setState({
          buttonDisabled: true,
        });
        this.props.screenProps.showLoading();
        const responseData = await resetPwd({ ...this.state.value, encpswd: this.state.value.password, username: this.state.value.mobile });
        if (responseData.success) {
          Global.setUser(responseData.result);
          this.props.screenProps.hideLoading();
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

  navigate({ title, component, passProps }) {
    if (component !== null) {
      this.props.navigate({ component, params: passProps });
    } else {
      Toast.show(`${title}即将开通`);
    }
  }
  form = null;
  timer = null;
  clockTimer = null;

  sendAuthSM() {
    console.log('in send auth sm');
    this.setState({ buttonDisabled: true }, () => {
      this.countdown();
      this.timer = setTimeout(
        () => {
          this.setState({ buttonDisabled: false });
        },
        30000,
      );
    });
  }
  countdown() {
    if (this.state.second === 0) {
      this.setState({ second: 30 });
      return;
    }
    const second = this.state.second ? this.state.second - 1 : 30;
    this.clockTimer = setTimeout(
      () => {
        this.setState({ second });
        this.countdown();
      },
      1000,
    );
  }
  render() {
    if (!this.state.doRenderScene) {
      return ResetPwd.renderPlaceholderView();
    }

    return (
      <View style={[Global.styles.CONTAINER]} >
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
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
                password
                required
                secureTextEntry
                icon="md-lock"
              />
              <Form.TextInput
                name="smsCode"
                label="验证码"
                placeholder="请输入短信验证码"
                required
                dataType="number"
                maxLength={6}
                minLength={6}
                textAlign="center"
                buttonText={`点击免费${'\n'}获取验证码`}
                buttonOnPress={this.sendAuthSM}
                buttonDisabled={this.state.buttonDisabled}
                buttonDisabledText={`${this.state.second}秒钟后可${'\n'}再次发送`}
                help="请输入验证短信中的6位验证码"
              />
            </Form>

            <View style={{
              flexDirection: 'row', marginTop: 20, marginLeft: 20, marginRight: 20,
            }}
            >
              <Button text="确定" onPress={this.resetPwd} />
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
  resetPwd: user => dispatch(resetPwd(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPwd);
