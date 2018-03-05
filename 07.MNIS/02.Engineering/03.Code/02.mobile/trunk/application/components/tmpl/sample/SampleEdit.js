import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  InteractionManager,
  Alert,
  ActivityIndicator,
} from 'react-native';

import Toast from 'react-native-root-toast';
import Button from 'rn-easy-button';
import Sep from 'rn-easy-separator';

import Global from '../../../Global';
import Form from '../../../modules/form/EasyForm';
import { save } from '../../../services/tmpl/SampleService';

class SampleEdit extends Component {
  static displayName = 'SampleEdit';
  static description = '表单样例';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.INDICATOR_CONTAINER} >
        <ActivityIndicator />
      </View>
    );
  }

  constructor(props) {
    // console.log('.....:', props);
    super(props);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
    this.clear = this.clear.bind(this);
    this.sendAuthSM = this.sendAuthSM.bind(this);
    this.countdown = this.countdown.bind(this);
  }

  state = {
    doRenderScene: false,
    value: (
      this.props.navigation.state.params.data ?
        Object.assign({}, this.props.navigation.state.params.data) : null
    ),
    buttonDisabled: false,
    second: 30,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.clockTimer);
  }

  /**
   * 为表单绑定 onChange 事件，表单中的任何元素更改都会触发此方法
   */
  onChange(fieldName, fieldValue, formValue) {
    // console.log(arguments);
    this.setState({ value: formValue });
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
    // console.log(this.state.value);
    if (this.form.validate()) {
      if (this.state.value.pwd !== this.state.value.pwdConfirm) {
        this.form.pwdConfirm.showError('两次密码输入不一致');
        this.form.pwdConfirm.focus();
        return;
      }
      if (this.state.value.authCode !== '999999') {
        Alert.alert('提示', '校验码不正确！', [
          { text: '确定', onPress: () => this.form.authCode.focus() },
        ]);
        return;
      }

      try {
        // 显示遮罩
        this.props.screenProps.showLoading();
        // 调用后台保存
        const responseData = await save(this.state.value);
        if (responseData.success) {
          // 提示成功信息
          Toast.show('保存成功！');
          // 隐藏遮罩
          this.props.screenProps.hideLoading();
          // 回调列表更新数据
          const { callback } = this.props.navigation.state.params;
          if (typeof callback === 'function') callback(responseData.result);
          // 返回列表页
          this.props.navigation.goBack();
        } else {
          Toast.show(responseData.msg || '保存数据出错！');
        }
      } catch (e) {
        // 隐藏遮罩
        this.props.screenProps.hideLoading();
        this.handleRequestException(e);
      }
    }
  }

  clear() {
    console.log('data in reset()', this.props.navigation.state.params.data);
    this.setState({ value: this.props.navigation.state.params.data });
  }

  render() {
    // console.log('......:', this.props);
    if (!this.state.doRenderScene) { return SampleEdit.renderPlaceholderView(); }
    const genders = [
      { label: '女', value: '0' },
      { label: '男', value: '1' },
    ];
    const portraits = [
      { label: 'p002', value: 'p002' },
      { label: 'u0001', value: 'u0001' },
      { label: 'u0002', value: 'u0002' },
      { label: 'u0003', value: 'u0003' },
      { label: 'u0004', value: 'u0004' },
      { label: 'u0005', value: 'u0005' },
    ];
    return (
      <View style={Global.styles.CONTAINER}>
        <ScrollView style={styles.scrollView}>
          <Form
            ref={(c) => { this.form = c; }}
            labelWidth={65}
            onChange={this.onChange}
            value={this.state.value}
            style={{ backgroundColor: 'red' }}
          >
            <Form.TextInput name="name" label="姓名" placeholder="请输入姓名" required minLength={1} maxLength={20} help="请输入您的真实姓名" />
            <Form.Checkbox name="gender" label="性别" dataSource={genders} />
            <Form.TextInput name="password" label="密码" placeholder="请输入密码" password required />
            <Form.TextInput name="passwordConfirm" label="校验密码" placeholder="请重新输入密码进行验证" password required />
            <Form.TextInput
              name="authCode"
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
            <Form.Picker name="portrait" label="头像" dataSource={portraits} />
          </Form>

          <View style={styles.btnHolder} >
            <Button text="重置" outline onPress={this.clear} />
            <Sep width={10} />
            <Button text="保存" outline onPress={this.submit} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {},
  btnHolder: {
    flexDirection: 'row', margin: 10, marginTop: 0, marginBottom: 40,
  },
});

SampleEdit.navigationOptions = {
  headerTitle: 'Edit Form Sample',
};

export default SampleEdit;
