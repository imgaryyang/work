/**
 * 扫一扫
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

import Global from '../../Global';

class Scanner extends Component {
  static displayName = 'Scanner';
  static description = '扫一扫';

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  // static renderPlaceholderView() {
  //   return (
  //     <View style={Global.styles.CONTAINER} />
  //   );
  // }

  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
  }

  state = {
    // doRenderScene: false,
    // rst: '',
  };

  componentDidMount() {
    // InteractionManager.runAfterInteractions(() => {
    //   this.setState({
    //     doRenderScene: true,
    //   });
    // });
  }

  onSuccess(e) {
    const { state, goBack } = this.props.navigation;
    const { onSuccess, shouldGoBack } = state.params;
    onSuccess(e.data);
    if (shouldGoBack) goBack();
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    // if (!this.state.doRenderScene) {
    //   return Scanner.renderPlaceholderView();
    // }

    return (
      <QRCodeScanner
        ref={(node) => { this.scanner = node; }}
        onRead={this.onSuccess}
        topContent={null /* (
          <Text style={styles.centerText}>
            扫描结果{'\n'}{/!* this.state.rst*!/}
          </Text>
        )*/}
        bottomContent={(
          <View style={{ flexDirection: 'row' }} >
            <TouchableOpacity
              style={styles.buttonTouchable}
              onPress={() => {
                // this.setState({
                //   rst: '',
                // }, () => {
                //   this.scanner.reactivate();
                // });
                this.scanner.reactivate();
              }}
            >
              <Text style={styles.buttonText}>重新扫描</Text>
            </TouchableOpacity>
            {
              Global.mode === Global.MODE_PRO ? null : (
                <TouchableOpacity
                  style={styles.buttonTouchable}
                  onPress={() => {
                    this.onSuccess({ data: '1800544' });
                  }}
                >
                  <Text style={styles.buttonText}>测试返回</Text>
                </TouchableOpacity>
              )
            }
          </View>
        )}
      />
    );
  }
}

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
    flex: 1,
    alignItems: 'center',
  },
});

Scanner.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: navigation.state.params.title,
  };
};

export default Scanner;
