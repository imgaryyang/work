import React, {
  Component,
} from 'react';

import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
  FlatList,
  ActivityIndicator, Alert,
} from 'react-native';

import EasyIcon from 'rn-easy-icon';
import Sep from 'rn-easy-separator';
import SearchInput from '../../../modules/SearchInput';
import Global from '../../../Global';
import { loadTestList, loadByKeyWords } from '../../../services/tools/TestService';


class TestList extends Component {
    static displayName = 'TestList';
    static description = '化验列表';

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
      this.loadTestList = this.loadTestList.bind(this);
      this.renderToolBar = this.renderToolBar.bind(this);
      this.changeText = this.changeText.bind(this);
    }

    state = {
      doRenderScene: false,
      data: [],
      init: [],
    };
    componentWillMount() {
      this.loadTestList();
    }

    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ doRenderScene: true });
      });
      const t = this.props.navigation.state.params.value;

      this.props.navigation.setParams({
        title: t.classificationName,
        hideNavBarBottomLine: true,
      });
    }
    async loadTestList() {
      try {
        // 显示遮罩
        // this.props.screenProps.showLoading();
        const searchtype = this.props.navigation.state.params.type;
        let responseData;
        if (searchtype === '1') {
          // 药品分类搜索
          const key = this.props.navigation.state.params.code;
          responseData = await loadTestList(key);
        } else {
          // 根据关键字搜索
          const word = this.props.navigation.state.params.keywords;
          const query = { laboratoryName: word };
          responseData = await loadByKeyWords(query);
        }
        if (responseData.success === true) {
          // 隐藏遮罩
          // this.props.screenProps.hideLoading();
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
          if (d[i].classificationName !== undefined) {
            if (d[i].classificationName.indexOf(value) >= 0) {
              filtered.push(d[i]);
            }
          }
          if (d[i].laboratoryName !== undefined) {
            if (d[i].laboratoryName.indexOf(value) >= 0) {
              filtered.push(d[i]);
            }
          }
        }
        this.setState({ data: filtered });
      } else {
        const initdata = this.state.init;
        console.log(initdata);
        this.setState({ data: initdata });
      }
    }
    renderRow(item) {
      const value = item.item;
      return (
        <TouchableOpacity
          key={item}
          style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15, backgroundColor: 'white' }]}
          onPress={() => this.props.navigation.navigate('TestDesc', { item: value })}
        >
          <Text style={{ flex: 1, marginLeft: 15 }}>{value.laboratoryName}</Text>
          <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
        </TouchableOpacity>
      );
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
    render() {
      if (!this.state.doRenderScene) {
        return TestList.renderPlaceholderView();
      }

      return (
        <View style={Global.styles.CONTAINER_BG} >
          <ScrollView style={styles.scrollView} >
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
            <Sep height={40} />
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

TestList.navigationOptions = {
  title: '药品列表',
};

export default TestList;

