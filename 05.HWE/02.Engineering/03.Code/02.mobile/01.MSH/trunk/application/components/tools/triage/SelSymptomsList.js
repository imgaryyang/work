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

import Toast from 'react-native-root-toast';
import Sep from 'rn-easy-separator';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';
import Global from '../../../Global';

class Item extends PureComponent {
  render() {
    const symptom = this.props.data;
    return (
      <View style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15 }]}>
        <TouchableOpacity onPress={() => { this.props.onDelete(); }} style={{ justifyContent: 'center', flexDirection: 'row', paddingRight: 10, alignItems: 'flex-start', width: 80 }}>
          <Icon name="cross" iconLib='et' />
          <Text style={{ fontSize: 15, color: Global.colors.IOS_BLUE }}>删除</Text>
        </TouchableOpacity>
        <Text style={{ flex: 1, marginLeft: 15 }}>{symptom.symptomName}</Text>
      </View>
    );
  }
}
class selSymptomList extends Component {
  static displayName = 'selSymptomList';
  static description = '已选择病症';

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
    this.loadSelSymptom = this.loadSelSymptom.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.onRightButtonPress = this.onRightButtonPress.bind(this);

    this.props.navigation.setParams({
      title: '已选择症状',
      hideNavBarBottomLine: false,
      headerRight: (
        <TouchableOpacity onPress={this.onRightButtonPress}>
          <Icon name="plus" iconLib="Entypo" size={25} />
        </TouchableOpacity>
      ),
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
      this.loadSelSymptom();
    });
  }

  onRightButtonPress() {
    this.props.navigation.goBack(this.props.navigation.state.params.getTriageScreenKey());
  }

  // 删除确认
  confirmDelete(symptomId) {
    if (typeof symptomId === 'undefined' || symptomId === '' || symptomId === null) {
      Toast.show('请选择要删除的项！');
      return;
    }
    Alert.alert(
      '提示',
      '您确定要删除选中的记录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            this.props.navigation.state.params.delSelSymp(symptomId);
            const selData = this.state.data;
            for (let idx = 0; idx < selData.length; idx++) {
              if (selData[idx].symptomId === symptomId) {
                selData.splice(idx, 1);
                break;
              }
            }
            this.setState({ data: selData });
          },
        },
      ],
    );
  }


  async loadSelSymptom() {
    const selSymps = this.props.navigation.state.params.getSelSymps();
    const sympInfos = this.props.navigation.state.params.getSympInfo();
    // 转换格式后的病症信息
    const convertedSelSymps = [];
    const sortedSympKeys = Array.from(selSymps.keys()).sort()
    for (let idx = 0; idx < sortedSympKeys.length; idx++) {
      convertedSelSymps.push({ symptomId: sortedSympKeys[idx], symptomName: sympInfos.get(sortedSympKeys[idx]) });
    }

    this.setState({data:convertedSelSymps});
    return convertedSelSymps;
  }

  renderItem({ item, index }) {
    return (
      <Item
        data={item}
        index={index}
        onDelete={() => { this.confirmDelete(item.symptomId); }}
      />
    );
  }

  render() {
    if (!this.state.doRenderScene) {
      return selSymptomList.renderPlaceholderView();
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
        <Button
          style={styles.button}
          text="查看可能的疾病"
          onPress={() => {
            this.props.navigation.navigate('DiagnosisListTriage', {
              getSelSymps: this.props.navigation.state.params.getSelSymps,
              delSelSymp: this.props.navigation.state.params.delSelSymp,
              getSympInfo: this.props.navigation.state.params.getSympInfo,
            });
          }}
        />
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
  margin: {
    marginLeft: 50,
    marginRight: 50,
  },
  button: {
    flex: 0,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 15,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

selSymptomList.navigationOptions = {
  title: '关联病症',
};

export default selSymptomList;

