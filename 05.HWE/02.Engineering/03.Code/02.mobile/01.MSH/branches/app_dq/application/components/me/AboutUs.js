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
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} />
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
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <ScrollView>

          <View style={[Global.styles.CENTER, styles.logoHolder]}>
            <View style={Global.styles.PLACEHOLDER20} />
            <Image source={Global.logo.l} resizeMode="contain" style={styles.logo} />
            <Text style={styles.hospitalName}>{Global.Config.hospital.name}</Text>
          </View>

          <View style={Global.styles.PLACEHOLDER40} />
          <View style={[styles.holder]}>
            <View style={styles.row}>
              <Text>{this.state.data ? this.state.data.aboutUs || '暂无介绍信息' : '暂无介绍信息'}</Text>
            </View>
          </View>

        </ScrollView>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  logoHolder: {
    // height: Global.getScreen().height / 5,
    // backgroundColor: 'white',
  },
  logo: {
    width: (Global.getScreen().width * 1) / 2,
    height: (Global.getScreen().height / 6),
    backgroundColor: 'transparent',
  },
  hospitalName: {
    fontSize: 20,
    fontWeight: '900',
    color: 'black',
    paddingTop: 10,
  },

  holder: {
    borderTopWidth: 1 / Global.pixelRatio,
    borderTopColor: Global.colors.LINE,
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    // alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    // borderBottomWidth: 1 / Global.pixelRatio,
    // borderBottomColor: Global.colors.LINE,
  },
  borderTop: {
    // borderTopWidth: 1 / Global.pixelRatio,
    // borderTopColor: Global.colors.LINE,
  },
  type: {
    width: 90,
    fontSize: 14,
    color: 'black',
  },
  content: {
    flex: 1,
    fontSize: 14,
    color: Global.colors.FONT_GRAY,
  },
});

export default AboutUs;
