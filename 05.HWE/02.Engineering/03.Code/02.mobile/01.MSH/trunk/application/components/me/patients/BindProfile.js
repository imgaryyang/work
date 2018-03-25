import React, { Component } from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  FlatList,
  InteractionManager,
  TouchableOpacity,
} from 'react-native';

import Button from 'rn-easy-button';
import Sep from 'rn-easy-separator';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import Portrait from 'rn-easy-portrait';
import Icon from 'rn-easy-icon';
import Card from 'rn-easy-card';

import Tags from '../../../modules/filters/Tags';
import initCtrlState from '../../../modules/ListState';
import Global from '../../../Global';
import { queryHisProfiles } from '../../../services/me/PatientService';
import ProfileList from './ProfileList';

class BindProfiles extends Component {
  static displayName = 'BindProfiles';
  static description = '绑定档案';

  constructor(props) {
    super(props);
    this.patient = this.props.screenProps.getPatientById(this.props.navigation.state.params.patientId);

    this.renderPatientInfo = this.renderPatientInfo.bind(this);
    this.renderCurrHospital = this.renderCurrHospital.bind(this);
    this.afterChooseHospital = this.afterChooseHospital.bind(this);
    this.queryHisProfiles = this.queryHisProfiles.bind(this);
    this.renderProfiles = this.renderProfiles.bind(this);
  }

  state = {
    doRenderScene: false,
    hospital: this.props.base.currHospital,
    ctrlState: initCtrlState,
    data: [],
  };

  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.props.navigation.setParams({
      title: params && params.title ? params.title : '绑卡',
    });

    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      }, () => {
        const { base } = this.props;
        const { /* edition, */currHospital } = base;
        if (/* edition === Global.EDITION_SINGLE*/currHospital) this.queryHisProfiles();
      });
    });
  }

  patient = {};

  afterChooseHospital(hospital) {
    // console.log(hospital);
    if (hospital) {
      this.setState({
        hospital,
      }, () => {
        this.queryHisProfiles();
      });
    }
  }

  async queryHisProfiles() {
    try {
      const query = {
        hosNo: this.state.hospital.no,
        name: this.patient.name,
        idNo: this.patient.idNo,
      };
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: true,
        },
      });
      const responseData = await queryHisProfiles(query);
      // console.log('responseData of HIS profiles:', responseData);
      if (responseData.success) {
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
            requestErr: false,
            requestErrMsg: '',
          },
          data: responseData.result,
        });
      } else {
        this.setState({
          ctrlState: {
            ...this.state.ctrlState,
            refreshing: false,
            requestErr: true,
            requestErrMsg: { msg: responseData.msg },
          },
          data: [],
        });
        Toast.show(responseData.msg);
      }
    } catch (e) {
      this.setState({
        ctrlState: {
          ...this.state.ctrlState,
          refreshing: false,
          requestErr: true,
          requestErrMsg: e,
        },
      });
      this.handleRequestException(e);
    }
  }

  renderPatientInfo() {
    const value = this.patient;
    const infos = [
      { label: '手机号', text: value.mobile },
      { label: '身份证', text: value.idNo },
    ];
    const { tagConfig } = Global.Config;
    const tags = [value.relation !== '0' ? { ...tagConfig.patientRelationOther, label: Global.relations[value.relation] } : tagConfig.patientRelationMeself];

    return (
      <Card noPadding radius={6} style={{ margin: 10, marginBottom: 0 }}>
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

  renderCurrHospital() {
    const { base, navigation } = this.props;
    const { edition } = base;
    const currHospital = this.state.hospital;
    const portraitSource = currHospital && currHospital.logo ?
      { uri: `${Global.getImageHost()}${currHospital.logo}?timestamp=${new Date().getTime()}` } :
      Global.Config.defaultImgs.hospLogo;
    const currHospitalView = (
      <TouchableOpacity
        style={styles.hospitalContainer}
        onPress={() => navigation.navigate('ChooseHospital', {
          chooseHospital: this.afterChooseHospital,
          title: '选择医院',
          hideNavBarBottomLine: true,
        })}
      >
        <Portrait width={60} height={30} imageSource={portraitSource} resizeMode="contain" />
        <Text style={styles.hospName} numberOfLines={1}>{currHospital ? currHospital.name : '您还未选择医院...'}</Text>
        <Text style={styles.switchText}>{currHospital ? '切换' : '去选择'}</Text>
        <Icon
          iconLib="fa"
          name="angle-right"
          size={20}
          width={40}
          height={20}
          color={Global.colors.IOS_ARROW}
        />
      </TouchableOpacity>
    );
    // return currHospitalView;
    return edition === Global.EDITION_SINGLE ? null : currHospitalView;
  }

  renderPlaceholderView() {
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        {this.renderPatientInfo()}
        {this.renderCurrHospital()}
      </View>
    );
  }

  renderProfiles() {
    const { data } = this.state;
    return data.map((item, idx) => {
      return (
        <Card key={`his_profile_${item.id}_${idx + 1}`} fullWidth hideTopBorder={idx > 0} noPadding style={styles.profileContainer}>
          <View style={{ flex: 1 }}>
            <View style={styles.itemContainer}>
              <Text style={styles.label}>手机号：</Text>
              <Text style={styles.text} numberOfLine={1}>{item.mobile}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.label}>卡号：</Text>
              <Text style={styles.text} numberOfLine={1}>{item.no}</Text>
            </View>
          </View>
        </Card>
      );
    });
  }

  render() {
    if (!this.state.doRenderScene) { return this.renderPlaceholderView(); }

    const { data, hospital, ctrlState } = this.state;
    const emptyView = !hospital ? null : (
      data.length === 0 ? this.renderEmptyView({
        msg: '未查询到任何卡信息',
        ctrlState,
        style: { marginTop: 10, borderWidth: 0, backgroundColor: 'transparent' },
      }) : null
    );
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <ScrollView style={styles.scrollView}>
          {this.renderPatientInfo()}
          {this.renderCurrHospital()}
          {emptyView}
          <View style={{ height: 0 }} />
          <ProfileList
            profiles={data}
            screenProps={this.props.screenProps}
            navigation={this.props.navigation}
            patientId={this.props.navigation.state.params.patientId}
            allowBind
            showPatientInfo
          />
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  hospitalContainer: {
    backgroundColor: 'white',
    borderWidth: 1 / Global.pixelRatio,
    borderColor: Global.colors.LINE,
    margin: 10,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingLeft: 0,
    paddingRight: 0,
    borderRadius: 6,
  },
  hospName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Global.colors.FONT_GRAY,
  },
  switchText: {
    paddingLeft: 10,
    fontSize: 12,
    color: Global.colors.IOS_BLUE,
  },

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

  profilesContainer: {
    marginTop: 15,
  },
  profileContainer: {
    padding: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    marginTop: 3,
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'black',
  },
  itemText: {
    flex: 1,
    fontSize: 13,
    color: Global.colors.FONT_GRAY,
    textAlign: 'right',
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

// const mapDispatchToProps = dispatch => ({
//   updateUser: user => dispatch(updateUser(user)),
// });

export default connect(mapStateToProps/* , mapDispatchToProps*/)(BindProfiles);
