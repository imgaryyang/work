import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Toast, Modal } from 'antd-mobile';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Global from '../../Global';
import { spaceAfterThreeLetters } from '../../utils/Filters';
import SMSVerify from '../common/SMSVerify';

import styles from './ProfileList.less';
import baseStyle from '../../utils/base.less';

class ProfileList extends React.Component {
  constructor(props) {
    super(props);
    this.bind = this.bind.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.renderItems = this.renderItems.bind(this);
  }

  state = {
    visible: false,
    profile: {},
  };

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.clockTimer);
  }

  timer = null;
  clockTimer = null;

  bind(smsData) {
    console.log(smsData);
    const { dispatch, patient, profiles, base } = this.props;
    // const { profile } = this.state;
    dispatch({
      type: 'patient/bindProfile',
      payload: {
        token: smsData.token,
        hospitalId: base.currHospital.id,
        patientId: patient.patientInfo.id,
        profiles,
      },
      showMsg: msg => (msg === '_LOADING_' ? Toast.loading() : Toast.info(msg, 2, null, false)),
      submitDown: () => {
        dispatch({
          type: 'base/reloadUserInfo',
          reloadDown: (result) => {
            if (result.id) {
              this.props.dispatch({
                type: 'patient/setState',
                payload: {
                  patientInfo: this.getPatientById(result, patient.patientInfo.id),
                },
              });
            } else {
              Toast.info(result, 2, null, false);
            }
          },
        });
        dispatch(routerRedux.goBack());
      },
    });
  }

  renderModal() {
    return (
      <Modal
        visible={this.state.visible}
        maskClosable
        transparent
        onClose={() => this.setState({ visible: false })}
        className={styles.modal}
      >
        <div>
          <SMSVerify
            verifyType={Global.securityCodeType.BIND_PROFILE}
            buttonText="绑定"
            initMobile={this.state.profile.mobile}
            mobileEditable={false}
            afterVerifyText="验证成功，正在绑定，请稍候..."
            afterVerify={this.bind}
            buttonDisabled={this.props.patient.bindButtonDisabled}
          />
        </div>
      </Modal>
    );
  }

  /**
   * 渲染行数据
   */
  renderItems() {
    const { profiles, allowBind, showPatientInfo, patient, base } = this.props;
    const { bindedProfiles } = patient;
    return profiles.map((item, idx) => {
      const { id, hosId, /* hosName,*/ no, name, idNo, mobile } = item;

      const key = `${base.currHospital.id}${no}`;
      const bindBtn = allowBind ? (!bindedProfiles[key] ? (
        <div
          className={styles.bindBtn}
          onClick={() => this.setState({
            visible: true,
            profile: item,
          })}
        >
          <span className={styles.bindText}>绑定</span>
        </div>
      ) : (
        <span className={styles.bindedText}>已绑定</span>
      )) : null;

      const patientInfo = showPatientInfo ? (
        <div className={styles.patientContainer}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <span className={styles.name}>{name}</span>
            <span className={styles.idNo}>{idNo}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', marginTop: 4 }}>
            <span className={styles.name}>医院预留手机号：</span>
            <span className={styles.idNo}>{mobile}</span>
          </div>
        </div>
      ) : null;
      return (
        <div key={`card_${id}_${idx + 1}`} className={styles.cardContainer}>
          <div className={styles.cardBody}>
            <div className={classnames(baseStyle.flexRow, styles.hospitalContainer)}>
              <span className={styles.hospName}>{base.currHospital.name}</span>
              {bindBtn}
            </div>
            <span className={styles.cardNo}>{spaceAfterThreeLetters(no)}</span>
            {patientInfo}
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className={styles.profilesContainer}>
        {this.renderItems()}
        {this.renderModal()}
      </div>
    );
  }
}

ProfileList.propTypes = {
  profiles: PropTypes.array.isRequired,
  // patientId: PropTypes.string.isRequired,
  allowBind: PropTypes.bool,
  showPatientInfo: PropTypes.bool,
};

ProfileList.defaultProps = {
  allowBind: false,
  showPatientInfo: false,
};

export default connect(({ base, patient }) => ({ base, patient }))(ProfileList);
