/**
 * 用户登录
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
  InteractionManager,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';

import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Separator from 'rn-easy-separator';
import { NavigationActions } from 'react-navigation';
import Toast from 'react-native-root-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Global from '../../Global';
// import RSAUtils from '../../utils/RSAUtils';
import Form from '../../modules/form/EasyForm';
import { login } from '../../services/base/AuthService';
import { loadPatients } from '../../services/inpatientArea/InpatientArea';
import { afterLogin, updateUser } from '../../actions/base/AuthAction';
import { setCurrPatient, setPatients, setInpatientAreas, setCurrInpatientArea } from '../../actions/base/BaseAction';


// import JPush from 'react-native-jpush';

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

    this.register = this.register.bind(this);
    this.findPwd = this.findPwd.bind(this);
    this.login = this.login.bind(this);
    this.onChange = this.onChange.bind(this);
    this.refresh = this.refresh.bind(this);
    this.register = this.register.bind(this);
    // this.jPushSetAliasAndTags = this.jPushSetAliasAndTags.bind(this);
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
   * 登录
   */
  async login() {
    if (this.form.validate()) {
      try {
        this.setState({
          buttonDisabled: true,
        });
        this.props.screenProps.showLoading();
        const responseData = await login({ ...this.state.value, encpswd: this.state.value.password, username: this.state.value.username });
        // console.log('登录 》》', responseData);
        if (responseData.success) {
          // 将用户信息放入redux
          this.props.afterLogin(responseData.result);
          this.props.updateUser(responseData.result);
          this.props.setInpatientAreas(responseData.result.inpatientAreas);
          this.props.setCurrInpatientArea(responseData.result.inpatientAreas[0]);
          // 取患者信息
          const patientsData = await loadPatients();
          if (patientsData.success) {
            this.props.setPatients(patientsData.result);
          } else {
            Toast.show('取患者列表出错');
          }
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
        '登录账号或登录密码不符合要求,请确认后重新输入!',
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
                label="登录账号"
                name="username"
                maxLength={20}
                minLength={4}
                placeholder="请输入登录账号"
                autoFocus
                required
                icon="ios-person"
              />
              <Form.TextInput
                label="登录密码"
                name="password"
                placeholder="请输入登录密码"
                maxLength={16}
                minLength={6}
                secureTextEntry
                required
                icon="md-lock"
              />
            </Form>

            <View style={{ flexDirection: 'row', margin: 10 }} >
              <Button text="忘记密码？" onPress={() => { this.findPwd({ title: '重置密码', component: 'ResetPwd' }); }} />
              <Separator width={20} />
              <Button text="登录" onPress={this.login} disabled={this.state.buttonDisabled} />
            </View>

            {/* <Text style={[{
                flex: 1, textAlign: 'center', margin: 10, color: Global.colors.IOS_GRAY_FONT, fontSize: 12,
              }]}
            >
              还未注册？点击“注册”按钮免费注册。
            </Text>
            <View style={{ margin: 10, marginBottom: 40 }}>
              <Button text="注册" onPress={() => { this.register({ title: '用户注册', component: 'Register' }); }} theme={Button.THEME.ORANGE} />
            </View>*/}
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

Login.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: '登录',
    headerLeft: null,
    headerRight: (
      <Button
        text="服务器设置"
        clear
        size="big"
        style={{ width: 100 }}
        onPress={() => navigation.navigate('SettingsForTest')}
      />
    ),
  };
};

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  afterLogin: user => dispatch(afterLogin(user)),
  updateUser: user => dispatch(updateUser(user)),
  setCurrPatient: userPatient => dispatch(setCurrPatient(userPatient)),
  setPatients: patients => dispatch(setPatients(patients)),
  setInpatientAreas: areas => dispatch(setInpatientAreas(areas)),
  setCurrInpatientArea: area => dispatch(setCurrInpatientArea(area)),
  navigate: ({ component, params }) => dispatch(NavigationActions.navigate({ routeName: component, params })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
