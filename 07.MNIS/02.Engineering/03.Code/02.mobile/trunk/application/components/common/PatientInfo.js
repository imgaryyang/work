/**
 * 显示当前患者信息
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from 'rn-easy-card';
import Button from 'rn-easy-button';
import Icon from 'react-native-vector-icons/Ionicons';

import { filterMoney } from '../../utils/Filters';
import Global from '../../Global';
import Patients from './Patients';
// import { setPatients, setCurrInpatientArea, setInpatientAreas } from '../../actions/base/BaseAction';

class PatientInfo extends Component {
  static displayName = 'PatientInfo';
  static description = '当前患者信息';

  constructor(props) {
    super(props);
    this.showPatientsListWin = this.showPatientsListWin.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSwitchPatient = this.onSwitchPatient.bind(this);
  }

  state = {
    patientsListVisible: false,
  };

  onSwitchPatient() {
    this.setState({ patientsListVisible: false });
  }

  onClose() {
    this.setState({ patientsListVisible: false });
  }

  showPatientsListWin() {
    this.setState({ patientsListVisible: true });
  }

  render() {
    const { base } = this.props;
    const { /* currInpatientArea, */currPatient } = base;
    const minimalityStyle1 = this.props.minimality ? { height: 50 } : null;
    const minimalityStyle2 = this.props.minimality ? { height: 38 } : null;
    if (!currPatient) {
      return (
        <Card style={{ height: 120, justifyContent: 'center', alignItems: 'center', paddingTop: this.props.minimality ? 10 : 20, paddingBottom: this.props.minimality ? 10 : 20, overflow: 'hidden', ...minimalityStyle1 }} >
          {
            this.props.minimality ? null : (
              <Text style={{ textAlign: 'center', color: Global.colors.FONT_GRAY }} >请扫腕带获取患者信息或先选择患者</Text>
            )
          }
          <Button
            text="选择患者"
            outline
            stretch={false}
            style={{ width: 250, height: 30, marginTop: this.props.minimality ? 0 : 15 }}
            onPress={this.showPatientsListWin}
          />
          <Patients visible={this.state.patientsListVisible} onSwitch={this.onSwitchPatient} onClose={this.onClose} />
        </Card>
      );
    }
    return (
      <Card style={{ height: 120, overflow: 'hidden', ...minimalityStyle2 }} >
        <View style={styles.container} >
          <Text style={[styles.mainText, { flex: 2 }]} onPress={() => { console.log('patient info...'); }} >
            {currPatient.name}
            <Text style={styles.appendText} > ( {currPatient.gender} {currPatient.age}岁 )   </Text>
            <Text
              style={[styles.appendText, { color: Global.colors.IOS_BLUE, fontSize: 12 }]}
              onPress={this.showPatientsListWin}
            >
              <Icon name="md-swap" size={13} /> 切换患者
            </Text>
          </Text>
          <View style={[{ flexDirection: 'row' }]} >
            {
                    currPatient.bedNo ? (<Text style={[{ color: '#000000' }]}>{currPatient.bedNo}床</Text>) : null
                }
            <Text style={[{ paddingLeft: 5, color: '#000000' }]}>{currPatient.inpatientNo}</Text>
          </View>

        </View>
        <View style={styles.container} >
          <Text style={styles.normalText} >{currPatient.diagnosisName}</Text>
          <View style={styles.tagsContainer} >
            {
              currPatient.clinicalPathway === '1' ? (
                <View style={[styles.tagContainer, { backgroundColor: Global.colors.IOS_GREEN }]} >
                  <Text style={styles.tag} > 临床路径 </Text>
                </View>
              ) : null
            }
            <View style={[styles.tagContainer, { backgroundColor: Global.colors.IOS_RED }]} >
              <Text style={styles.tag} > {currPatient.nursingLvl} </Text>
            </View>
          </View>
        </View>

        <View style={styles.feeContainer} >
          <Text style={styles.feeCol} >结算类型{'\n'}
            <Text style={styles.feeType} >{currPatient.settleType}</Text>
          </Text>
          <View style={styles.feeSep} />
          <Text style={styles.feeCol} >总费用{'\n'}
            <Text style={styles.fee} >{filterMoney(currPatient.totalFee)}</Text>
          </Text>
          <View style={styles.feeSep} />
          <Text style={styles.feeCol} >预缴余额{'\n'}
            <Text style={styles.fee} >{filterMoney(currPatient.balance)}</Text>
          </Text>
        </View>
        <Patients visible={this.state.patientsListVisible} onSwitch={this.onSwitchPatient} onClose={this.onClose} />
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  appendText: {
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
  },

  normalText: {
    flex: 1,
    color: Global.colors.FONT_GRAY,
  },

  tagsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tagContainer: {
    padding: 2,
    borderRadius: 3,
    marginLeft: 5,
  },
  tag: {
    fontSize: 11,
    color: 'white',
  },

  feeContainer: {
    borderTopWidth: 1 / Global.pixelRatio,
    borderTopColor: Global.colors.LINE,
    paddingTop: 5,
    // paddingBottom: 5,
    // marginLeft: 15,
    // marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feeCol: {
    flex: 1,
    // textAlign: 'center',
    fontSize: 10,
    color: Global.colors.FONT_GRAY,
  },
  feeSep: {
    width: 1 / Global.pixelRatio,
    height: 40,
    backgroundColor: Global.colors.LINE,
    marginRight: 10,
  },
  feeType: {
    fontSize: 12,
    lineHeight: 20,
  },
  fee: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
  },
});

PatientInfo.propTypes = {
  minimality: PropTypes.bool,
};

PatientInfo.defaultProps = {
  minimality: false,
};

const mapStateToProps = state => ({
  base: state.base,
});

// const mapDispatchToProps = dispatch => ({
//   setPatients: patients => dispatch(setPatients(patients)),
//   setInpatientAreas: areas => dispatch(setInpatientAreas(areas)),
//   setCurrInpatientArea: area => dispatch(setCurrInpatientArea(area)),
// });

export default connect(mapStateToProps)(PatientInfo);
