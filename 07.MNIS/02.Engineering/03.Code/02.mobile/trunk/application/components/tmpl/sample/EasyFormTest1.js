import React, { Component } from 'react';

import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  InteractionManager,
  Alert,
} from 'react-native';

import Toast from 'react-native-root-toast';
import Button from 'rn-easy-button';
import Sep from 'rn-easy-separator';

import Global from '../../../Global';
import Form from '../../../modules/form/EasyForm';

class EasyFormTest1 extends Component {
  static displayName = 'EasyFormTest1';
  static description = '组件';

  constructor(props) {
    super(props);

    this.clear = this.clear.bind(this);
    this.submit = this.submit.bind(this);
    this.sendAuthSM = this.sendAuthSM.bind(this);
    this.setClock = this.setClock.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  state = {
    doRenderScene: false,
    value: {
      name: 'Victor',
      birth: '1979-02-09',
      birth1: '11:11',
      birth2: '1979-02-09 11:11',
      age: '99',
    },
    showLabel: true,
    labelPosition: 'left',
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

  onChange(fieldName, fieldValue, formValue) {
    // console.log(arguments);
    this.setState({ value: formValue });
  }

  setClock() {
    if (this.state.second === 0) {
      this.setState({ second: 30 });
      return;
    }

    const second = this.state.second ? this.state.second - 1 : 30;
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

  sendAuthSM() {
    console.log('in send auth sm');
    this.setState({ buttonDisabled: true }, () => {
      this.setClock();
      this.timer = setTimeout(
        () => {
          this.setState({ buttonDisabled: false });
        },
        30000,
      );
    });
  }

  clear() {
    this.setState({ value: {} });
  }

  submit() {
    console.log(this.state.value);
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
      Toast.show('校验通过！');
    }
  }

  renderToolBar() {
    return (
      <View style={[Global.styles.TOOL_BAR.FIXED_BAR]}>
        <Button
          text={`showLabel : ${this.state.showLabel}`}
          clear
          onPress={() => this.setState({ showLabel: !this.state.showLabel })}
        />
        <Button
          text={`labelPosition : ${this.state.labelPosition}`}
          clear
          onPress={() => this.setState({ labelPosition: this.state.labelPosition === 'top' ? 'left' : 'top' })}
        />
      </View>
    );
  }

  renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: '#ffffff' }]}>
        {this.renderToolBar()}
      </View>
    );
  }

  render() {
    if (!this.state.doRenderScene) { return this.renderPlaceholderView(); }

    const genders = [
      { label: '女', value: '0' },
      { label: '男', value: '1' },
    ];

    const graduates = [
      { label: '专科以下', value: '1' },
      { label: '大学专科', value: '2' },
      { label: '大学本科', value: '3' },
      { label: '硕士学历', value: '4' },
      { label: '博士学历', value: '5' },
    ];

    const ds = [
      { label: 'Java', value: '1' },
      { label: 'C++', value: '2' },
      { label: 'C#', value: '3' },
      { label: 'Javascript', value: '4' },
      { label: 'Html', value: '5' },
      { label: 'CSS', value: '6' },
      { label: 'Ruby', value: '7' },
      { label: 'Basic', value: '8' },
      { label: 'Go', value: '9' },
      { label: 'Objective C', value: '10' },
      { label: 'SQL', value: '11' },
      { label: 'Visual Basic', value: '12' },
      { label: 'VBScript', value: '13' },
    ];

    const x = null;

    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: '#ffffff' }]}>
        {this.renderToolBar()}
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">

          <Form
            ref={(c) => { this.form = c; }}
            showLabel={this.state.showLabel}
            labelPosition={this.state.labelPosition}
            labelWidth={100}
            onChange={this.onChange}
            value={this.state.value}
          >

            <View style={{
              borderLeftWidth: 4,
              borderLeftColor: 'brown',
              paddingLeft: 10,
              marginBottom: 6,
              marginTop: 10,
            }}
            ><Text>基础信息</Text>
            </View>

            <Form.TextInput
              name="name"
              label="姓名"
              placeholder="请输入姓名"
              required
              minLength={5}
              maxLength={20}
              help="请输入您的真实姓名"
            />
            <Form.TextInput
              name="alias"
              label="昵称"
              placeholder="请输入昵称"
              required
              minLength={6}
              maxLength={20}
              help={'1、昵称将用于显示' + '\n' + '2、请遵守当地法律'}
            />

            <Form.Date name="birth" label="出生日期" placeholder="请选择出生日期" />
            <Form.Date name="birth1" label="出生时间" placeholder="请选择出生时间" mode="time" />
            <Form.Date name="birth2" label="出生日期" placeholder="请选择出生日期及时间" mode="datetime" />

            {x}

            <Form.Checkbox name="gender" label="性别" dataSource={genders} />
            <Form.Checkbox name="graduate" label="学历" dataSource={graduates} type="multi" display="col" />

            <Form.TextInput
              name="age"
              label="年龄"
              placeholder="请输入年龄"
              dataType="int"
              textAlign="center"
              showAdjustButton
            />
            <Form.TextInput name="idNo" label="身份证号" placeholder="请输入身份证号" dataType="cnIdNo" />
            <Form.TextInput name="cardNo" label="银行卡号" placeholder="请输入银行卡号" dataType="bankAcct" />
            <Form.TextInput name="gain" label="月收入" placeholder="请输入月收入" dataType="amt" />

            <Form.Picker name="skill" label="特长" placeholder="请选择特长" dataSource={ds} />

            <View style={{
              borderLeftWidth: 4,
              borderLeftColor: 'brown',
              paddingLeft: 10,
              marginBottom: 6,
              marginTop: 10,
            }}
            ><Text>安全信息</Text>
            </View>

            <Form.TextInput name="pwd" label="密码" placeholder="请输入密码" password required icon="md-lock" />
            <Form.TextInput
              name="pwdConfirm"
              label="再次输入密码"
              placeholder="请重新输入密码进行验证"
              password
              required
              icon="md-lock"
            />
            <Form.TextInput
              name="email"
              label="电子邮箱"
              placeholder="请输入电子邮箱"
              dataType="email"
              required
              icon="ios-mail"
            />
            <Form.TextInput
              name="mobile"
              label="手机号"
              placeholder="请输入手机号码"
              dataType="mobile"
              required
              icon="ios-phone-portrait"
            />
            <Form.TextInput
              name="authCode"
              label="验证码"
              placeholder="请输入短信验证码"
              icon="ios-chatbubbles"
              required
              dataType="number"
              maxLength={6}
              minLength={6}
              textAlign="center"
              buttonText={'点击免费' + '\n' + '获取验证码'}
              buttonOnPress={this.sendAuthSM}
              buttonDisabled={this.state.buttonDisabled}
              buttonDisabledText={`${this.state.second}秒钟后可` + '\n' + '再次发送'}
              help="请输入验证短信中的6位验证码"
            />

            <Form.Switch name="agreement" label="服务协议" showLabel={false}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text>点击同意</Text>
                <Button text="《易民生服务协议》" theme={Button.THEME.HREF} stretch={false} />
              </View>
            </Form.Switch>

          </Form>

          <View style={{
              flexDirection: 'row', margin: 20, marginTop: 0, marginBottom: 40,
            }}
          >
            <Button text="清除" outline onPress={this.clear} />
            <Sep width={10} />
            <Button text="提交" outline onPress={this.submit} />
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
});

EasyFormTest1.navigationOptions = {
  headerTitle: '通用表单',
};

export default EasyFormTest1;