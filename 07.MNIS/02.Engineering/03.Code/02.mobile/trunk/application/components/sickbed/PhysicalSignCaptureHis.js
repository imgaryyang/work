/**
 * 口服药
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
import BackButton from '../common/BottomBackButton';
import Item from '../../modules/PureListItem';
import { physicalSignCaptureHis } from '../../services/sickbed/Sickbed';
import { setCurrPatient } from '../../actions/base/BaseAction';

class PhysicalSignCaptureHis extends Component {
    static displayName = 'PhysicalSignCaptureHis';
    static description = '体征查询';

    constructor(props) {
      super(props);
      this.onMainScanSuccess = this.onMainScanSuccess.bind(this);
      this.renderPlaceholderView = this.renderPlaceholderView.bind(this);
      this.setData = this.setData.bind(this);
      this.fetchOrder = this.fetchOrder.bind(this);
      this.dataHandle = this.dataHandle.bind(this);
      this.renderItem = this.renderItem.bind(this);
    }

    state = {
      doRenderScene: false,
      data: [],
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

    setData(data, inpatientNo, barcode) {
      this.setState({
        data,
        refreshing: false,
        // selectedIds: barcode || this.state.selected,
        // todo
      });
    }

    async fetchOrder(inpatientNo) {
      try {
        this.setState({ refreshing: true });
        // todo
        const responseData = await physicalSignCaptureHis(inpatientNo);
        if (responseData.success) {
          const data = responseData.result;
          this.dataHandle(data, inpatientNo, null);
        } else {
          Toast.show(responseData.msg);
        }
      } catch (e) {
        this.handleRequestException(e);
      }
    }

    dataHandle(data, inpatientNo, barcode) {
      if (data.length !== 0) {
        const patient = this.props.screenProps.getPatient(data[0].inpatientNo);
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

    renderItem({ item, index }) {
      // console.log(item);
      const lastRow = index === this.state.data.length - 1 ? {
        borderBottomColor: Global.colors.LINE,
        borderBottomWidth: 1 / Global.pixelRatio,
      } : null;
        /*
              id: '0001',
              inpatientNo: '1800150',

              temperature: '40',
              temperatureDown: '37.8',

              heartRate: '120',
              pulse: '110',
              breathe: '80',

              bloodPressureH: '120',
              bloodPressureL: '40',

              stool: '大便',
              urineVolume: '尿量',
              infusion: '输液量',
                painScore: '疼痛评分',
              weight: '体重',
              createTime: '2018-01-20 08:00:00',
              * */
      return (<Item
        data={item}
        index={index}
        chevron={false}
        style={lastRow}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.itemRowContainer}>
            <Text style={styles.normalLabel}>体征记录时间：</Text>
            <Text
              style={[styles.normalValue]}
            >{moment(item.createTime).format('YYYY/MM/DD hh:mm')}
            </Text>
          </View>
            <View style={styles.itemRowContainer}>
                <Text style={{ flex: 1 }}><Text style={styles.normalLabel}>体温：</Text><Text
                    style={styles.normalValue}
                >{item.temperature}->{item.temperatureDown}
                </Text>
                </Text>
                <Text style={{ flex: 1 }}><Text style={styles.normalLabel}>血压(高)：</Text><Text
                    style={styles.normalValue}
                >{item.bloodPressureH}
                </Text>
                </Text>
                <Text style={{ flex: 1 }}><Text style={styles.normalLabel}>血压(低)：</Text><Text
                    style={styles.normalValue}
                >{item.bloodPressureL}
                </Text>
                </Text>
            </View>
          <View style={styles.itemRowContainer}>
            <Text style={{ flex: 1 }}><Text style={styles.normalLabel}>心率：</Text><Text
              style={styles.normalValue}
            >{item.heartRate}
            </Text>
            </Text>
            <Text style={{ flex: 1 }}><Text style={styles.normalLabel}>脉搏：</Text><Text
              style={styles.normalValue}
            >{item.pulse}
            </Text>
            </Text>
            <Text style={{ flex: 1 }}><Text style={styles.normalLabel}>呼吸：</Text><Text
              style={styles.normalValue}
            >{item.breathe}
                                                                                 </Text>
            </Text>
          </View>
          <View style={styles.itemRowContainer}>
            <Text style={{ flex: 1 }}><Text style={styles.normalLabel}>大便：</Text><Text
              style={styles.normalValue}
            >{item.stool}
                                                                                 </Text>
            </Text>
            <Text style={{ flex: 1 }}><Text style={styles.normalLabel}>尿量：</Text><Text
              style={styles.normalValue}
            >{item.urineVolume}
                                                                                 </Text>
            </Text>
            <Text style={{ flex: 1 }}><Text style={styles.normalLabel}>输液量：</Text><Text
              style={styles.normalValue}
            >{item.infusion}
            </Text>
            </Text>
          </View>
          <View style={styles.itemRowContainer}>
            <Text style={{ flex: 1 }}><Text style={styles.normalLabel}>疼痛等级：</Text><Text
              style={styles.normalValue}
            >{item.painScore}
                                                                                   </Text>
            </Text>
            <Text style={{ flex: 1 }}><Text style={styles.normalLabel}>体重：</Text><Text
              style={styles.normalValue}
            >{item.weight}
                                                                                 </Text>
            </Text>
          </View>
        </View>
              </Item>);
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
            <Card noPadding style={{ flex: 1 }} >
              <FlatList
                ref={(c) => { this.listInfusionsRef = c; }}
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
    fontWeight: '400',
    color: Global.colors.FONT_GRAY,
  },
  planedExecTime: {
    color: Global.colors.IOS_RED,
  },
});

PhysicalSignCaptureHis.navigationOptions = ({ navigation, screenProps }) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(PhysicalSignCaptureHis);
