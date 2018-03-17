/**
 * 住院单查询
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import Sep from 'rn-easy-separator';
import Global from '../../Global';
import ctrlState from '../../modules/ListState';
import { loadHisInpatientInfo } from '../../services/inpatient/InpatientService';

class InpatientInfo extends Component {
  static displayName = 'InpatientInfo';
  static description = '住院单查询';

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
    this.loadInpatientInfo = this.loadInpatientInfo.bind(this);
    this.afterChooseHospital = this.afterChooseHospital.bind(this);
    this.afterChoosePatient = this.afterChoosePatient.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  state = {
    doRenderScene: false,
    data: {},
    ctrlState,
    profile: {},
  };

  componentWillMount() {

  }

  componentDidMount() {
    const user = Global.getUser();
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      }, () => this.getProfile(this.props.base.currHospital, this.props.base.currPatient));
    });
    this.props.navigation.setParams({
      title: '住院单查询',
      showCurrHospitalAndPatient: !!user,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      afterChooseHospital: this.afterChooseHospital,
      afterChoosePatient: this.afterChoosePatient,
    });
  }

  getProfile(hospital, patient) {
    if (hospital !== null && patient !== null) {
      const { profiles } = patient;
      if (profiles !== null) {
        const length = profiles.length ? profiles.length : 0;
        for (let i = 0; i < length; i++) {
          const pro = profiles[i];
          if (pro.status === '1' && pro.hosId === hospital.id) {
            this.setState({
              profile: pro,
            }, () => this.loadInpatientInfo());
          }
        }
      } else {
        Toast.show('当前就诊人在当前医院暂无档案！');
        return null;
      }
    }
  }
  async afterChooseHospital(hospital) {
    await this.getProfile(hospital, this.props.base.currPatient);
    await this.loadInpatientInfo();
  }
  afterChoosePatient(patient, profile) {
    if (typeof profile !== 'undefined' && profile !== null) {
      this.setState({
        profile,
      }, () => this.loadInpatientInfo());
    }
  }

  async loadInpatientInfo() {
    try {
      // 获得当前的医院Id
      const hosNo = this.props.base.currHospital.no;
      // 显示遮罩
      // this.props.screenProps.showLoading();
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
          infiniteLoading: false,
          noMoreData: false,
          requestErr: false,
          requestErrMsg: null,
        },
      });
      const profileNo = this.state.profile.no;
      const query = { proNo: profileNo, hosNo };
      const responseData = await loadHisInpatientInfo(query);
      if (responseData.success === true) {
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
        };

        // 隐藏遮罩
        // this.props.screenProps.hideLoading();
        await this.setState({
          data: responseData.result,
          ctrlState: newCtrlState,
        });
      } else {
        /* this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
            infiniteLoading: false,
            noMoreData: true,
            requestErr: true,
            requestErrMsg: { msg: responseData.msg },
          },
        });
        this.handleRequestException({ msg: responseData.msg });*/
        /* Alert.alert(
          '提示',
          responseData.msg,
          [
            {
              text: '确定',
              onPress: () => {
              },
            },
          ],
        );*/
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
        };
        this.setState({
          data: {},
          ctrlState: newCtrlState,
        });
        Toast.show(responseData.msg);
      }
    } catch (e) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
          infiniteLoading: false,
          noMoreData: true,
          requestErr: true,
          requestErrMsg: e,
        },
      });
      this.handleRequestException(e);
    }
  }

  render() {
    console.log(this.state.profile.no);
    console.log(this.props.base.currHospital);
    const { data } = this.state;
    const genderText = { 1: '男', 2: '女', 3: '不详' };
    const status = { 0: '已出院', 1: '正在住院' };
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return InpatientInfo.renderPlaceholderView();
    }

    if (!data.proName) {
      return (
        <View style={{ height: 200, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
          <Text style={{ fontSize: 16, color: Global.colors.FONT_LIGHT_GRAY }} >未查询到住院信息</Text>
        </View>
      );
    }

    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        <Sep height={2 / Global.pixelRatio} bgColor={Global.colors.LINE} />
        <View
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <View style={styles.view_row}>
            <Text style={styles.text_info}>姓名：</Text>
            <Text style={styles.text_2_value}>{data.proName === undefined ? '未知' : data.proName }</Text>
          </View>
          <View style={styles.view_row}>
            <Text style={styles.text_info}>性别：</Text>
            <Text style={styles.text_2_value}>{data.gender === undefined ? '暂无' : genderText[data.gender] }</Text>
          </View>
          <View style={styles.view_row}>
            <Text style={styles.text_info}>床位号：</Text>
            <Text style={styles.text_3_value}>{data.bedNo === undefined ? '暂无' : data.bedNo }</Text>
          </View>
          <View style={styles.view_row}>
            <Text style={styles.text_info}>病区名称：</Text>
            <Text style={styles.text_4_value}>{data.areaName === undefined ? '暂无' : data.areaName }</Text>
          </View>
          <View style={styles.view_row}>
            <Text style={styles.text_info}>专科名称：</Text>
            <Text style={styles.text_4_value}>{data.depName === undefined ? '暂无' : data.depName }</Text>
          </View>
          <View style={styles.view_row}>
            <Text style={styles.text_info}>医生名称：</Text>
            <Text style={styles.text_4_value}>{data.docName === undefined ? '暂无' : data.docName }</Text>
          </View>
          <View style={styles.view_row}>
            <Text style={styles.text_info}>当前状态：</Text>
            <Text style={styles.color_red}>{data.status === undefined ? '暂无' : status[data.status] }</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  view_row: {
    flexDirection: 'row',
    height: 50,
    paddingLeft: 15,
    paddingTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: Global.colors.LINE,
  },
  text_info: {
    fontSize: 15,
  },
  text_2_value: {
    fontSize: 15,
    /* paddingLeft: 30,*/
  },
  text_3_value: {
    fontSize: 15,
    /* paddingLeft: 15,*/
  },
  text_4_value: {
    fontSize: 15,
  },
  color_red: {
    fontSize: 15,
    color: 'orangered',
  },
});

InpatientInfo.navigationOptions = {
  title: '住院单查询',
};


const mapStateToProps = state => ({
  base: state.base,
});

export default connect(mapStateToProps, null)(InpatientInfo);
