import React, {
  Component, PureComponent,
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
import { loadPart } from '../../../services/tools/DiseaseaService';


class Item extends PureComponent {
    onPress = () => {
      this.props.onPressItem();
    };
    render() {
      const part = this.props.data;

      return (
        <TouchableOpacity
          style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15 }]}
          onPress={this.onPress}
        >
          <Text style={{ flex: 1, marginLeft: 15 }}>{part.partName}</Text>
          <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
        </TouchableOpacity>
      );
    }
}

class PartList extends Component {
    static displayName = 'PartList';

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
      this.loadPart = this.loadPart.bind(this);
      this.changeText = this.changeText.bind(this);
    }

    state = {
      doRenderScene: false,
      data: [],
      init: [],

    };
    componentWillMount() {
      this.loadPart();
    }
    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ doRenderScene: true });
      });
      this.props.navigation.setParams({
        title: '部位',
        hideNavBarBottomLine: true,
      });
    }


    changeText(value) {
      const d = this.state.data;
      const filtered = [];
      if (value !== null && value !== '') {
        for (let i = 0; i < d.length; i++) {
          // 如果字符串中不包含目标字符会返回-1
          if (d[i].partName.indexOf(value) >= 0) {
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
    async loadPart() {
      try {
        const responseData = await loadPart();
        if (responseData.success === true) {
          // 隐藏遮罩
          await this.setState({ data: responseData.result });
          await this.setState({ init: responseData.result });
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

    renderItem({ item, index }) {
      return (
        <Item
          data={item}
          index={index}
          onPressItem={() => {
 this.props.navigation.navigate('DiagnosisList', {
              type: '3',
              code: item.partId,
          });
}}
        />
      );
    }

    render() {
      if (!this.state.doRenderScene) {
        return PartList.renderPlaceholderView();
      }

      return (
        <View style={Global.styles.CONTAINER_BG} >

          <ScrollView style={styles.scrollView} >
            <View style={Global.styles.TOOL_BAR.FIXED_BAR} >
              <SearchInput placeholder="请输入关键字" onChangeText={this.changeText} />
            </View>
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

PartList.navigationOptions = {
  title: '疾病列表',
};

export default PartList;

