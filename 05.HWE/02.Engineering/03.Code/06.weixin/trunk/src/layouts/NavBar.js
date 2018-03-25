import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
// import { Flex } from 'antd-mobile';
import classnames from 'classnames';
// import PropTypes from 'prop-types';

import Icon from '../components/FAIcon';
import styles from './NavBar.less';

import CurrPatient from '../routes/common/CurrPatient';

class NavBar extends React.PureComponent {
  render() {
    const { base } = this.props;
    const { title, hideNavBarBottomLine, headerRight, showCurrHospitalAndPatient } = base;
    const rightComponent = headerRight ? (
      <div>
        {headerRight}
      </div>
    ) : null;
    return (
      <div
        className={classnames(styles.navBar, hideNavBarBottomLine ? '' : styles.navBorderBottom)}
      >
        <div
          className={styles.leftBtnContainer}
          onClick={() => {
            this.props.dispatch(routerRedux.goBack());
          }}
        >
          <Icon type="chevron-left" className={styles.leftIcon} />
        </div>
        <div className={styles.title} >
          {title}
        </div>
        {rightComponent}
        {showCurrHospitalAndPatient ? <CurrPatient /> : null}
      </div>
    );
  }
}

NavBar.propTypes = {
};

NavBar.defaultProps = {
};

export default connect(base => (base))(NavBar);
