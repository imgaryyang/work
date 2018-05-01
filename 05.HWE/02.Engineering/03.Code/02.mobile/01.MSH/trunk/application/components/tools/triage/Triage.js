/**
 * 智能分诊
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  Text,
  View,
  ScrollView,
  Modal,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

import EASYButton from 'rn-easy-button';
import Sep from 'rn-easy-separator';
import Icon from 'rn-easy-icon';
import _ from 'lodash';
import BodyPartListTriage from './BodyPartListTriage';
import Form from '../../../modules/form/EasyForm';
import Global from '../../../Global';
import FormConfig from '../../../modules/form/config/DefaultConfig';

class Triage extends Component {
  static displayName = 'Triage';
  static description = '智能分诊';

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.getSelSymps = this.getSelSymps.bind(this);
    this.addSelSymp = this.addSelSymp.bind(this);
    this.delSelSymp = this.delSelSymp.bind(this);
    this.dealNewLoadSymps = this.dealNewLoadSymps.bind(this);
    this.getSympLog = this.getSympLog.bind(this);
    this.getSympInfo = this.getSympInfo.bind(this);
    this.onRightButtonPress = this.onRightButtonPress.bind(this);
    this._setModalVisible = this._setModalVisible.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSave = this.onSave.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  state = {
    doRenderScene: false,
    animationType: 'none', // none slide fade
    modalVisible: true, // 模态场景是否可见
    transparent: true, // 是否透明显示
    sympInfos: new Map(), // 保存病症信息，包括大病症和小病症。key:id, value:name
    sympRelations: new Map(), // 保存病症之间的关系。 key:大病症ID,value:数组,小病症ID
    selSympItems: new Map(), // 保存选择的病症信息。key:大病症ID,value:数组,小病症ID
    labelPosition: 'top',
    value: { age: '20', gender: '0' },
    defaultValue: { age: '20', gender: '0' },
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });

      this.props.navigation.setParams({
        title: '智能分诊',
        hideNavBarBottomLine: false,
        headerRight: (
          <TouchableOpacity onPress={this.onRightButtonPress}>
            <Icon name="settings" iconLib="Feather" size={20} />
          </TouchableOpacity>
        ),
      });
    });
  }

  onReset() {
    this.setState({ value: { ...this.state.defaultValue } });
  }

  onChange(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }

  onCancel() {
    this._setModalVisible(false);
  }

  onSave(fieldName, fieldValue, formValue) {
    this.setState({ value: formValue });
  }
  onConfirm() {
    const formValue = this.state.value;
    if (typeof formValue.age === 'undefined' || formValue.age === '' || formValue.age === null) {
      // Toast.show('请输入年龄！');
      Alert.alert('提示', '请输入年龄');
      return;
    } else if (!/^[1-9]\d*$/.test(formValue.age)) {
      Alert.alert('提示', '请输入合法年龄！');
      return;
    }

    if (typeof formValue.gender === 'undefined' || formValue.gender === '' || formValue.gender === null) {
      Alert.alert('提示', '请选择性别！');
      return;
    }
    this._setModalVisible(false);
  }

  onRightButtonPress() {
    this._setModalVisible(!this.state.modalVisible);
  }
  getProfile() {
    return this.state.value;
  }
  // 获取选择的症状
  getSelSymps() {
    return this.state.selSympItems;
  }

  getSympLog() {
    console.log('打印病症日志begin:');
    console.log('打印所有病症信息begin:');
    this.state.sympInfos.forEach((value, key, mapObj) => {
      console.log(`----${key}|${value}`);
    });
    console.log('打印所有病症信息end:');

    console.log('打印病症关系信息begin:');
    this.state.sympRelations.forEach((value, key, mapObj) => {
      console.log(`病症关系信息父:${key}`);
      value.forEach((value1, key1, mapObj1) => {
        console.log(`病症关系信息子:${key1}|${value1}---${mapObj1}`);
      });
    });
    console.log('打印病症关系信息end:');

    console.log('打印选择病症关系信息begin:');
    this.state.selSympItems.forEach((value, key, mapObj) => {
      console.log(`病症选择关系信息父:${key}`);
      value.forEach((value1, key1, mapObj1) => {
        console.log(`病症选择关系信息子:${key1}|${value1}---${mapObj1}`);
      });
    });
    console.log('打印选择病症关系信息end:');
  }


  getSympInfo() {
    return this.state.sympInfos;
  }
  // 处理新加载的症状(将新加载的症状维护进入state.sympInfos和state.sympRelations中)
  dealNewLoadSymps(newLoadedSympInfos, parentId) {
    if (typeof newLoadedSympInfos === 'undefined') {
      return;
    }

    // 将输入增量加入到ympInfos
    for (let idx = 0; idx < newLoadedSympInfos.length; idx++) {
      const curLoadSympInfo = newLoadedSympInfos[idx];
      if (!this.state.sympInfos.has(curLoadSympInfo.symptomId)) {
        this.state.sympInfos.set(curLoadSympInfo.symptomId, curLoadSympInfo.symptomName);
      }
    }

    this.getSympLog();
  }

  // 增加症状
  // sympId:症状Id
  // sympName:症状名称
  // sympType:'0':大症状 '1':小症状
  addSelSymp(sympId, parentSympId) {
    const selSympItems = this.state.selSympItems;
    // 入参有效
    if (typeof sympId !== 'undefined' && sympId != null && sympId !== '') {
      // 有父症状(则其为小症状)
      if (typeof parentSympId !== 'undefined' && parentSympId != null && parentSympId !== '') {
        if (!selSympItems.has(parentSympId)) {
          selSympItems.set(parentSympId, []);
        }
        if (selSympItems.get(parentSympId).indexOf(sympId) === -1) {
          selSympItems.get(parentSympId).push(sympId);
        }
      } else if (!selSympItems.has(sympId)) { // 大症状
        selSympItems.set(sympId, []);
      }
    }
  }

  // 删除症状
  // sympId:症状Id
  // sympName:症状名称
  // sympType:'0':大症状 '1':小症状
  delSelSymp(sympId, parentSympId) {
    const selSympItems = this.state.selSympItems;
    if (typeof sympId !== 'undefined' && sympId != null && sympId !== '') {
      // 有父症状(则其为小症状)
      if (typeof parentSympId !== 'undefined' && parentSympId !== null && parentSympId !== '') {
        // 对应的大症状存在
        if (selSympItems.has(parentSympId)) {
          const sympIndex = selSympItems.get(parentSympId).indexOf(sympId);
          if (sympIndex !== -1) {
            selSympItems.get(parentSympId).splice(sympIndex, 1);
          }
        }
      } else if (selSympItems.has(sympId)) { // 大症状
        selSympItems.delete(sympId);
      }
    }

    this.getSympLog();
  }
  _setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };
  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return Triage.renderPlaceholderView();
    }
    const genders = [
      { label: '女', value: '0' },
      { label: '男', value: '1' },
    ];
    const modalBackgroundStyle = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
    };
    const innerContainerTransparentStyle = this.state.transparent ? { backgroundColor: '#fff', padding: 20 } : null;
    return (
      <View style={[Global.styles.CONTAINER]}>
        <ScrollView>
          <BodyPartListTriage tabLabel="列表" navigates={this.props.navigation.navigate} screenProps={this.props.screenProps} delSelSymp={this.delSelSymp} addSelSymp={this.addSelSymp} getSelSymps={this.getSelSymps} dealNewLoadSymps={this.dealNewLoadSymps} getSympLog={this.getSympLog} getSympInfo={this.getSympInfo} getProfile={this.getProfile} />
        </ScrollView>
        <Modal
          animationType={this.state.animationType}
          transparent={this.state.transparent}
          visible={this.state.modalVisible}
          onBackdropPress={() => this.setState({ modalVisible: false })}
          animationIn="slideInDown"
          onRequestClose={() => { this._setModalVisible(false); }}
        >
          <View style={[modalStyles.container, modalBackgroundStyle]}>
            <View style={[modalStyles.innerContainer, innerContainerTransparentStyle]}>
              <Text style={styles.headerText} >个人设置</Text>
              <Sep height={1 / Global.pixelRatio} bgColor={Global.colors.IOS_SEP_LINE} />
              <Form
                ref={(c) => { this.form = c; }}
                onChange={this.onChange}
                config={FormConfig}
                labelWidth={80}
                showLabel
                value={this.state.value}
                labelPosition={this.state.labelPosition}
              >
                <Form.TextInput
                  name="age"
                  label="年龄"
                  dataType="int"
                  textAlign="center"
                  required
                  showAdjustButton
                />
                <Form.Checkbox name="gender" label="性别" dataSource={genders} />
                <Text style={{ marginLeft: 15, marginRight: 15, marginBottom: 10, marginTop: 10 }}>测试结果仅供参考，可能产生误诊、漏诊，不能代替医生和其他医务人员的建议。</Text>
                <View style={styles.buttonHolder} >
                  <EASYButton text="重置" onPress={this.onReset} theme={EASYButton.THEME.BLUE} title="重置" />
                  <Sep width={10} />
                  <EASYButton text="确定" onPress={this.onConfirm} theme={EASYButton.THEME.BLUE} title="确定" />
                </View>
              </Form>
            </View>
          </View>
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    textAlign: 'center',
    color: Global.colors.FONT_GRAY,
    fontSize: 16,
    paddingBottom: 16,
  },
  buttonHolder: {
    flexDirection: 'row',
    margin: 10,
    marginTop: 20,
  },
});

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'stretch',
  },
  row: {
    alignItems: 'center',

    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
  },
  rowTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 5,
    flex: 1,
    height: 44,
    alignSelf: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
  },

  page: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  zhifu: {
    height: 150,
  },

  flex: {
    flex: 1,
  },
  at: {
    borderWidth: Global.lineWidth,
    width: 80,
    marginLeft: 10,
    marginRight: 10,
    borderColor: '#18B7FF',
    height: 1,
    marginTop: 10,

  },
  date: {
    textAlign: 'center',
    marginBottom: 5,
  },
  station: {
    fontSize: 20,
  },
  mp10: {
    marginTop: 5,
  },
  btn: {
    width: 60,
    height: 30,
    borderRadius: 3,
    backgroundColor: '#FFBA27',
    padding: 5,
  },
  btn_text: {
    lineHeight: 18,
    textAlign: 'center',
    color: '#fff',
  },
  buttonHolder: {
    flexDirection: 'row',
    margin: 10,
    marginTop: 20,
    marginBottom: 40,
  },
  scrollView: {
    flex: 1,
  },
});

export default Triage;
