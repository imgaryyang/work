/**
 * 扫一扫
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text,
  // TouchableOpacity,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

import Global from '../../Global';

const effSize = Global.device.isTablet() ? 360 : 240;

class BarcodeScanner extends Component {
  static displayName = 'BarcodeScanner';
  static description = '扫一扫';

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.onRead = this.onRead.bind(this);
  }

  state = {
    doRenderScene: false,
    data: '',
    activate: true,
  };

  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.props.navigation.setParams({
      title: params ? params.title || '扫一扫' : '扫一扫',
    });
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
  }

  onRead({ data/* , type*/ }) {
    if (this.state.activate) {
      // console.log('onBarCodeRead():', data, type);
      this.setState({ data, activate: false }, () => {
        const { state, goBack } = this.props.navigation;
        const { onSuccess, shouldGoBack } = state.params;
        if (typeof onSuccess === 'function') {
          onSuccess(data);
        }
        if (shouldGoBack) goBack();
      });
    }
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return BarcodeScanner.renderPlaceholderView();
    }

    return (
      <View style={Global.styles.CONTAINER} >
        <RNCamera
          ref={(cam) => {
            this.camera = cam;
          }}
          onBarCodeRead={this.onRead}
          style={styles.camera}
        >
          <View style={[styles.maskView, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={styles.barcode} >{this.state.data}</Text>
          </View>
          <View style={styles.centerView} >
            <View style={styles.maskView} />
            <View style={styles.effView} >
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <View style={styles.maskView} />
          </View>
          <View style={styles.maskView} />
        </RNCamera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    flexDirection: 'column',
  },
  maskView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.2)',
    // width: Global.screen.width,
  },
  centerView: {
    height: effSize,
    flexDirection: 'row',
  },
  effView: {
    width: effSize,
    height: effSize,
    backgroundColor: 'transparent',
    borderRadius: 13,
    borderColor: 'rgba(0,0,0,.2)',
    borderWidth: 5,
  },
  corner: {
    width: 15,
    height: 15,
    backgroundColor: 'transparent',
  },
  topLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderTopWidth: 4,
    borderTopColor: 'white',
    borderLeftWidth: 4,
    borderLeftColor: 'white',
    borderTopLeftRadius: 8,
  },
  topRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    borderTopWidth: 4,
    borderTopColor: 'white',
    borderRightWidth: 4,
    borderRightColor: 'white',
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    borderBottomWidth: 4,
    borderBottomColor: 'white',
    borderLeftWidth: 4,
    borderLeftColor: 'white',
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderBottomWidth: 4,
    borderBottomColor: 'white',
    borderRightWidth: 4,
    borderRightColor: 'white',
    borderBottomRightRadius: 8,
  },
  barcode: {
    fontSize: 18,
    color: 'white',
  },
});

export default BarcodeScanner;
