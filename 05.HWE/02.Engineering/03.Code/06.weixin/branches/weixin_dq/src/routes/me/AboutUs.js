/**
 * 联系我们
 */
import React from 'react';
import { connect } from 'dva';

import styles from './AboutUs.less';
import baseStyles from '../../utils/base.less';
import Global from '../../Global';

class AboutUs extends React.Component {
  static displayName = 'ContactUs';
  static description = '关于我们';


  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '关于我们',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: false,
        headerRight: null,
      },
    });
    dispatch({
      type: 'base/loadAppInfo',
      payload: Global.Config.appUUID,
    });
  }


  render() {
    const { screen, app } = this.props.base;
    return (
      <div className={styles.container}>
        <div className={styles['logoHolder']}>
          <div
            style={{
              width: screen.width / 2,
              height: screen.height / 6,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'auto 100%',
            }}
            className={baseStyles.logo}
          />
          <div className={styles['title']}>{Global.Config.hospital.name}</div>
        </div>
        <div className={styles.holder}>
          <div className={styles.row}>
            <div>{app ? app.aboutUs || '暂无介绍信息' : '暂无介绍信息'}</div>
          </div>
        </div>
      </div>

    );
  }
}


AboutUs.propTypes = {
};

export default connect(base => (base))(AboutUs);
