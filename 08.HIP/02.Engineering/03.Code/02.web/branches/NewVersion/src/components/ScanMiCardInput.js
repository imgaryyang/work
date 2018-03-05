import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Input, Button } from 'antd';
import _ from 'lodash';
import { getRandomNum } from '../utils/randomTool';

class ScanMiCardInput extends Component {
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
  }

  tmpPatients = [{
    id: '402a4ed15b769e0c015b76afc9500000',
    hosId: 'H31AAAA001',
    createTime: '2017-04-16 20:14:43',
    createOper: '风晴雪',
    createOperId: '402a53455a8e71eb015a8e71eb110000',
    updateTime: '2017-04-16 20:14:43',
    updateOper: '风晴雪',
    updateOperId: '402a53455a8e71eb015a8e71eb110000',
    patientId: 'P0000000000035',
    medicalCardNo: null,
    miCardNo: '5618482391',
    idNo: '532503200007075100',
    name: '窦淑君',
    alias: null,
    sex: '2',
    birthday: '2000-07-07 00:00:00.0',
    idAddress: '云南省红河蒙自市',
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

  readed() {
    if (typeof this.props.readed === 'function') {
      if (this.props.random) {
        this.props.readed({
          miCardNo: getRandomNum(10),
        });
      } else {
        this.props.readed(this.tmpPatients[0]);
      }
    }
  }

  read() {
    // TODO: 读医保卡
    this.readed();
  }

  render() {
    const { iconOnly } = this.props;
    const other = _.omit(this.props, ['iconOnly', 'dispatch', 'readed', 'random']);
    const button = iconOnly ? (
      <Button icon="scan" size="small" onClick={this.read} />
    ) : (
      <Button icon="scan" size="small" onClick={this.read} >读医保卡</Button>
    );
    return (
      <Input addonAfter={button} {...other} />
    );
  }
}

export default connect()(ScanMiCardInput);

