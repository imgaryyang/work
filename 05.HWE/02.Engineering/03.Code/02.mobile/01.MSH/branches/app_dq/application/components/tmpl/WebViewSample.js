/**
 * 电影主页
 */

import React, {
  Component,
} from 'react';

import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  InteractionManager,
  WebView,
} from 'react-native';

import PropTypes from 'prop-types';
import * as Global from '../Global';

const WEBVIEW_REF = '__WebViewSample__';

class WebViewSample extends Component {
    static displayName = 'WebViewSample';
    static description = 'WebView测试';

    static propTypes = {

      /**
        * 导航容器
        * 必填
        */
      navigator: PropTypes.object.isRequired,

      /**
        * 路由
        * 必填
        */
      route: PropTypes.object.isRequired,
    };

    static defaultProps = {
    };

    state = {
      doRenderScene: false,
      url: 'http://www.baidu.com',
      loading: true,
      scalesPageToFit: true,
      title: 'loading...',
    };

    constructor(props) {
      super(props);

      this.goBack = this.goBack.bind(this);
      this.goForward = this.goForward.bind(this);
      this.reload = this.reload.bind(this);
      this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
      this.onLoad = this.onLoad.bind(this);
      this._renderPlaceholderView = this._renderPlaceholderView.bind(this);
      this._getNavBar = this._getNavBar.bind(this);
    }

    componentDidMount() {
      const x = [];
      InteractionManager.runAfterInteractions(() => {
        this.setState({ doRenderScene: true });
      });
    }

    goBack() {
      if (this.state.backButtonEnabled) { this.refs[WEBVIEW_REF].goBack(); }
    }

    goForward() {
      if (this.state.forwardButtonEnabled) { this.refs[WEBVIEW_REF].goForward(); }
    }

    reload() {
      this.refs[WEBVIEW_REF].reload();
    }

    onNavigationStateChange(navState) {
      this.setState({
        backButtonEnabled: navState.canGoBack,
        forwardButtonEnabled: navState.canGoForward,
        url: navState.url,
        title: navState.title,
        loading: navState.loading,
        scalesPageToFit: true,
      });
    }

    onLoad() {
      console.log(arguments);
    }

    render() {
      if (!this.state.doRenderScene) { return this._renderPlaceholderView(); }

      const backBtnTextStyle = this.state.backButtonEnabled ? styles.btnText : styles.disabledBtnText;
      const forwardBtnTextStyle = this.state.forwardButtonEnabled ? styles.btnText : styles.disabledBtnText;

      return (
        <View style={[Global._styles.CONTAINER/* , {backgroundColor: 'white'}*/]}>
          {this._getNavBar()}
          <WebView
            ref={WEBVIEW_REF}
            automaticallyAdjustContentInsets={false}
            style={styles.webView}
            source={{ uri: this.state.url }}
            javaScriptEnabled={false}
                    // domStorageEnabled = {true}
                    // decelerationRate = "normal"
                    // onLoad = {this.onLoad}
            onNavigationStateChange={this.onNavigationStateChange}
                    // onShouldStartLoadWithRequest = {this.onShouldStartLoadWithRequest}
            startInLoadingState
          />
          <View style={[Global._styles.CENTER, styles.statusBar]}>
            <TouchableOpacity style={[Global._styles.CENTER, styles.bottomBtn]} onPress={this.goBack} >
              <Text style={backBtnTextStyle} >后退</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[Global._styles.CENTER, styles.bottomBtn]} onPress={this.goForward} >
              <Text style={forwardBtnTextStyle} >前进</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[Global._styles.CENTER, styles.bottomBtn]} onPress={this.reload} >
              <Text style={styles.btnText} >刷新</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    _renderPlaceholderView() {
      return (
        <View style={[Global._styles.CONTAINER/* , {backgroundColor: 'white'}*/]}>
          {this._getNavBar()}
        </View>
      );
    }

    _getNavBar() {
      return (
        <NavBar
          title={this.state.title}
          navigator={this.props.navigator}
          route={this.props.route}
          hideBackButton={false}
          hideBackText
          hideBottomLine={false}
          flow={false}
          centerComponent={(
            <View style={[Global._styles.NAV_BAR.CENTER_VIEW, { flex: 4, flexDirection: 'row' }]} >
              <Text numberOfLines={1} style={Global._styles.NAV_BAR.TITLE_TEXT} >{this.state.title}</Text>
            </View>
                )}
        />
      );
    }
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
  },
  statusBar: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: 'white',
    borderTopWidth: 1 / Global._pixelRatio,
    borderTopColor: Global._colors.IOS_NAV_LINE,
  },
  bottomBtn: {
    flex: 1,
  },
  disabledBtnText: {
    color: 'gray',
  },
  btnText: {
    color: Global._colors.IOS_BLUE,
  },

});

export default WebViewSample;

