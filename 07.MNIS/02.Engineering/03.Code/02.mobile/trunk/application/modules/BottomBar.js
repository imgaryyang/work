import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';

import Global from '../Global';

// iPhone X 额外需要添加的高度
const appendHeight = DeviceInfo.getModel() === 'iPhone X' ? 21 : 0;
const duration = 80;

class BottomBar extends PureComponent {
  constructor(props) {
    super(props);
    this.showBottomBar = this.showBottomBar.bind(this);
    this.hideBottomBar = this.hideBottomBar.bind(this);
  }

  state = {
    barHeight: new Animated.Value(this.props.visible ? (44 + appendHeight) : 0),
    paddingBottom: new Animated.Value(this.props.visible ? appendHeight : 0),
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      if (nextProps.visible) this.showBottomBar();
      else this.hideBottomBar();
    }
  }

  showBottomBar() {
    Animated.timing(
      this.state.barHeight,
      {
        toValue: 44 + appendHeight,
        duration,
      },
    ).start();
    if (appendHeight > 0) {
      Animated.timing(
        this.state.paddingBottom,
        {
          toValue: appendHeight,
          duration,
        },
      ).start();
    }
  }

  hideBottomBar() {
    Animated.timing(
      this.state.barHeight,
      {
        toValue: 0,
        duration: 100,
      },
    ).start();
    if (appendHeight > 0) {
      Animated.timing(
        this.state.paddingBottom,
        {
          toValue: 0,
          duration,
        },
      ).start();
    }
  }

  render() {
    return (
      <Animated.View style={[styles.bar, { height: this.state.barHeight, paddingBottom: this.state.paddingBottom }]} >
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  bar: {
    width: Global.getScreen().width,
    borderTopWidth: 1 / Global.pixelRatio,
    borderTopColor: Global.colors.IOS_NAV_LINE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: Global.colors.IOS_NAV_BG,
  },
})

BottomBar.propTypes = {
  /**
   * 滑动操作的按钮
   */
  visible: PropTypes.bool,
};

BottomBar.defaultProps = {
  visible: false,
};

export default BottomBar;
