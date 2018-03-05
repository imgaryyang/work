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
import { loadDiseaseByKeyWords, loadCommonDisease, loadDiseaseByPart } from '../../../services/tools/DiseaseaService';


class DiagnoseList extends Component {
    static displayName = 'DiagnoseList';
    static description = '疾病列表';

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
      this.loadDiseaseList = this.loadDiseaseList.bind(this);
      this.changeText = this.changeText.bind(this);
      this.renderToolBar = this.renderToolBar.bind(this);
    }

    state = {
      doRenderScene: false,
      data: [],
      init: [],

    };
    componentWillMount() {
      this.loadDiseaseList();
    }
    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ doRenderScene: true });
      });
    }

    changeText(value) {
      const d = this.state.data;
      const filtered = [];
      if (value !== null && value !== '') {
        for (let i = 0; i < d.length; i++) {
          // 如果字符串中不包含目标字符会返回-1
          if (d[i].diseaseName.indexOf(value) >= 0) {
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
    async loadDiseaseList() {
      try {
        const searchtype = this.props.navigation.state.params.type;
        let responseData;
        if (searchtype === '2') {
          this.props.navigation.setParams({
            title: '常见疾病列表',
            hideNavBarBottomLine: true,
          });
          responseData = await loadCommonDisease();
        } else {
          this.props.navigation.setParams({
            title: '疾病列表',
            hideNavBarBottomLine: true,
          });
          // 根据部位搜索
          const part = this.props.navigation.state.params.code;
          const query = { partId: part };
          responseData = await loadDiseaseByPart(query);
        }
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
          onPress={() => this.props.navigation.navigate('DiseaseDetail', { item: value })}
        >
          <Text style={{ flex: 1, marginLeft: 15 }}>{value.diseaseName}</Text>
          <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
        </TouchableOpacity>
      );
    }

    render() {
      if (!this.state.doRenderScene) {
        return DiagnoseList.renderPlaceholderView();
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

DiagnoseList.navigationOptions = {
  title: '疾病列表',
};

export default DiagnoseList;

