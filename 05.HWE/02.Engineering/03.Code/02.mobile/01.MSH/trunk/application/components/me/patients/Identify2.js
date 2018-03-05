/**
 * 用户注册
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  InteractionManager, Alert,
} from 'react-native';

import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Sep from 'rn-easy-separator';
import Toast from 'react-native-root-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Global from '../../../Global';
// import RSAUtils from '../../utils/RSAUtils';
import Form from '../../../modules/form/EasyForm';
import { updateUser } from '../../../actions/base/AuthAction';
import { identify, updateUserPatients } from '../../../services/me/PatientService';

const dismissKeyboard = require('dismissKeyboard');

class Identity2 extends Component {
  static displayName = 'Identity2';
  static description = '卡号认证';

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
    this.submit = this.submit.bind(this);
    this.sendAuthSM = this.sendAuthSM.bind(this);
    this.countdown = this.countdown.bind(this);
  }

  state = {
    doRenderScene: false,
    data: (
      this.props.navigation.state.params.data ?
        Object.assign({}, this.props.navigation.state.params.data) : null
    ),
    patient: (
      this.props.navigation.state.params.patient ?
        Object.assign({}, this.props.navigation.state.params.patient) : null
    ),
    value: {},
    buttonDisabled: false,
    second: 30,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    this.props.navigation.setParams({
      title: '卡号认证',
    });
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.clockTimer);
  }
  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }
  refresh() {
    this.form = null;
    this.setState({
      value: {},
      buttonDisabled: false,
    });
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
  async submit() {
    if (this.form.validate()) {
      try {
        this.setState({
          buttonDisabled: true,
        });
        if (this.state.value.mobile !== this.state.data.mobile) {
          this.form.mobile.showError('手机号输入不正确，请到医院修改预留手机号');
          this.form.mobile.focus();
          return;
        }
        this.props.screenProps.showLoading();
        const responseData = await identify(
          this.state.value.mobile,
          this.state.value.smscode,
          this.state.data.hosId,
          this.state.patient.id,
        );
        if (responseData.success) {
          // 回调列表更新数据
          const { callback } = this.props.navigation.state.params;
          if (typeof callback === 'function') callback(responseData.result);
          const res = await updateUserPatients(null);
          if (res.success) {
            const { user } = this.props.auth;
            const userPatients = res.result;
            user.map = { userPatients };
            this.props.updateUser(user);
            this.props.screenProps.hideLoading();
          } else {
            this.props.screenProps.hideLoading();
            this.handleRequestException(res.msg);
          }
          this.props.screenProps.hideLoading();
          Toast.show('认证通过');
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

  navigate({ title, component, passProps }) {
    if (component !== null) {
      this.props.navigate({ component, params: passProps });
    } else {
      Toast.show(`${title}即将开通`);
    }
  }

  render() {
    if (!this.state.doRenderScene) {
      return Identity2.renderPlaceholderView();
    }
    return (
      <View style={[Global.styles.CONTAINER]} >
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
            <Sep height={20} />
            <View style={{ flex: 1, flexDirection: 'column', marginLeft: 10 }} >
              <Text style={{ flex: 1, color: '#2C3742', fontSize: 15 }} >{this.state.data.hosName}</Text>
              <Sep height={5} />
              <View style={{ flex: 1, flexDirection: 'row' }} >
                <Text style={{ color: '#2C3742', fontSize: 15 }}>{this.state.data.name}</Text>
                <Sep width={10} />
                <Text style={{ color: '#2C3742', fontSize: 15 }}>{this.state.data.gender === '1' ? '男' : '女'}</Text>
              </View>
              <Sep height={5} />
              <View style={{ flex: 1, flexDirection: 'row' }} >
                <Text style={{ color: '#999999', fontSize: 14 }}>身份证</Text>
                <Sep width={10} />
                <Text style={{ color: '#999999', fontSize: 14 }}>{this.state.data.idNo}</Text>
              </View>
              <Sep height={5} />
              <View style={{ flex: 1, flexDirection: 'row' }} >
                <Text style={{ color: '#999999', fontSize: 14 }}>卡号</Text>
                <Sep width={10} />
                <Text style={{ color: '#999999', fontSize: 14 }}>{this.state.data.no}</Text>
              </View>
            </View>
            <Form ref={(c) => { this.form = c; }} onChange={this.onChange} value={this.state.value} showLabel={false} >
              <Form.TextInput
                label="登录手机号"
                name="mobile"
                dataType="mobile"
                placeholder="请输入预留医院手机号码"
                autoFocus
                required
                icon="ios-phone-portrait"
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
              flexDirection: 'row', margin: 10, marginBottom: 40,
            }}
            >
              <Button text="认证" onPress={this.submit} disabled={this.state.buttonDisabled} />
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
  updateUser: user => dispatch(updateUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Identity2);
