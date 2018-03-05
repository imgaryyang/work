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
import Card from 'rn-easy-card';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ctrlState from '../../../modules/ListState';
import Global from '../../../Global';
import Form from '../../../modules/form/EasyForm';
import ArchivesList from './ArchivesList';
import { save } from '../../../services/me/PatientService';
import { updateUser } from '../../../actions/base/AuthAction';

const dismissKeyboard = require('dismissKeyboard');

class EditPatient extends Component {
  static displayName = 'EditPatient';
  static description = '编辑就诊人';

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
  }

  state = {
    doRenderScene: false,
    value: (
      this.props.navigation.state.params.data ?
        Object.assign({}, this.props.navigation.state.params.data) : null
    ),
    hospital: {},
    labelPosition: 'top',
    ctrlState,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      });
    });
    this.props.navigation.setParams({
      title: '编辑就诊人',
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
        // 显示遮罩
        this.props.screenProps.showLoading();
        // 调用后台保存
        const responseData = await save(this.state.value);
        if (responseData.success) {
          const { user } = this.props.auth;
          user.map.userPatients.concat(responseData.result);
          this.props.updateUser(user);
          // 隐藏遮罩
          this.props.screenProps.hideLoading();
          // 提示成功信息
          Toast.show('保存成功！');
        } else {
          this.props.screenProps.hideLoading();
          Toast.show(responseData.msg);
        }
      } catch (e) {
        // 隐藏遮罩
        this.handleRequestException(e);
        this.props.screenProps.hideLoading();
      }
    }
  }
  clear() {
    this.setState({ value: this.props.navigation.state.params.data });
    // this.setState({ value: {} });
  }

  render() {
    if (!this.state.doRenderScene) { return EditPatient.renderPlaceholderView(); }
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
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
            <Card>
              <Form
                ref={(c) => { this.form = c; }}
                labelWidth={65}
                onChange={this.onChange}
                value={this.state.value}
                labelPosition={this.state.labelPosition}
              >
                <Form.Checkbox name="relation" label="关系" showClearIcon={false} dataSource={relations} editable={false} disabled={true} required />
                <Form.TextInput name="name" label="姓名" placeholder="请输入您的真实姓名" showClearIcon={false} editable={false} required />
                <Form.Checkbox name="gender" label="性别" dataSource={genders} required showClearIcon={false} disabled={true} editable={false} />
                <Form.TextInput name="idNo" label="身份证号" placeholder="请输入身份证号码" showClearIcon={false} editable={false} dataType="cnIdNo" required />
                <Form.TextInput name="mobile" label="手机号码" placeholder="请输入手机号码" mobile showClearIcon={false} dataType="mobile" required />
                <Form.TextInput name="address" label="联系地址" placeholder="请输入联系地址" address />
              </Form>
              <View style={styles.btnHolder} >
                <Button text="重置" onPress={this.clear} />
                <Sep width={10} />
                <Button text="保存" onPress={this.submit} />
              </View>
            </Card>
            <ArchivesList data={this.state.value} screenProps={this.props.screenProps} />
            <Sep height={20} />
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  btnHolder: {
    flexDirection: 'row', margin: 10, marginTop: 0, marginBottom: 10,
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  updateUser: user => dispatch(updateUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPatient);
