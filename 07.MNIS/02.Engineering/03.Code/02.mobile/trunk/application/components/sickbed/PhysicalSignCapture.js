/**
 * 体征录入
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import SafeView from 'react-native-safe-area-view';
import Card from 'rn-easy-card';
import Sep from 'rn-easy-separator';
import Picker from 'rn-easy-picker';
// import Icon from 'rn-easy-icon';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Global from '../../Global';
import PatientInfo from '../common/PatientInfo';
import ScannerButton from '../common/ScannerButton';
import BackButton from '../common/BottomBackButton';
import GenericButton from '../common/BottomGenericButton';

import Form from '../../modules/form/EasyForm';
import FormConfig from '../common/LineInputsConfig';
import { setCurrPatient } from '../../actions/base/BaseAction';

const dismissKeyboard = require('dismissKeyboard');

class PhysicalSignCapture extends Component {
  static displayName = 'PhysicalSignCapture';
  static description = '体征录入';

  constructor(props) {
    super(props);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);
    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.renderPlaceholderView = this.renderPlaceholderView.bind(this);
    this.onMainScanSuccess = this.onMainScanSuccess.bind(this);
    // this.onScanWristbandExec = this.onScanWristbandExec.bind(this);
    this.onSave = this.onSave.bind(this);
    this.getBottomBar = this.getBottomBar.bind(this);
  }

  state = {
    doRenderScene: false,
    // currPatient: Object.assign({}, this.props.base.currPatient),
    value1: {
      recordTime: moment(new Date()).format('YYYY-MM-DD hh:mm'),
    },
    temperatureType: '腋下',
    minimality: false,
  };

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
    this.props.navigation.setParams({ onMainScanSuccess: this.onMainScanSuccess });
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  /**
   * 主操作扫描完成回调
   */
  onMainScanSuccess(/* barcode*/) {
    this.setState({
      value1: {
        recordTime: moment(new Date()).format('YYYY-MM-DD hh:mm'),
      },
      value2: null,
      value3: null,
      value4: null,
    });
  }

  /**
   * 扫腕带执行回调
   */
  // onScanWristbandExec(barcode) {
  //   // TODO:扫腕带执行业务逻辑
  //   Toast.show(`onScanWristbandExec:${barcode}`);
  // }

  onSave() {
    Toast.show('体征录入成功');
    this.props.navigation.goBack();
  }

  getBottomBar() {
    return (
      <View style={Global.styles.FIXED_BOTTOM_BTN_CONTAINER} >
        <BackButton />
        <GenericButton onPress={this.onSave} disabled={this.props.base.currPatient === null} />
      </View>
    );
  }

  keyboardDidShow() {
    this.setState({ minimality: true });
  }

  keyboardDidHide() {
    this.setState({ minimality: false });
  }

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} >
        <SafeView style={Global.styles.SAFE_VIEW} >
          <Card style={{ height: 120 }} />
          <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
          <Card noPadding style={[Global.styles.CENTER, { flex: 1 }]} >
            <ActivityIndicator />
          </Card>
          <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
          {this.getBottomBar()}
        </SafeView>
      </View>
    );
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return this.renderPlaceholderView();
    }
    const temperatureType = [
      { label: '腋下', value: 'axillary' },
      { label: '口腔', value: 'oral' },
      { label: '肛门', value: 'rectal' },
    ];
    // console.log(this.state.value1, this.state.value2, this.state.value3, this.state.value4);
    return (
      <View style={Global.styles.CONTAINER} >
        <SafeView style={Global.styles.SAFE_VIEW} >
          <PatientInfo minimality={this.state.minimality} />
          <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
          <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
            <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
              <Form
                ref={(c) => { this.form1 = c; }}
                config={FormConfig}
                showLabel
                onChange={(fieldName, fieldValue, formValue) => {
                  this.setState({ value1: formValue });
                }}
                value={this.state.value1}
              >
                <Form.Date name="recordTime" label="记录时间:" placeholder="请选择记录时间" mode="datetime" />
                <View style={{ flexDirection: 'row' }} >
                  <TouchableOpacity
                    style={styles.temperatureContainer}
                    onPress={() => this.temperatureTypePicker.toggle()}
                  >
                    <Text style={styles.temperatureLabel} >体温测量位置: </Text>
                    <Text style={styles.temperatureType} >{this.state.temperatureType}</Text>
                    <Icon name="keyboard-arrow-down" color={Global.colors.IOS_BLUE} size={12} />
                    <Picker
                      ref={(c) => { this.temperatureTypePicker = c; }}
                      dataSource={temperatureType}
                      selected={this.state.temperatureType}
                      onChange={(selected) => {
                        this.setState({
                          temperatureType: selected ? selected.label : null,
                        });
                      }}
                      center
                    />
                  </TouchableOpacity>
                </View>
                <Form.TextInput name="temperature" label="体温:" dataType="number" placeholder="请输入体温" buttonText={'\u2103'} />
                <Form.TextInput name="temperatureDown" label="降温后:" dataType="number" placeholder="请输入降温后体温" buttonText={'\u2103'} />
                <Form.TextInput name="heartRate" label="心率:" dataType="number" placeholder="请输入心率" buttonText="次/分" />
                <Form.TextInput name="pulse" label="脉搏:" dataType="number" placeholder="请输入脉搏次数" buttonText="次" />
                <Form.TextInput name="breathe" label="呼吸:" dataType="number" placeholder="请输入呼吸次数" buttonText="次/分" />
                <Form.TextInput name="bloodPressureH" label="血压(高):" dataType="number" placeholder="请输入收缩压" buttonText="mmHg" />
                <Form.TextInput name="bloodPressureL" label="血压(低):" dataType="number" placeholder="请输入舒张压" buttonText="mmHg" />
                <Form.TextInput name="stool" label="大便:" dataType="number" placeholder="请输入大便次数" buttonText="次" />
                <Form.TextInput name="urineVolume" label="尿量:" dataType="number" placeholder="请输入尿量" buttonText="ml" />
                <Form.TextInput name="infusion" label="输液量:" dataType="number" placeholder="请输入输液量" buttonText="次" />
                <Form.TextInput name="painScore" label="疼痛评分:" dataType="number" placeholder="请输入疼痛评分" />
                <Form.TextInput name="weight" label="体重:" dataType="number" placeholder="请输入体重" buttonText="Kg" buttonStyle={{ textAlign: 'right' }} />
              </Form>
            </KeyboardAwareScrollView>
          </TouchableWithoutFeedback>
          <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
          {this.getBottomBar()}
        </SafeView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    borderTopColor: Global.colors.LINE,
    borderTopWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
    borderBottomWidth: 1 / Global.pixelRatio,
  },
  labelContainer: {
    width: 90,
    paddingLeft: 5,
    borderBottomColor: '#c8c7cc',
    borderBottomWidth: 1 / Global.pixelRatio,
    alignItems: 'center',
    flexDirection: 'row',
  },
  label: {
    // lineHeight: 50,
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  unitContainer: {
    width: 30,
    paddingLeft: 5,
    borderBottomColor: '#c8c7cc',
    borderBottomWidth: 1 / Global.pixelRatio,
    alignItems: 'center',
    flexDirection: 'row',
  },
  unit: {
    flex: 1,
    // lineHeight: 50,
    fontSize: 12,
    color: Global.colors.IOS_BLUE,
    textAlign: 'center',
  },

  temperatureContainer: {
    paddingLeft: 5,
    paddingTop: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  temperatureLabel: {
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
  },
  temperatureType: {
    fontSize: 12,
    color: Global.colors.IOS_BLUE,
  },

  inputContainer: {
    flex: 1,
    borderBottomColor: '#c8c7cc',
    borderBottomWidth: 1 / Global.pixelRatio,
  },
  input: {
    ...FormConfig.fields.textInput.style,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
});

PhysicalSignCapture.navigationOptions = ({ navigation, screenProps }) => {
  return {
    headerTitle: '体征录入',
    headerRight: (
      <ScannerButton
        type={ScannerButton.SCAN_WRISTBAND}
        navigation={navigation}
        screenProps={screenProps}
        onSuccess={navigation.state.params ? navigation.state.params.onMainScanSuccess : null}
      />
    ),
  };
};

const mapStateToProps = state => ({
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  setCurrPatient: patient => dispatch(setCurrPatient(patient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PhysicalSignCapture);
