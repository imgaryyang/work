/**
 * 化验结果
 */
import React, { Component } from 'react';
import {
  InteractionManager,
  ActivityIndicator,
  StyleSheet,
  View, FlatList,
  Text,
} from 'react-native';
import _ from 'lodash';
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';
import SafeView from 'react-native-safe-area-view';
import Card from 'rn-easy-card';
import Sep from 'rn-easy-separator';
import Icon from 'rn-easy-icon';
import moment from 'moment';

import Global from '../../Global';
import PatientInfo from '../common/PatientInfo';
import ScannerButton from '../common/ScannerButton';
import Item from '../../modules/PureListItem';
import { testOrderStack } from '../../services/sickbed/Sickbed';
import { setCurrPatient } from '../../actions/base/BaseAction';

class LabTestResult extends Component {
  static displayName = 'LabTestResult';
  static description = '化验结果';

  constructor(props) {
    super(props);
    this.onMainScanSuccess = this.onMainScanSuccess.bind(this);
    this.renderPlaceholderView = this.renderPlaceholderView.bind(this);
    this.setData = this.setData.bind(this);
    this.fetchTestOrder = this.fetchTestOrder.bind(this);
    this.dataHandle = this.dataHandle.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.showDetail = this.showDetail.bind(this);
  }

  state = {
    doRenderScene: false,
    data: [],
    refreshing: false,
    selected: [],
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
    this.props.navigation.setParams({ onMainScanSuccess: this.onMainScanSuccess });

    // 如果首页扫功能条码进入此功能并传入条码，则自动查询化验医嘱
    if (this.props.base.currPatient) {
      this.fetchTestOrder(this.props.base.currPatient.inpatientNo);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { currPatient } = this.props.base;
    const nextPatient = nextProps.base.currPatient;
    if ((!currPatient && nextPatient) || (currPatient && nextPatient && currPatient.inpatientNo !== nextPatient.inpatientNo)) {
      this.setState({
        data: [],
        refreshing: true,
        selected: [],
      }, () => {
        this.fetchTestOrder(nextProps.base.currPatient.inpatientNo);
      });
    }
  }
  /**
   * 主操作扫描完成回调
   */
  onMainScanSuccess(barcode) {
    this.fetchTestOrder(barcode);
  }

  setData(data, inpatientNo) {
    const selected = this.state.selected.concat();
    if (inpatientNo) selected[selected.length] = inpatientNo;
    this.setState({
      data,
      refreshing: true,
      selected: _.uniq(selected),
    });
  }

  /**
     * 获取化验医嘱
     */
  async fetchTestOrder(inpatientNo) {
    try {
      this.setState({ refreshing: true });
      const responseData = await testOrderStack(inpatientNo);
      if (!responseData.success) {
        Toast.show(responseData.msg);
      } else {
        const data = responseData.result;
        this.dataHandle(data, inpatientNo);
      }
    } catch (e) {
      this.handleRequestException(e);
    }
  }
  dataHandle(data, inpatientNo) {
    if (data.length !== 0) {
      this.setData(data, inpatientNo);
    } else {
      this.setData([], null);
      Toast.show('未查询到相关数据');
    }
  }

  showDetail(item, index) {
    console.log('999999999999', item.orderNO);
    if (typeof index !== 'undefined') ;
    this.props.navigation.navigate('LabTestResultDetail', {
      orderNO: item.orderNO,
      name: item.testName,
      index,
    });
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

  renderItem({ item, index }) {
    const lastRow = index === this.state.data.length - 1 ? {
      borderBottomColor: Global.colors.LINE,
      borderBottomWidth: 1 / Global.pixelRatio,
    } : null;
    const isReport = (item.state === '已报告');
    const color = isReport ? Global.colors.IOS_BLUE : '';
    return (
      <Item
        data={item}
        index={index}
        chevron={false}
        onPress={() => {
              if (isReport) { this.showDetail(item, index); } else { Toast.show('检验未出结果！'); }
        }}
        style={lastRow}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 5 }}>
            <Text style={{ color: `${color}` }}>{item.testName}</Text>
            { (<Text style={{ color: `${color}` }}>开立时间：{item.orderTime || ''}</Text>) }
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.isEmergency, { color: Global.colors.IOS_RED }]}>{item.isEmergency ? '急诊' : ' '}</Text>
            { (<Text style={{ color: `${color}` }}>{item.state || ''}</Text>) }
          </View>
        </View>


      </Item>
    );
  }

  render() {
    console.log(this.props);
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return this.renderPlaceholderView();
    }
    return (
      <View style={Global.styles.CONTAINER} >
        <SafeView style={Global.styles.SAFE_VIEW} >
          <PatientInfo />
          <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
          <Card noPadding style={{ flex: 1 }} >
            <FlatList
              ref={(c) => { this.listTestsRef = c; }}
              data={this.state.data}
              style={styles.list}
              keyExtractor={(item, index) => `${item}${index + 1}`}
              // 渲染行
              renderItem={this.renderItem}
              // 渲染行间隔
              ItemSeparatorComponent={() => (<Sep height={1} bgColor={Global.colors.LINE} />)}
              // 控制下拉刷新
              refreshing={this.state.refreshing}
            />
          </Card>
          <Sep height={15} bgColor={Global.colors.IOS_GRAY_BG} />
        </SafeView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  itemRowContainer: {
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 2,
    alignItems: 'center',
  },
  mainItemRowContainer: {
    paddingBottom: 5,
  },
  itemBarcode: {
    width: 100,
    textAlign: 'right',
  },
  normalLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  normalValue: {
    fontSize: 12,
    fontWeight: '500',
    color: Global.colors.FONT_GRAY,
  },
  testGrpContainer: {
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 2,
    alignItems: 'center',
  },
});

LabTestResult.navigationOptions = ({ navigation, screenProps }) => {
  return {
    headerTitle: '化验结果',
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

export default connect(mapStateToProps, mapDispatchToProps)(LabTestResult);
