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
  TouchableHighlight,
} from 'react-native';

import Global from '../../Global';

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
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
  }

  componentWillReceiveProps() {

  }

  async fetchData() {
    // 获取消息
    const FIND_URL = 'el//';
    this.showLoading();
    this.setState({
      loaded: false,
      fetchForbidden: false,
    });
    try {
      const responseData = await this.request(Global.host + FIND_URL, {
        body: JSON.stringify({

        }),
      });
      this.hideLoading();
      this.data = responseData.body;
      // console.log(responseData);
      if (responseData.success === false) {
        Alert.alert(
          '提示',
          responseData.msg,
          [
            {
              text: '确定',
              onPress: () => {
                this.setState({ bankCards: null });
              },
            },
          ],
        );
      } else {
        this.toast('成功！');
      }
    } catch (e) {
      this.hideLoading();

      this.handleRequestException(e);
    }
  }

  render() {
    if (!this.state.doRenderScene) { return ContactUs.renderPlaceholderView(); }

    return (
      <View style={Global.styles.CONTAINER} >
        <ScrollView style={styles.scrollView}>
          <View style={[styles.holder, { height: 50 }]}>
            <Text style={{ fontSize: 16, color: '#000000' }}>大庆龙南医院</Text>
          </View>
          <View style={Global.styles.FULL_SEP_LINE} />
          <View style={[styles.holder]}>
            <Text>地  址：黑龙江省大庆市让胡路区爱国路35号</Text>
          </View>
          <View style={Global.styles.FULL_SEP_LINE} />
          <View style={[styles.holder]}>
            <Text>电  话：0459-5989120</Text>
          </View>
          <View style={Global.styles.FULL_SEP_LINE} />
          <View style={Global.styles.FULL_SEP_LINE} />
          <View style={[styles.holder]}>
            <Text>邮  箱：dqln@dqln.com.cn</Text>
          </View>
          <View style={Global.styles.FULL_SEP_LINE} />

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
    height: 40,
    paddingLeft: 20,
    // alignItems: 'center',
    justifyContent: 'center', // 上下
    backgroundColor: 'white',
  },
  holder2: {
    height: 40,
    paddingLeft: 20,
    // alignItems: 'center',
    justifyContent: 'center', // 上下
  },
});

ContactUs.navigationOptions = {
  title: '联系我们',
};

export default ContactUs;
