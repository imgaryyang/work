/**
 * 住院单查询
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
// import Toast from 'react-native-root-toast';
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
  }

  state = {
    doRenderScene: false,
    data: {},
    ctrlState,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      title: '住院单查询',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
    });
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      }, () => {
        this.loadInpatientInfo(
          this.props.base.currHospital,
          this.props.base.currPatient,
          this.props.base.currProfile,
        );
      });
    });
  }

  componentWillReceiveProps(props) {
    if (props.base.currProfile !== this.props.base.currProfile) {
      this.loadInpatientInfo(
        props.base.currHospital,
        props.base.currPatient,
        props.base.currProfile,
      );
    }
  }

  async loadInpatientInfo(hospital, patient, profile) {
    if (!profile) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
          requestErr: false,
          requestErrMsg: null,
        },
        data: {},
      });
      return;
    }
    try {
      // 获得当前的医院Id
      const hosNo = profile.hosNo; // this.props.base.currHospital.no;
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
          requestErr: false,
          requestErrMsg: null,
          data: {},
        },
      });
      const profileNo = profile.no; // this.state.profile.no;
      const query = { proNo: profileNo, hosNo };
      const responseData = await loadHisInpatientInfo(query);
      if (responseData.success === true) {
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          requestErr: false,
          requestErrMsg: '',
        };

        this.setState({
          data: responseData.result,
          ctrlState: newCtrlState,
        });
      } else {
        const newCtrlState = {
          ...this.state.ctrlState,
          refreshing: false,
          requestErr: true,
          requestErrMsg: { msg: responseData.msg },
        };
        this.setState({
          data: {},
          ctrlState: newCtrlState,
        });
      }
    } catch (e) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
          requestErr: true,
          requestErrMsg: e,
        },
      });
      this.handleRequestException(e);
    }
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return InpatientInfo.renderPlaceholderView();
    }

    const { currProfile } = this.props.base;
    const { data } = this.state;

    const emptyView = !currProfile ? this.renderEmptyView({
      msg: '未选择就诊人',
      ctrlState: this.state.ctrlState,
      style: { marginTop: 15 },
    }) : this.renderEmptyView({
      msg: `暂无${currProfile.name}（卡号：${currProfile.no}）的住院信息！`,
      ctrlState: this.state.ctrlState,
      style: { marginTop: 15 },
    });

    if (!data || !data.proName) {
      return (
        <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
          {emptyView}
        </View>
      );
    }

    // const genderText = { 1: '男', 2: '女', 3: '不详' };
    const status = { 0: '普通', 1: '挂账', 2: '呆账', 5: '特殊回归', 7: '普通回归', 9: '病区出院' };

    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        <Sep height={2 / Global.pixelRatio} bgColor={Global.colors.LINE} />
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={styles.scrollView}
        >
          <View style={[styles.row, styles.firstLine]}>
            <Text style={styles.label}>姓名：</Text>
            <Text style={styles.value}>{data.proName ? data.proName : '暂无' }</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>床位号：</Text>
            <Text style={styles.value}>{data.bedNo ? data.bedNo : '暂无' }</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>病区名称：</Text>
            <Text style={styles.value}>{data.areaName ? data.areaName : '暂无' }</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>专科名称：</Text>
            <Text style={styles.value}>{data.depName ? data.depName : '暂无' }</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>入院时间：</Text>
            <Text style={styles.value}>{data.inTime ? data.inTime : '暂无' }</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>入院诊断：</Text>
            <Text style={styles.value}>{data.inDiagnose ? data.inDiagnose : '暂无' }</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>医生名称：</Text>
            <Text style={styles.value}>{data.docName ? data.docName : '暂无' }</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>当前状态：</Text>
            <Text style={[styles.value, { color: Global.colors.IOS_RED }]}>{data.status ? status[data.status] : '暂无' }</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    // paddingLeft: 15,
    // paddingRight: 15,
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
    backgroundColor: 'white',
  },
  firstLine: {
    marginTop: 15,
    borderTopWidth: 1 / Global.pixelRatio,
    borderTopColor: Global.colors.LINE,
  },
  label: {
    fontSize: 13,
    color: 'black',
  },
  value: {
    flex: 1,
    fontSize: 13,
    color: Global.colors.FONT_GRAY,
    textAlign: 'right',
  },
  // text_2_value: {
  //   fontSize: 15,
  //   /* paddingLeft: 30,*/
  // },
  // text_3_value: {
  //   fontSize: 15,
  //   /* paddingLeft: 15,*/
  // },
  // text_4_value: {
  //   fontSize: 15,
  // },
  // color_red: {
  //   fontSize: 15,
  //   color: 'orangered',
  // },
});

InpatientInfo.navigationOptions = {
  title: '住院单查询',
};


const mapStateToProps = state => ({
  base: state.base,
});

export default connect(mapStateToProps, null)(InpatientInfo);
