/**
 * 相机测试
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';
import Camera from 'react-native-camera';

import Global from '../../../Global';

class CameraTest extends Component {
  static displayName = 'CameraTest';
  static description = '相机测试';

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  state = {
    doRenderScene: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
  }

  onBarCodeRead(e) {
    console.log(
      'Barcode Found!',
      `Type: ${e.type}${'\n'}Data: ${e.data}`,
    );
  }

  takePicture() {
    const options = {};
    // options.location = ...
    this.camera.capture({ metadata: options })
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return CameraTest.renderPlaceholderView();
    }
    // console.log('this.props.navigation in ConsultRecords.render():', this.props.navigation);

    return (
      <View style={styles.container} >
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          onBarCodeRead={this.onBarCodeRead.bind(this)}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
        >
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40,
  },
});

CameraTest.navigationOptions = {
  headerTitle: '相机测试',
};

export default CameraTest;
