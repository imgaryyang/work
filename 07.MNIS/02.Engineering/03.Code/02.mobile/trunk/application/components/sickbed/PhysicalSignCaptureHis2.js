/**
 * 体征查询
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  View,
  Text,
  Alert,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';
import SafeView from 'react-native-safe-area-view';
import Card from 'rn-easy-card';
import Sep from 'rn-easy-separator';

import Global from '../../Global';
import PatientInfo from '../common/PatientInfo';
import ScannerButton from '../common/ScannerButton';
import { physicalSignCaptureHis } from '../../services/sickbed/Sickbed';
import { setCurrPatient } from '../../actions/base/BaseAction';

class PhysicalSignCaptureHis2 extends Component {
    static displayName = 'PhysicalSignCaptureHis';
    static description = '体征查询';

    constructor(props) {
      super(props);
      this.onMainScanSuccess = this.onMainScanSuccess.bind(this);
      this.renderPlaceholderView = this.renderPlaceholderView.bind(this);
      this.setData = this.setData.bind(this);
      this.fetchOrder = this.fetchOrder.bind(this);
      this.dataHandle = this.dataHandle.bind(this);
      this.renderPhysicalSign = this.renderPhysicalSign.bind(this);
      this.renderPhysicalSignHead = this.renderPhysicalSignHead.bind(this);
      this.renderPhysicalSignDetail = this.renderPhysicalSignDetail.bind(this);
    }

    state = {
      doRenderScene: false,
      data: [],
      head: [],
      refreshing: false,
    };

    componentDidMount() {
      InteractionManager.runAfterInteractions(() => {
        this.setState({
          doRenderScene: true,
        });
      });
      if (this.props.base.currPatient) {
        this.fetchOrder(this.props.base.currPatient.inpatientNo);
      }
    }

    componentWillReceiveProps(nextProps) {
      const { currPatient } = this.props.base;
      const nextPatient = nextProps.base.currPatient;
      if ((!currPatient && nextPatient) || (currPatient && nextPatient && currPatient.inpatientNo !== nextPatient.inpatientNo)) {
        this.setState({
          data: [],
          refreshing: false,
        }, () => {
          this.fetchOrder(nextProps.base.currPatient.inpatientNo);
        });
      }
    }

    /**
     * 主操作扫描完成回调 更换病人
     */
    onMainScanSuccess() {
      this.fetchOrder(this.props.base.currPatient.inpatientNo);
    }

    setData(result, inpatientNo, barcode) {
      // console.log('result===', result);
      this.setState({
        data: result.data,
        head: result.head,
        refreshing: false,
        // todo
      });
      // console.log('this.state.data===', this.state.data);
    }

    async fetchOrder(inpatientNo) {
      try {
        this.setState({ refreshing: true });
        // todo
        const responseData = await physicalSignCaptureHis(inpatientNo);
        if (responseData.success) {
          const result = responseData.result;
          this.dataHandle(result, inpatientNo);
        } else {
          Toast.show(responseData.msg);
        }
      } catch (e) {
        this.handleRequestException(e);
      }
    }

    dataHandle(data, inpatientNo, barcode) {
      if (data.length !== 0) {
        const patient = this.props.screenProps.getPatient(inpatientNo);
        const { currPatient } = this.props.base;
        if (!currPatient) { // 当前患者不存在
          // 设置当前患者
          this.props.setCurrPatient(patient);
          this.setData(data, inpatientNo, barcode);
        } else if (currPatient.inpatientNo !== patient.inpatientNo) { // 当前患者存在但与新获取的患者不一致
          Alert.alert(
            '提示',
            `腕带 ${barcode} 对应的患者 ${patient.name} 与当前所选患者 ${currPatient.name} 不一致。${'\n'}${'\n'}点击"确定"按钮切换患者，点击"取消"按钮放弃当前操作。`,
            [
              { text: '取消', style: 'cancel' },
              {
                text: '确定',
                onPress: () => {
                  this.props.setCurrPatient(patient);
                  this.setState({
                    data: [],
                    refreshing: false,
                  }, () => {
                    this.setData(data, inpatientNo, barcode);
                  });
                },
              },
            ],
          );
        } else { // 当前患者存在
          this.setData(data, inpatientNo, barcode);
        }
      } else {
        this.setData([], null, null);
        Toast.show('未查询到相关数据');
      }
    }

    /**
     * 渲染过渡场景
     * @returns {XML}
     */
    renderPlaceholderView() {
      return (
        <View style={Global.styles.CONTAINER} >
          <SafeView style={Global.styles.SAFE_VIEW} >
            <Card style={{ height: 120 }} />
            <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
            <Card noPadding style={[Global.styles.CENTER, { flex: 1 }]} >
              <ActivityIndicator />
            </Card>
            <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
          </SafeView>
        </View>
      );
    }

    /**
     * 渲染体征项目

     */
    renderPhysicalSignHead() {
      const physicalSignHeads = this.state.head;
      // console.log('aaaa', physicalSignHeads.length);
      return (
        physicalSignHeads.map((head, idx) => {
          return (
            <Text key={`${idx + 1}`} style={[{ flex: 1 }, styles.itemHead]}>{head.input}</Text>
          );
        }));
    }

    /**
     * 渲染体征数据
     */

    renderPhysicalSign() {
      const mydata = this.state.data;
      /*
      100150: [
    [{ code: createTime, input: '08-11 08:10' },
      { code: temperature, input: '37.5' },
      { code: heartRate, input: '120' },
      { code: pulse, input: '60/m' },
      { code: breathe, input: '40' },
      { code: bloodPressureH, input: '120' },
      { code: bloodPressureL, input: '80' },
      { code: stool, input: '一次' },
      { code: painScore, input: '6' },
      { code: infusion, input: '1200' },
      { code: urineVolume, input: '200' },
      { code: weight, input: '50kg' }],[]]
          */
      return (
        mydata.map((item, idx) => {
          return (
            <View style={styles.itemContainer} key={`${idx + 1}`}>
              { this.renderPhysicalSignDetail(item)}
            </View>
          );
        }));
    }
    renderPhysicalSignDetail(detail) {
      const physicalSignHeads = this.state.head;
      return (
        physicalSignHeads.map((physicalSignHead, idx) => {
          // console.log('idx==', idx);
          let input = '';
          for (let i = 0; i < detail.length; i++) {
            if (detail[i].code == physicalSignHead.code) {
              input = detail[i].input;
              break;
            } else {
              input = '';
            }
          }
          if (input == '') {
            input = '无';
          }
          // console.log('input==', input);
          return (
            <Text style={[styles.normalValue]} key={`${idx + 100}`}>{input}</Text>
          );
        }));
    }

    render() {
      // 场景过渡动画未完成前，先渲染过渡场景
      if (!this.state.doRenderScene) {
        return this.renderPlaceholderView();
      }

      return (
        <View style={Global.styles.CONTAINER} >
          <SafeView style={Global.styles.SAFE_VIEW} >
            <PatientInfo />
            <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
            <View style={{ flexDirection: 'row', height: 300, width: Global.getScreen().width }} >
              <View style={styles.itemHeadContainer}>
                {this.renderPhysicalSignHead()}
              </View>
              {this.renderPhysicalSign()}
            </View>
            <Sep height={1} bgColor={Global.colors.IOS_GRAY_BG} />

          </SafeView>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  itemHeadContainer: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,

  },
  itemContainer: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  mainItemRowContainer: {
    paddingBottom: 5,
  },
  itemHead: {
    fontSize: 10,
    fontWeight: '400',
    textAlign: 'center',
  },
  normalValue: {
    flex: 1,
    fontSize: 10,
    fontWeight: '400',
    textAlign: 'center',
    // color: Global.colors.FONT_GRAY,
  },
  planedExecTime: {
    color: Global.colors.IOS_RED,
  },
});

PhysicalSignCaptureHis2.navigationOptions = ({ navigation, screenProps }) => {
  return {
    headerTitle: '体征查询',
    headerRight: (
      <ScannerButton
        type={ScannerButton.SCAN_WRISTBAND}
        navigation={navigation}
        screenProps={screenProps}
        onSuccess={navigation.state.params ? navigation.state.params.onMainScanSuccess : null}
      />
    ),
  };
};

const mapStateToProps = state => ({
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  setCurrPatient: patient => dispatch(setCurrPatient(patient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PhysicalSignCaptureHis2);
