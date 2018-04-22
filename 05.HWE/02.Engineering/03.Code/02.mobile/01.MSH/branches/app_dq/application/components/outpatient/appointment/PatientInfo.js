import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'rn-easy-icon';
import Picker from 'rn-easy-picker';
import { connect } from 'react-redux';
import Global from '../../../Global';
import Form from '../../../modules/form/EasyForm';
import { isValidArray } from '../../../utils/Filters';
import { setCurrPatient } from '../../../actions/base/BaseAction';

const initTypeData = [
  { value: 0, label: '有卡预约' },
  { value: 1, label: '无卡预约' },
];

class PatientInfo extends Component {
  static filterProfile(patient, hospital) {
    const { profiles } = patient;
    return isValidArray(profiles) ?
      profiles.find(({ status, hosId }) => status === '1' && hosId === hospital.id) :
      profiles;
  }

  static hasProfile(patient, hospital) {
    const { profiles } = patient;
    return !!(isValidArray(profiles) && profiles.find(({ status, hosId }) => status === '1' && hosId === hospital.id));
  }

  constructor(props) {
    super(props);

    this.typePickerRef = null;
    this.formRef = null;

    const typeData = isValidArray(props.currPatient.profiles) ? initTypeData : initTypeData.slice(1);
    this.state = {
      typeData,
      selectedType: typeData[0],
    };
  }

  render() {
    const { style, currPatient, currHospital } = this.props;
    const { typeData, selectedType } = this.state;

    const currProfile = PatientInfo.filterProfile(currPatient, currHospital);

    return (
      <View style={[styles.container, style]}>
        <View style={[styles.row, { height: 20 }]}>
          <Text style={[styles.labelText, { flex: 1 }]}>预约类型</Text>
          <TouchableOpacity onPress={() => this.typePickerRef.toggle()} style={styles.typeSwitch}>
            <Text style={[styles.contentText, { color: Global.colors.IOS_BLUE }]}>{selectedType.label}</Text>
            <Icon name="ios-arrow-forward" style={styles.icon} size={15} width={15} height={15} color={Global.colors.IOS_ARROW} />
          </TouchableOpacity>
        </View>
        {
          selectedType.value ?
          (
            <Form
              ref={(ref) => { this.formRef = ref; }}
              onChange={this.onChange}
              value={this.state.value}
              showLabel
            >
              <Form.TextInput
                label="患者名称"
                name="proName"
                dataType="string"
                placeholder="请输入患者名称"
                autoFocus
                required
              />
              <Form.TextInput
                label="手机号"
                name="mobile"
                dataType="mobile"
                placeholder="请输入手机号"
                required
              />
              <Form.TextInput
                label="身份证号"
                name="idNo"
                dataType="cnIdNo"
                placeholder="请输入身份证号"
                maxLength={18}
                minLength={15}
                required
              />
            </Form>
          ) : (
            <View>
              <View style={styles.row}>
                <Text style={styles.labelText}>姓名</Text>
                <Text style={styles.contentText}>{currPatient.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelText}>手机号</Text>
                <Text style={styles.contentText}>{currPatient.mobile}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelText}>身份证号</Text>
                <Text style={styles.contentText}>{currPatient.idNo}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelText}>就诊卡</Text>
                <Text style={styles.contentText}>{(currProfile && currProfile.no) || '无卡或尚未绑卡'}</Text>
              </View>
            </View>
          )
        }
        <Picker
          ref={(ref) => { this.typePickerRef = ref; }}
          dataSource={typeData}
          selected={selectedType.value}
          onChange={(item) => {
            this.setState({ selectedType: item });
          }}
          center
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    paddingTop: 5,
    paddingBottom: 15,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    marginLeft: 15,
    marginTop: 5,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 15,
    color: Global.colors.FONT_GRAY,
    width: 65,
  },
  contentText: {
    fontSize: 15,
  },
  icon: {
    marginLeft: 5,
    marginRight: 10,
  },
  typeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
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
