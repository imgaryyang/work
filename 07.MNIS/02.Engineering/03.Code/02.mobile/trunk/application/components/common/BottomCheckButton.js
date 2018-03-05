/**
 * 显示当前患者信息
 */

import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';
import Global from '../../Global';

class BottomGenericButton extends Component {
  static displayName = 'BottomGenericButton';
  static description = '底端通用按钮';

  render() {
    const fontColor = this.props.disabled === true ? Global.colors.FONT_LIGHT_GRAY1 : Global.colors.IOS_BLUE;
    return (
      <Button
        clear
        style={{ flexDirection: 'row' }}
        onPress={() => {
          if (this.props.disabled !== true) this.props.onPress();
        }}
      >
        <Icon iconLib={this.props.iconLib} name={this.props.iconName} color={fontColor} />
        <Text style={{ color: fontColor }} >{this.props.text}</Text>
      </Button>
    );
  }
}

BottomGenericButton.propTypes = {
  text: PropTypes.string,
  iconLib: PropTypes.string,
  iconName: PropTypes.string,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
};

BottomGenericButton.defaultProps = {
  text: '审核',
  iconLib: 'ii',
  iconName: 'md-checkmark',
  onPress: () => {},
  disabled: false,
};

export default BottomGenericButton;
