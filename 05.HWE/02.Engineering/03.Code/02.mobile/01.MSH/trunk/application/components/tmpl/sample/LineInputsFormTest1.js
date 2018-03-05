import React, { Component } from 'react';

import {
  View,
  ScrollView,
  StyleSheet,
  InteractionManager,
  Alert,
} from 'react-native';

import Button from 'rn-easy-button';
import Separator from 'rn-easy-separator';
import Card from 'rn-easy-card';

import Global from '../../../Global';
import Form from '../../../modules/form/EasyForm';
import FormConfig from '../../../modules/form/config/LineInputsConfig';

class LineInputsFormTest1 extends Component {
  static displayName = 'LineInputsFormTest1';
  static description = '组件';

  constructor(props) {
    super(props);

    this.clear = this.clear.bind(this);
    this.submit = this.submit.bind(this);
    this.sendAuthSM = this.sendAuthSM.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  state = {
    doRenderScene: false,
    value: {
      name: 'Victor',
      age: '99',
    },
    showLabel: true,
    labelPosition: 'left',
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    this.props.navigation.setParams({
      title: '线型输入框表单',
    });
  }

  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }

  form = null;

  sendAuthSM() {
    console.log('in send auth sm');
  }

  clear() {
    this.setState({ value: {} });
  }

  submit() {
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
      this.toast('校验通过！');
    }
  }

  renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: '#ffffff' }]}>
        {this.renderToolBar()}
      </View>
    );
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

  render() {
    if (!this.state.doRenderScene) { return this.renderPlaceholderView(); }

    return (
      <View style={[Global.styles.CONTAINER]}>
        {this.renderToolBar()}
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">

          <Card radius={7} style={{ margin: 20, padding: 10 }}>

            <Form
              ref={(c) => { this.form = c; }}
              config={FormConfig}
              showLabel={this.state.showLabel}
              labelPosition={this.state.labelPosition}
              labelWidth={100}
              onChange={this.onChange}
              value={this.state.value}
            >

              {/* <View style = {styles.fieldSet} ><Text>基础信息</Text></View>*/}

              <Form.TextInput
                name="name"
                label="姓名"
                placeholder="请输入姓名"
                required
                minLength={5}
                maxLength={20}
                icon="md-person"
              />
              <Form.TextInput
                name="alias"
                label="昵称"
                placeholder="请输入昵称"
                required
                minLength={6}
                maxLength={20}
                icon="md-pricetags"
              />
              <Form.TextInput
                name="age"
                label="年龄"
                placeholder="请输入年龄"
                dataType="int"
                textAlign="center"
                showAdjustButton
                icon="logo-reddit"
              />
              <Form.TextInput name="idNo" label="身份证号" placeholder="请输入身份证号" dataType="cnIdNo" icon="md-list-box" />
              <Form.TextInput name="cardNo" label="银行卡号" placeholder="请输入银行卡号" dataType="bankAcct" icon="ios-card" />
              <Form.TextInput name="gain" label="月收入" placeholder="请输入月收入" dataType="amt" icon="logo-usd" />

              {/* <View style = {styles.fieldSet} ><Text>安全信息</Text></View>*/}

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
              />
            </Form>

          </Card>

          <View style={{
              flexDirection: 'row', margin: 20, marginTop: 0, marginBottom: 40,
            }}
          >
            <Button text="清除" onPress={this.clear} />
            <Separator width={10} />
            <Button text="提交" onPress={this.submit} />
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

  fieldSet: {
    borderLeftWidth: 4,
    borderLeftColor: 'brown',
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: Global.colors.IOS_GRAY_BG,
  },
});

LineInputsFormTest1.navigationOptions = {
};

export default LineInputsFormTest1;

