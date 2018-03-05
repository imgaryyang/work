/**
 * 预约挂号4
 */
import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Global from '../../../Global';
import AppointInfo from './AppointInfo';
import PatientInfo from './PatientInfo';
import PlaceholderView from '../../../modules/PlaceholderView';
import ViewText from '../../../modules/ViewText';
import { forReserve } from '../../../services/outpatient/AppointService';

class Appoint extends Component {
  static displayName = 'Appoint';
  static description = '预约挂号';
  static margin = 8;
  static radius = 4;

  constructor(props) {
    super(props);

    this.confirmAppoint = this.confirmAppoint.bind(this);

    this.state = {
      doRenderScene: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => { this.setState({ doRenderScene: true }); });
    this.props.navigation.setParams({
      title: '预约挂号',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: false,
      allowSwitchPatient: true,
      afterChoosePatient: null,
      hideNavBarBottomLine: false,
    });
  }

  async confirmAppoint(data) {
    const { showLoading, hideLoading, resetBackNavigate } = this.props.screenProps;
    showLoading();

    try {
      const { currPatient, currHospital } = this.props;
      const currProfile = PatientInfo.filterProfile(currPatient, currHospital);
      const newData = {
        ...data,
        hosId: currHospital.id,
        hosNo: currHospital.no,
        hosName: currHospital.name,
        proId: currProfile && currProfile.id ? currProfile.id : null,
        proNo: currProfile && currProfile.no ? currProfile.no : null,
        proName: currProfile && currProfile.name ? currProfile.name : null,
        cardNo: currProfile && currProfile.cardNo ? currProfile.cardNo : null,
        cardType: currProfile && currProfile.cardType ? currProfile.cardType : null,
        mobile: currProfile && currProfile.mobile ? currProfile.mobile : currPatient.mobile,
        idNo: currProfile && currProfile.idNo ? currPatient.idNo : currPatient.idNo,
      };

      const responseData = await forReserve(newData);

      if (responseData.success) {
        resetBackNavigate(this.props.navigation.state.params.backIndex || 0, 'AppointSuccess', this.props.navigation.state.params);
      } else {
        this.handleRequestException({ msg: responseData.msg });
      }
    } catch (e) {
      this.handleRequestException(e);
    }
    hideLoading();
  }

  render() {
    const { doRenderScene } = this.state;
    const { data } = this.props.navigation.state.params;

    if (!doRenderScene) {
      return <PlaceholderView />; // 场景过渡动画未完成前，先渲染过渡场景
    }

    return (
      <ScrollView style={[Global.styles.CONTAINER_BG, { paddingTop: 10 }]}>
        <AppointInfo data={data} style={styles.appointInfo} />
        <PatientInfo />
        <Button
          text="确定预约"
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => this.confirmAppoint(data)}
        />
        <ViewText text="预约挂号费由医院自行设定，平台不收取任何额外费用" textStyle={styles.infoText1} />
        <ViewText text="确定预约就表示，我已经了解并同意以下规则" textStyle={styles.infoText1} />
        <ViewText text="点击查看详情" style={styles.info} textStyle={styles.infoText2} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  appointInfo: {
    marginBottom: 10,
  },
  button: {
    flex: 0,
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 15,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
  },
  infoText1: {
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
  },
  infoText2: {
    fontSize: 12,
    color: Global.colors.ORANGE,
  },
  infoText3: {
    fontSize: 10,
    color: Global.colors.FONT_GRAY,
  },
});

const mapStateToProps = state => ({
  currPatient: state.base.currPatient,
  currHospital: state.base.currHospital,
  nav: state.nav,
});

// Appoint.navigationOptions = { title: '预约挂号' };

export default connect(mapStateToProps)(Appoint);
