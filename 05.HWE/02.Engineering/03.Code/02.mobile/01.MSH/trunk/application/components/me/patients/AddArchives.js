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
// import RSAUtils from '../../utils/RSAUtils';
import Form from '../../../modules/form/EasyForm';
import { addArchives } from '../../../services/me/PatientService';

const dismissKeyboard = require('dismissKeyboard');

class AddArchives extends Component {
  static displayName = 'AddArchives';
  static description = '新建档案';

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
    this.addArchives = this.addArchives.bind(this);
    this.sendAuthSM = this.sendAuthSM.bind(this);
  }

  state = {
    doRenderScene: false,
    value: {},
    hospital: (
      this.props.navigation.state.params.data ?
        Object.assign({}, this.props.navigation.state.params.data) : null
    ),
    buttonDisabled: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    this.props.navigation.setParams({
      title: '新建档案',
    });
  }

  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }

  async addArchives() {
    if (this.form.validate()) {
      try {
        this.setState({
          buttonDisabled: true,
        });
        this.props.screenProps.showLoading();
        const hospitalId = this.state.hospital;
        const responseData = await addArchives({ ...this.state.value, hospitalId });
        if (responseData.success) {
          console.log('新增档案', responseData);
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
      return AddArchives.renderPlaceholderView();
    }
    const genders = [
      { label: '女', value: '0' },
      { label: '男', value: '1' },
    ];
    return (
      <View style={[Global.styles.CONTAINER]} >
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
            <Separator height={20} />
            <Form ref={(c) => { this.form = c; }} onChange={this.onChange} value={this.state.value} >
              <Form.TextInput
                label="姓名"
                name="name"
                placeholder="请输入患者姓名"
                required
              />
              <Form.Checkbox
                style={null}
                name="gender"
                label="性别"
                dataSource={genders}
              />
              <Form.TextInput
                label="身份证"
                name="idNo"
                placeholder="请输入身份证号码"
                maxLength={18}
                idNo
                required
              />
              <Form.TextInput
                label="手机号"
                name="mobile"
                dataType="mobile"
                placeholder="请输入手机号码"
                autoFocus
                required
              />
            </Form>

            <View style={{
              flexDirection: 'row', margin: 10, marginBottom: 40,
            }}
            >
              <Button text="新建" onPress={this.addArchives} disabled={this.state.buttonDisabled} />
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

export default connect(mapStateToProps)(AddArchives);
