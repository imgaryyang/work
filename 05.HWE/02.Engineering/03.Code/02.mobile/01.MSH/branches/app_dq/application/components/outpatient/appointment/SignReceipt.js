import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  InteractionManager,
} from 'react-native';
import Sep from 'rn-easy-separator';
import Portrait from 'rn-easy-portrait';
import PlaceholderView from '../../../modules/PlaceholderView';
import Global from '../../../Global';
import ViewText from '../../../modules/ViewText';
import { base } from '../../../services/RequestTypes';

class SignReceipt extends Component {
  constructor(props) {
    super(props);
    this.state = { doRenderScene: false };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => { this.setState({ doRenderScene: true }); });
    this.props.navigation.setParams({
      title: '签到小票',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: false,
      allowSwitchPatient: false,
      hideNavBarBottomLine: false,
    });
  }

  render() {
    const { doRenderScene } = this.state;
    if (!doRenderScene) return <PlaceholderView />; // 场景过渡动画未完成前，先渲染过渡场景
    const {
      clinicDate,
      clinicTime,
      clinicTypeName,
      docName,
      docJobTitle,
      depName,
      portrait,
      address,
      num,
      totalFee,
      proNo,
      proName,
      idNo,
      mobile,
      comment,
    } = this.props.navigation.state.params.data;
    const shortTime = (clinicTime || '').slice(11, 16);
    const notice = comment || `请您于 ${clinicDate} ${shortTime} 到候诊厅等候呼叫`;

    const imageSource = portrait ? { uri: base().img + portrait } : Global.Config.defaultImgs.docPortrait;

    return (
      <ScrollView style={{ backgroundColor: Global.colors.IOS_GRAY_BG }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Portrait width={30} height={30} radius={15} bgColor={Global.colors.IOS_LIGHT_GRAY} imageSource={imageSource} />
            <ViewText text={docName} textStyle={{ marginLeft: 10, fontSize: 14 }} />
            <ViewText text={docJobTitle} textStyle={{ marginLeft: 10, fontSize: 11 }} />
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>科室</Text>
            <Text style={styles.contentText}>{depName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>类型</Text>
            <Text style={styles.contentText}>{clinicTypeName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>诊室</Text>
            <Text style={styles.contentText}>{address}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>排号</Text>
            <Text style={styles.contentText}>{num}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>费用</Text>
            <Text style={styles.contentText}>{totalFee}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>姓名</Text>
            <Text style={styles.contentText}>{proName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>手机号</Text>
            <Text style={styles.contentText}>{mobile}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>身份证号</Text>
            <Text style={styles.contentText}>{idNo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>卡号</Text>
            <Text style={styles.contentText}>{proNo}</Text>
          </View>
          <Text style={styles.info}>{notice}</Text>
          <Sep height={Global.lineWidth} bgColor={Global.colors.LINE} style={{ marginBottom: 10 }} />
          <View style={styles.tipsRow}>
            <Text style={styles.tips}>注：</Text>
            <Text style={styles.tips}>预约单当日有效，预约当日该医师有可能遇到急事不能坐诊，请谅解！</Text>
          </View>
          <View style={[styles.tipsRow, { marginBottom: 20 }]}>
            <Text style={[styles.tips, { opacity: 0 }]}>注：</Text>
            <Text style={styles.tips}>请于当日预约时间前到护士分诊台报到，否则预约失效！</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
  },
  title: {
    flexDirection: 'row',
    height: 37,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  tipsRow: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingRight: 20,
  },
  labelText: {
    fontSize: 13,
    color: Global.colors.FONT_GRAY,
    width: 65,
  },
  contentText: {
    fontSize: 13,
    // marginLeft: 10,
  },
  info: {
    fontSize: 13,
    color: Global.colors.ORANGE,
    marginBottom: 15,
  },
  tips: {
    fontSize: 11,
    color: Global.colors.FONT_GRAY,
  },
});

export default SignReceipt;
