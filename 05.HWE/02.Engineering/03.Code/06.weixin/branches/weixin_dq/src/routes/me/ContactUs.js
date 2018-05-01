/**
 * 联系我们
 */
import React from 'react';
// import { Route } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import classnames from 'classnames';

import styles from './ContactUs.less';
// import imgNews from '../../assets/images/logo-l.png';
import baseStyles from '../../utils/base.less';
import Global from '../../Global';

class ContactUs extends React.Component {
  static displayName = 'ContactUs';
  static description = '联系我们';

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '联系我们',
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
          <div className={styles.hospitalName}>{Global.Config.hospital.name}</div>
        </div>
        <div className={styles.holder}>
          {
            app && app.contactUs ? _.split(app.contactUs, ';').map((item, idx) => {
              const con = _.split(item, '|');
              return (
                <div key={`contact_${idx + 1}`} className={classnames(styles.row, idx === 0 ? styles.borderTop : null)}>
                  <div className={styles.type}>{con[0]}：</div>
                  <div className={styles.content}>{con[1]}</div>
                </div>
              );
            }) : (
              <div className={styles.row}>
                <div>暂无联系方式信息</div>
              </div>
            )
          }
        </div>
      </div>

    );
  }
}


ContactUs.propTypes = {
};

export default connect(base => (base))(ContactUs);
