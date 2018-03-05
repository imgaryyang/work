/**
 * 显示当前患者信息
 */

import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';
import Global from '../../Global';

class BottomBackButton extends Component {
  static displayName = 'BottomBackButton';
  static description = '底端后退按钮';

  render() {
    return (
      <Button clear style={{ flexDirection: 'row' }} onPress={() => { this.props.goBack(); }} >
        <Icon name="md-arrow-round-back" color={Global.colors.IOS_BLUE} />
        <Text style={{ color: Global.colors.IOS_BLUE }} >返回</Text>
      </Button>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  goBack: () => dispatch(NavigationActions.back()),
});

export default connect(null, mapDispatchToProps)(BottomBackButton);
