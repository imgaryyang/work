/**
 * IOS、Android均可使用的Loading
 */

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import Global from '../Global';

class Loading extends Component {
  static displayName = 'Loading';
  static description = '载入遮罩';

  render() {
    const spinnerObj = <ActivityIndicator />;
    const topPos = this.props.visible ? 0 : Global.getScreen().height;
    return (
      <View style={[styles.container, Global.styles.CENTER, { top: topPos }]}>
        <View style={[styles.spinnerHolder, Global.styles.CENTER]}>
          {spinnerObj}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Global.getScreen().width,
    height: Global.getScreen().height,
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, .25)',
    overflow: 'hidden',
  },

  spinnerHolder: {
    top: -50,
    backgroundColor: 'rgba(0, 0, 0, .35)',
    borderRadius: 6,
    width: 50,
    height: 50,
  },
});

Loading.propTypes = {
  visible: PropTypes.bool,
};

Loading.defaultProps = {
  visible: false,
};

export default Loading;
