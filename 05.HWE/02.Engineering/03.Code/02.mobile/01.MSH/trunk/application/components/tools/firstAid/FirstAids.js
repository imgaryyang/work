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
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text, Alert,
} from 'react-native';
import Button from 'rn-easy-button';
import EasyIcon from 'rn-easy-icon';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Sep from 'rn-easy-separator';
import SearchInput from '../../../modules/SearchInput';
import Global from '../../../Global';
import { loadByKeyWords, loadFirstAidType } from '../../../services/tools/FirstAidService';

const dismissKeyboard = require('dismissKeyboard');

class FirstAids extends Component {
  static displayName = 'FirstAids';
  static description = '急救知识库';

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
    this.changeText = this.changeText.bind(this);
  }

  state = {
    doRenderScene: false,
    data: [],
    init: [],
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
      title: '急救库',
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

  async fetchData() {
    try {
      // 显示遮罩
      const responseData = await loadFirstAidType();
      if (responseData.success === true) {
        this.setState({ data: responseData.result });
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
        onPress={() => this.props.navigation.navigate('FirstAidType', { item: value })}
      >
        <Text style={{ flex: 1, marginLeft: 15 }}>{value.classificationName}</Text>
        <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
      </TouchableOpacity>
    );
  }
  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return FirstAids.renderPlaceholderView();
    }

    return (
      <View style={Global.styles.CONTAINER_BG} >
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible="false" >
          <KeyboardAwareScrollView keyboardShouldPersistTaps="always" >
            {this.renderToolBar()}
            <FlatList
              ref={(c) => { this.listRef = c; }}
              data={this.state.data}
              style={styles.list}
              keyExtractor={(item, index) => `${item}${index + 1}`}
                // 渲染行
              renderItem={this.renderRow}
                // 渲染行间隔
              ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
            />
            <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />
            <View style={{ height: 40 }} />
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({


  scrollView: {
    flex: 1,
  },
});

FirstAids.navigationOptions = {
  title: '急救知识库',
};

export default FirstAids;
