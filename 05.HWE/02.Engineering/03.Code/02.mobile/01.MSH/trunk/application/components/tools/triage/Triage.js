/**
 * 智能分诊
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

class Triage extends Component {
  static displayName = 'Triage';
  static description = '智能分诊';

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
      return Triage.renderPlaceholderView();
    }
    // console.log('this.props.navigation in Vaccines.render():', this.props.navigation);

    return (
      <View style={Global.styles.CONTAINER} >
        <ScrollView style={styles.scrollView} >
          <Text>智能分诊</Text>
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

Triage.navigationOptions = {
  title: '智能分诊',
};

export default Triage;
