import React, {
  Component, PureComponent,
} from 'react';

import {
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
import { loadDrugType } from '../../../services/tools/DrugService';


class Item extends PureComponent {
  onPress = () => {
    this.props.onPressItem();
  };
  render() {
    const type = this.props.data;
    return (
      <TouchableOpacity
        style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15 }]}
        onPress={this.onPress}
      >
        <Text style={{ flex: 1, marginLeft: 15 }}>{type.classificationName}</Text>
        <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
      </TouchableOpacity>
    );
  }
}

class MutilDrugType extends Component {
  static displayName = 'MutilDrugType';
  static description = '药品分类列表';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.INDICATOR_CONTAINER]} >
        <ActivityIndicator />
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.loadType = this.loadType.bind(this);
    this.renderToolBar = this.renderToolBar.bind(this);
    this.changeText = this.changeText.bind(this);
  }

  state = {
    doRenderScene: false,
    data: [],
    init: [],

  };
  componentWillMount() {
    const query = { classType: '1' };
    this.loadType(query, null);
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true });
    });
    this.props.navigation.setParams({
      title: '药品分类',
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
      console.log(initdata);
      this.setState({ data: initdata });
    }
  }
  async loadType(query, item) {
    try {
      const responseData = await loadDrugType(query);

      if (responseData.success === true) {
        if (responseData.result.length === 0) {
          this.props.navigation.navigate('DrugList', { type: '1', code: query.parentNode });
        } else {
          if (item !== null) {
            this.props.navigation.setParams({
              title: item.classificationName,
              hideNavBarBottomLine: true,
            });
          }
          await this.setState({ data: responseData.result });
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
  renderItem({ item, index }) {
    const query = { parentNode: item.classificationId };
    return (
      <Item
        data={item}
        index={index}
        onPressItem={() => { this.loadType(query, item); }}
      />
    );
  }

  render() {
    if (!this.state.doRenderScene) {
      return MutilDrugType.renderPlaceholderView();
    }

    return (
      <View style={Global.styles.CONTAINER_BG} >
        {this.renderToolBar()}
        <FlatList
          ref={(c) => { this.listRef = c; }}
          data={this.state.data}
          style={styles.list}
          keyExtractor={(item, index) => `${item}${index + 1}`}
          // 渲染行
          renderItem={this.renderItem}
          // 渲染行间隔
          ItemSeparatorComponent={() => (<Sep height={1 / Global.pixelRatio} bgColor={Global.colors.LINE} />)}
        />
        <View style={{ height: 40 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  list: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

MutilDrugType.navigationOptions = {
};

export default MutilDrugType;

