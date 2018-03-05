import React, { Component, PureComponent } from 'react';

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

import Global from '../../Global';
import TestItem from './TestItem';

class Item extends PureComponent {
  render() {
    return (
      <TouchableOpacity
        style={[{ flexDirection: 'row', paddingLeft: 5, padding: 7 }]}
      >
        <View style={{ flex: 1, flexDirection: 'row', marginLeft: 1 }} >
          <View style={{ flex: 2 }} >
            <Text style={styles.titleText}>药名：{this.props.data.name}</Text>
            <Text style={styles.titleText}>剂型：{this.props.data.form}</Text>
            <Text style={styles.titleText}>一次用量：{this.props.data.oneSize}</Text>
            <Text style={styles.titleText}>方法：{this.props.data.way}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}


class RecipeDetails extends Component {
  static displayName = 'RecipeDetails';
  static description = '处方详情';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, styles.container]} />
    );
  }

  constructor(props) {
    // console.log('.....:', props);
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.renderTestItem = this.renderTestItem.bind(this);
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
    this.props.navigation.setParams({
      title: '处方详情',
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.clockTimer);
  }

  testScan(item) {
    this.props.navigation.navigate('TestDetails', {
      data: item,
    });
  }
  /**
   * 渲染药品行数据
   */
  renderItem({ item, index }) {
    return (
      <Item
        data={item}
        index={index}
      />
    );
  }

  /**
   * 渲染检查项目行数据
   */
  renderTestItem({ item, index }) {
    return (
      <TestItem
        data={item}
        index={index}
        onPressItem={this.testScan.bind(this)}
      />
    );
  }
  render() {
    // console.log('......:', this.props);
    if (!this.state.doRenderScene) { return RecipeDetails.renderPlaceholderView(); }
    return (
      <View style={Global.styles.CONTAINER}>
        <ScrollView style={styles.scrollView}>
          <Card radius={7} style={{ margin: 20, padding: 10 }}>
            <View
              style={{ flex: 1, flexDirection: 'row', marginLeft: 20 }}
            >
              <FlatList
                data={this.state.value.recordDrug}
                ref={(c) => { this.listRef = c; }}
                keyExtractor={(item, index) => `${item}${index + 1}`}
                ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
                renderItem={this.renderItem}
                style={styles.list}
              />
            </View>
          </Card>

          <Card radius={7} style={{ margin: 20, padding: 10 }}>
            <View
              style={{ flex: 1, flexDirection: 'row', marginLeft: 20 }}
            >
              <FlatList
                data={this.state.value.recordTest}
                ref={(c) => { this.listRef = c; }}
                keyExtractor={(item, index) => `${item}${index + 1}`}
                ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
                renderItem={this.renderTestItem}
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

// RecipeDetails.navigationOptions = {
//   headerTitle: '处方详情',
// };

export default RecipeDetails;
