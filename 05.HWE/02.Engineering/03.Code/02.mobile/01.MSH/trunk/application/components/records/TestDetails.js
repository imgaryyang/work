import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  InteractionManager,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Card from 'rn-easy-card';
import Sep from 'rn-easy-separator';

import Item from '../../modules/PureListItem';
import Global from '../../Global';

// class Item extends PureComponent {
//   render() {
//     return (
//       <TouchableOpacity
//         style={[{ flexDirection: 'row', paddingLeft: 5, padding: 7 }]}
//       >
//         <View style={{ flex: 1, flexDirection: 'row', marginLeft: 1 }} >
//           <View style={{ flex: 2 }} >
//             <Text style={styles.titleText}>项目代号：{this.props.data.subjectCode}</Text>
//             <Text style={styles.titleText}>项目名称：{this.props.data.subject}</Text>
//             <Text style={styles.titleText}>标志：{this.props.data.flag}</Text>
//             <Text style={styles.titleText}>单位：{this.props.data.unit}</Text>
//             <Text style={styles.titleText}>参考值：{this.props.data.reference}</Text>
//             <Text style={styles.titleText}>结果：{this.props.data.result}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   }
// }


class TestDetails extends Component {
  static displayName = 'TestDetails';
  static description = '检查项明细';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
    );
  }

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  state = {
    doRenderScene: false,
    value: (
      this.props.navigation.state.params.data ?
        Object.assign({}, this.props.navigation.state.params.data) : null
    ),
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.clockTimer);
  }

  /**
   * 渲染行数据
   */
  renderItem({ item, index }) {
    return (
      <Item
        data={item}
        index={index}
      >
        <TouchableOpacity
          style={[{ flexDirection: 'row', paddingLeft: 5, padding: 7 }]}
        >
          <View style={{ flex: 1, flexDirection: 'row', marginLeft: 1 }} >
            <View style={{ flex: 2 }} >
              <Text style={styles.titleText}>项目代号：{item.subjectCode}</Text>
              <Text style={styles.titleText}>项目名称：{item.subject}</Text>
              <Text style={styles.titleText}>标志：{item.flag}</Text>
              <Text style={styles.titleText}>单位：{item.unit}</Text>
              <Text style={styles.titleText}>参考值：{item.reference}</Text>
              <Text style={styles.titleText}>结果：{item.result}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Item>
    );
  }


  render() {
    if (!this.state.doRenderScene) { return TestDetails.renderPlaceholderView(); }
    return (
      <View style={Global.styles.CONTAINER}>
        <ScrollView style={styles.scrollView}>
          <Card radius={7} style={{ margin: 20, padding: 10 }}>
            <View
              style={{ flex: 1, flexDirection: 'row', marginLeft: 20 }}
            >
              <FlatList
                data={this.state.value.testDetail}
                ref={(c) => { this.listRef = c; }}
                keyExtractor={(item, index) => `${item}${index + 1}`}
                ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
                renderItem={this.renderItem}
                style={styles.list}
              />
            </View>
          </Card>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {},
  btnHolder: {
    flexDirection: 'row', margin: 10, marginTop: 0, marginBottom: 40,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

TestDetails.navigationOptions = {
  headerTitle: '检查项明细',
};

export default TestDetails;
