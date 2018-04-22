import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Input, Button } from 'antd';
import _ from 'lodash';
import { getRandomName, getRandomIdCard } from '../utils/randomTool';

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
  };

  static defaultProps = {
    iconOnly: false,
  };

  constructor(props) {
    super(props);

    this.read = this.read.bind(this);
    this.readed = this.readed.bind(this);
  }

  readed() {
    if (typeof this.props.readed === 'function') {
      const idCard = getRandomIdCard();
      const randomGenderIdx = parseInt(2 * Math.random(), 10);
      this.props.readed({
        ...idCard,
        name: getRandomName(),
        sex: ['1', '2'][randomGenderIdx],
        nationality: '86',
        nation: '01',
      });
    }
  }

  read() {
    // TODO: 读身份证
    this.readed();
  }

  render() {
    const { iconOnly } = this.props; // 获取属性
    const other = _.omit(this.props, ['iconOnly', 'dispatch', 'readed']); // 反向获取属性

    const button = iconOnly ? (
      <Button icon="scan" size="small" onClick={this.read} />
    ) : (
      <Button icon="scan" size="small" onClick={this.read} >读身份证</Button>
    );
    return (
      <Input addonAfter={button} {...other} />
    );
  }
}

export default connect()(ScanIdCardInput);

