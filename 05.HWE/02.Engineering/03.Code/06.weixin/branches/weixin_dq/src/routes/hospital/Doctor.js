import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd-mobile';
import classnames from 'classnames';

import styles from './Doctor.less';
import { image } from '../../services/baseService';
import ActivityIndicatorView from '../../components/ActivityIndicatorView';

class Doctor extends React.Component {
  constructor(props) {
    super(props);
    this.loadDoctorDescs = this.loadDoctorDescs.bind(this);

    this.loadDoctorDescs();
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '医生信息',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: null,
      },
    });
  }

  loadDoctorDescs() {
    const { dispatch, hospital } = this.props;
    dispatch({
      type: 'hospital/getDoctorDescs',
      payload: { id: hospital.doctor.id },
    });
  }

  render() {
    const { doctor, doctorDescs, loading } = this.props.hospital;
    const portrait = doctor.photo ? { backgroundImage: `url(${image(doctor.photo)})` } : {};

    const doctorDescsView = loading ? <ActivityIndicatorView /> : (
      doctorDescs.length === 0 ? (
        <div className={styles.emptyView}>暂无医生详细介绍</div>
      ) : (
        <Card full style={{ marginTop: 15 }}>
          <Card.Body>
            {doctorDescs.map((item, idx) => {
              return (
                <div key={`desc_${idx + 1}`} >
                  <div className={styles.descTitleContainer} >
                    <span className={styles.descTitle} >{item.caption}</span>
                  </div>
                  <div className={styles.descContent} >{item.body}</div>
                </div>
              );
            })}
          </Card.Body>
        </Card>
      )
    );
    return (
      <div className={styles.container}>
        <Card
          full
          className={styles.row}
        >
          <Card.Body>
            <div className={styles.mainContainer}>
              <div
                className={classnames(styles.portrait, !doctor.photo ? styles.userPortrait : null)}
                style={portrait}
              />
              <div style={{ flex: 1 }}>
                <div className={styles.nameContainer}>
                  <div className={styles.name}>{doctor.name}</div>
                  <div className={styles.docDept}><b>科室：</b>{doctor.depName}</div>
                </div>
                <span className={styles.appendText}><b>职称：</b>{doctor.jobTitle}</span>
                <span className={styles.appendText}><b>专长：</b>{doctor.speciality}</span>
              </div>
            </div>
            <div className={styles.clinicDescContainer}>
              <span className={styles.clinicDescTitle}>常规出诊时间：</span>
              <span className={styles.clinicDesc}>{doctor.clinicDesc || '暂无记录'}</span>
            </div>
          </Card.Body>
        </Card>
        {doctorDescsView}
      </div>
    );
  }
}

Doctor.propTypes = {
};

export default connect(({ base, hospital }) => ({ base, hospital }))(Doctor);
