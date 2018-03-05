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
  InteractionManager,
} from 'react-native';

import Button from 'rn-easy-button';
import { connect } from 'react-redux';
import Icon from 'rn-easy-icon';
import Sep from 'rn-easy-separator';
import { NavigationActions } from 'react-navigation';

import Global from '../../../Global';
import { updateUser } from '../../../actions/base/AuthAction';
import { setCurrPatient } from '../../../actions/base/BaseAction';

class ChangePatient extends Component {
  static displayName = 'ChangePatient';
  static description = ' 选择就诊人';

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.gotoBind = this.gotoBind.bind(this);
    this.afterSelect = this.afterSelect.bind(this);
    this.renderProfile = this.renderProfile.bind(this);
  }

  state = {
    value: this.props.base.currPatient ? this.props.base.currPatient : {},
    hospital: this.props.base.currHospital ? this.props.base.currHospital : {},
    profile: {},
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
      }, () => this.renderProfile(this.state.hospital, this.state.value));
    });
    // this.renderProfile(this.state.hospital, this.state.value);
  }
  onSelect() {
    this.props.navigate('PatientList', { callback: this.afterSelect, hospital: this.state.hospital });
  }
  gotoBind() {
    this.props.navigate('BindArchives', {
      data: this.state.value,
      hospital: this.state.hospital,
      callback: this.afterSelect,
    });
  }
  afterSelect(patient, pro) {
    this.setState({
      value: patient,
      profile: pro,
    });
    // 将当前就诊人放入redux
    this.props.setCurrPatient(patient);
    // 回调列表更新数据
    const { callback } = this.props;
    if (typeof callback === 'function') callback(patient, pro);
  }
  renderProfile(hospital, item) {
    const { profiles } = item;
    if (profiles !== null) {
      const length = profiles.length ? profiles.length : 0;
      for (let i = 0; i < length; i++) {
        const pro = profiles[i];
        if (pro.status === '1' && pro.hosId === hospital.id) {
          this.setState({
            profile: pro,
          });
        }
      }
    }
  }
  render() {
    const view = this.state.profile && this.state.profile.no ? (
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 15, color: '#999999' }}>档案号</Text>
        <Sep width={5} />
        <Text style={{ fontSize: 15, color: '#999999' }}>{this.state.profile.no}</Text>
      </View>
    ) : (
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 15, color: '#999999' }}>暂无档案，请前往绑定档案</Text>
        <Sep width={10} />
        <Button text="绑定" stretch={false} style={{ height: 15, width: 50 }} onPress={this.gotoBind} />
      </View>
    );
    return (
      <View >
        <ScrollView style={{ backgroundColor: 'white' }}>
          <View style={{ backgroundColor: Global.colors.LINE, height: 10 }} />
          <TouchableOpacity onPress={this.onSelect}>
            <View style={Global.styles.FULL_SEP_LINE} />
            <Sep height={15} />
            <View style={{ flex: 1, marginLeft: 10, flexDirection: 'row' }}>
              <View style={{ flex: 5 }}>
                <Text style={{ fontSize: 15, color: '#2C3742' }}>{this.state.value.name}</Text>
                <Sep height={4} />
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontSize: 15, color: '#999999' }}>身份证</Text>
                  <Sep width={5} />
                  <Text style={{ fontSize: 15, color: '#999999' }}>{this.state.value.idNo}</Text>
                </View>
                <Sep height={4} />
                {view}
              </View>
              <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', paddingRight: 10, alignItems: 'flex-start' }}>
                <Icon name="md-swap" />
                <Text style={{ fontSize: 15, color: Global.colors.IOS_BLUE }}>切换</Text>
              </View>
            </View>
            <Sep height={15} />
          </TouchableOpacity>
          <View style={{ backgroundColor: Global.colors.LINE, height: 10 }} />
        </ScrollView>
      </View>
    );
  }
}

ChangePatient.navigationOptions = ({ navigation }) => ({
  headerTitle: navigation.state.params ? navigation.state.params.title : '我的个人资料',
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  updateUser: user => dispatch(updateUser(user)),
  setCurrPatient: userPatient => dispatch(setCurrPatient(userPatient)),
  navigate: (component, params) => dispatch(NavigationActions.navigate({ routeName: component, params })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePatient);
