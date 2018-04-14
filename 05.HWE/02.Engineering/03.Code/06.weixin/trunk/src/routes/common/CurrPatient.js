import React, { PureComponent } from 'react';
// import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Icon, Toast } from 'antd-mobile';
import classnames from 'classnames';
import { routerRedux } from 'dva/router';

// import Icon from '../components/CustomIcon';
import styles from './CurrPatient.less';

class CurrPatient extends PureComponent {
  constructor(props) {
    super(props);
    this.gotoChoosePatient = this.gotoChoosePatient.bind(this);
    this.afterChoosePatient = this.afterChoosePatient.bind(this);
  }

  gotoChoosePatient() {
    const { base, dispatch } = this.props;
    const { allowSwitchPatient } = base;
    if (allowSwitchPatient) {
      dispatch(routerRedux.push('/stack/choosePatient'));
    }
  }

  afterChoosePatient(patient, profile) {
    const { base, dispatch } = this.props;
    const { afterChoosePatient } = base;
    // 将当前就诊人放入baseModel
    dispatch({
      type: 'base/save',
      payload: {
        currPatient: patient,
      },
    });
    if (profile === null) {
      Toast.info('就诊人在该医院没有档案');
    }
    if (typeof afterChoosePatient === 'function') afterChoosePatient(patient, profile);
  }

  render() {
    const { base } = this.props;
    const { currPatient, allowSwitchPatient } = base;
    const switchIcon = allowSwitchPatient ? <Icon type="down" className={classnames(styles.iconContainer, styles.icon)} /> : null; // <div className={styles.iconContainer} />;
    return (
      <div className={styles.patientContainer} onClick={this.gotoChoosePatient} >
        <div className={styles.title} >就诊人</div>
        <div className={styles.patientNameContainer} >
          <span className={styles.patientName} >{currPatient && currPatient.name ? currPatient.name : '未选择就诊人'}</span>
          {switchIcon}
        </div>
      </div>
    );
  }
}

CurrPatient.propTypes = {
};

CurrPatient.defaultProps = {
};

export default connect(base => (base))(CurrPatient);
