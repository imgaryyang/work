/**
 * 显示及切换当前医院
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
import { NavigationActions } from 'react-navigation';
import Icon from 'rn-easy-icon';
import Toast from 'react-native-root-toast';

import Global from '../../Global';
import { setCurrHospital, setCurrPatient } from '../../actions/base/BaseAction';

export const CompHeight = 40;

class CurrHospital extends Component {
  static displayName = 'CurrHospital';
  static description = ' 显示及切换当前医院';

  constructor(props) {
    super(props);
    this.gotoChooseHospital = this.gotoChooseHospital.bind(this);
    this.afterChooseHospital = this.afterChooseHospital.bind(this);
  }

  componentDidMount() {
  }

  gotoChooseHospital() {
    const { allowSwitchHospital } = this.props;
    const editionCtrl = this.props.base.edition !== Global.EDITION_SINGLE;
    if (editionCtrl && allowSwitchHospital) {
      this.props.navigate(
        'ChooseHospital',
        {
          chooseHospital: this.afterChooseHospital,
          title: '选择医院',
          hideNavBarBottomLine: true,
        },
      );
    }
  }

  afterChooseHospital(hospital) {
    const { afterChooseHospital, base } = this.props;
    /**
     * 查找当前就诊人在所选医院是否有档案
     * 如果有，则自动将第一个档案设为当前就诊人档案
     * 如果没有，则清空当前就诊人及当前档案，并提示给用户
     */
    const { currPatient } = base;
    let newProfile = null;
    if (currPatient) {
      for (let i = 0; currPatient.profiles && i < currPatient.profiles.length; i++) {
        if (currPatient.profiles[i].hosId === hospital.id) {
          newProfile = currPatient.profiles[i];
          break;
        }
      }
    }
    if (newProfile) {
      this.props.setCurrPatient(currPatient, newProfile);
    } else {
      this.props.setCurrPatient(currPatient, null);
      Toast.show(`当前所选就诊人${currPatient.name}在${hospital.name}未绑定卡`);
    }
    // 设置当前医院
    this.props.setCurrHospital(hospital);
    // 处理回调
    if (typeof afterChooseHospital === 'function') afterChooseHospital(hospital, currPatient, newProfile);
  }

  render() {
    const { allowSwitchHospital, base } = this.props;
    const editionCtrl = this.props.base.edition !== Global.EDITION_SINGLE;
    const { currHospital } = base;
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
      <TouchableOpacity style={styles.hospitalContainer} onPress={this.gotoChooseHospital} >
        <Text style={styles.title} >当前医院{'\n'}</Text>
        <View style={styles.contentContainer} >
          {hostName}
          {editionCtrl && allowSwitchHospital ? switchText : null}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: CompHeight,
    paddingTop: 0,
  },
  hospitalContainer: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 10,
    // backgroundColor: 'green',
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

CurrHospital.propTypes = {
  /**
   * 是否可以切换医院
   */
  allowSwitchHospital: PropTypes.bool,

  /**
   * 切换医院后回调
   */
  afterChooseHospital: PropTypes.func,
};

CurrHospital.defaultProps = {
  allowSwitchHospital: false,
  afterChooseHospital: () => {},
};

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  navigate: (component, params) => dispatch(NavigationActions.navigate({ routeName: component, params })),
  setCurrHospital: hospital => dispatch(setCurrHospital(hospital)),
  setCurrPatient: (patient, profile) => dispatch(setCurrPatient(patient, profile)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrHospital);
