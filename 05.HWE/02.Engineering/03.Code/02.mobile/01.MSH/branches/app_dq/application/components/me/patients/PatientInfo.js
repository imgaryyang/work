import React, { Component } from 'react';

import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  InteractionManager,
  Text,
  TouchableOpacity,
} from 'react-native';

import Button from 'rn-easy-button';
import Sep from 'rn-easy-separator';
import Icon from 'rn-easy-icon';
import Card from 'rn-easy-card';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Global from '../../../Global';
import ProfileList from './ProfileList';
// import { updateUser } from '../../../actions/base/AuthAction';
import Tags from '../../../modules/filters/Tags';
import initCtrlState from '../../../modules/ListState';

const dismissKeyboard = require('dismissKeyboard');

class PatientInfo extends Component {
  static displayName = 'PatientInfo';
  static description = '就诊人信息';

  constructor(props) {
    super(props);
    this.renderPatientInfo = this.renderPatientInfo.bind(this);
    this.bindProfile = this.bindProfile.bind(this);
    this.afterBind = this.afterBind.bind(this);
    this.getProfiles = this.getProfiles.bind(this);
  }

  state = {
    doRenderScene: false,
    ctrlState: initCtrlState,
    // value: (
    //   this.props.navigation.state.params.data ?
    //     Object.assign({}, this.props.navigation.state.params.data) : null
    // ),
    // hospital: {},
  };

  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.props.navigation.setParams({
      title: params && params.title ? params.title : '就诊人信息',
      headerRight: (
        <View style={{ flexDirection: 'row' }}>
          <Button
            onPress={() => {
              this.props.navigation.navigate('EditPatientInfo', {
                data: this.props.screenProps.getPatientById(this.props.navigation.state.params.id),
                title: '修改就诊人信息',
                callback: () => {}, // patient => this.setState({ value: patient }),
              });
            }}
            clear
            stretch={false}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginLeft: 15,
            }}
          >
            <Icon iconLib="mi" name="recent-actors" size={18} width={26} height={35} color={Global.colors.FONT_GRAY} />
            <Text style={{ color: Global.colors.FONT_GRAY, fontSize: 12 }}>修改就诊人信息</Text>
          </Button>
        </View>
      ),
    });

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
  }

  componentWillUnmount() {
  }

  getProfiles() {
    const patientId = this.props.navigation.state.params.id;
    const patient = this.props.screenProps.getPatientById(patientId);
    const { base } = this.props;
    const { edition, currHospital } = base;

    if (edition === Global.EDITION_MULTI) return patient.profiles;

    const data = [];
    for (let i = 0; patient.profiles && i < patient.profiles.length; i++) {
      const profile = patient.profiles[i];
      if (profile.hosId === currHospital.id) data[data.length] = profile;
    }
    return data;

    // const { base } = this.props;
    // const { edition, currHospital } = base;
    // const { profiles } = patient;
    //
    // const flag = edition === Global.EDITION_SINGLE;
    // const hospId = currHospital ? currHospital.id : '';
    // const sections = [];
    // for (let i = 0; i < profiles.length; i++) {
    //   const datas = [];
    //   const pro = profiles[i].profiles;
    //   console.log('pro', pro);
    //   for (let j = 0; j < pro.length; j++) {
    //     if (flag) {
    //       if (pro[j].hosId === hospId) {
    //         datas.push(pro[j]);
    //       }
    //     } else {
    //       datas.push(pro[j]);
    //     }
    //   }
    //   if (flag) {
    //     if (profiles[i].id === hospId) {
    //       sections.push({ key: profiles[i].name, data: datas });
    //     }
    //   } else {
    //     sections.push({ key: profiles[i].name, data: datas });
    //   }
    // }
    // return sections;
  }

  /**
   * 绑定档案
   * @param item
   */
  bindProfile() {
    this.props.navigation.navigate('BindProfile', {
      patientId: this.props.navigation.state.params.id,
      callback: this.afterBind,
      title: '绑卡',
    });
  }

  afterBind(/* item*/) {
    // this.setState({
    //   profiles: item,
    // });
    this.getProfiles();
  }

  renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        {this.renderPatientInfo()}
        {this.renderCardsHeader()}
      </View>
    );
  }

  renderPatientInfo() {
    const value = this.props.screenProps.getPatientById(this.props.navigation.state.params.id);
    const infos = [
      { label: '手机号', text: value.mobile },
      { label: '身份证', text: value.idNo },
      { label: '联系地址', text: value.address || '未填写' },
    ];
    const { tagConfig } = Global.Config;
    const tags = [value.relation !== '0' ? { ...tagConfig.patientRelationOther, label: Global.relations[value.relation] } : tagConfig.patientRelationMeself];

    return (
      <Card fullWidth hideTopBorder noPadding>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{value.name}</Text>
          <Text style={styles.gender}>{`（ ${value.gender === '1' ? '男' : '女'} ）`}</Text>
          <Tags tags={tags} containerStyle={{ flex: 1 }} />
        </View>
        {infos.map(({ label, text }, idx) => {
          return (
            <View key={`info_item_${idx + 1}`} style={styles.infoItem}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.text} numberOfLine={1}>{text}</Text>
            </View>
          );
        })}
      </Card>
    );
  }

  renderCardsHeader() {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 30, paddingLeft: 15, paddingRight: 15, paddingTop: 10 }}>
        <Text style={styles.textLeft}>已绑定的卡</Text>
        <TouchableOpacity style={styles.headerToch} onPress={this.bindProfile}>
          <Icon iconLib="fa" name="address-card-o" size={12} height={14} width={24} color={Global.colors.IOS_BLUE} />
          <Text style={styles.textRight}>去绑定</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    if (!this.state.doRenderScene) { return this.renderPlaceholderView(); }
    const profiles = this.getProfiles();
    const { ctrlState } = this.state;
    const emptyView = !profiles || profiles.length === 0 ? this.renderEmptyView({
      msg: '您还未绑定任何卡',
      ctrlState,
      style: { marginTop: 10 },
    }) : null;
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false} >
          <KeyboardAwareScrollView style={styles.scrollView} keyboardShouldPersistTaps="always" >
            {this.renderPatientInfo()}
            {this.renderCardsHeader()}
            {emptyView}
            <ProfileList
              profiles={profiles || []}
              screenProps={this.props.screenProps}
              navigation={this.props.navigation}
              patientId={this.props.navigation.state.params.id}
            />
            <Sep height={40} />
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  nameContainer: {
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
  },
  gender: {
    fontSize: 12,
    fontWeight: '600',
    color: Global.colors.FONT_GRAY,
  },
  infoItem: {
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1 / Global.pixelRatio,
    borderTopColor: Global.colors.LINE,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Global.colors.FONT_GRAY,
    width: 60,
  },
  text: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
  },
  btnHolder: {
    flexDirection: 'row', margin: 10, marginTop: 0, marginBottom: 10,
  },

  textLeft: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Global.colors.FONT_LIGHT_GRAY,
  },
  textRight: {
    textAlign: 'right',
    fontSize: 12,
    color: Global.colors.IOS_BLUE,
  },
  headerToch: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

// const mapDispatchToProps = dispatch => ({
//   updateUser: user => dispatch(updateUser(user)),
// });

export default connect(mapStateToProps/* , mapDispatchToProps*/)(PatientInfo);
