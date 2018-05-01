/**
 * 预约挂号4
 */
import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Button from 'rn-easy-button';
import Global from '../../../Global';
import AppointInfo from './AppointInfo';
import PlaceholderView from '../../../modules/PlaceholderView';
import ViewText from '../../../modules/ViewText';
import Radios from '../../../modules/Radios';
import { forReserve } from '../../../services/outpatient/AppointService';
import Form from '../../../modules/form/EasyForm';
import { testMobile } from '../../../modules/form/Validation';
import dftConfig from '../../../modules/form/config/DefaultConfig';

const formRowHeight = 33;
const formConfig = {
  ...dftConfig,
  style: { paddingLeft: 10, paddingRight: 10, paddingTop: 0, paddingBottom: 0 },
  fields: {
    ...dftConfig.fields,
    style: { margin: 0 },
    label: { ...dftConfig.fields.label, style: { ...dftConfig.fields.label.style, fontSize: 13 } },
    textInput: { ...dftConfig.fields.textInput, style: { ...dftConfig.fields.textInput.style, height: formRowHeight } },
  },
};
const initTypeData = [
  { value: '0', label: '有卡预约' },
  { value: '1', label: '无卡预约' },
];

const dismissKeyboard = require('dismissKeyboard');

class Appoint extends Component {
  static displayName = 'Appoint';
  static description = '预约挂号';
  static margin = 8;
  static radius = 4;

  constructor(props) {
    super(props);

    this.formRef = null;
    this.confirmAppoint = this.confirmAppoint.bind(this);
    this.onChange = this.onChange.bind(this);
    this.validate = this.validate.bind(this);
    this.afterChoosePatient = this.afterChoosePatient.bind(this);

    const { currProfile } = props;
    const typeData = currProfile ? initTypeData : initTypeData.slice(1);

    this.state = {
      doRenderScene: false,
      typeData,
      selectedType: typeData[0],
      formValue: {},
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => { this.setState({ doRenderScene: true }); });
    this.props.navigation.setParams({
      title: '预约挂号',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: false,
      allowSwitchPatient: true,
      afterChoosePatient: this.afterChoosePatient,
      hideNavBarBottomLine: false,
    });
  }

  onChange(fieldName, fieldValue, formValue) {
    this.setState({ formValue });
  }

  afterChoosePatient(_, currPatient, currProfile) {
    const typeData = currProfile ? initTypeData : initTypeData.slice(1);
    this.setState({ typeData, selectedType: typeData[0] });
  }

  validate() {
    try {
      const { name, mobile } = this.props.currProfile || {};

      if (!name) throw new Error('姓名不能为空！');
      if (!mobile) {
        throw new Error('手机号不能为空！');
      } else if (!testMobile(mobile)) {
        throw new Error('手机号格式不符合要求！');
      }
      // 有卡预约去掉身份证号校验
      // if (!idNo) {
      //   throw new Error('身份证号不能为空！');
      // } else if (!testCnIdNo(idNo)) {
      //   throw new Error('身份证号格式不符合要求！');
      // }
      return true;
    } catch (e) {
      Toast.show(String(e));
      return false;
    }
  }

  confirmAppoint() {
    if (this.state.selectedType.value === '1') { // 无卡预约
      if (this.formRef.validate()) this.doSave();
    } else if (this.validate()) { // 有卡预约
      this.doSave();
    }
  }

  async doSave() {
    const {
      screenProps: { showLoading, hideLoading, resetBackNavigate },
      navigation: { state: { params, params: { data, backIndex } } },
      currProfile = {},
      currHospital: { id: hosId, no: hosNo, name: hosName },
      user: { id: terminalUser },
    } = this.props;
    const { selectedType: { value: type }, formValue } = this.state;
    const { id: proId, no: proNo, name: proName, cardNo, cardType, mobile, idNo, gender } = type === '0' ? currProfile : formValue;

    showLoading();
    try {
      const cond = {
        ...data,
        hosId,
        hosNo,
        hosName,
        proId,
        proNo,
        proName,
        cardNo,
        cardType,
        mobile,
        idNo,
        terminalUser,
        gender,
        appCode: Global.Config.appCode,
        appType: Global.Config.appType,
        hisUser: Global.hisUser,
      };
      const { success, msg } = await forReserve(cond);

      if (success) {
        resetBackNavigate(
          backIndex || 0, 'AppointSuccess',
          {
            ...params,
            title: '预约成功',
            showCurrHospitalAndPatient: true,
            allowSwitchHospital: false,
            allowSwitchPatient: false,
            afterChooseHospital: null,
            afterChoosePatient: null,
            hideNavBarBottomLine: false,
            type,
          },
        );
      } else {
        Toast.show(`错误：${msg}`);
      }
    } catch (e) {
      this.handleRequestException(e);
    }
    hideLoading();
  }

  render() {
    const { doRenderScene, typeData, selectedType, formValue } = this.state;
    const { currProfile = {}, currHospital = {}, navigation: { state: { params: { data } } } } = this.props;

    if (!doRenderScene) return <PlaceholderView />; // 场景过渡动画未完成前，先渲染过渡场景

    return (
      <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false}>
        <KeyboardAwareScrollView
          style={[Global.styles.CONTAINER_BG, { paddingTop: 10 }]}
          keyboardShouldPersistTaps="always"
          extraHeight={220}
        >
          <AppointInfo data={data} style={styles.appointInfo} currHospital={currHospital} />
          <View style={styles.container}>
            <Radios
              data={typeData}
              value={selectedType.value}
              onSelect={obj => this.setState({ selectedType: obj })}
              radiosContainerStyle={styles.radiosContainer}
              radioContainerStyle={styles.radioContainer}
            />
            {
              selectedType.value === '0' ?
                <View>
                  <View style={styles.row}>
                    <Text style={styles.labelText}>患者姓名</Text>
                    <Text style={styles.contentText}>{currProfile.name}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.labelText}>手机号</Text>
                    <Text style={styles.contentText}>{currProfile.mobile}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.labelText}>身份证号</Text>
                    <Text style={styles.contentText}>{currProfile.idNo}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.labelText}>就诊卡号</Text>
                    <Text style={styles.contentText}>{currProfile.no}</Text>
                  </View>
                </View> :
                <Form
                  config={formConfig}
                  ref={(ref) => { this.formRef = ref; }}
                  onChange={this.onChange}
                  value={formValue}
                  showLabel
                >
                  <Form.TextInput
                    label="患者姓名"
                    name="name"
                    dataType="string"
                    placeholder="请输入患者姓名"
                    autoFocus
                    required
                  />
                  <Form.TextInput
                    label="手机号"
                    name="mobile"
                    dataType="mobile"
                    placeholder="请输入手机号"
                    required
                  />
                  <Form.TextInput
                    label="身份证号"
                    name="idNo"
                    dataType="cnIdNo"
                    placeholder="请输入身份证号"
                    maxLength={18}
                    minLength={15}
                    required
                  />
                </Form>
            }
          </View>
          <Button
            text="确定预约"
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={this.confirmAppoint}
          />
          <ViewText text="实名制预约挂号，就诊人信息不符将无法取号" textStyle={styles.infoText2} />
          <ViewText text="停诊将短信通知，请保持手机畅通" textStyle={styles.infoText1} />
          <ViewText text="预约挂号费由医院自行设定，平台不收取任何额外费用" style={styles.info} textStyle={styles.infoText1} />
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  appointInfo: {
    marginBottom: 10,
  },
  button: {
    flex: 0,
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 15,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
  },
  infoText1: {
    fontSize: 11,
    color: Global.colors.FONT_GRAY,
  },
  infoText2: {
    fontSize: 11,
    color: Global.colors.ORANGE,
  },
  info: {
    marginBottom: 25, // 解决安卓上滚动显示不全
  },
  container: {
    flex: 0,
    flexDirection: 'column',
    paddingTop: 5,
    paddingBottom: 15,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    marginLeft: 10,
    height: formRowHeight,
    borderWidth: Global.lineWidth,
    borderColor: 'transparent',
    marginTop: 5,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 13,
    marginLeft: 5,
    color: Global.colors.FONT_GRAY,
    width: 80,
  },
  contentText: {
    fontSize: 13,
  },
  radiosContainer: {
    marginTop: 5,
    marginHorizontal: 10,
  },
  radioContainer: {
    height: formRowHeight,
  },
});

const mapStateToProps = state => ({
  currPatient: state.base.currPatient,
  currProfile: state.base.currProfile,
  currHospital: state.base.currHospital,
  nav: state.nav,
  user: state.auth.user,
});

export default connect(mapStateToProps)(Appoint);
