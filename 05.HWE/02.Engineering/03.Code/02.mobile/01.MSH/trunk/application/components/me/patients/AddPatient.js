import React, { Component } from 'react';

import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  InteractionManager,
} from 'react-native';

import Toast from 'react-native-root-toast';
import Button from 'rn-easy-button';
import Sep from 'rn-easy-separator';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Global from '../../../Global';
import Form from '../../../modules/form/EasyForm';
import { save, updateUserPatients } from '../../../services/me/PatientService';
import { updateUser } from '../../../actions/base/AuthAction';

const dismissKeyboard = require('dismissKeyboard');

class AddPatient extends Component {
  static displayName = 'AddPatient';
  static description = '添加就诊人';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
    );
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
    this.clear = this.clear.bind(this);
    this.callbacking = this.callbacking.bind(this);
    this.bindProfile = this.bindProfile.bind(this);
  }

  state = {
    doRenderScene: false,
    value: (
      this.props.navigation.state.params.data ?
        Object.assign({}, this.props.navigation.state.params.data) : null
    ),
    labelPosition: 'top',
    buttonDisabled: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    // this.props.navigation.setParams({
    //   title: '添加就诊人',
    // });
  }

  componentWillUnmount() {
  }

  /**
   * 为表单绑定 onChange 事件，表单中的任何元素更改都会触发此方法
   */
  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }
  form = null;

  async submit() {
    if (this.form.validate()) {
      try {
        this.setState({
          buttonDisabled: true,
        });
        // 显示遮罩
        this.props.screenProps.showLoading();
        // 调用后台保存
        const responseData = await save(this.state.value);
        if (responseData.success) {
          this.setState({
            value: responseData.result,
          });
          const res = await updateUserPatients();
          if (res.success) {
            const { user } = this.props.auth;
            const userPatients = res.result;
            user.map = { userPatients };
            this.props.updateUser(user);
          } else {
            this.handleRequestException({ msg: res.msg });
          }
          this.props.screenProps.hideLoading();
          // 提示成功信息
          Toast.show('保存成功！');
          // 跳转到绑定档案页面
          this.props.navigation.navigate('BindArchives', {
            data: this.state.value,
            callback: this.callbacking,
          });
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
        // 隐藏遮罩
        this.props.screenProps.hideLoading();
        this.handleRequestException(e);
      }
    }
  }

  callbacking(item) {
    console.log('callbacking', item);
    console.log(this);
  }

  /**
   * 绑定档案
   * @param item
   */
  bindProfile() {
    this.props.navigation.navigate('BindArchives', {
      data: this.state.value,
      // callback: this.callbacking(),
    });
  }

  clear() {
    this.setState({ value: {} });
  }

  render() {
    if (!this.state.doRenderScene) { return AddPatient.renderPlaceholderView(); }
    const genders = [
      { label: '女', value: '0' },
      { label: '男', value: '1' },
    ];
    const relations = [
      { label: '父母', value: '1' },
      { label: '夫妻', value: '2' },
      { label: '子女', value: '3' },
      { label: '其他', value: '4' },
    ];
    return (
      <View style={Global.styles.CONTAINER}>
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always">
            <Form
              ref={(c) => { this.form = c; }}
              labelWidth={65}
              onChange={this.onChange}
              value={this.state.value}
              labelPosition={this.state.labelPosition}
            >
              <Form.Checkbox name="relation" label="关系" dataSource={relations} display="row" required />
              <Form.TextInput name="name" label="姓名" placeholder="请输入您的真实姓名" required />
              <Form.Checkbox name="gender" label="性别" dataSource={genders} required />
              <Form.TextInput name="idNo" label="身份证号" placeholder="请输入身份证号码，不允许修改" dataType="cnIdNo" required />
              <Form.TextInput name="mobile" label="手机号码" placeholder="请输入手机号码" dataType="mobile" required />
              <Form.TextInput name="address" label="联系地址" placeholder="请输入联系地址" address />
            </Form>
            <View style={styles.btnHolder} >
              <Button text="重置" onPress={this.clear} theme={Button.THEME.BLUE} />
              <Sep width={10} />
              <Button text="保存" onPress={this.submit} theme={Button.THEME.BLUE} disable={this.state.buttonDisabled} />
            </View>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
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

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  updateUser: user => dispatch(updateUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPatient);
