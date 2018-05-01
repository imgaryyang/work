import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Toast } from 'antd-mobile';
import classnames from 'classnames';

import Icon from '../../components/FAIcon';
import Global from '../../Global';
import Tags from '../../components/Tags';
import ProfileList from './ProfileList';

import styles from './PatientInfo.less';
import baseStyles from '../../utils/base.less';

class PatientInfo extends React.Component {
  constructor(props) {
    super(props);
    this.getProfiles = this.getProfiles.bind(this);
    this.bindProfile = this.bindProfile.bind(this);
    this.renderPatientInfo = this.renderPatientInfo.bind(this);
    this.afterBind = this.afterBind.bind(this);
  }

  componentWillMount() {
    const { patient, dispatch } = this.props;

    if (!patient.patientInfo.id) {
      Toast.info('请先选择就诊人', 2, null, false);
      dispatch(routerRedux.push({
        pathname: '/stack/patients',
      }));
    }
    dispatch({
      type: 'base/save',
      payload: {
        title: '就诊人信息',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div
              onClick={() => {
                dispatch(routerRedux.push({
                  pathname: '/stack/editPatientInfo',
                }));
              }}
              className={baseStyles.navBtnContainer}
            >
              <Icon type="pencil-square" className={baseStyles.navBtnIcon} />
              <div className={baseStyles.navBtnText}>修改就诊人信息</div>
            </div>
          </div>
        ),
      },
    });
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  getProfiles() {
    const { patientInfo } = this.props.patient;
    console.log('getProfiles', patientInfo);
    const { base } = this.props;
    const { edition, currHospital } = base;

    if (edition === Global.EDITION_MULTI) return patientInfo.profiles;

    const data = [];
    for (let i = 0; patientInfo.profiles && i < patientInfo.profiles.length; i++) {
      const profile = patientInfo.profiles[i];
      if (profile.hosId === currHospital.id) data[data.length] = profile;
    }
    return data;
  }

  /**
   * 绑定档案
   * @param item
   */
  bindProfile() {
    this.props.dispatch({
      type: 'patient/initBindedProfiles',
      payload: {},
    });
    this.props.dispatch(routerRedux.push({
      pathname: '/stack/bindProfile',
    }));
  }
  afterBind() {
    console.log('afterBind');
  }
  renderPatientInfo() {
    const { patientInfo } = this.props.patient;
    console.log('patientInfo', patientInfo);
    const infos = [
      { label: '手机号', text: patientInfo.mobile },
      { label: '身份证', text: patientInfo.idNo },
      { label: '联系地址', text: patientInfo.address || '未填写' },
    ];

    const { tagConfig } = Global.Config;
    const tags = [patientInfo.relation !== '0' ? { ...tagConfig.patientRelationOther, label: Global.relations[patientInfo.relation] } : tagConfig.patientRelationMeself];

    return (
      <div className={styles.patientInfoContainer}>
        <div className={classnames(baseStyles.flexRow, styles.nameContainer)}>
          <span className={styles.name}>{patientInfo.name}</span>
          <span className={styles.gender}>{`（ ${patientInfo.gender === '1' ? '男' : '女'} ）`}</span>
          <Tags tags={tags} containerStyle={{ flex: 1 }} />
        </div>
        {infos.map(({ label, text }, idx) => {
          return (
            <div key={`info_item_${idx + 1}`} className={classnames(baseStyles.flexRow, styles.infoItem)}>
              <span className={styles.label}>{label}</span>
              <span className={classnames(styles.text, baseStyles.ellipsisText)}>{text}</span>
            </div>
          );
        })}
      </div>
    );
  }

  renderCardsHeader() {
    return (
      <div className={classnames(baseStyles.flexRow, styles.cardsHeader)}>
        <span className={styles.textLeft}>已绑定的卡</span>
        <div className={classnames(baseStyles.flexRow, styles.headerToch)} onClick={this.bindProfile}>
          <Icon type="address-card" className={styles.bindIcon} />
          <span className={styles.textRight}>去绑定</span>
        </div>
      </div>
    );
  }

  render() {
    const profiles = this.getProfiles();
    console.log('profiles', profiles);
    const emptyView = !profiles || profiles.length === 0 ? (
      <div className={baseStyles.emptyView} style={{ marginTop: 10 }}>还未绑定任何卡！</div>
    ) : null;

    return (
      <div className={styles.container}>
        {this.renderPatientInfo()}
        {this.renderCardsHeader()}
        {emptyView}
        <ProfileList
          profiles={profiles || []}
        />
        <div style={{ height: 40 }} />
      </div>
    );
  }
}

PatientInfo.propTypes = {
};

export default connect(({ base, patient }) => ({ base, patient }))(PatientInfo);
