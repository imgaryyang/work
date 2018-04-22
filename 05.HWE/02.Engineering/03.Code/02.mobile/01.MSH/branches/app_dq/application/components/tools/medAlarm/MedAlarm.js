/**
 * 用药小闹钟
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';

import Global from '../../../Global';

class MedAlarm extends Component {
  static displayName = 'MedAlarm';
  static description = '用药小闹钟';

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
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return MedAlarm.renderPlaceholderView();
    }
    // console.log('this.props.navigation in MedAlarm.render():', this.props.navigation);

    return (
      <View style={Global.styles.CONTAINER} >
        <ScrollView style={styles.scrollView} >
          <Text>用药小闹钟</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});

MedAlarm.navigationOptions = {
  title: '用药小闹钟',
};

export default MedAlarm;
