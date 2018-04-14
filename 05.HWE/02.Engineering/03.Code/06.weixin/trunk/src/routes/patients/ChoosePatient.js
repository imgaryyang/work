/**
 *  选择就诊人，直接选卡，如果无卡，则只显示就诊人
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Toast } from 'antd-mobile';

import Global from '../../Global';

import { colors } from '../../utils/common';
import Icon from '../../components/FAIcon';

import styles from './ChoosePatient.less';
import commonStyles from '../../utils/common.less';

class ChoosePatient extends Component {
  static displayName = 'ChoosePatient';
  static description = '选择就诊人';

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
    selectedCardNo: this.props.base.currProfile ? this.props.base.currProfile.no : '',
    hospital: this.props.base.currHospital,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '选择就诊人',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: (
          <div
            onClick={() => {
              dispatch({
                type: 'base/reloadUserInfo',
                callback: msg => (msg.id ? Toast.info('重新载入用户信息成功！', 2, null, false) : Toast.info(msg, 2, null, false)),
              });
            }}
            className={styles.refreshBtnContainer}
          >
            <Icon type="refresh" className={styles.refreshIcon} />
            <div className={styles.refreshText}>刷新</div>
          </div>
        ),
      },
    });
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        headerRight: null,
      },
    });
  }

  afterChooseProfile(patient, profile) {
    const { dispatch } = this.props;
    this.setState({ selectedCardNo: profile.no }, () => {
      // 设置当前医院
      dispatch({
        type: 'base/setState',
        payload: {
          currHospital: this.state.hospital,
          currPatient: patient,
          currProfile: profile,
        },
      });
      this.props.dispatch(routerRedux.goBack());
    });
  }

  afterChooseHospital(hospital) {
    this.setState({ hospital });
  }

  renderCurrHospital() {
    // const { base, navigation } = this.props;
    // const { edition } = base;
    // const currHospital = this.state.hospital;
    // const portraitSource = currHospital && currHospital.logo ?
    //   { uri: `${Global.getImageHost()}${currHospital.logo}?timestamp=${new Date().getTime()}` } :
    //   Global.Config.defaultImgs.hospLogo;
    // const currHospitalView = (
    //   <TouchableOpacity
    //     style={styles.hospitalContainer}
    //     onPress={() => navigation.navigate('ChooseHospital', {
    //       chooseHospital: this.afterChooseHospital,
    //       title: '选择医院',
    //       hideNavBarBottomLine: true,
    //     })}
    //   >
    //     <Portrait width={60} height={30} imageSource={portraitSource} resizeMode="contain" />
    //     <Text style={styles.hospName} numberOfLines={1}>{currHospital ? currHospital.name : '您还未选择医院...'}</Text>
    //     <Text style={styles.switchText}>{currHospital ? '切换' : '去选择'}</Text>
    //     <Icon
    //       iconLib="fa"
    //       name="angle-right"
    //       size={20}
    //       width={40}
    //       height={20}
    //       color={Global.colors.IOS_ARROW}
    //     />
    //   </TouchableOpacity>
    // );
    // // return currHospitalView;
    // return edition === Global.EDITION_SINGLE ? null : currHospitalView;

    // TODO: 多医院版需要实现选择医院功能，参见APP
    const { base } = this.props;
    const { edition } = base;
    return edition === Global.EDITION_SINGLE ? null : (<div />);
  }

  renderItems() {
    const { selectedCardNo } = this.state;
    const { base } = this.props;
    const { edition, user } = base;
    const currHospital = this.state.hospital;
    // 如果多医院版本，且当前医院不存在，则不渲染患者列表
    if (edition === Global.EDITION_MULTI && !currHospital) {
      return (<div className={commonStyles.emptyView}>请先选择医院</div>);
    }
    // 如果当前用户无就诊人
    if (!user.map || !user.map.userPatients || user.map.userPatients.length === 0) {
      return (<div className={commonStyles.emptyView}>您还未添加任何就诊人！</div>);
    }

    // console.log('patients:', data);
    return user.map.userPatients.map((patient, idx) => {
      const { id, name, gender, idNo, profiles } = patient;
      const topLine = edition === Global.EDITION_SINGLE && idx === 0 ? { borderTopWidth: 0 } : {};
      // 无绑定档案显示的视图
      const noProfileView = (
        <div className={styles.noProfileContainer}>
          <span className={styles.noProfileText}>{`${name} 还未绑定任何就诊卡`}</span>
          <div
            style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 8 }}
            onClick={() => {
              this.props.dispatch({ type: 'patient/setState', payload: { patientInfo: patient } });
              this.props.dispatch(routerRedux.push({
                pathname: '/stack/BindProfile',
                // state: { patientId: id },
              }));
            }}
          >
            <Icon type="address-card" className={styles.bindCardIcon} />
            <span className={styles.bindCardText}>去绑定就诊卡</span>
          </div>
        </div>
      );
      // 档案列表
      let i = 0;
      const profilesView = profiles.map((profile, profileIdx) => {
        const { no, hosId } = profile;
        if (hosId !== currHospital.id) return null;
        i += 1;
        const iconName = selectedCardNo !== no ? 'circle-thin' : 'check-circle';
        const iconColor = selectedCardNo !== no ? colors.FONT_LIGHT_GRAY1 : colors.IOS_BLUE;
        return (
          <div
            key={`profile_${profile.id}_${profileIdx + 1}`}
            className={styles.cardContainer}
            onClick={() => this.afterChooseProfile(patient, profile)}
          >
            <Icon type={iconName} style={{ color: iconColor }} className={styles.checkIcon} />
            <span className={styles.cardNo}>就诊卡号 {no}</span>
          </div>
        );
      });
      const content = i === 0 ? noProfileView : profilesView;
      return (
        <div
          key={`patient_${id}_${idx + 1}`}
          className={styles.itemContainer}
          style={{ ...topLine, ...(i > 0 ? { borderBottomWidth: 0 } : {}) }}
        >
          <div className={styles.nameContainer}>
            <span className={styles.name}>{name}</span>
            <span className={styles.gender}>{gender === '1' || gender === '0' ? (gender === '1' ? '（ 男 ）' : '（ 女 ）') : ''}</span>
            <span className={styles.idNo}>{idNo}</span>
          </div>
          {content}
        </div>
      );
    });
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderCurrHospital()}
        {this.renderItems()}
        <Button
          type="primary"
          onClick={() => {
            this.props.dispatch({ type: 'patient/setState', payload: { patientInfo: {} } });
            this.props.dispatch(routerRedux.push({
              pathname: '/stack/editPatientInfo',
              state: {},
            }));
          }}
          style={{ margin: 15, marginTop: 30 }}
        >
          添加就诊人
        </Button>
        <div style={{ height: 40 }} />
      </div>
    );
  }
}

export default connect(({ base }) => ({ base }))(ChoosePatient);
