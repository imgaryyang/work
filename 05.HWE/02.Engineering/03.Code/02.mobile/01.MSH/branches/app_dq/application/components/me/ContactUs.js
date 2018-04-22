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
import _ from 'lodash';

import Global from '../../Global';
import { loadAppInfo } from '../../services/base/AppService';

class ContactUs extends Component {
  static displayName = 'ContactUs';
  static description = '联系我们';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} />
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
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <ScrollView style={styles.scrollView}>

          <View style={[Global.styles.CENTER, styles.logoHolder]}>
            <View style={Global.styles.PLACEHOLDER20} />
            <Image source={Global.logo.l} resizeMode="contain" style={styles.logo} />
            <Text style={styles.hospitalName}>{Global.Config.hospital.name}</Text>
          </View>

          <View style={Global.styles.PLACEHOLDER40} />
          <View style={[styles.holder]}>
            {
              this.state.data && this.state.data.contactUs ? _.split(this.state.data.contactUs, ';').map((item, idx) => {
                const con = _.split(item, '|');
                return (
                  <View key={`contact_${idx + 1}`} style={[styles.row, idx === 0 ? styles.borderTop : null]}>
                    <Text style={styles.type}>{con[0]}：</Text>
                    <Text style={styles.content}>{con[1]}</Text>
                  </View>
                );
              }) : (
                <View style={styles.row}>
                  <Text>暂无联系方式信息</Text>
                </View>
              )
            }
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

ContactUs.navigationOptions = {
  title: '联系我们',
};

export default ContactUs;
