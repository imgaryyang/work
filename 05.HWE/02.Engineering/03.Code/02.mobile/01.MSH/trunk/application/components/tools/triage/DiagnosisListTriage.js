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
import { listDiseasesBySymptomIds } from '../../../services/tools/TriageService';

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
    this.getSelSymptoIds = this.getSelSymptoIds.bind(this);
    this.props.navigation.setParams({
      title: '疾病',
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
      this.loadDiseaseList();
      this.setState({ doRenderScene: true });
    });
  }

  getSelSymptoIds() {
    const selSymps = this.props.navigation.state.params.getSelSymps();
    const sortedSympKeys = Array.from(selSymps.keys()).sort()
    let selSympIds = '';
    for (let idx = 0; idx < sortedSympKeys.length; idx++) {
      if (idx !== 0) {
        selSympIds += ',';
      }
      selSympIds += sortedSympKeys[idx];
    }
    return { symptomId: selSympIds };
  }

  async loadDiseaseList() {
    try {
      console.info('loadDiseaseList:', this.getSelSymptoIds());
      const responseData = await listDiseasesBySymptomIds(this.getSelSymptoIds());
      if (responseData.success === true) {
        this.setState({ data: responseData.result });
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
        <Text style={{ marginLeft: 15, marginRight: 15, marginBottom: 10, marginTop: 10 }}>若症状程度较重、反复或持续不缓解、甚至加剧，请及时就医！</Text>
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

