/** 复选框
 * onCheck:选中后回调的方法
 * onUncheck：取消选中后回调的方法
 * checked : true | flase 初始状态
 * style : 添加样式
 * color : 选中时颜色
 * bgcolor:复选框背景颜色
 * iconSize ： 复选框内图标大小 可选nomal | small | large
 * size : 复选框大小,数字,自定义
 * refresh
 * ———————————————————————————————————————————
 * Author : 39Er
 * 简单实现，有问题再优化~^o^~
 **/
import React, { Component } from 'react';

import {
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import Icon from 'rn-easy-icon';
import Global from '../Global';

class Checkbox extends Component {
  // 限制属性类型
  static propTypes = {
    size: PropTypes.number,
    checkedColor: PropTypes.string,
    uncheckedColor: PropTypes.string,
    iconSize: PropTypes.string,
    checked: PropTypes.bool,
  };

  static defaultProps = {
    size: 30,
    checkedColor: Global.colors.IOS_BLUE,
    uncheckedColor: Global.colors.FONT_LIGHT_GRAY,
    iconSize: 'normal',
    checked: false,
  };

  getIconSize() {
    if (this.props.iconSize === 'small') {
      return this.props.size * 0.7;
    } else if (this.props.iconSize === 'normal') {
      return this.props.size * 0.8;
    } else if (this.props.iconSize === 'large') {
      return this.props.size * 0.9;
    } else {
      return this.props.size * 0.8;
    }
  }

  completeProgress() {
    if (this.props.onPress !== null && typeof this.props.onPress === 'function') {
      this.props.onPress();
    }
  }

  render() {
    const icon = this.props.checked ? (
      <Icon
        name="ios-checkbox-outline"
        size={this.getIconSize()}
        width={this.getIconSize()}
        height={this.getIconSize()}
        color={this.props.checkedColor}
        // style={[this.getIconStyle()]}
      />
    ) : (
      <Icon
        name="ios-square-outline"
        size={this.getIconSize()}
        width={this.getIconSize()}
        height={this.getIconSize()}
        color={this.props.uncheckedColor}
        // style={[this.getIconStyle()]}
      />
    );
    return (
      <TouchableOpacity style={[this.props.style]} onPress={() => this.completeProgress()}>
        {icon}
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

module.exports = Checkbox;
