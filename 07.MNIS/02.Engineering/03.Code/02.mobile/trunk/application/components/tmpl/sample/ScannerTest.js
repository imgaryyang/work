/**
 * 扫码测试
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text,
  // Linking,
  TouchableOpacity,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Toast from 'react-native-root-toast';

import Global from '../../../Global';

class ScannerTest extends Component {
  static displayName = 'ScannerTest';
  static description = '扫码测试';

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
    rst: '',
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
  }

  onSuccess(e) {
    this.setState({
      rst: e.data,
    });
    // Linking.openURL(e.data).catch(err => console.error('An error occured', err));
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return ScannerTest.renderPlaceholderView();
    }
    // console.log('this.props.navigation in ConsultRecords.render():', this.props.navigation);

    return (
      <QRCodeScanner
        ref={(node) => { this.scanner = node; }}
        onRead={this.onSuccess.bind(this)}
        topContent={(
          <Text style={styles.centerText}>
            扫描结果{'\n'}{this.state.rst}
          </Text>
        )}
        bottomContent={(
          <TouchableOpacity
            style={styles.buttonTouchable}
            onPress={() => {
              this.setState({
                rst: '',
              }, () => this.scanner.reactivate());
            }}
          >
            <Text style={styles.buttonText}>重新扫描</Text>
          </TouchableOpacity>
        )}
      />
    );
  }
}

// containerStyle={{ flexDirection: 'column' }}
// topViewStyle={{ flex: -1, height: 0 }}
// bottomViewStyle={{ flex: -1, height: 0 }}
// cameraStyle={{ height: Global.getScreen().height, width: Global.getScreen().width }}
// topContent={null}
// bottomContent={null}
// showMarker
// customMarker={(
//   <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.3)' }}>
//     <View style={{ backgroundColor: 'rgba(0,0,0,0)' }} />
//   </View>
// )}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
    textAlign: 'center',
  },

  textBold: {
    fontWeight: '500',
    color: '#000',
  },

  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },

  buttonTouchable: {
    padding: 16,
  },
});

ScannerTest.navigationOptions = {
  headerTitle: '扫码测试',
  // header: null,
};

export default ScannerTest;
