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
import Global from '../../../Global';
import ctrlState from '../../../modules/ListState';
import SearchInput from '../../../modules/SearchInput';
import { loadSecondTestType, loadByKeyWords } from '../../../services/tools/TestService';

class TestTypeList extends Component {
    static displayName = 'TestTypeList';

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
      ctrlState,

    };
    componentWillMount() {
      const key = this.props.navigation.state.params.item;
      const query = { parentNode: key.classificationId };
      this.loadTestList(query, null);
    }
    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ doRenderScene: true });
      });
      this.props.navigation.setParams({
        title: this.props.navigation.state.params.item.classificationName,
        hideNavBarBottomLine: true,
      });
    }
    async loadTestList(query, value) {
      try {
        // 显示遮罩
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

        // 化验单分类搜索
        const responseData = await loadSecondTestType(query);

        if (responseData.success === true) {
          const newCtrlState = {
            ...this.state.ctrlState,
            refreshing: false,
            infiniteLoading: false,
          };
          if (responseData.result.length === 0) {
            this.props.navigation.navigate('TestList', { code: query, value, type: '1' });
          } else {
            if (value !== null) {
              this.props.navigation.setParams({
                title: value.classificationName,
              });
            }
            this.setState({ data: responseData.result, ctrlState: newCtrlState });
            this.setState({ init: responseData.result });
          }
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
          if (d[i].classificationName.indexOf(value) >= 0) {
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
        <View style={Global.styles.TOOL_BAR.FIXED_BAR} >
          <SearchInput placeholder="请输入关键字" onChangeText={this.changeText} />
        </View>
      );
    }
    renderRow(item) {
      const value = item.item;
      const query = { parentNode: value.classificationId };
      return (
        <TouchableOpacity
          key={item}
          style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15, backgroundColor: 'white' }]}
          onPress={() => { this.loadTestList(query, value); }}
        >
          <Text style={{ flex: 1, marginLeft: 15 }}>{value.classificationName}</Text>
          <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
        </TouchableOpacity>
      );
    }

    render() {
      if (!this.state.doRenderScene) {
        return TestTypeList.renderPlaceholderView();
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



export default TestTypeList;

