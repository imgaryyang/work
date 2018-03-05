import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Global from '../../../Global';
import { setCurrPatient } from '../../../actions/base/BaseAction';

class PatientInfo extends Component {
  static filterProfile(patient, hospital) {
    const { profiles } = patient;
    return Array.isArray(profiles) && profiles.length > 0 ?
      profiles.find(item => item.status === '1' && item.hosId === hospital.id) :
      profiles;
  }

  render() {
    const { style, currPatient, currHospital } = this.props;
    const currProfile = PatientInfo.filterProfile(currPatient, currHospital);

    return (
      <View style={[styles.container, style]}>
        <View style={styles.row}>
          <Text style={styles.labelText}>姓名</Text>
          <Text style={[styles.contentText, { marginLeft: 25 }]}>{currPatient.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText}>手机号</Text>
          <Text style={styles.contentText}>{currPatient.mobile}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText}>身份证</Text>
          <Text style={styles.contentText}>{currPatient.idNo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText}>就诊卡</Text>
          <Text style={styles.contentText}>{currProfile && currProfile.no ? currProfile.no : '无卡或尚未绑卡'}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 5,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 15,
    color: Global.colors.FONT_GRAY,
  },
  contentText: {
    fontSize: 15,
    marginLeft: 10,
  },
});

const mapStateToProps = state => ({
  currPatient: state.base.currPatient,
  currHospital: state.base.currHospital,
});

const mapDispatchToProps = dispatch => ({
  navigate: (component, params) => dispatch(NavigationActions.navigate({ routeName: component, params })),
  setCurrPatient: userPatient => dispatch(setCurrPatient(userPatient)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PatientInfo);

// 过滤出就诊人在当前医院的默认档案
// export function filterProfile(patient, hospital) {
//   const { profiles } = patient;
//
//   return Array.isArray(profiles) && profiles.length > 0 ?
//     profiles.find(item => item.status === '1' && item.hosId === hospital.id) :
//     profiles;
// }
