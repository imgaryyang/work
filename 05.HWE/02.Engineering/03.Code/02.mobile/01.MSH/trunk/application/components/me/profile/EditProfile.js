/**
 * 编辑我的档案
 */

import React, {
  Component,
} from 'react';

import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  InteractionManager,
} from 'react-native';

import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Sep from 'rn-easy-separator';
import Toast from 'react-native-root-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Global from '../../../Global';
import Form from '../../../modules/form/EasyForm';
import FormConfig from '../../../modules/form/config/DefaultConfig';
import { doSave } from '../../../services/base/AuthService';
import { afterLogin, updateUser } from '../../../actions/base/AuthAction';
import { setCurrPatient } from '../../../actions/base/BaseAction';

const dismissKeyboard = require('dismissKeyboard');

class EditProfile extends Component {
  static displayName = 'EditProfile';
  static description = '编辑个人资料';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.onChange = this.onChange.bind(this);
    this.saveCheck = this.saveCheck.bind(this);
    this.doSave = this.doSave.bind(this);
    this.goPop = this.goPop.bind(this);
    this.clear = this.clear.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  state = {
    doRenderScene: false,
    value: { ...this.props.auth.user, age: this.props.auth.user.age ? this.props.auth.user.age.toString() : '0' },
    buttonDisabled: false,
    labelPosition: 'top',
  };

  async componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
    // this.props.navigation.setParams({
    //   title: '编辑个人资料',
    //   headerBackTitle: '首页',
    // });
  }

  componentWillReceiveProps() {
  }

  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }

  saveCheck() {
    if (this.form.validate()) {
      this.doSave();
    }
  }
  async doSave() {
    this.setState({ buttonDisabled: true });
    try {
      // do update
      this.setState({
        buttonDisabled: true,
      });
      this.props.screenProps.showLoading();
      const responseData = await doSave({ ...this.state.value });
      if (responseData.success) {
        this.props.updateUser(responseData.result);
        const { callback } = this.props.navigation.state.params ? this.props.navigation.state.params : '';
        if (typeof callback === 'function') callback(responseData.result);
        const currPatient = responseData.result.map.currPatient ? responseData.result.map.currPatient : {};
        this.props.setCurrPatient(currPatient);
        this.setState({
          buttonDisabled: false,
        });
        this.props.screenProps.hideLoading();
        Toast.show('保存成功');
        this.props.navigation.navigate('BindArchives', { hospital: {}, data: currPatient, title: '添加卡号', });
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
  }

  goPop() {
    this.props.navigation.goBack();
  }

  clear() {
    this.setState({ value: { ...this.props.auth.user, age: this.props.auth.user.age ? this.props.auth.user.age.toString() : '0' } });
    // this.setState({ value: {} });
  }
  form = null;

  render() {
    if (!this.state.doRenderScene) { return EditProfile.renderPlaceholderView(); }
    const genders = [
      { label: '女', value: '0' },
      { label: '男', value: '1' },
    ];
    return (
      <View style={Global.styles.CONTAINER} >
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
            <Form
              ref={(c) => { this.form = c; }}
              onChange={this.onChange}
              config={FormConfig}
              labelWidth={80}
              value={this.state.value}
              showLabel
              labelPosition={this.state.labelPosition}
            >
              <Form.TextInput
                name="name"
                label="姓名"
                placeholder={this.props.auth.user.name == null ? '未填写' : this.props.auth.user.name}
                required
                clearTextOnFocus
              />
              <Form.Checkbox
                style={null}
                name="gender"
                label="性别"
                required
                dataSource={genders}
              />
              <Form.TextInput
                name="age"
                label="年龄"
                dataType="int"
                textAlign="center"
                required
                showAdjustButton
              />
              <Form.TextInput
                name="idNo"
                label="身份证号"
                placeholder={this.props.auth.user.idNo == null ? '未填写' : this.props.auth.user.idNo}
                dataType="cnIdNo"
                required
                clearTextOnFocus
              />
              <Form.TextInput
                name="email"
                label="电子邮箱"
                disable={false}
                placeholder={this.props.auth.user.email == null ? '未填写' : this.props.auth.user.email}
                dataType="email"
                clearTextOnFocus
              />
              <Form.TextInput
                name="address"
                label="地址"
                disable={false}
                placeholder={this.props.auth.user.address == null ? '未填写' : this.props.auth.user.address}
                clearTextOnFocus
              />
            </Form>
            <View style={styles.buttonHolder} >
              <Button text="重置" onPress={this.clear} theme={Button.THEME.BLUE} />
              <Sep width={10} />
              <Button text="保存" onPress={this.saveCheck} theme={Button.THEME.BLUE} disable={this.state.buttonDisabled} />
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
  listItem: {
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 30,
    justifyContent: 'center', // 上下
    height: 40,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  portrait: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  buttonHolder: {
    flexDirection: 'row',
    margin: 10,
    marginTop: 20,
    marginBottom: 40,
  },
});



const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  afterLogin: user => dispatch(afterLogin(user)),
  updateUser: user => dispatch(updateUser(user)),
  setCurrPatient: userPatient => dispatch(setCurrPatient(userPatient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
