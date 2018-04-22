/**
 * 门诊诊疗记录
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

class OutpatientRecord extends Component {
  static displayName = 'OutpatientRecord';
  static description = '门诊诊疗记录';

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
      return OutpatientRecord.renderPlaceholderView();
    }
    // console.log('this.props.navigation in OutpatientRecord.render():', this.props.navigation);

    return (
      <View style={Global.styles.CONTAINER} >
        <ScrollView style={styles.scrollView} >
          <Text>门诊诊疗记录</Text>
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

OutpatientRecord.navigationOptions = {
  title: '诊疗记录',
};

export default OutpatientRecord;
