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
import SearchInput from '../../../modules/SearchInput';
import Sep from 'rn-easy-separator';
import Global from '../../../Global';
import { loadByKeyWords, loadAll, loadRecent } from '../../../services/tools/VaccineService';


class VaccinesList extends Component {
    static displayName = 'VaccinesList';
    static description = '疫苗列表';

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
      this.loadVaccineList = this.loadVaccineList.bind(this);
      this.renderToolBar = this.renderToolBar.bind(this);
      this.changeText = this.changeText.bind(this);
    }

    state = {
      doRenderScene: false,
      data: [],
      init: [],

    };
    componentWillMount() {
      this.loadVaccineList();
    }
    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ doRenderScene: true });
      });
    }
    async loadVaccineList() {
      try {
        // 显示遮罩
        // this.props.screenProps.showLoading();
        const searchtype = this.props.navigation.state.params.type;
        let responseData;

        if (searchtype === '1') {
          this.props.navigation.setParams({
            title: '全部疫苗接种',
            hideNavBarBottomLine: true,
          });
          // 查找全部接种疫苗
          responseData = await loadAll();
        } else if (searchtype === '2') {
          this.props.navigation.setParams({
            title: '新生儿接种疫苗',
            hideNavBarBottomLine: true,
          });
          // 新生儿接种疫苗
          responseData = await loadRecent();
        } else {
          // 根据关键字搜索
          const word = this.props.navigation.state.params.keywords;
          const query = { vaccineName: word };
          responseData = await loadByKeyWords(query);
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
      console.log('111', value);
      const d = this.state.data;
      const filtered = [];
      if (value !== null && value !== '') {
        for (let i = 0; i < d.length; i++) {
          // 如果字符串中不包含目标字符会返回-1
          if (d[i].vaccineName.indexOf(value) >= 0) {
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
      return (
        <TouchableOpacity
          key={item}
          style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15, backgroundColor: 'white' }]}
          onPress={() => this.props.navigation.navigate('VaccinesDesc', { item: value })}
        >
          <Text style={{ flex: 1, marginLeft: 15 }}>{value.vaccineName}</Text>
          <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
        </TouchableOpacity>
      );
    }

    render() {
      if (!this.state.doRenderScene) {
        return VaccinesList.renderPlaceholderView();
      }

      return (
        <View style={Global.styles.CONTAINER} >
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

VaccinesList.navigationOptions = {
  title: '药品列表',
};

export default VaccinesList;

