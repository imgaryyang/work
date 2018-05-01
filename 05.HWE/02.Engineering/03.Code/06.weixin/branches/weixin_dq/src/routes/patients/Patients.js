import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon } from 'antd-mobile';
import classnames from 'classnames';

import { colors } from '../../utils/common';
import FAIcon from '../../components/FAIcon';
import Global from '../../Global';
import Tags from '../../components/Tags';

import styles from './Patients.less';
import baseStyles from '../../utils/base.less';

class Patients extends React.Component {
  constructor(props) {
    super(props);
    this.checkProfile = this.checkProfile.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.viewPatientInfo = this.viewPatientInfo.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '常用就诊人',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div
              onClick={() => {
                dispatch({
                  type: 'base/reloadUserInfo',
                  // callback: msg => Toast.info(msg, 2, null, false),
                  // reloadDown: () => { Toast.info('刷新就诊人列表信息成功！', 2, null, false); },
                });
              }}
              className={baseStyles.navBtnContainer}
            >
              <FAIcon type="refresh" className={baseStyles.navBtnIcon} />
              <div className={baseStyles.navBtnText}>刷新</div>
            </div>
            <div
              onClick={() => {
                this.props.dispatch({ type: 'patient/setState', payload: { patientInfo: {} } });
                dispatch(routerRedux.push({
                  pathname: '/stack/editPatientInfo',
                  state: {},
                }));
              }}
              className={baseStyles.navBtnContainer}
            >
              <FAIcon type="user-plus" className={baseStyles.navBtnIcon} />
              <div className={baseStyles.navBtnText}>添加</div>
            </div>
          </div>
        ),
      },
    });
  }

  checkProfile(profiles, currHospital) {
    if (!currHospital) return 0;
    const { id } = currHospital;
    let num = 0;
    for (let i = 0; i < profiles.length; i++) {
      if (profiles[i].hosId === id) {
        num += 1;
      }
    }
    return num;
  }

  viewPatientInfo(patient) {
    this.props.dispatch({ type: 'patient/setState', payload: { patientInfo: patient } });
    this.props.dispatch(routerRedux.push({
      pathname: '/stack/patientInfo',
      // state: { id: patient.id },
    }));
  }

  /**
   * 渲染行数据
   */
  renderItem({ item, index }) {
    // console.log('render patients item:', item);
    const { currHospital, edition } = this.props.base;

    const profiles = item.profiles ? item.profiles : [];
    const flag = edition === Global.EDITION_SINGLE;
    const num1 = item.profiles ? item.profiles.length : '0';
    const num2 = this.checkProfile(profiles, currHospital);
    const no = flag ? num2 : num1;

    const { tagConfig } = Global.Config;
    const tags = [item.relation !== '0' ? { ...tagConfig.patientRelationOther, label: Global.relations[item.relation] } : tagConfig.patientRelationMeself];

    return (
      <div key={`patient_${item.id}_${index + 1}`} onClick={() => this.viewPatientInfo(item)}>
        <div className={styles.rowContainer}>
          <div style={{ flex: 1 }}>
            <div className={classnames(baseStyles.flexRow, styles.nameContainer)}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.gender}>{`（ ${item.gender === '1' ? '男' : '女'} ）`}</span>
              <Tags tags={tags} containerStyle={{ flex: 1 }} />
            </div>
            <div className={classnames(baseStyles.flexRow, styles.itemContainer)} style={{ marginTop: 0 }}>
              <span className={styles.label}>身份证：</span>
              <span className={styles.text}>{item.idNo}</span>
            </div>
            <div className={classnames(baseStyles.flexRow, styles.itemContainer)}>
              <span className={styles.label}>手机号：</span>
              <span className={styles.text}>{item.mobile}</span>
            </div>
            <div className={classnames(baseStyles.flexRow, styles.itemContainer)}>
              <span className={styles.label}>已绑定：</span>
              <span className={styles.text}>
                <span
                  className={styles.cardNum}
                  style={no === 0 ? { color: colors.FONT_LIGHT_GRAY } : {}}
                >{no}
                </span> 张就诊卡
              </span>
            </div>
          </div>
          <Icon type="right" className={classnames(baseStyles.defaultIcon, baseStyles.chevronIcon)} />
        </div>
      </div>
    );
  }

  render() {
    const { base } = this.props;
    const { map } = base.user;

    if (!map || !map.userPatients || map.userPatients.length === 0) {
      return (
        <div className={styles.container}>
          <div className={baseStyles.emptyView}>您还未添加任何就诊人！</div>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        {map.userPatients.map((item, index) => {
          return this.renderItem({ item, index });
        })}
      </div>
    );
  }
}

Patients.propTypes = {
};

export default connect(({ base, patient }) => ({ base, patient }))(Patients);
