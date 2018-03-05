/**
 *手术申请单明细
 */

import React, { Component } from 'react';
import SafeView from 'react-native-safe-area-view';
import Toast from 'react-native-root-toast';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text, ScrollView,
} from 'react-native';
import Sep from 'rn-easy-separator';
import Global from '../../Global';
import CheckButton from '../common/BottomCheckButton';
import BackButton from '../common/BottomBackButton';
import { operationByApp } from '../../services/sickbed/Sickbed';

class OperationDetail extends Component {
  static displayName = 'Operation';
  static description = '手术申请单';
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
    this.onSave = this.onSave.bind(this);
    this.setData = this.setData.bind(this);
  }
  state = {
    doRenderScene: false,
    data: null,
  };
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
    this.setData(this.props.navigation.state.params.item);
  }

  async onSave() {
    try {
      const responseData = await operationByApp(this.state.data.applicationID, Global.user);
      if (responseData.success) {
        this.setState({
          data: responseData.result,
        });
      }
    } catch (e) {
      this.handleRequestException(e);
    }
    Toast.show('审批成功！');
  }
  setData(data) {
    this.setState({
      data,
    });
  }
  getBottomBar() {
    return (
      <View style={Global.styles.FIXED_BOTTOM_BTN_CONTAINER} >
        <BackButton />
        <CheckButton onPress={this.onSave} disabled={(this.props.navigation.state.params.item.status !== '0') || (this.props.navigation.state.params.item.ischeck === false)} />
      </View>
    );
  }

  render() {
    const curPatient = this.props.navigation.state.params.currPatient;
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return OperationDetail.renderPlaceholderView();
    }
    const guaid = this.state.data.guidDocName ? '指导:' : '';
    const ass = this.state.data.firAssName ? '助手:' : '';
    const speExplain = this.state.data.speExplain ? '特殊要求:' : '';
    const arranged = this.state.data.status === '2' ? '已安排 ' : (this.state.data.status === '3' ? '已完成' : '未安排');
    return (
      <View style={styles.GRAY} >
        <SafeView style={Global.styles.SAFE_VIEW} >
          <View style={[styles.patientInfo, { paddingLeft: 10, paddingRight: 10 }]} >
            <View style={styles.container} >
              <Text style={[styles.mainText, { flex: 2 }]} onPress={() => { console.log('patient info...'); }} >
                {curPatient.name}
                <Text style={styles.appendText} > ( {curPatient.gender} {curPatient.age}岁 )   </Text>
              </Text>

              <View style={styles.tagsContainer} >
                <View style={[{ flexDirection: 'row' }]} >
                  {
                          curPatient.bedNo ? (<Text style={[{ color: '#000000' }]}>{curPatient.bedNo}床</Text>) : null
                      }
                  <Text style={[{ paddingLeft: 5, color: '#000000' }]}>{curPatient.inpatientNo}</Text>
                </View>
              </View>
            </View>

            <View style={styles.container} >
              <Text style={styles.normalText} >{curPatient.diagnosisName}</Text>
              <View style={styles.tagsContainer} >
                {
                          curPatient.clinicalPathway === '1' ? (
                            <View style={[styles.tagContainer, { backgroundColor: Global.colors.IOS_GREEN }]} >
                              <Text style={styles.tag} > 临床路径 </Text>
                            </View>
                          ) : null
                      }
                <View style={[styles.tagContainer, { backgroundColor: Global.colors.IOS_RED }]} >
                  <Text style={styles.tag} > {curPatient.nursingLvl} </Text>
                </View>
              </View>
            </View>
          </View>

          <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
          <ScrollView style={[{ flex: 1, backgroundColor: 'white' }]} >

            <View style={[styles.title, { flexDirection: 'row', borderBottomWidth: 1 / Global.pixelRatio, borderBottomColor: Global.colors.LINE }]}>
              <View style={[styles.logo, { borderColor: 'red' }]}>
                <Text style={[styles.logoName, { color: '#000000' }]}>拟</Text>
              </View>
              <View style={[styles.mainView, { flex: 1 }]}>
                <Text style={[{ color: '#000000' }]}>{this.state.data.planOperationName} {this.state.data.isEmergency}   {this.state.data.planOperationTime}</Text>
                <Text style={[{ flexDirection: 'row', marginTop: 5 }]} >
                  <Text style={[{ color: 'red' }]}>主刀:{this.state.data.mainDocName} </Text>
                  <Text>{guaid}{this.state.data.guidDocName} {ass}{this.state.data.firAssName} {this.state.data.secfAssName} </Text>
                </Text>
                <View style={[{ marginTop: 5, paddingRight: 5 }]}><Text>{speExplain}{this.state.data.speExplain}</Text></View>
              </View>
            </View>
            <View style={[styles.title, { flexDirection: 'row', borderBottomWidth: 1 / Global.pixelRatio, borderBottomColor: Global.colors.LINE }]}>
              <View style={[styles.logo, { borderColor: 'red' }]}>
                <Text style={[styles.logoName, { color: '#000000' }]}>审</Text>
              </View>
              {
                  this.state.data.status === '0' ?
                      (<View style={[styles.mainView, { flex: 1 }]}>
                        <Text>待审批</Text>
                      </View>) :
                    (<View style={[styles.mainView, { flex: 1 }]}>
                      <Text>{this.state.data.checkDocName}</Text>
                      <Text style={[{ marginTop: 5, marginBottom: 8 }]} >
                        {this.state.data.checkTime}
                      </Text>
                    </View>)
                }

            </View>
            <View style={[styles.title, { flexDirection: 'row', borderBottomWidth: 1 / Global.pixelRatio, borderBottomColor: Global.colors.LINE }]}>
              <View style={[styles.logo, { borderColor: 'red' }]}>
                <Text style={[styles.logoName, { color: '#000000' }]}>术</Text>
              </View>
              <View style={[styles.mainView, { flex: 1, marginRight: 5 }]}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ flex: 1 }}>{arranged}</Text>
                  <Text style={{ flex: 1 }}>{this.state.data.room}</Text>
                  <Text style={[{ flex: 2, textAlign: 'right', color: 'red' }]}>{this.state.data.arrangeTime}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ flex: 1 }}>{this.state.data.operationName} {this.state.data.isEmergency}</Text>
                  <Text style={[{ width: 120, textAlign: 'right', color: 'red' }]}>{this.state.data.operationTime}</Text>
                </View>
                {
                    this.state.data.anesthetist1Name ? (
                      <Text style={[{ color: 'green' }]}>麻醉:{this.state.data.anesthetist1Name}  {this.state.data.anesthetist2Name}
                      </Text>
                ) : null }
                {
                    this.state.data.insNur1Name ? (<Text>巡回护士:{this.state.data.insNur1Name}  {this.state.data.insNur2Name}</Text>) : null
            }
                {
                    this.state.data.cirNur1Name ? (<Text>器械护士:{this.state.data.cirNur1Name}  {this.state.data.cirNur2Name}</Text>) : null
            }
              </View>
            </View>

          </ScrollView>
          <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
          {this.getBottomBar()}
        </SafeView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  mainText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  normalText: {

    flex: 1,
    color: Global.colors.FONT_GRAY,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tagContainer: {
    padding: 2,
    borderRadius: 3,
    marginLeft: 5,
  },
  tag: {
    fontSize: 11,
    color: 'white',
  },
  title: {
    width: Global.getScreen().width,
    marginTop: 2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  patientInfo: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingLeft: 10,
  },
  introduce: {
    paddingTop: 8,
    paddingLeft: 10,
    fontSize: 14,
    color: '#999999',
    width: Global.getScreen().width,
    marginTop: 2,
    // borderColor: 'blue',
    // borderWidth: 1,
  },
  mainView: {
    paddingTop: 8,
    paddingLeft: 10,
    width: Global.getScreen().width,
  },
  appendText: {
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
    width: Global.getScreen().width,
  },
  GRAY: {

    flex: 1,
    backgroundColor: Global.colors.IOS_LIGHT_GRAY,

  },
  logo: {
    marginTop: 3,
    marginBottom: 3,
    width: 44,
    height: 44,
    marginLeft: 10,
    borderRadius: 22,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  logoName: {
    fontSize: 18,
  },

  reference: { marginLeft: 10 },
  result: { paddingLeft: 10 },
  state: { paddingLeft: 25 },
});

OperationDetail.navigationOptions = {
  title: '手术申请单',
};

export default OperationDetail;
