/**
 * 医院功能区 - 单医院版
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card } from 'antd-mobile';
import classnames from 'classnames';
import Icon from '../../components/FAIcon';

import Ads from './Ads';
import AppFuncs from './AppFuncs';

import styles from './HospitalFuncCenter.less';
import baseStyles from '../../utils/base.less';

class HospitalFuncCenter extends Component {
  static displayName = 'HospitalFuncCenter';
  static description = '医院功能区';

  constructor(props) {
    super(props);
    this.goToHospital = this.goToHospital.bind(this);
  }

  state = {
  };

  componentDidMount() {
  }

  goToHospital() {
    this.props.dispatch(routerRedux.push('/stack/hospital'));
  }

  render() {
    const { currHospital } = this.props.base;
    return (
      <div className={styles.container} >
        <Ads />
        <div className={baseStyles.sep15} />
        <AppFuncs />
        <div className={baseStyles.sep15} />
        <div className={styles.androidDownloadContainer} onClick={() => this.props.dispatch(routerRedux.push('/downloadApp'))}>
          <div className={classnames(baseStyles.appDownloadBg, styles.androidDownloadText)}>APP下载安装</div>
          <div className={baseStyles.chevronContainer} >
            <Icon type="angle-right" className={baseStyles.chevron} />
          </div>
        </div>
        <div className={baseStyles.sep15} />
        <Card full>
          <Card.Header
            title={(
              <div className={styles.cardTitleContainer}>
                <div className={styles.cardTitle}>医院简介</div>
                <span className={styles.hrefText} onClick={this.goToHospital}>查看详情</span>
                <div
                  className={baseStyles.chevronContainer}
                  onClick={this.goToHospital}
                  style={{ width: 20, height: 14, paddingLeft: 10 }}
                >
                  <Icon type="angle-right" className={baseStyles.chevron} />
                </div>
              </div>
            )}
          />
          <Card.Body>
            <div className={styles.brief} >{currHospital.brief}</div>
          </Card.Body>
        </Card>
        <div className={baseStyles.sep15} />
      </div>
    );
  }
}

HospitalFuncCenter.propTypes = {
};

export default connect(base => (base))(HospitalFuncCenter);
