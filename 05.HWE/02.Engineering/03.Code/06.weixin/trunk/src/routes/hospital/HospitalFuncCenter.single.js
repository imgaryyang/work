/**
 * 医院功能区 - 单医院版
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd-mobile';

import Global from '../../Global';

import Ads from './Ads';
import AppFuncs from './AppFuncs';

import styles from './HospitalFuncCenter.less';
import commonStyles from '../../utils/common.less';

class HospitalFuncCenter extends Component {
  static displayName = 'HospitalFuncCenter';
  static description = '医院功能区';

  state = {
  };

  componentDidMount() {
  }

  render() {
    // const { currHospital } = this.props.base;
    return (
      <div className={styles.container} >
        <Ads />
        <div className={commonStyles.sep15} />
        <AppFuncs />
        <div className={commonStyles.sep15} />
        <Card full>
          <Card.Header
            title={(<div className={styles.cardTitle} >医院简介</div>)}
          />
          <Card.Body>
            <div className={styles.brief} >{Global.Config.hospital.brief}</div>
          </Card.Body>
        </Card>
        <div className={commonStyles.sep15} />
      </div>
    );
  }
}

HospitalFuncCenter.propTypes = {
};

export default connect(base => (base))(HospitalFuncCenter);
