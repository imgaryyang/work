/**
 * 调用扫一扫的按钮
 */

import React, { Component } from 'react';
import {
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import Toast from 'react-native-root-toast';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';

import Global from '../../Global';

class ScannerButton extends Component {
  static displayName = 'ScannerButton';
  static description = '调用扫一扫的按钮';

  static SCAN_FUNC_BARCODE = 'SCAN_FUNC_BARCODE'; // 扫功能条码
  static SCAN_TEST_BARCODE = 'SCAN_TEST_BARCODE'; // 扫检验条码
  static SCAN_INFUSION_BARCODE = 'SCAN_INFUSION_BARCODE'; // 扫输液条码
  static SCAN_WRISTBAND = 'SCAN_WRISTBAND'; // 扫腕带
  static SCAN_WRISTBAND_EXEC = 'SCAN_WRISTBAND_EXEC'; // 扫腕带执行

  constructor(props) {
    super(props);
    this.onScanFuncBarcodeSuccess = this.onScanFuncBarcodeSuccess.bind(this);
    this.onScanTestBarcodeSuccess = this.onScanTestBarcodeSuccess.bind(this);
    this.onScanInfusionBarcodeSuccess = this.onScanInfusionBarcodeSuccess.bind(this);
    this.onScanWristbandSuccess = this.onScanWristbandSuccess.bind(this);
    this.onScanWristbandExecSuccess = this.onScanWristbandExecSuccess.bind(this);
  }

  state = {
  };

  onScanFuncBarcodeSuccess(barcode) {
    // console.log('------ onScanFuncBarcodeSuccess:', barcode, this.props);
    if (barcode) {
      const { screenProps } = this.props;
      const { resetBackNavigate } = screenProps;
      const bizType = Global.Config.global.funcBarcodeRule(barcode);
      // console.log('bizType:', bizType);
      if (bizType && bizType.type === 'test') {
        resetBackNavigate(0, 'LabTestExec', { barcode });
      } else if (bizType && bizType.type === 'infusion') {
        resetBackNavigate(0, 'InfusionExec', { barcode });
      } else {
        Toast.show(`无法识别的功能条码:${barcode}`);
      }
    }
  }
  onScanTestBarcodeSuccess(barcode) {
    this.props.onSuccess(barcode);
  }
  onScanInfusionBarcodeSuccess(barcode) {
    this.props.onSuccess(barcode);
  }
  onScanWristbandSuccess(barcode) {
    // 变更当前患者
    const patient = this.props.screenProps.setCurrPatient(barcode);
    // 回调
    if (patient) this.props.onSuccess(barcode);
  }
  onScanWristbandExecSuccess(barcode) {
    this.props.onSuccess(barcode);
  }

  services = {
    SCAN_FUNC_BARCODE: { buttonText: '扫一扫', title: '扫描功能条码', onSuccess: barcode => this.onScanFuncBarcodeSuccess(barcode), shouldGoBack: false },
    SCAN_TEST_BARCODE: { buttonText: '扫LIS条码', title: '扫描LIS条码', onSuccess: barcode => this.onScanTestBarcodeSuccess(barcode), shouldGoBack: true },
    SCAN_INFUSION_BARCODE: { buttonText: '扫输液条码', title: '扫描输液条码', onSuccess: barcode => this.onScanInfusionBarcodeSuccess(barcode), shouldGoBack: true },
    SCAN_WRISTBAND: { buttonText: '扫腕带', title: '扫描腕带', onSuccess: barcode => this.onScanWristbandSuccess(barcode), shouldGoBack: true },
    SCAN_WRISTBAND_EXEC: { buttonText: '扫腕带执行', title: '扫描腕带', onSuccess: barcode => this.onScanWristbandExecSuccess(barcode), shouldGoBack: true },
  }

  render() {
    const { type, buttonText } = this.props;
    const service = this.services[type];
    const buttonStyle = type === ScannerButton.SCAN_WRISTBAND_EXEC ? 'normal' : 'navbar';
    const buttonProps = buttonStyle === 'navbar' ? {
      clear: true,
      style: { flexDirection: 'row', paddingRight: 10 },
    } : {
      clear: true,
      style: { flexDirection: 'row' },
    };
    let fontColor = type === ScannerButton.SCAN_WRISTBAND_EXEC ? Global.colors.IOS_BLUE : Global.colors.FONT_GRAY;
    if (this.props.disabled === true) fontColor = Global.colors.FONT_LIGHT_GRAY1;
    return (
      <Button
        onPress={() => {
          if (!this.props.disabled) {
            this.props.navigation.navigate('Scanner', {
              title: service.title,
              onSuccess: service.onSuccess,
              shouldGoBack: service.shouldGoBack,
            });
          }
        }}
        {...buttonProps}
        disabled={this.props.disabled === true}
      >
        <Icon name="md-qr-scanner" color={fontColor} />
        <Text style={{ color: fontColor }} >{ buttonText || service.buttonText }</Text>
      </Button>
    );
  }
}

ScannerButton.propTypes = {
  /**
   * biz type
   */
  type: PropTypes.string.isRequired,

  /**
   * 扫描成功回调
   */
  onSuccess: PropTypes.func,

  /**
   * navigation
   */
  navigation: PropTypes.object.isRequired,

  /**
   * screenProps
   */
  screenProps: PropTypes.object,

  /**
   * 按钮类型
   * navbar - 导航栏按钮
   * normal - 正常
   */
  // buttonStyle: PropTypes.string,

  /**
   * 按钮文字
   */
  buttonText: PropTypes.string,

  /**
   * 按钮是否可用
   */
  disabled: PropTypes.bool,
};

ScannerButton.defaultProps = {
  // buttonStyle: 'navbar',
  buttonText: null,
  onSuccess: () => {},
  screenProps: null,
  disabled: false,
};

export default ScannerButton;
