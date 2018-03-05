import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Input, Button } from 'antd';
import _ from 'lodash';
import { getRandomNum } from '../utils/randomTool';

class ScanMedicalCardInput extends Component {

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
     * 是否随机返回一个卡号，测试用
     */
    random: PropTypes.bool,
  };

  static defaultProps = {
    iconOnly: false,
    random: false,
  };

  constructor(props) {
    super(props);

    this.read = this.read.bind(this);
    this.readed = this.readed.bind(this);
    this.onPressEnter = this.onPressEnter.bind(this);
  }

  /* state = {
    patientId: '',
    patient: {},
  };*/

  componentWillReceiveProps(newProps) {
    // console.log('newProps:', newProps);
    if (this.props.utils.patient.id !== newProps.utils.patient.id) {
      // console.log(newProps.utils.patient);
      this.setState({ patient: newProps.utils.patient }, () => {
        this.readed(newProps.utils.patient);
      });
    }
  }

  onPressEnter() {
    this.read();
  }

  tmpPatients = [{
    id: '402a4ed15b66a7f8015b66aa6fe30001',
    hosId: 'H31AAAA001',
    createTime: '2017-04-13 17:34:57',
    createOper: '风晴雪',
    createOperId: '402a53455a8e71eb015a8e71eb110000',
    updateTime: '2017-04-13 17:34:57',
    updateOper: '风晴雪',
    updateOperId: '402a53455a8e71eb015a8e71eb110000',
    patientId: 'P0000000000031',
    medicalCardNo: '8178413845',
    miCardNo: null,
    idNo: '532326199409087321',
    name: '酆春齐',
    alias: null,
    sex: '1',
    birthday: '1994-09-08 00:00:00.0',
    idAddress: '云南省楚雄大姚县',
    nationality: '86',
    nation: '01',
    province: null,
    city: null,
    area: null,
    linkAddress: null,
    othDetail: null,
    mobile: '13886868686',
    wechat: null,
    qq: null,
    eMail: null,
    linkRelation: null,
    linkName: null,
    linkIdNo: null,
    linkTel: null,
    infoSource: '2',
  }, {
    id: '402a4ed15b66a7f8015b66aae8e40003',
    hosId: 'H31AAAA001',
    createTime: '2017-04-13 17:35:28',
    createOper: '风晴雪',
    createOperId: '402a53455a8e71eb015a8e71eb110000',
    updateTime: '2017-04-13 17:35:28',
    updateOper: '风晴雪',
    updateOperId: '402a53455a8e71eb015a8e71eb110000',
    patientId: 'P0000000000033',
    medicalCardNo: '3326090436',
    miCardNo: null,
    idNo: '530102200112235559',
    name: '吕清妍',
    alias: null,
    sex: '1',
    birthday: '2001-12-23 00:00:00.0',
    idAddress: '云南省昆明市五华区',
    nationality: '86',
    nation: '01',
    province: null,
    city: null,
    area: null,
    linkAddress: null,
    othDetail: null,
    mobile: null,
    wechat: null,
    qq: null,
    eMail: null,
    linkRelation: null,
    linkName: null,
    linkIdNo: null,
    linkTel: null,
    infoSource: '2',
  }, {
    id: '402a4ed15b66b66c015b66b7a52b0000',
    hosId: 'H31AAAA001',
    createTime: '2017-04-13 17:49:22',
    createOper: '风晴雪',
    createOperId: '402a53455a8e71eb015a8e71eb110000',
    updateTime: '2017-04-13 17:49:22',
    updateOper: '风晴雪',
    updateOperId: '402a53455a8e71eb015a8e71eb110000',
    patientId: 'P0000000000034',
    medicalCardNo: '1059107851',
    miCardNo: null,
    idNo: '53322219930921467X',
    name: '方佳毅',
    alias: null,
    sex: '1',
    birthday: '1993-09-21 00:00:00.0',
    idAddress: '云南省丽江永胜县',
    nationality: '86',
    nation: '01',
    province: null,
    city: null,
    area: null,
    linkAddress: null,
    othDetail: null,
    mobile: null,
    wechat: null,
    qq: null,
    eMail: null,
    linkRelation: null,
    linkName: null,
    linkIdNo: null,
    linkTel: null,
    infoSource: '2',
  }];

  /**
   * 读卡完毕回调
   */
  readed() {
    if (typeof this.props.readed === 'function') {
      // 测试模式，传入random属性模拟读卡，返回随机卡号
      if (this.props.random) {
        // console.log('random return.');
        this.props.readed({
          medicalCardNo: getRandomNum(10),
        });
      } else {
        // console.log('call readed():', this.state.patient);
        this.props.readed(this.state.patient);
      }
    }
  }

  /**
   * 读卡
   */
  read() {
    if (this.props.random) {
      this.readed();
      return;
    }
    const inputValue = this.refs.scanMedicalCardInput.props.value;
    // console.log('inputValue:', inputValue);
    if (inputValue) {
      this.props.dispatch({
        type: 'utils/loadPatientInfoByPatientId',
        patientId: inputValue,
      });
    } else {
      // 模拟读卡，返回固定患者信息
      this.setState({ patient: this.tmpPatients[0] }, () => {
        // TODO: 读诊疗卡
        this.readed();
      });
    }
  }

  // randomRef = `M${getRandomNum(20)}`;

  render() {
    const { iconOnly } = this.props;
    const rest = _.omit(this.props, ['iconOnly', 'dispatch', 'readed', 'random', 'onPressEnter', 'utils']);
    const button = iconOnly ? (
      <Button icon="scan" size="small" onClick={this.read} />
    ) : (
      <Button icon="scan" size="small" onClick={this.read} >读诊疗卡</Button>
    );
    return (
      <Input ref="scanMedicalCardInput" addonAfter={button} onPressEnter={this.onPressEnter} {...rest} maxLength={20} />
    );
  }
}

export default connect(
  ({ utils }) => ({ utils }),
)(ScanMedicalCardInput);
