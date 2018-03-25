/**
 * 显示及切换当前就诊人
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
import { setCurrPatient } from '../../actions/base/BaseAction';

export const CompHeight = 40;

class CurrPatient extends Component {
  static displayName = 'CurrPatient';
  static description = ' 显示及切换当前就诊人';

  constructor(props) {
    super(props);
    this.gotoChoosePatient = this.gotoChoosePatient.bind(this);
    this.afterChoosePatient = this.afterChoosePatient.bind(this);
  }

  componentDidMount() {
  }

  gotoChoosePatient() {
    const { /* base, */allowSwitchPatient } = this.props;
    if (allowSwitchPatient) {
      // const { currHospital } = base;
      this.props.navigate(
        'ChoosePatient',
        {
          callback: this.afterChoosePatient,
          // hospital: currHospital,
          title: '选择就诊人',
          hideNavBarBottomLine: false,
        },
      );
    }
  }

  afterChoosePatient(hospital, patient, profile) {
    const { afterChoosePatient } = this.props;
    // 将当前就诊人放入redux
    this.props.setCurrPatient(patient, profile);
    if (profile === null) {
      Toast.show('就诊人在该医院没有档案');
    }
    if (typeof afterChoosePatient === 'function') afterChoosePatient(hospital, patient, profile);
  }

  render() {
    const { allowSwitchPatient, base } = this.props;
    const { /* currPatient, */currProfile } = base;
    // console.log('currPatient:', currPatient);
    // console.log('currProfile:', currProfile);
    const switchText = <Icon name="ios-arrow-down" size={12} width={12} height={12} color={Global.colors.FONT_LIGHT_GRAY1} style={styles.switchIcon} />;
    return (
      <TouchableOpacity style={styles.patientContainer} onPress={this.gotoChoosePatient} >
        <Text style={styles.title} >就诊人{'\n'}</Text>
        <View style={styles.contentContainer} >
          <Text style={styles.content} numberOfLines={1} >{currProfile ? currProfile.name || '姓名未填写' : '未选择就诊人'}</Text>
          {allowSwitchPatient ? switchText : null}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 110,
    height: CompHeight,
    paddingTop: 0,
  },
  patientContainer: {
    maxWidth: 110,
    paddingRight: 15,
    // alignItems: 'flex-end',
    // backgroundColor: 'blue',
    marginLeft: 5,
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
    fontSize: 12,
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

CurrPatient.propTypes = {
  /**
   * 是否可以切换就诊人
   */
  allowSwitchPatient: PropTypes.bool,

  /**
   * 切换就诊人后回调
   */
  afterChoosePatient: PropTypes.func,
};

CurrPatient.defaultProps = {
  allowSwitchPatient: false,
  afterChoosePatient: () => {},
};

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  navigate: (component, params) => dispatch(NavigationActions.navigate({ routeName: component, params })),
  setCurrPatient: (userPatient, profile) => dispatch(setCurrPatient(userPatient, profile)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrPatient);
