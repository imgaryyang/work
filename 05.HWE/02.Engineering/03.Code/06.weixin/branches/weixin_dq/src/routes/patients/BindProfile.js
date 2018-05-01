import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Toast, ActivityIndicator } from 'antd-mobile';
import classnames from 'classnames';

import Global from '../../Global';
import Tags from '../../components/Tags';
import ProfileList from './ProfileList';

import styles from './BindProfile.less';
import baseStyles from '../../utils/base.less';

class BindProfile extends React.Component {
  constructor(props) {
    super(props);
    this.afterChooseHospital = this.afterChooseHospital.bind(this);
    this.queryHisProfiles = this.queryHisProfiles.bind(this);
    this.renderPatientInfo = this.renderPatientInfo.bind(this);
  }

  state = {
    hospital: this.props.base.currHospital,
  };

  componentWillMount() {
    const { dispatch, base, patient } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '绑卡',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: null,
      },
    });
    if (!patient.patientInfo.id) {
      Toast.info('请先选择就诊人', 2, null, false);
      dispatch(routerRedux.push({
        pathname: '/stack/patients',
      }));
    } else {
      const { currHospital } = base;
      if (currHospital.id) this.queryHisProfiles();
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'patient/setState',
      payload: {
        hisProfiles: [],
      },
    });
  }

  patient = {};

  afterChooseHospital(hospital) {
    if (hospital) {
      this.setState({
        hospital,
      }, () => {
        this.queryHisProfiles();
      });
    }
  }

  queryHisProfiles() {
    const { dispatch, patient } = this.props;
    dispatch({
      type: 'patient/queryHisProfiles',
      payload: {
        hosNo: this.state.hospital.no,
        name: patient.patientInfo.name,
        idNo: patient.patientInfo.idNo,
      },
    });
  }

  renderPatientInfo() {
    const { patientInfo } = this.props.patient;
    const infos = [
      { label: '手机号', text: patientInfo.mobile },
      { label: '身份证', text: patientInfo.idNo },
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

  render() {
    const { patient } = this.props;
    const { hisProfiles, loadingHisProfiles } = patient;
    let content = null;
    if (loadingHisProfiles) {
      content = (
        <div className={classnames(baseStyles.emptyView, baseStyles.transparentEmptyView)}>
          <ActivityIndicator text="正在查询档案信息..." />
        </div>
      );
    } else if (hisProfiles.length === 0) {
      content = (<div className={classnames(baseStyles.emptyView, baseStyles.transparentEmptyView)}>患者在该医院暂无档案！</div>);
    } else {
      content = (
        <ProfileList
          profiles={this.props.patient.hisProfiles}
          allowBind
          showPatientInfo
        />
      );
    }
    return (
      <div className={styles.container}>
        {this.renderPatientInfo()}
        {content}
      </div>
    );
  }
}

BindProfile.propTypes = {
};

export default connect(({ base, patient }) => ({ base, patient }))(BindProfile);
