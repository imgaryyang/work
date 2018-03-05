/**
 * 联系我们
 */

import React, {
  Component,
} from 'react';

import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  InteractionManager,
  Alert,
  Image,
} from 'react-native';

import Global from '../../Global';
import { loadAppInfo } from '../../services/base/AppService';

class ContactUs extends Component {
  static displayName = 'ContactUs';
  static description = '联系我们';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  state = {
    doRenderScene: false,
    data: {},
  };

  componentWillMount() {
    this.fetchData();
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
  }

  componentWillReceiveProps() {

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
    if (!this.state.doRenderScene) { return ContactUs.renderPlaceholderView(); }

    return (
      <View style={Global.styles.CONTAINER} >
        <ScrollView style={styles.scrollView}>
          <View style={Global.styles.PLACEHOLDER20} />
          <View style={[Global.styles.CENTER, styles.logoHolder]}>
            <Image source={Global.logo.l} resizeMode="contain" style={styles.logo} />
          </View>
          <View style={Global.styles.PLACEHOLDER20} />
          <View style={[styles.holder]}>
            <Text>{this.state.data ? this.state.data.contactUs || '暂无联系信息' : '暂无联系信息'}</Text>
          </View>
          {/* <View style={Global.styles.FULL_SEP_LINE} />
          <View style={[styles.holder]}>
            <Text>客 服 电 话： 0471-12345678</Text>
          </View>
          <View style={Global.styles.FULL_SEP_LINE} />
          <View style={[styles.holder]}>
            <Text>商户合作电话：0471-12345678</Text>
          </View>
          <View style={Global.styles.FULL_SEP_LINE} />
          <View style={[styles.holder]}>
            <Text>邮  箱：ides@ides.com.cn</Text>
          </View>
          <View style={Global.styles.FULL_SEP_LINE} />
          <View style={[styles.holder]}>
            <Text>地  址：呼和浩特市赛罕区学府康都B座4层</Text>
          </View>
          <View style={Global.styles.FULL_SEP_LINE} />
          <View style={[styles.holder2]}>
            <Text style={styles.text}>工作时间：周一至周五9：00-18：00</Text>
            <Text style={styles.text}>法定节假日休息！</Text>
          </View>*/}

        </ScrollView>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginBottom: Global.os === 'ios' ? 48 : 0,
  },
  text: {
    fontSize: 13,
  },
  holder: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  holder2: {
    height: 40,
    paddingLeft: 20,
    // alignItems: 'center',
    justifyContent: 'center', // 上下
  },
  logoHolder: {
    height: Global.getScreen().height / 5,
  },
  logo: {
    width: (Global.getScreen().width * 1) / 2,
    height: (Global.getScreen().height / 8),
    backgroundColor: 'transparent',
  },
});

ContactUs.navigationOptions = {
  title: '联系我们',
};

export default ContactUs;
