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

class partList extends Component {
    static displayName = 'DiagnoseList';
    static description = '选择身体部位';

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
      // this.gotoList = this.gotoList.bind(this);
    }

    state = {
      doRenderScene: false,
      data: [],
    };
    componentWillMount() {
      this.loadPart();
    }
    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ doRenderScene: true });
      });
    }

    async loadPart() {
      try {
        // 显示遮罩
        this.props.screenProps.showLoading();
        const responseData = await loadPart();
        if (responseData.success === true) {
          // 隐藏遮罩
          this.props.screenProps.hideLoading();
          await this.setState({ data: responseData.result });
        } else {
          Alert.alert(
            '提示',
            responseData.msg,
            [
              {
                text: '确定',
                onPress: () => {
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
                    this.props.navigates('Symptom', {
                        partId: item.partId,
                        partName: item.partName,
                        delSelSymp: this.props.delSelSymp,
                        addSelSymp: this.props.addSelSymp,
                        getSelSymps: this.props.getSelSymps,
                        dealNewLoadSymps: this.props.dealNewLoadSymps,
                        dealSelSymps: this.props.dealSelSymps,
                        getSympInfo: this.props.getSympInfo,
                        getProfile: this.props.getProfile,
                    });
                }}
        />
      );
    }

    render() {
      if (!this.state.doRenderScene) {
        return partList.renderPlaceholderView();
      }

      return (
        <View style={Global.styles.CONTAINER} >
          <ScrollView style={styles.scrollView} >
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
          </ScrollView>
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
    backgroundColor: '#ffffff',
  },
});

partList.navigationOptions = {
  title: '选择身体部位',
};

export default partList;

