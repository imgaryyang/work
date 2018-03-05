/**
 * 手术
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


import Global from '../../Global';
import PatientInfo from '../common/PatientInfo';
import ScannerButton from '../common/ScannerButton';
import Item from '../../modules/PureListItem';
import { operation } from '../../services/sickbed/Sickbed';
import { setCurrPatient } from '../../actions/base/BaseAction';

class Operation extends Component {
  static displayName = 'Operation';
  static description = '手术';

  constructor(props) {
    super(props);
    this.onMainScanSuccess = this.onMainScanSuccess.bind(this);
    this.renderPlaceholderView = this.renderPlaceholderView.bind(this);
    this.setData = this.setData.bind(this);
    this.operation = this.operation.bind(this);
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
      this.operation(this.props.base.currPatient.inpatientNo);
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
        this.operation(nextProps.base.currPatient.inpatientNo);
      });
    }
  }
  /**
   * 主操作扫描完成回调
   */
  onMainScanSuccess(barcode) {
    this.operation(barcode);
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
     * 获取手术信息
     */
  async operation(inpatientNo) {
    try {
      this.setState({ refreshing: true });
      const responseData = await operation(inpatientNo);
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
    const currPatient = this.props.base.currPatient;
    console.log('88888888888', currPatient);
    if (typeof index !== 'undefined') ;
    this.props.navigation.navigate('OperationDetail', {
      item,
      currPatient,
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
    const color = item.status === '0' ? Global.colors.FONT : (item.status === '3' ? Global.colors.IOS_LIGHT_GRAY : Global.colors.IOS_BLUE);
    const timetype = item.status === '0' ? '拟手术时间：' : (item.status === '2' ? '安排时间：' : '手术时间：');
    const time = item.status === '0' ? item.planOperationTime : (item.status === '2' ? item.arrangeTime : item.operationTime);
    const status = item.status === '0' ? '新申请' : (item.status === '1' ? '已审核' : (item.status === '2' ? '已安排' : '已手术'));
    return (
      <Item
        data={item}
        index={index}
        chevron={false}
        onPress={this.showDetail}
        style={lastRow}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 5 }}>
            <Text style={{ color: `${color}` }}>{item.planOperationName}</Text>
            { (<Text style={{ color: `${color}` }}> {timetype}{time}</Text>) }
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.isEmergency, { color: Global.colors.IOS_RED }]}>{item.isEmergency ? '急诊' : ' '}</Text>
            { (<Text style={{ color: `${color}` }}>{status}</Text>) }
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

Operation.navigationOptions = ({ navigation, screenProps }) => {
  return {
    headerTitle: '手术',
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

export default connect(mapStateToProps, mapDispatchToProps)(Operation);
