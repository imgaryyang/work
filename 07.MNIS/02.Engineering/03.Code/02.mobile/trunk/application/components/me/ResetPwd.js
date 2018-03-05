/**
 * 重置密码
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  InteractionManager, Alert,
} from 'react-native';

import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Separator from 'rn-easy-separator';
import Toast from 'react-native-root-toast';
import { NavigationActions } from 'react-navigation';

import Global from '../../Global';
// import RSAUtils from '../../utils/RSAUtils';
import Form from '../../modules/form/EasyForm';
// import { gotoresetPwd } from '../../actions/base/AuthAction';
import { resetPwd } from '../../services/base/AuthService';


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
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
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

  refresh() {
    this.form = null;
    this.setState({
      value: {},
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
      return ResetPwd.renderPlaceholderView();
    }

    return (
      <View style={[Global.styles.CONTAINER]} >
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
          <Separator height={20} />
          <View style={[Global.styles.CENTER, styles.logoHolder]} >
            <Image source={Global.logo.l} resizeMode="contain" style={styles.logo} />
          </View>
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
            flexDirection: 'row', marginTop: 20, marginLeft: 20, marginRight: 20,
          }}
          >
            <Button text="确定" onPress={this.resetPwd} disabled={this.state.buttonDisabled} />
          </View>
          <View style={{
            flexDirection: 'row', marginTop: 20, marginLeft: 20, marginRight: 20,
          }}
          >
            <Button text="确定" onPress={() => { this.navigate({ title: '用户登录', component: 'Login' }); }} />
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

ResetPwd.navigationOptions = {
  headerTitle: '重置密码',
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  resetPwd: user => dispatch(resetPwd(user)),
  navigate: ({ component, params }) => dispatch(NavigationActions.navigate({ routeName: component, params })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPwd);