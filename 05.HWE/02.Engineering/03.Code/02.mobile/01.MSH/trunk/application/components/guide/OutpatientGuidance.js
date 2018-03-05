/**
 * 智能导诊
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
// import Toast from 'react-native-root-toast';
import Card from 'rn-easy-card';
// import Portrait from 'rn-easy-portrait';
import Sep from 'rn-easy-separator';
import Icon from 'rn-easy-icon';
import Button from 'rn-easy-button';
import { B } from 'rn-easy-text';

import Global from '../../Global';
import { getGuidance } from '../../services/guide/GuideService';
// import { base } from '../../services/RequestTypes';

import { setCurrHospital } from '../../actions/base/BaseAction';

import StepRegister from './steps/StepRegister';
import StepDiagnosis from './steps/StepDiagnosis';
import StepOrder from './steps/StepOrder';
import StepCheck from './steps/StepCheck';
import StepDrug from './steps/StepDrug';
import StepCure from './steps/StepCure';
import StepQueue from './steps/StepQueue';

export const TIMELINE_WIDTH = 93;
const HEADER_HEIGHT = /* 38 + 36 + */70;

class OutpatientGuidance extends Component {
  static displayName = 'OutpatientGuidance';
  static description = '门诊导诊';

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  static renderPlaceholderView() {
    return (
      <View style={Global.styles.INDICATOR_CONTAINER} >
        <ActivityIndicator />
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.pullToRefresh = this.pullToRefresh.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderStepCats = this.renderStepCats.bind(this);
    this.backParent = this.backParent.bind(this);
    // this.onMainContainerLayout = this.onMainContainerLayout.bind(this);
  }

  state = {
    doRenderScene: false,
    pullToRefreshing: false,
    data: null,
    step: 1,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ doRenderScene: true }, () => {
        this.pullToRefresh();
      });
    });
  }

  /* onMainContainerLayout(e) {
    this.setState({ mainContainerHeight: e.nativeEvent.layout.height });
  }*/

  pullToRefresh() {
    this.setState({
      pullToRefreshing: true,
      step: this.state.step + 1,
    }, () => {
      this.fetchData();
    });
  }

  async fetchData() {
    try {
      const guidanceData = await getGuidance(this.state.step);
      // console.log('......guidance:', guidanceData);
      if (guidanceData.success) {
        this.setState({
          pullToRefreshing: false,
          data: guidanceData.result,
        });
      } else {
        this.setState({
          pullToRefreshing: false,
        });
        this.handleRequestException({ msg: '获取导诊信息出错，请稍后再试！' });
      }
    } catch (e) {
      this.setState({
        pullToRefreshing: false,
      });
      this.handleRequestException(e);
    }
  }

  backParent() {
    this.props.navigator.pop();
    if (this.props.refresh && typeof this.props.refresh === 'function') {
      this.props.refresh();
    }
  }

  /**
   * 渲染导诊步骤
   */
  renderStepCats() {
    if (this.state.data) {
      // console.log('renderStepCats.......', this.state.data);
      // console.log(this.state.data.groups);
      return this.state.data.groups.map((item, idx) => {
        switch (item.bizType) {
          case 'register': // 预约挂号
            return <StepRegister key={`cat_${idx + 1}`} item={item} idx={idx} navigate={this.props.navigate} />;
          case 'diagnosis': // 看诊
            return <StepDiagnosis key={`cat_${idx + 1}`} item={item} idx={idx} navigate={this.props.navigate} />;
          case 'cure': // 治疗
            return <StepCure key={`cat_${idx + 1}`} item={item} idx={idx} navigate={this.props.navigate} />;
          case 'order': // 缴费
            // if (item.steps[0].bizObject.state === '1') { return null; }
            return <StepOrder key={`cat_${idx + 1}`} item={item} idx={idx} navigate={this.props.navigate} />;
          case 'check': // 检查
            return <StepCheck key={`cat_${idx + 1}`} item={item} idx={idx} navigate={this.props.navigate} />;
          case 'drug': // 取药
            return <StepDrug key={`cat_${idx + 1}`} item={item} idx={idx} navigate={this.props.navigate} />;
          case 'queue': // 排号
            return <StepQueue key={`cat_${idx + 1}`} item={item} idx={idx} navigate={this.props.navigate} />;
          default:
            return null;
        }
      });
    }
  }

  renderHeader() {
    // console.log('json>>>>', JSON.stringify(this.props.base.currHospital));
    const hosp = {
      id: '8a81a7db4dad2271014dad2271e20001',
      createdBy: 'lxm',
      updatedBy: 'lxm',
      createdAt: '2017-12-19 11:38:58',
      updatedAt: '2017-12-19 11:39:06',
      startDate: null,
      endDate: null,
      orgId: '8a81a7db4dad2271014dad22org20001',
      name: '北京大学人民医院',
      no: '001',
      type: '1',
      level: '3A',
      stars: 4.5,
      likes: 190,
      favs: 99,
      goodComment: 1000,
      badComment: 8,
      comment: '1008',
      status: '1',
      logo: '8a50ad50e87c11e7be625254001f7cdb',
      scenery: '54279a56e87d11e7be625254001f7cdb',
      sceneryNum: 4,
      longitude: 116.360788,
      latitude: 39.942493,
      org: null,
      profiles: null,
    };
    const row = this.props.row || {};
    row.patient = this.props.base.currPatient;
    row.hospital = hosp;
    row.cardTypeName = '就诊卡';
    row.cardNo = '342423563';

    const item = this.props.item || {};
    item.departmentName = '消化内科';
    item.doctorName = '何权瀛';
    item.doctorTitle = '副主任医师';
    item.diagnosis = this.state.step > 2 ? '急性肠胃炎' : '还未开立诊断';
    item.deptAddr = '1号门诊楼8层C区';

    // const hospLogo = row.hospital && row.hospital.logo ?
    //   { uri: (`${base().img}${row.hospital.logo}`) } :
    //   Global.Config.defaultImgs.hospLogo;

    // const portrait = row.patient && row.patient.portrait ?
    //   { uri: (`${base().img}${row.patient.portrait}`) } :
    //   Global.Config.defaultImgs.userPortrait;

    return (
      <Card fullWidth noPadding style={[styles.header, styles.headerShadow]} >
        {/* <View style={[styles.hospHolder, Global.styles.CENTER]} >
          <Portrait imageSource={hospLogo} width={26} height={26} />
          <Text style={styles.hospName} >{row.hospital.name}</Text>
        </View>
        <View style={[styles.patientHolder, Global.styles.CENTER]} >
          <Portrait imageSource={portrait} bgColor={Global.colors.IOS_GRAY_BG} width={30} height={30} radius={5} />
          <View style={styles.patientNameHolder} >
            <Text style={styles.patientNameText} >就诊人</Text>
            <Text style={styles.patientName} >{row.patient.name} </Text>
          </View>
          <View style={styles.cardHolder} >
            <Text style={styles.cardTypeName} >{row.cardTypeName}</Text>
            <Text style={styles.cardNo} >{row.cardNo}</Text>
          </View>
        </View>*/}
        <Sep style={Global.styles.FULL_SEP_LINE} />
        <View style={[{ flexDirection: 'row' }, Global.styles.CENTER]} >
          <Text style={styles.deptName} >{item.departmentName}</Text>
          <View style={styles.treatInfo} >
            <Text style={styles.doc}><B>主诊医生：</B>{item.doctorName}<Text style={styles.appendText} >{item.doctorTitle ? ` [ ${item.doctorTitle} ]` : ''}</Text></Text>
            <Text style={styles.medicalResult}><B>诊断结果：</B>{item.diagnosis}</Text>
            <View style={[styles.addrHolder, Global.styles.CENTER]} >
              <Icon name="ios-pin" size={11} width={18} height={12} color={Global.colors.FONT_LIGHT_GRAY1} />
              <Text style={styles.addr} >{item.deptAddr}</Text>
            </View>
          </View>
        </View>

      </Card>
    );
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return OutpatientGuidance.renderPlaceholderView();
    }

    const { auth } = this.props;
    const { pullToRefreshing, data } = this.state;

    // 未登录状态提示登录
    if (!auth.isLoggedIn) {
      return (
        <View style={[Global.styles.CONTAINER, Global.styles.CENTER]} >
          <View style={{ width: Global.getScreen().width, justifyContent: 'center', alignItems: 'center', marginBottom: 50 }} >
            <Text style={{ textAlign: 'center', color: Global.colors.FONT_GRAY, fontSize: 16 }} >请登录系统获取您的导诊信息</Text>
            <Button
              text="登录系统"
              outline
              stretch={false}
              style={{ width: 245, height: 30, marginTop: 30 }}
              onPress={() => this.props.navigate({ routeName: 'Login' })}
            />
          </View>
        </View>
      );
    }

    // 未选择医院提示选择医院先
    if (!this.props.base.currHospital) {
      return (
        <View style={[Global.styles.CONTAINER, Global.styles.CENTER]} >
          <View style={{ width: Global.getScreen().width, justifyContent: 'center', alignItems: 'center', marginBottom: 50 }} >
            <Text style={{ textAlign: 'center', color: Global.colors.FONT_GRAY, fontSize: 16 }} >请先选择医院，获取导诊信息</Text>
            <Button
              text="选择医院"
              outline
              stretch={false}
              style={{ width: 245, height: 30, marginTop: 30 }}
              onPress={() => {
                this.props.navigate({
                  routeName: 'ChooseHospital',
                    params: {
                      chooseHospital: hospital => this.props.setCurrHospital(hospital),
                    },
                  });
                }
              }
            />
          </View>
        </View>
      );
    }

    // 未获取数据，提示去挂号
    if (!pullToRefreshing && !data) {
      return (
        <View style={[Global.styles.CONTAINER, Global.styles.CENTER]} >
          <View style={{ width: Global.getScreen().width, justifyContent: 'center', alignItems: 'center', marginBottom: 50 }} >
            <Text style={{ textAlign: 'center', color: Global.colors.FONT_GRAY, fontSize: 16, lineHeight: 22 }} >
              暂无未完成的就诊信息{'\n'}您可以随便看看或先去预约挂号
            </Text>
            <Button
              text="预约挂号"
              outline
              stretch={false}
              style={{ width: 245, height: 30, marginTop: 30 }}
              onPress={() => this.props.navigate({ routeName: 'AppAndReg' })}
            />
          </View>
        </View>
      );
    }

    return (
      <View style={Global.styles.CONTAINER} >
        <View style={styles.bgView} >
          <View style={styles.timeLineView} />
          <ScrollView
            style={[styles.scrollView]}
            refreshControl={
              <RefreshControl
                refreshing={pullToRefreshing}
                onRefresh={this.pullToRefresh}
              />
            }
          >
            {this.renderStepCats()}
            <Sep height={40} />
          </ScrollView>
          {this.renderHeader()}
          <View style={[styles.refreshBtn]} >
            <TouchableOpacity onPress={this.pullToRefresh} >
              <Icon name="ios-refresh" color="white" size={28} width={28} height={28} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Global.getScreen().width,
    borderTopWidth: 0,
    height: HEADER_HEIGHT,
  },
  headerShadow: {
    // shadow for ios
    shadowColor: '#bbbbbb',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    // for android
    elevation: 3,
  },
  bgView: {
    flex: 1,
    overflow: 'hidden',
  },
  timeLineView: {
    position: 'absolute',
    top: 0,
    left: TIMELINE_WIDTH - 1,
    width: Global.getScreen().width - (TIMELINE_WIDTH - 1),
    borderLeftWidth: 2,
    borderLeftColor: '#eeeeee',
    height: 2000,
  },
  scrollView: {
    flex: 1,
    marginTop: HEADER_HEIGHT,
  },

  // hospHolder: {
  //   flexDirection: 'row',
  //   paddingLeft: 15,
  //   paddingTop: 5,
  //   height: 38,
  //   alignItems: 'center',
  // },
  // hospName: {
  //   fontSize: 16,
  //   color: '#000000',
  //   fontWeight: '600',
  //   marginLeft: 15,
  //   flex: 1,
  // },

  // patientHolder: {
  //   flexDirection: 'row',
  //   height: 36,
  //   alignItems: 'center',
  // },
  // patientNameHolder: {
  //   flex: 1,
  //   paddingLeft: 56,
  // },
  // patientNameText: {
  //   fontSize: 10,
  //   color: Global.colors.FONT_LIGHT_GRAY,
  // },
  // patientName: {
  //   fontSize: 13,
  //   color: '#000000',
  //   fontWeight: '600',
  //   marginTop: 3,
  // },
  //
  // cardHolder: {
  //   flex: 1,
  // },
  // cardTypeName: {
  //   fontSize: 10,
  //   color: Global.colors.FONT_LIGHT_GRAY,
  // },
  // cardNo: {
  //   fontSize: 13,
  //   color: Global.colors.FONT_GRAY,
  //   marginTop: 4,
  // },

  deptName: {
    width: TIMELINE_WIDTH,
    fontSize: 13,
    fontWeight: '600',
    color: Global.colors.FONT_GRAY,
    textAlign: 'center',
  },

  treatInfo: {
    flex: 1,
    borderLeftWidth: 1 / Global.pixelRatio,
    borderLeftColor: Global.colors.LINE,
    paddingLeft: 10,
    height: 70,
    justifyContent: 'center',
  },
  doc: {
    fontSize: 13,
    color: Global.colors.FONT_GRAY,
  },
  medicalResult: {
    fontSize: 13,
    marginTop: 4,
    color: Global.colors.FONT_GRAY,
  },
  appendText: {
    fontSize: 12,
  },

  addrHolder: {
    flexDirection: 'row',
    marginTop: 4,
  },
  addr: {
    flex: 1,
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
  },

  refreshBtn: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,122,255,.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
    // shadow for ios
    shadowColor: '#bbbbbb',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    // Android 透明背景阴影错乱？
    // elevation: 2,
  },
});

OutpatientGuidance.navigationOptions = {
};

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  navigate: ({ routeName, params }) => dispatch(NavigationActions.navigate({ routeName, params })),
  setCurrHospital: hospital => dispatch(setCurrHospital(hospital)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OutpatientGuidance);
