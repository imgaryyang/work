/**
 * 消费记录
 */
import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import SignHasCardRecords from './SignHasCardRecords';
import Global from '../../../Global';

class SignMain extends Component {
  static displayName = 'SignMain';
  static description = '消费记录';

  constructor(props) {
    super(props);

    this.hasCardList = null;
  }

  componentDidMount() {
    this.props.navigation.setParams({
      title: '预约签到',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
      hideNavBarBottomLine: false,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { currHospital: hospital, currPatient: patient, currProfile: profile } = nextProps;
    const { currHospital, currProfile } = this.props;
    if (hospital !== currHospital || profile !== currProfile) {
      if (this.hasCardList) this.hasCardList.onRefresh(hospital, patient, profile);
    }
  }

  render() {
    const { currHospital, currProfile, navigation, screenProps } = this.props;

    return (
      <View style={Global.styles.CONTAINER_BG}>
        <SignHasCardRecords
          tabLabel="有卡预约"
          ref={(ref) => { this.hasCardList = ref; }}
          currHospital={currHospital}
          currProfile={currProfile}
          navigation={navigation}
          screenProps={screenProps}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  currProfile: state.base.currProfile,
  currHospital: state.base.currHospital,
});

export default connect(mapStateToProps)(SignMain);
