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
import { listBigSymptomsByPartId } from '../../../services/tools/TriageService';


class Item extends PureComponent {
  render() {
    const symptom = this.props.data;
    return (
      <TouchableOpacity
        style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15 }]}
        onPress={() => { this.props.onPressItem(); }}
      >
        <Text style={{ flex: 1, marginLeft: 15 }}>{symptom.symptomName}</Text>
        <EasyIcon name="ios-arrow-forward-outline" size={20} width={40} height={20} color={Global.colors.FONT_LIGHT_GRAY1} />
      </TouchableOpacity>
    );
  }
}

class symptomList extends Component {
    static displayName = 'symptomList';
    static description = '病症';

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
      this.loadSymptom = this.loadSymptom.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
      this.getTriageScreenKey = this.getTriageScreenKey.bind(this);
      this.props.navigation.setParams({
        title: '病症',
        hideNavBarBottomLine: false,
      });
    }

    state = {
      doRenderScene: false,
      data: [],

    };
    componentWillMount() {
    }
    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ doRenderScene: true });
        this.loadSymptom();
      });
    }

    // 获取当前页面的key
    getTriageScreenKey() {
      return this.props.navigation.state.key;
    }
    async loadSymptom() {
      try {
        // 显示遮罩
        // this.props.screenProps.showLoading();
        const key = this.props.navigation.state.params.partId;
        const profile = this.props.navigation.state.params.getProfile();
        const responseData = await listBigSymptomsByPartId({ partId: key, gender: profile.gender, minAge: profile.age, maxAge: profile.age });
        if (responseData.success === true) {
          // 隐藏遮罩
          // this.props.screenProps.hideLoading();
          await this.props.navigation.state.params.dealNewLoadSymps(responseData.result);
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
        // this.props.screenProps.hideLoading();
        this.handleRequestException(e);
      }
    }

    renderItem({ item, index }) {
      return (
        <Item
          data={item}
          index={index}
          onPressItem={() => {
                    this.props.navigation.state.params.addSelSymp(item.symptomId, null);
                    if (item.childSymptomCount !== 0) {
                      this.props.navigation.navigate('RelatedSymptoms', {
                        parentSymptomId: item.symptomId,
                        addSelSymp: this.props.navigation.state.params.addSelSymp,
                        getSelSymps: this.props.navigation.state.params.getSelSymps,
                        delSelSymp: this.props.navigation.state.params.delSelSymp,
                        getSympInfo: this.props.navigation.state.params.getSympInfo,
                        getProfile: this.props.navigation.state.params.getProfile,
                        getTriageScreenKey: this.getTriageScreenKey,
                        title: '勾选存在的症状',
                      });
                    } else {
                      this.props.navigation.navigate('SelSymptomsList', {
                        getSelSymps: this.props.navigation.state.params.getSelSymps,
                        delSelSymp: this.props.navigation.state.params.delSelSymp,
                        getSympInfo: this.props.navigation.state.params.getSympInfo,
                        getTriageScreenKey: this.getTriageScreenKey,
                        title: '已选择病症',
                      });
                    }
                }}
        />
      );
    }

    render() {
      if (!this.state.doRenderScene) {
        return symptomList.renderPlaceholderView();
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

symptomList.navigationOptions = {
  title: '病症',
};

export default symptomList;

