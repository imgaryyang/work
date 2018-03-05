/**
 * 所有待办事项
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';

import Global from '../../Global';

class TodoList extends Component {
  static displayName = 'TodoList';
  static description = '待办事项';

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
      return TodoList.renderPlaceholderView();
    }
    // console.log('this.props.navigation in ConsultRecords.render():', this.props.navigation);

    return (
      <View style={Global.styles.CONTAINER} >
        <ScrollView style={styles.scrollView} >
          <Text>组件模板</Text>
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

TodoList.navigationOptions = {
  headerTitle: '待办事项',
};

export default TodoList;
