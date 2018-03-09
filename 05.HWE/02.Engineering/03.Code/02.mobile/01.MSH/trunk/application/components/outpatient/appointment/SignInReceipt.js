import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text, InteractionManager,
} from 'react-native';

import Sep from 'rn-easy-separator';
import { connect } from 'react-redux';
import Portrait from 'rn-easy-portrait';
import PlaceholderView from '../../../modules/PlaceholderView';
import Global from '../../../Global';
import ViewText from '../../../modules/ViewText';
import { base } from '../../../services/RequestTypes';

class SignInReceipt extends Component {
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

  signIn = () => {
    const { onPress, data } = this.props;
    if (typeof onPress === 'function') onPress(data);
  };

  render() {
    const { doRenderScene } = this.state;
    if (!doRenderScene) {
      return <PlaceholderView />; // 场景过渡动画未完成前，先渲染过渡场景
    }
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
    } = this.props.navigation.state.params.data;
    const imageSource = portrait ? { uri: base().img + portrait } : Global.Config.defaultImgs.docPortrait;

    return (
      <ScrollView style={{ backgroundColor: Global.colors.IOS_GRAY_BG }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Portrait width={30} height={30} radius={15} bgColor={Global.colors.IOS_GRAY_BG} imageSource={imageSource} />
            <ViewText text={docName} textStyle={{ marginLeft: 10, fontSize: 15 }} />
            <ViewText text={docJobTitle} textStyle={{ marginLeft: 10, fontSize: 12 }} />
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
          <Text style={styles.info}>请您于 {clinicDate} {clinicTime.trim()} 到候诊厅等候呼叫</Text>
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
    fontSize: 15,
    color: Global.colors.FONT_GRAY,
  },
  contentText: {
    fontSize: 15,
    marginLeft: 10,
  },
  info: {
    fontSize: 15,
    color: Global.colors.ORANGE,
    marginBottom: 15,
  },
  tips: {
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
  },
});

// SignInReceipt.navigationOptions = ({
//   title: '签到小票',
// });

const mapStateToProps = state => ({
  currPatient: state.base.currPatient,
  currHospital: state.base.currHospital,
});

export default connect(mapStateToProps)(SignInReceipt);
