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
    const { title, hideNavBarBottomLine, headerRight, showCurrHospitalAndPatient, route } = base;
    const rightComponent = headerRight ? (
      <div>
        {headerRight}
      </div>
    ) : null;
    const url = window.location.href;
    // console.log('url:', url);
    const goHome = route && url.indexOf(`/stack/${route}`) !== -1;
    const iconType = goHome ? 'home' : 'chevron-left';

    const borderBottomStyle = hideNavBarBottomLine === true ? {
      borderBottomWidth: 0,
    } : {
      borderBottom: '1px solid #96969A',
    };
    // console.log(hideNavBarBottomLine, borderBottomStyle);
    return (
      <div
        className={classnames(styles.navBar)}
        style={borderBottomStyle}
      >
        <div
          className={styles.leftBtnContainer}
          onClick={() => {
            // 如果是从微信公众号或支付宝服务窗配置的菜单跳转过来，则返回按钮跳到主页
            // 否则直接调用后退逻辑
            if (goHome) {
              this.props.dispatch(routerRedux.replace({
                pathname: '/home/hfc',
              }));
            } else {
              this.props.dispatch(routerRedux.goBack());
            }
          }}
        >
          <Icon type={iconType} className={styles.leftIcon} />
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
