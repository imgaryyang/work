/**
 * 首页待办事项组件
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Card from 'rn-easy-card';
import Icon from 'rn-easy-icon';

import Global from '../../Global';
import { todo } from '../../services/todo/TodoService';

class Todo extends Component {
  static displayName = 'Todo';
  static description = '待办事项组件';

  constructor(props) {
    super(props);
    this.fetch = this.fetch.bind(this);
    this.renderItems = this.renderItems.bind(this);
  }

  state = {
    loading: true,
    data: [],
  };

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    try {
      this.setState({ loading: true });
      const responseData = await todo();
      if (responseData.success) {
        this.setState({
          loading: false,
          data: responseData.result,
        });
      } else {
        this.handleRequestException({ msg: responseData.msg });
        this.setState({ loading: false });
      }
    } catch (e) {
      this.handleRequestException(e);
    }
  }

  renderItems() {
    const { data } = this.state;
    if (data.length === 0) return null;
    return (
      <View style={styles.todosContainer} >
        {
          data.map(({ id, index, content }, idx) => {
            return (
              <View style={styles.todoContainer} key={`${id}_${idx + 1}`} >
                <View style={styles.todoIdxContainer} >
                  <Text style={styles.todoIdx} >{index}</Text>
                </View>
                <Text style={styles.todoText} >{content}</Text>
              </View>
            );
          })
        }
      </View>
    );
  }

  render() {
    const { loading, data } = this.state;
    const loadingView = loading ? (
      <View style={[Global.styles.CENTER, { height: 50 }]} >
        <ActivityIndicator />
      </View>
    ) : null;
    const emptyView = !loading && data.length === 0 ? (
      <View style={[Global.styles.CENTER, { height: 50 }]} >
        <Text>暂无待办信息，点击刷新按钮重新查询...</Text>
        <TouchableOpacity onPress={this.fetch} >
          <Icon name="refresh" />
        </TouchableOpacity>
      </View>
    ) : null;
    return (
      <Card style={styles.container} >
        <View style={styles.todosTitle} >
          <Text style={styles.todosTitleText} >待办事项</Text>
          <Text style={styles.viewAll} >查看所有</Text>
          <Icon name="md-arrow-round-forward" size={10} width={18} height={10} color={Global.colors.IOS_BLUE} />
        </View>
        <ScrollView>
          {loadingView}
          {emptyView}
          {this.renderItems()}
        </ScrollView>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 140,
  },
  todosTitle: {
    marginBottom: 10,
    borderBottomColor: Global.colors.LINE,
    borderBottomWidth: 1 / Global.pixelRatio,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  todosTitleText: {
    flex: 1,
    lineHeight: 20,
  },
  viewAll: {
    flex: 1,
    textAlign: 'right',
    lineHeight: 10,
    fontSize: 10,
    color: Global.colors.IOS_BLUE,
  },
  todosContainer: {
  },
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  todoIdxContainer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderColor: Global.colors.BROWN,
    borderWidth: 1 / Global.pixelRatio,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  todoIdx: {
    fontSize: 9,
    color: Global.colors.FONT_LIGHT_GRAY,
  },
  todoText: {
    flex: 1,
    color: Global.colors.FONT_GRAY,
    lineHeight: 16,
    fontSize: 13,
  },
});

const mapStateToProps = state => ({
  base: state.base,
});

export default connect(mapStateToProps)(Todo);
