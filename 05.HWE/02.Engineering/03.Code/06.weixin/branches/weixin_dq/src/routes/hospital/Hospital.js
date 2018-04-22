import React from 'react';
import { connect } from 'dva';
import { Badge, Tabs } from 'antd-mobile';
import classnames from 'classnames';

import HospitalIntro from './HospitalIntro';
import HospitalDepts from './HospitalDepts';
import HospitalDoctors from './HospitalDoctors';

import styles from './Hospital.less';
// import Global from '../../Global';
import { image } from '../../services/baseService';

const tabs = [
  { title: <Badge>首页</Badge> },
  { title: <Badge>科室</Badge> },
  { title: <Badge>医生</Badge> },
];

class Hospital extends React.Component {
  constructor(props) {
    super(props);
    this.onTabClick = this.onTabClick.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '医院信息介绍',
        hideNavBarBottomLine: true,
        showCurrHospitalAndPatient: false,
        headerRight: null,
      },
    });
  }

  onTabClick(tab, index) {
    const { dispatch, hospital } = this.props;
    if (index === 0) {
      dispatch({
        type: 'base/save',
        payload: {
          title: '医院信息介绍',
        },
      });
    } else if (index === 1) {
      dispatch({
        type: 'base/save',
        payload: {
          title: '科室',
        },
      });
    } else if (index === 2) {
      dispatch({
        type: 'base/save',
        payload: {
          title: '医生',
        },
      });
      const initQuery = { hosId: hospital.hospital.id };
      if (hospital.doctors.length === 0) {
        dispatch({
          type: 'hospital/refresh',
          payload: { ...initQuery },
        });
      }
    }
    dispatch({
      type: 'hospital/setState',
      payload: {
        tabIdx: index,
      },
    });
  }

  render() {
    const { base, hospital } = this.props;
    const picHeight = base.screen.width * (1 - 0.618);
    const portrait = hospital.hospital.logo ? { backgroundImage: `url(${image(hospital.hospital.logo)})` } : {};
    return (
      <div className={styles.container}>
        <div
          className={classnames(styles.bgContainer, styles.hospBg)}
          style={{
            height: picHeight,
            // backgroundImage: `url(${image(hospital.hospital.logo)})`,
          }}
        >
          <div className={styles.portraitContainer} >
            <div
              className={classnames(!hospital.hospital.logo ? styles.hospLogo : styles.portrait)}
              style={portrait}
            />
          </div>
          <div className={styles.name} >{hospital.hospital.name}</div>
        </div>
        <Tabs
          tabs={tabs}
          page={this.props.hospital.tabIdx}
          onTabClick={(tab, index) => {
            this.onTabClick(tab, index);
          }}
          style={{ flex: 1 }}
        >
          <HospitalIntro />
          <HospitalDepts />
          <HospitalDoctors />
        </Tabs>
      </div>
    );
  }
}

Hospital.propTypes = {
};

export default connect(({ base, hospital }) => ({ base, hospital }))(Hospital);
