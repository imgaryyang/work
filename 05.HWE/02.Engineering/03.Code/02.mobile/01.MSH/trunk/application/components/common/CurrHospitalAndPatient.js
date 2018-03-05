/**
 * 显示及切换当前医院和就诊人
 */

import React, {
  Component,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import { NavigationActions } from 'react-navigation';
import Icon from 'rn-easy-icon';

import Global from '../../Global';
import { setCurrHospital, setCurrPatient } from '../../actions/base/BaseAction';

export const CompHeight = 40;

class CurrHospitalAndPatient extends Component {
  static displayName = 'CurrHospitalAndPatient';
  static description = ' 显示及切换当前医院和就诊人';

  constructor(props) {
    super(props);
    this.gotoChooseHospital = this.gotoChooseHospital.bind(this);
    this.gotoChoosePatient = this.gotoChoosePatient.bind(this);
    this.afterChooseHospital = this.afterChooseHospital.bind(this);
    this.afterChoosePatient = this.afterChoosePatient.bind(this);
  }

  componentDidMount() {
  }

  gotoChooseHospital() {
    const { allowSwitchHospital } = this.props;
    const editionCtrl = this.props.base.edition !== Global.EDITION_SINGLE;
    if (editionCtrl && allowSwitchHospital) {
      this.props.navigate('ChooseHospital', { chooseHospital: this.afterChooseHospital });
    }
  }

  afterChooseHospital(hospital) {
    const { afterChooseHospital } = this.props;
    this.props.setCurrHospital(hospital);
    if (typeof afterChooseHospital === 'function') afterChooseHospital(hospital);
  }

  gotoChoosePatient() {
    const { base, allowSwitchPatient } = this.props;
    if (allowSwitchPatient) {
      const { currHospital } = base;
      this.props.navigate('PatientList', { callback: this.afterChoosePatient, hospital: currHospital });
    }
  }

  afterChoosePatient(patient, profile) {
    const { afterChoosePatient } = this.props;
    // 将当前就诊人放入redux
    this.props.setCurrPatient(patient);
    if (profile === null) {
      Toast.show('就诊人在该医院没有档案');
    }
    if (typeof afterChoosePatient === 'function') afterChoosePatient(patient, profile);
  }

  render() {
    const { allowSwitchPatient, allowSwitchHospital, base } = this.props;
    const editionCtrl = this.props.base.edition !== Global.EDITION_SINGLE;
    const { currHospital, currPatient } = base;
    // console.log('currPatient in CurrHospitalAndPatient:', currPatient);
    const hostName = currHospital ?
      (
        <Text style={styles.content} numberOfLines={1} >{currHospital.name}</Text>
      ) :
      (
        <Text style={styles.content} numberOfLines={1} >
          未选择医院
          { editionCtrl && allowSwitchHospital ? <Text>，</Text> : null }
          { editionCtrl && allowSwitchHospital ? <Text style={styles.chooseText} onPress={this.gotoChooseHospital} >去选择</Text> : null }
        </Text>
      );
    const switchText = <Icon name="ios-arrow-down" size={12} width={12} height={12} color={Global.colors.FONT_LIGHT_GRAY1} style={styles.switchIcon} />;
    return (
      <View style={styles.container} >
        <TouchableOpacity style={styles.hospitalContainer} onPress={this.gotoChooseHospital} >
          <Text style={styles.title} >当前医院{'\n'}</Text>
          <View style={styles.contentContainer} >
            {hostName}
            {editionCtrl && allowSwitchHospital ? switchText : null}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.patientContainer} onPress={this.gotoChoosePatient} >
          <Text style={styles.title} >就诊人{'\n'}</Text>
          <View style={styles.contentContainer} >
            <Text style={styles.content} numberOfLines={1} >{currPatient ? currPatient.name : '未选择就诊人'}</Text>
            {allowSwitchPatient ? switchText : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: CompHeight,
    flexDirection: 'row',
    paddingTop: 0,
    // backgroundColor: 'red',
  },
  hospitalContainer: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 10,
    // backgroundColor: 'green',
  },
  patientContainer: {
    maxWidth: 110,
    paddingRight: 15,
    // alignItems: 'flex-end',
    // backgroundColor: 'blue',
  },
  title: {
    fontSize: 10,
    height: 12,
    color: Global.colors.FONT_LIGHT_GRAY1,
    // backgroundColor: 'brown',
  },
  contentContainer: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  content: {
    fontSize: 14,
    fontWeight: '600',
    color: Global.colors.FONT_LIGHT_GRAY,
    // backgroundColor: 'brown',
  },
  chooseText: {
    fontSize: 14,
    fontWeight: '600',
    color: Global.colors.IOS_BLUE,
  },
  switchIcon: {
    marginLeft: 2,
  },
  switchText: {
    fontSize: 10,
    height: 12,
    color: Global.colors.IOS_BLUE,
  },
});

CurrHospitalAndPatient.propTypes = {
  /**
   * 是否可以切换医院
   */
  allowSwitchHospital: PropTypes.bool,

  /**
   * 是否可以切换就诊人
   */
  allowSwitchPatient: PropTypes.bool,

  /**
   * 切换医院后回调
   */
  afterChooseHospital: PropTypes.func,

  /**
   * 切换就诊人后回调
   */
  afterChoosePatient: PropTypes.func,
};

CurrHospitalAndPatient.defaultProps = {
  allowSwitchHospital: false,
  allowSwitchPatient: false,
  afterChooseHospital: () => {},
  afterChoosePatient: () => {},
};

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  navigate: (component, params) => dispatch(NavigationActions.navigate({ routeName: component, params })),
  setCurrHospital: hospital => dispatch(setCurrHospital(hospital)),
  setCurrPatient: userPatient => dispatch(setCurrPatient(userPatient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrHospitalAndPatient);
