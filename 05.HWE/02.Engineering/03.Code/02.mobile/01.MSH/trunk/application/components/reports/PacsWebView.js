/**
 * 检查单详情
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  WebView,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'rn-easy-icon';
import Button from 'rn-easy-button';

import Global from '../../Global';

class PacsWebView extends Component {
  static displayName = 'PacsWebView';
  static description = '特检单详情';

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
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  state = {
    doRenderScene: false,
    canGoBack: false,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      title: '特检单详情',
    });
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
  }

  onNavigationStateChange(state) {
    // console.log(state);
    this.setState({ canGoBack: state.canGoBack });
  }

  goBack() {
    if (this.state.canGoBack) this.webView.goBack();
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return PacsWebView.renderPlaceholderView();
    }
    // TODO: 正式上线时根据条件组合URL
    const url = 'http://dqlnyy.webris.cn:8904/index.aspx?accessno=NHII8JZcF26YpJV67bHzOA%3d%3d';
    const btnHeight = this.state.canGoBack ? { height: 40 } : { height: 0, borderBottomWidth: 0 };
    return (
      <View style={[Global.styles.CONTAINER, styles.container]}>
        <TouchableOpacity
          style={[styles.backBtn, btnHeight]}
          onPress={this.goBack}
        >
          <Icon iconLib="fa" name="angle-left" size={18} width={26} height={35} color={Global.colors.IOS_BLUE} style={styles.icon} />
          <Text style={{ color: Global.colors.IOS_BLUE, fontSize: 12 }}>返回查看文字诊断</Text>
        </TouchableOpacity>
        <WebView
          ref={(webView) => { this.webView = webView; }}
          source={{ uri: url }}
          onNavigationStateChange={this.onNavigationStateChange}
          style={styles.webView}
          automaticallyAdjustContentInsets={false}
          javaScriptEnabled
          domStorageEnabled
          decelerationRate="normal"
          scalesPageToFit
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  webView: {
    flex: 1,
  },
  backBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.NAV_BAR_LINE,
  },
  icon: {
    paddingBottom: 1,
  },
});

export default PacsWebView;
