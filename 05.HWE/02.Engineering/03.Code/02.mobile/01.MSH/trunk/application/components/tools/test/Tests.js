/**
 * 急救知识库
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  TouchableOpacity,
  Text, Alert,
} from 'react-native';
import EasyIcon from 'rn-easy-icon';
import Sep from 'rn-easy-separator';
import SearchInput from '../../../modules/SearchInput';
import Global from '../../../Global';
import ctrlState from '../../../modules/ListState';
import { loadTestType } from '../../../services/tools/TestService';

class Tests extends Component {
    static displayName = 'Tests';
    static description = '化验单解读';

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
      this.renderToolBar = this.renderToolBar.bind(this);
      this.renderRow = this.renderRow.bind(this);
      this.fetchData = this.fetchData.bind(this);
      this.searchByKeyWords = this.searchByKeyWords.bind(this);
      this.changeText = this.changeText.bind(this);
    }

    state = {
      doRenderScene: false,
      keyWords: '',
      data: [],
      init: [],
      ctrlState,
    };
    componentWillMount() {
      this.fetchData();
    }
    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.setState({
          doRenderScene: true,
        });
      });
      this.props.navigation.setParams({
        title: '化验单解读',
        hideNavBarBottomLine: true,
      });
    }
    changeText(value) {
      const d = this.state.data;
      const filtered = [];
      if (value !== null && value !== '') {
        for (let i = 0; i < d.length; i++) {
        // 如果字符串中不包含目标字符会返回-1
          if (d[i].classificationName.indexOf(value) >= 0) {
            filtered.push(d[i]);
          }
        }
        this.setState({ data: filtered });
      } else {
        const initdata = this.state.init;
        this.setState({ data: initdata });
      }
    }

    searchByKeyWords() {
      console.log(this.state.keyWords);
      this.props.navigation.navigate('TestList', { keyWords: this.state.keyWords });
    }
    async fetchData() {
      try {
        // 显示遮罩
        // this.props.screenProps.showLoading();
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: true,
            infiniteLoading: false,
            noMoreData: false,
            requestErr: false,
            requestErrMsg: null,
          },
        });
        const responseData = await loadTestType();
        if (responseData.success === true) {
          const newCtrlState = {
            ...this.state.ctrlState,
            refreshing: false,
            infiniteLoading: false,
          };
          this.setState({ data: responseData.result, ctrlState: newCtrlState });
          this.setState({ init: responseData.result });
        } else {
          Alert.alert(
            '提示',
            responseData.msg,
            [
              {
                text: '确定',
                onPress: () => {
                  // this.setState({ value: {} });
                },
              },
            ],
          );
        }
      } catch (e) {
        // 隐藏遮罩
        this.props.screenProps.hideLoading();
        this.handleRequestException(e);
      }
    }

    /**
     * 渲染顶端工具栏
     */
    renderToolBar() {
      return (
        <View style={Global.styles.TOOL_BAR.FIXED_BAR} >
          <SearchInput placeholder="请输入关键字" onChangeText={this.changeText} />
        </View>
      );
    }
    renderRow(item) {
      const value = item.item;
      return (
        <TouchableOpacity
          key={item}
          style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15, backgroundColor: 'white' }]}
          onPress={() => this.props.navigation.navigate('TestTypeList', { item: value, type: '1' })}
        >
          <Text style={{ flex: 1, marginLeft: 15 }}>{value.classificationName}</Text>
          <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
        </TouchableOpacity>
      );
    }
    render() {
      // 场景过渡动画未完成前，先渲染过渡场景
      if (!this.state.doRenderScene) {
        return Tests.renderPlaceholderView();
      }

      return (
        <View style={Global.styles.CONTAINER_BG} >
          <ScrollView style={styles.scrollView} >
            { this.renderToolBar()}
            <FlatList
              ref={(c) => { this.listRef = c; }}
              data={this.state.data}
              style={styles.list}
              keyExtractor={(item, index) => `${item}${index + 1}`}
                        // 渲染行
              renderItem={this.renderRow}
                // 控制下拉刷新
              refreshing={this.state.ctrlState.refreshing}
              onRefresh={this.fetchData}
                // 无数据占位符
              ListEmptyComponent={() => {
                  return this.renderEmptyView({
                      msg: '暂无符合查询条件的报告单信息',
                      reloadMsg: '点击刷新按钮重新查询',
                      reloadCallback: this.fetchData,
                      ctrlState: this.state.ctrlState,
                  });
              }}
                        // 渲染行间隔
              ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
            />
            <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
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



export default Tests;
