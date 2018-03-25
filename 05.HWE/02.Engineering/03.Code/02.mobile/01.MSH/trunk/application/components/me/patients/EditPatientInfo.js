import React, { Component } from 'react';

import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';

import Toast from 'react-native-root-toast';
import Button from 'rn-easy-button';
import Sep from 'rn-easy-separator';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Global from '../../../Global';
import Form from '../../../modules/form/EasyForm';
import { save } from '../../../services/me/PatientService';
import { updateUser } from '../../../actions/base/AuthAction';

const dismissKeyboard = require('dismissKeyboard');

class EditPatientInfo extends Component {
  static displayName = 'EditPatientInfo';
  static description = '添加/修改就诊人信息';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} >
        <View style={[Global.styles.CENTER, { flex: 1 }]} >
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
    this.clear = this.clear.bind(this);
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
    const { params } = this.props.navigation.state;
    this.props.navigation.setParams({
      title: params && params.title ? params.title : '添加就诊人',
    });

    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
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
        const { params } = this.props.navigation.state;
        const doAdd = !this.state.value.id;
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
          this.props.screenProps.hideLoading();
          // 重载登录用户信息
          await this.props.screenProps.reloadUserInfo();
          // 提示成功信息
          Toast.show('保存成功！');
          // 回调
          if (params && typeof params.callback === 'function') {
            params.callback(responseData.result);
          }
          // 如果是新增就诊人
          if (doAdd) {
            // 跳转到绑定档案页面
            this.props.screenProps.resetBackNavigate(this.props.nav.index - 1, 'BindProfile', {
              patientId: responseData.result.id,
              callback: () => {},
              title: '绑卡',
            });
          } else {
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
        // 隐藏遮罩
        this.props.screenProps.hideLoading();
        this.handleRequestException(e);
      }
    }
  }

  clear() {
    this.setState({ value: {} });
  }

  render() {
    if (!this.state.doRenderScene) { return EditPatientInfo.renderPlaceholderView(); }
    const genders = [
      { label: '女', value: '0' },
      { label: '男', value: '1' },
    ];
    const relations = [];
    for (const key in Global.relations) {
      relations[relations.length] = { value: key, label: Global.relations[key] };
    }
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
  scrollView: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  btnHolder: {
    flexDirection: 'row',
    margin: 10,
    marginTop: 0,
    marginBottom: 40,
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  nav: state.nav,
});

const mapDispatchToProps = dispatch => ({
  updateUser: user => dispatch(updateUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPatientInfo);
