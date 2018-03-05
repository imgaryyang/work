/**
 * 我的档案
 */

import React, {
  Component,
} from 'react';

import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
} from 'react-native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import Sep from 'rn-easy-separator';
import { NavigationActions } from 'react-navigation';

import Global from '../../Global';

class HosPatient extends Component {
  static displayName = 'HosPatient';
  static description = ' 选择就诊人';

  static renderPlaceholderView() {
    return (
      <View style={Global.styles.CONTAINER} />
    );
  }

  constructor(props) {
    super(props);
    this.chooseHospital = this.chooseHospital.bind(this);
    this.choosePatient = this.choosePatient.bind(this);
    this.chooseHos = this.chooseHos.bind(this);
    this.choosePat = this.choosePat.bind(this);
  }

  state = {
    doRenderScene: false,
    patient: {},
    hospital: {},
    profile: {},
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
        patient: this.props.base.currPatient ? this.props.base.currPatient : {},
        hospital: this.props.base.currHospital ? this.props.base.currHospital : {},
      });
    });
  }
  chooseHospital() {
    const { doSwitchHos } = this.props;
    if (doSwitchHos) {
      this.props.navigate('ChooseHospital', { chooseHospital: this.chooseHos });
    }
  }
  chooseHos(item) {
    this.setState({
      hospital: item,
      patient: null,
    });
  }
  choosePatient() {
    const { doSwitchPat } = this.props;
    if (doSwitchPat) {
      this.props.navigate('PatientList', { callback: this.choosePat, hospital: this.state.hospital });
    }
  }
  choosePat(item, profile) {
    if (profile === null) {
      Toast.show('就诊人在该医院没有档案');
    }
    this.setState({
      patient: item,
      profile,
    });
  }
  render() {
    if (!this.state.doRenderScene) {
      return HosPatient.renderPlaceholderView();
    }
    const hosName = this.state.hospital ? this.state.hospital.name : '医院';
    const patName = this.state.patient ? this.state.patient.name : '就诊人';
    console.log('this.state.profile.....', this);
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <ScrollView style={styles.scrollView}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={styles.touch}>
              <TouchableOpacity onPress={this.chooseHospital}>
                <Text style={styles.hos}>{hosName}</Text>
              </TouchableOpacity>
            </View>
            <Sep width={1} style={{ backgroundColor: Global.colors.IOS_DARK_GRAY }} />
            <View style={styles.touch}>
              <TouchableOpacity onPress={this.choosePatient}>
                <Text style={styles.pat}>{patName}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  touch: {
    flex: 1,
    backgroundColor: 'white',
    height: 26,
  },
  hos: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
  },
  pat: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
  },
});

HosPatient.navigationOptions = ({ navigation }) => ({
  headerTitle: navigation.state.params ? navigation.state.params.title : '我的个人资料',
});

HosPatient.propTypes = {
  /**
   * 是否可以选择医院
   */
  doSwitchHos: PropTypes.bool,
  /**
   * 是否可以选择就诊人
   */
  doSwitchPat: PropTypes.bool,
};

HosPatient.defaultProps = {
  doSwitchHos: false,
  doSwitchPat: false,
};

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  navigate: (component, params) => dispatch(NavigationActions.navigate({ routeName: component, params })),
});

export default connect(mapStateToProps, mapDispatchToProps)(HosPatient);
