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
    doRenderScene: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
  }

  async fetchData() {
    // 获取消息
    // 暂时将文档写死
    this.showLoading();
    this.setState({
      loaded: false,
      fetchForbidden: false,
    });

    try {
      // let responseData = await this.request(Global.host + FIND_URL, {
      //     body: JSON.stringify({

      //     })
      // });
      this.hideLoading();
      const responseData =
        {
          success: true,
          result: {
            version: 'V 0.1.01',
            content: '“易民生”是一个基于内蒙社会保障卡实名认证，建立居民相关薪资发放、挂号就医、缴费等民生活动为一体的应用平台，未来还将逐步丰富公共服务、个人消费及理财信贷等领域',
          },
        };
      // this.data = responseData.result;

      if (responseData.success === false) {
        Alert.alert(
          '提示',
          responseData.msg,
          [
            {
              text: '确定',
              onPress: () => {
                this.setState({});
              },
            },
          ],
        );
      } else {
        this.toast('成功！');
      }
    } catch (e) {
      this.hideLoading();
      this.setState({
        isRefreshing: false,
      });
      if (e.status === 401 || e.status === 403) { this.setState({ fetchForbidden: true }); }
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
            <Text style={styles.font}>移动护理  V 0.1.01</Text>
          </View>
          <View style={Global.styles.PLACEHOLDER20} />
          <View style={[styles.holder2]}>
            <Text>
              {
              `
    大庆龙南医院地处石油、石化企业中心区域，始建于1997年，是一所集医疗、教学、科研、预防保健于一体的综合性国家三级甲等医院，现有4个成员医院（乘风医院、东海医院、让北医院、五官医院）组成。建筑面积10.8万平方米，开放床位823张，共设34个病区，38个临床科室，年门诊量100万余人次。历经10余年的建设，大庆龙南医院用深圳速度，诠释了一个快速发展的奇迹。
    名医名家汇聚。医院现有职工本部1723人，专业技术人员1313人。副教授以上高级技术人员344人，博士、硕士研究生219人，教授24人、副教授8人，硕士研究生导师17人，省级名医1人、市级名医2人，名医26人及青年医学精英15人。
              `
              }
            </Text>
          </View>
          <View style={Global.styles.PLACEHOLDER20} />

        </ScrollView>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  holder: {
    height: 140,
  },
  font: {
    fontSize: 20,
    color: Global.colors.FONT,
  },
  logoHolder: {
    height: Global.getScreen().height / 5,
  },
  logo: {
    width: (Global.getScreen().width * 2) / 3,
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
    // alignItems: 'center',
    justifyContent: 'center', // 上下
  },
});

export default AboutUs;
