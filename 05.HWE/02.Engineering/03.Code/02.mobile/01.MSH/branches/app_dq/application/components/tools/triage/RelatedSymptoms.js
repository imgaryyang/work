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

import Button from 'rn-easy-button';
import Sep from 'rn-easy-separator';
import Global from '../../../Global';
import { listSmallSymptomsByBigSymptomId } from '../../../services/tools/TriageService';
import Checkbox from '../../../modules/Checkbox';


class Item extends PureComponent {
  render() {
    const symptom = this.props.data;
    return (
      <TouchableOpacity
        style={[Global.styles.CENTER, { flexDirection: 'row', paddingTop: 15, paddingBottom: 15 }]}
        onPress={() => { this.props.onPressItem(); }}
      >
        <Checkbox
          checked={this.props.checked}
          style={{ marginLeft: 15 }}
          onPress={() => { this.props.onPressItem(); }}
        />
        <Text style={{ flex: 1, marginLeft: 15 }}>{symptom.symptomName}</Text>
      </TouchableOpacity>
    );
  }
}
class relatedSymptomList extends Component {
    static displayName = 'relatedSymptomList';
    static description = '关联病症';

    static renderPlaceholderView() {
      return (
        <View style={[Global.styles.INDICATOR_CONTAINER]} >
          <ActivityIndicator />
        </View>
      );
    }

    constructor(props) {
      super(props);
      this.props.navigation.setParams({
        title: '勾选存在的症状',
        hideNavBarBottomLine: false,
      });
      this.renderItem = this.renderItem.bind(this);
      this.loadRelatedSymptom = this.loadRelatedSymptom.bind(this);
      this.setSelState = this.setSelState.bind(this);
    }

    state = {
      doRenderScene: false,
      data: [],
      selData: new Map(),

    };

    componentWillMount() {
    }
    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ doRenderScene: true });
        this.loadRelatedSymptom();
      });
    }

    // 病症选择处理事件响应函数
    onPressItem(symptomId, symptomName) {
      const SelData = this.state.selData;
      if (!SelData.has(symptomId)) {
        SelData.set(symptomId, symptomName);
        this.props.navigation.state.params.addSelSymp(symptomId, this.props.navigation.state.params.parentSymptomId);
      } else {
        this.props.navigation.state.params.delSelSymp(symptomId, this.props.navigation.state.params.parentSymptomId);
        SelData.delete(symptomId);
      }
      this.setState({ selData: SelData });
    }

    setSelState() {
      this.state.selData.clear();
      const selSymps = this.props.navigation.state.params.getSelSymps();
      if (!selSymps.has(this.props.navigation.state.params.parentSymptomId)) {
        return;
      }
      const selRelSymps = selSymps.get(this.props.navigation.state.params.parentSymptomId);
      const sympInfo = this.props.navigation.state.params.getSympInfo();
      for (let idx = 0; idx < selRelSymps.length; idx++) {
        this.state.selData.set(selRelSymps[idx], sympInfo.get(selRelSymps[idx]));
      }
    }
    async loadRelatedSymptom() {
      try {
        // 显示遮罩
        this.props.screenProps.showLoading();
        const key = this.props.navigation.state.params.parentSymptomId;
        const profile = this.props.navigation.state.params.getProfile;
        const responseData = await listSmallSymptomsByBigSymptomId({ parentSymptomId: key, gender: profile.gender, minAge: profile.minAge, maxAge: profile.maxAge });
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
          checked={this.state.selData.has(item.symptomId)}
          onPressItem={() => this.onPressItem(item.symptomId, item.symptomName)}
        />
      );
    }

    render() {
      if (!this.state.doRenderScene) {
        return relatedSymptomList.renderPlaceholderView();
      }
      this.setSelState();
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
            text="下一步"
            onPress={() => {
              this.props.navigation.navigate('SelSymptomsList', {
                getSelSymps: this.props.navigation.state.params.getSelSymps,
                delSelSymp: this.props.navigation.state.params.delSelSymp,
                getSympInfo: this.props.navigation.state.params.getSympInfo,
                getTriageScreenKey: this.props.navigation.state.params.getTriageScreenKey,
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

relatedSymptomList.navigationOptions = {
  title: '关联病症',
};

export default relatedSymptomList;

