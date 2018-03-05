/**
 * 关于我们
 */

import React, {
  Component,
} from 'react';

import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  InteractionManager,
  Alert,
} from 'react-native';

import Global from '../../Global';
import { loadAppInfo } from '../../services/base/AppService';

class AboutUs extends Component {
  static displayName = 'AboutUs';
  static description = '关于我们';

  static navigationOptions = () => ({
    title: '关于我们',
  });

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  state = {
    data: {},
    doRenderScene: false,
  };
  componentWillMount() {
    this.fetchData();
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
  }

  async fetchData() {
    try {
      const appid = Global.Config.appUUID;
      // 显示遮罩
      this.props.screenProps.showLoading();
      const responseData = await loadAppInfo(appid);
      if (responseData.success === true) {
        // 隐藏遮罩
        this.props.screenProps.hideLoading();
        this.setState({
          data: responseData.result,
        });
      } else {
        Alert.alert(
          '提示',
          responseData.msg,
          [
            {
              text: '确定',
              onPress: () => {
                // this.setState({ value: {} });
              },
            },
          ],
        );
      }
    } catch (e) {
      // 隐藏遮罩
      this.props.screenProps.hideLoading();
      this.handleRequestException(e);
    }
  }


  render() {
    if (!this.state.doRenderScene) { return AboutUs.renderPlaceholderView(); }

    return (
      <View style={Global.styles.CONTAINER} >
        <ScrollView>
          <View style={Global.styles.PLACEHOLDER20} />
          <View style={[Global.styles.CENTER, styles.logoHolder]}>
            <Image source={Global.logo.l} resizeMode="contain" style={styles.logo} />
          </View>
          <View style={Global.styles.PLACEHOLDER20} />
          <View style={[styles.holder1]}>
            <Text style={styles.font}>{this.state.data ? this.state.data.name : '智慧医院'}</Text>
          </View>
          <View style={Global.styles.PLACEHOLDER20} />
          <View style={[styles.holder2]}>
            <Text>{this.state.data ? this.state.data.aboutUs || '暂无介绍信息' : '暂无介绍信息'}</Text>
          </View>
          <View style={Global.styles.PLACEHOLDER20} />

        </ScrollView>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: Global.os === 'ios' ? 48 : 0,
  },
  holder: {
    height: 180,
  },
  font: {
    fontSize: 20,
    color: Global.colors.FONT,
  },
  logoHolder: {
    height: Global.getScreen().height / 5,
  },
  logo: {
    width: (Global.getScreen().width * 1) / 2,
    height: (Global.getScreen().height / 8),
    backgroundColor: 'transparent',
  },
  holder1: {
    height: 35,
    alignItems: 'center',
    justifyContent: 'center', // 上下
  },
  holder2: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default AboutUs;
