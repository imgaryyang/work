/**
 *  选择就诊人，直接选卡，如果无卡，则只显示就诊人
 */
import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  InteractionManager,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import Button from 'rn-easy-button';
import Icon from 'rn-easy-icon';
import Portrait from 'rn-easy-portrait';

import Global from '../../../Global';
import ctrlState from '../../../modules/ListState';
import { updateUser } from '../../../actions/base/AuthAction';
import { setCurrPatient, setCurrHospital } from '../../../actions/base/BaseAction';

class ChoosePatient extends Component {
  static displayName = 'ChoosePatient';
  static description = '选择就诊人';

  static renderPlaceholderView() {
    return (
      <View style={[Global.styles.INDICATOR_CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <ActivityIndicator />
      </View>
    );
  }

  static getProfiles(data, hospital) {
    // console.log('data', data);
    const { id } = hospital;
    const sections = [];
    for (let i = 0; i < data.length; i++) {
      const datas = [];
      const pro = data[i].profiles;
      for (let j = 0; j < pro.length; j++) {
        if (pro[j].hosId === id) {
          datas.push(pro[j]);
        }
      }
      sections.push({ key: data[i].name, gender: data[i].gender, id: data[i].id, data: datas });
    }
    // console.log('sections', sections);
    return sections;
  }

  constructor(props) {
    super(props);
    this.renderCurrHospital = this.renderCurrHospital.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.afterChooseProfile = this.afterChooseProfile.bind(this);
    this.afterChooseHospital = this.afterChooseHospital.bind(this);
  }

  state = {
    doRenderScene: false,
    ctrlState,
    selectedCardNo: this.props.base.currProfile ? this.props.base.currProfile.no : '',
    hospital: this.props.base.currHospital,
  };

  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.props.navigation.setParams({
      title: params && params.title ? params.title : '选择就诊人',
      headerRight: (
        <Button
          onPress={this.props.screenProps.reloadUserInfo/* this.fetchData*/}
          clear
          stretch={false}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        >
          <Icon iconLib="mi" name="cached" size={18} width={26} height={35} color={Global.colors.FONT_GRAY} />
          <Text style={{ color: Global.colors.FONT_GRAY, fontSize: 12 }}>刷新</Text>
        </Button>
      ),
    });
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
  }

  afterChooseProfile(patient, profile) {
    this.setState({ selectedCardNo: profile.no }, () => {
      // 设置当前医院
      this.props.setCurrHospital(this.state.hospital);
      // 处理回调
      const { state, goBack } = this.props.navigation;
      const { params } = state;
      if (params && typeof params.callback === 'function') params.callback(this.state.hospital, patient, profile);
      goBack();
    });
  }

  afterChooseHospital(hospital) {
    this.setState({ hospital });
    // this.props.setCurrHospital(hospital);
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

  renderItems() {
    const { selectedCardNo } = this.state;
    const { auth, base, navigation } = this.props;
    const { edition } = base;
    const currHospital = this.state.hospital;
    // 如果多医院版本，且当前医院不存在，则不渲染患者列表
    if (edition === Global.EDITION_MULTI && !currHospital) {
      return this.renderEmptyView({
        ctrlState: this.state.ctrlState,
        msg: '请先选择医院',
        style: { marginBottom: 15 },
      });
    }
    // 如果当前用户无就诊人
    if (!auth.user.map || !auth.user.map.userPatients || auth.user.map.userPatients.length === 0) {
      return this.renderEmptyView({
        ctrlState: this.state.ctrlState,
        msg: '您还未添加任何就诊人',
        style: { marginBottom: 15 },
      });
    }

    // console.log('patients:', data);
    return auth.user.map.userPatients.map((patient, idx) => {
      const { id, name, gender, idNo, profiles } = patient;
      const topLine = edition === Global.EDITION_SINGLE && idx === 0 ? { borderTopWidth: 0 } : {};
      // 无绑定档案显示的视图
      const noProfileView = (
        <View style={styles.noProfileContainer}>
          <Text style={styles.noProfileText}>{`${name} 还未绑定任何就诊卡`}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }} >
            <Icon iconLib="mi" name="assignment-turned-in" size={16} width={20} height={25} color={Global.colors.IOS_BLUE} />
            <Button
              text="去绑定就诊卡"
              onPress={() => navigation.navigate('BindProfile', {
                patientId: id,
                callback: () => {},
                title: '绑卡',
              })}
              clear
              stretch={false}
              size="small"
              style={{ width: 220, alignItems: 'flex-start', marginLeft: 5 }}
            />
          </View>
        </View>
      );
      // 档案列表
      let i = 0;
      const profilesView = profiles.map((profile, profileIdx) => {
        const { no, hosId } = profile;
        if (hosId !== currHospital.id) return null;
        i += 1;
        const iconName = selectedCardNo !== no ? 'radio-button-unchecked' : 'radio-button-checked';
        const iconColor = selectedCardNo !== no ? Global.colors.FONT_LIGHT_GRAY1 : Global.colors.IOS_BLUE;
        return (
          <TouchableOpacity
            key={`profile_${profile.id}_${profileIdx + 1}`}
            style={styles.cardContainer}
            onPress={() => this.afterChooseProfile(patient, profile)}
          >
            <Icon iconLib="mi" name={iconName} color={iconColor} size={16} width={46} height={40} />
            <Text style={styles.cardNo}>就诊卡号 {no}</Text>
          </TouchableOpacity>
        );
      });
      const content = i === 0 ? noProfileView : profilesView;
      return (
        <View key={`patient_${id}_${idx + 1}`} style={[styles.itemContainer, topLine]} >
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.gender}>{gender === '1' || gender === '0' ? (gender === '1' ? '（ 男 ）' : '（ 女 ）') : ''}</Text>
            <Text style={styles.idNo} numberOfLines={1}>{idNo}</Text>
          </View>
          {content}
        </View>
      );
    });
  }

  render() {
    if (!this.state.doRenderScene) return ChoosePatient.renderPlaceholderView();

    const { navigation } = this.props;
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.ctrlState.refreshing}
              onRefresh={this.fetchData}
            />
          }
        >
          {this.renderCurrHospital()}
          {this.renderItems()}
          <Button
            text="添加就诊人"
            onPress={() => navigation.navigate('EditPatientInfo', {
              title: '添加就诊人',
            })}
            style={{ margin: 15 }}
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
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingLeft: 0,
    paddingRight: 0,
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

  itemContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1 / Global.pixelRatio,
    borderTopColor: Global.colors.LINE,
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
    marginBottom: 15,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 15,
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
  },
  name: {
    fontSize: 14,
    color: 'black',
    fontWeight: '600',
  },
  gender: {
    fontSize: 12,
    color: Global.colors.FONT_LIGHT_GRAY,
    fontWeight: '600',
  },
  idNo: {
    flex: 1,
    fontSize: 12,
    color: Global.colors.FONT_LIGHT_GRAY,
    fontWeight: '600',
    textAlign: 'right',
  },
  noProfileContainer: {
    height: 70,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
  },
  noProfileText: {
    fontSize: 12,
    color: Global.colors.FONT_LIGHT_GRAY,
  },
  cardContainer: {
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardNo: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: Global.colors.FONT_GRAY,
  },
});

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

const mapDispatchToProps = dispatch => ({
  updateUser: user => dispatch(updateUser(user)),
  setCurrPatient: userPatient => dispatch(setCurrPatient(userPatient)),
  setCurrHospital: hospital => dispatch(setCurrHospital(hospital)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChoosePatient);
