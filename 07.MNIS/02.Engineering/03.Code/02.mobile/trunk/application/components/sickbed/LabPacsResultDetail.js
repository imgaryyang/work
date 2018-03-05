/**
 * 检查单详情
 */

import React, { Component } from 'react';
import Sep from 'rn-easy-separator';
import SafeView from 'react-native-safe-area-view';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text, ScrollView,
} from 'react-native';
import Global from '../../Global';


class LabPacsResultDetail extends Component {
  static displayName = 'Reports';
  static description = '检查申请单';

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
  };
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
  }

  render() {
    const date = this.props.navigation.state.params;
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return LabPacsResultDetail.renderPlaceholderView();
    }
    return (
      <SafeView style={[Global.styles.SAFE_VIEW, { backgroundColor: Global.colors.IOS_LIGHT_GRAY }]}>
        <ScrollView style={[{ flex: 1, backgroundColor: 'white' }]} >
          <View style={styles.normalView}>
            <Text style={styles.title}>检查项目 {date.name }</Text>
            <Text style={styles.normalText}>检查类型 {date.type}</Text>
            <Text style={styles.normalText}>检查日期 {date.checkTime}</Text>
            <Text style={styles.normalText}>检查部位 {date.part}</Text>
          </View>
          <View style={styles.normalView}>
            <Text style={styles.title}>检查所见</Text>
            <Text style={styles.normalText}>{date.see}</Text>
          </View>
          <View style={styles.normalView}>
            <Text style={styles.title}>诊断结果</Text>
            <Text style={styles.normalText}>{date.result}</Text>
          </View>
        </ScrollView>
        <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
      </SafeView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  title: {
    width: Global.getScreen().width,
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingTop: 5,
    paddingLeft: 10,
    fontSize: 18,
    color: '#080808',
  },
  normalView: {
    flex: 1,
    paddingBottom: 5,
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
  },
  normalText: {
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
    color: '#999999',
    width: Global.getScreen().width,
    flex: 1,
  },
  reference: { marginLeft: 10 },
  result: { paddingLeft: 10 },
  state: { paddingLeft: 25 },
});

LabPacsResultDetail.navigationOptions = {
  title: '检查单详情',
};

export default LabPacsResultDetail;
