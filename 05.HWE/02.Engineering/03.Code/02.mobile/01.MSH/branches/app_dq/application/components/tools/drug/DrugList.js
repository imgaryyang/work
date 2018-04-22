import React, { Component } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  InteractionManager,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import EasyIcon from 'rn-easy-icon';
import Sep from 'rn-easy-separator';
import SearchInput from '../../../modules/SearchInput';
import Global from '../../../Global';
import { loadDrugByKeyWords, loadDrugByType, loadRescueDrug } from '../../../services/tools/DrugService';


class DrugList extends Component {
  static displayName = 'DrugList';
  static description = '药品列表';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.INDICATOR_CONTAINER]} >
        <ActivityIndicator />
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.loadDrugList = this.loadDrugList.bind(this);
    this.renderToolBar = this.renderToolBar.bind(this);
    this.changeText = this.changeText.bind(this);
  }

  state = {
    doRenderScene: false,
    data: [],
    init: [],

  };
  componentWillMount() {
    this.loadDrugList();
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    const t = this.props.navigation.state.params.item;

    this.props.navigation.setParams({
      title: t === undefined ? '药品列表' : t.classificationName || '',
      hideNavBarBottomLine: true,
    });
  }
  async loadDrugList() {
    try {
      // 显示遮罩
      // this.props.screenProps.showLoading();
      const searchtype = this.props.navigation.state.params.type;
      let responseData;

      if (searchtype === '1') {
        // 药品分类搜索
        const key = this.props.navigation.state.params.code;
        responseData = await loadDrugByType(key);
      } else if (searchtype === '2') {
        // 常见抢救药搜索
        responseData = await loadRescueDrug();
      } else {
        // 根据关键字搜索
        const word = this.props.navigation.state.params.keywords;
        const query = { drugName: word };
        responseData = await loadDrugByKeyWords(query);
      }
      if (responseData.success === true) {
        // 隐藏遮罩
        this.props.screenProps.hideLoading();
        console.log(responseData);
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
  changeText(value) {
    const d = this.state.data;
    const filtered = [];
    if (value !== null && value !== '') {
      for (let i = 0; i < d.length; i++) {
        // 如果字符串中不包含目标字符会返回-1
        if (d[i].drugName.indexOf(value) >= 0) {
          filtered.push(d[i]);
        }
      }
      this.setState({ data: filtered });
    } else {
      const initdata = this.state.init;
      console.log(initdata);
      this.setState({ data: initdata });
    }
  }

  /**
   * 渲染顶端工具栏
   */
  renderToolBar() {
    return (
      <View style={Global.styles.TOOL_BAR.FIXED_BAR_WITH_NAV} >
        <SearchInput placeholder="请输入关键字" onChangeText={this.changeText} />
      </View>
    );
  }

  renderRow(item) {
    const value = item.item;
    return (
      <TouchableOpacity
        key={item}
        style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15 }]}
        onPress={() => this.props.navigation.navigate('DrugDesc', { item: value })}
      >
        <Text style={{ flex: 1, marginLeft: 15 }}>{value.drugName}</Text>
        <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
      </TouchableOpacity>
    );
  }

  render() {
    if (!this.state.doRenderScene) {
      return DrugList.renderPlaceholderView();
    }

    return (
      <View style={Global.styles.CONTAINER_BG} >
        {this.renderToolBar()}
        <ScrollView style={styles.scrollView} >
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
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  list: {
    backgroundColor: '#ffffff',
  },
});

DrugList.navigationOptions = {
};

export default DrugList;

