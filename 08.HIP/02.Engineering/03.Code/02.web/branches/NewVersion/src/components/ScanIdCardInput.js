import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Input, Button, notification } from 'antd';
import _ from 'lodash';
import { testCnIdNo } from '../utils/validation';

class ScanIdCardInput extends Component {
  static propTypes = {
    /**
     * 是否只显示icon
     */
    iconOnly: PropTypes.bool,

    /**
     * 读取后回调方法
     */
    readed: PropTypes.func,
    /**
     * 判断是否查询
     */
    isSearch: PropTypes.bool,

    /**
     * 是否随机返回一个卡号，测试用
      random: PropTypes.bool,
     */
  };

  static defaultProps = {
    iconOnly: false,
    isSearch: true,
  };

  constructor(props) {
    super(props);
    this.read = this.read.bind(this);
    this.readed = this.readed.bind(this);
    this.onPressEnter = this.onPressEnter.bind(this);
  }
  componentWillReceiveProps(newProps) {
    if (this.props.utils.patient.id !== newProps.utils.patient.id) {
      this.setState({ patient: newProps.utils.patient });
    }
  }

  onPressEnter() {
    const inputValue = this.refs.scanIdCardInput.props.value;
    const valid = testCnIdNo(inputValue);
    if (valid) {
      // TODO 身份证信息处理
      // const patient = this.conversionIdNo(inputValue);
      // this.props.readed(patient);
      if (this.props.isSearch) {
        this.props.dispatch({
          type: 'utils/loadPatientInfoByIdNo',
          idNo: inputValue,
        });
      }
    }
  }

  getStatus() {
    const CertCtl = document.getElementById('CertCtl');
    return CertCtl.getStatus();
  }

  /*
  通过身份证分离出性别和出生日期
  */
  conversionIdNo(idNo) {
    let patient = {};
    let sex = '';
    let birth = '';
    if (idNo.length === 18) {
      const sexFlag = idNo.substring(16, 17);
      if (sexFlag % 2 === 0) {
        sex = '2';
      } else {
        sex = '1';
      }
      birth = `${idNo.substring(6, 10)}-${idNo.substring(10, 12)}-${idNo.substring(12, 14)}`;
    } else if (idNo.length === 15) {
      birth = `19${idNo.substring(6, 8)}-${idNo.substring(8, 10)}-${idNo.substring(10, 12)}`;
    }
    patient = {
      idNo,
      sex,
      birthday: birth,
    };
    return patient;
  }

  connect() {
    const CertCtl = document.getElementById('CertCtl');
    CertCtl.connect();
  }

  toJson(str) {
    return eval(`(${str})`);
  }

  readCert() {
    let patient = {};
    this.connect();
    const status = this.getStatus();
    const statusObj = this.toJson(status);
    if (statusObj !== null && statusObj.resultFlag === 0) { // 读卡设备已接入
      const CertCtl = document.getElementById('CertCtl');
      const result = CertCtl.readCert();
      const resultObj = this.toJson(result);
      if (resultObj && resultObj.errorMsg === '') { // 成功读卡
        patient = {
          idNo: resultObj.resultContent.certNumber,
          name: resultObj.resultContent.partyName,
          sex: `${resultObj.resultContent.gender}`,
          birthday: resultObj.resultContent.bornDay,
          idAddress: resultObj.resultContent.certAddress,
          identityPic: `data:image/jpeg;base64,${resultObj.resultContent.identityPic}`,
          nationality: '86',
          nation: resultObj.resultContent.nation,
        };
        return patient;
      } else {
        notification.warn({
          message: '提示!',
          description: '请先将身份证放在读卡器上再进行读卡！',
        });
      }
      return '';
    } else {
      notification.warning({
        message: '错误!',
        description: '请安装驱动并接入读卡器后重试！',
      });
    }
  }

  readed() {
    if (typeof this.props.readed === 'function') {
      const patient = this.readCert();
      this.props.readed(patient);
      return patient;
    }
  }

  read() {
    const patient = this.readed();
    if (patient && this.props.isSearch) {
      this.props.dispatch({
        type: 'utils/loadPatientInfoByIdNo',
        idNo: patient.idNo,
      });
    }
  }

  render() {
    const { iconOnly } = this.props;
    const rest = _.omit(this.props, ['iconOnly', 'dispatch', 'readed', 'random', 'onPressEnter', 'utils']);

    const button = iconOnly ? (
      <Button icon="scan" size="small" onClick={this.read} />
    ) : (
      <Button icon="scan" size="small" onClick={this.read} >读身份证</Button>
    );
    return (
      <Input ref="scanIdCardInput" addonAfter={button} onPressEnter={this.onPressEnter} {...rest} maxLength={18} />
    );
  }
}

export default connect(
  ({ utils }) => ({ utils }),
)(ScanIdCardInput);

