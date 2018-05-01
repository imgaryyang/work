import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Toast } from 'antd-mobile';
import classnames from 'classnames';

import Icon from '../../components/FAIcon';

import styles from './AppSubFuncs.less';
import baseStyles from '../../utils/base.less';

class AppSubFuncs extends Component {
  constructor(props) {
    super(props);
    this.onPressMenuItem = this.onPressMenuItem.bind(this);
  }

  componentWillMount() {
    const { dispatch, base } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: base.subFuncsTitle,
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: true,
        allowSwitchPatient: true,
        headerRight: null,
      },
    });
  }

  onPressMenuItem(route, title, passProps, state) {
    if (route && state === '1') {
      const { dispatch } = this.props;
      dispatch({
        type: 'base/save',
        payload: {
          title,
          ...passProps,
        },
      });
      dispatch(routerRedux.push(`/stack/${route}`));
    } else {
      Toast.info(`${title}即将开通，敬请期待`);
    }
  }

  /**
   * 渲染所有菜单项
   */
  renderMenu() {
    const { dispatch, base } = this.props;
    if (!base.subFuncs) {
      dispatch(routerRedux.push('/home/hfc'));
      return null;
    }
    // console.log(params);
    return base.subFuncs.map(({
      id, name, /* iconLib,*/ icon, route, passProps, group, state,
    }, idx) => {
      if (group === true) {
        return (
          <div key={id} className={styles.borderBottom} style={{ padding: '10px 0 10px 15px' }}>
            <span className={styles.grpText}>{name}</span>
          </div>
        );
      }
      const marginTop = idx === 0 && group !== true ? (
        <div style={{ height: 15 }} />
      ) : null;
      return (
        <div
          key={id}
          onClick={() => {
            this.onPressMenuItem(route, name, passProps, state);
          }}
        >
          {marginTop}
          <div className={classnames(styles.itemContainer, idx === 0 ? styles.borderTop : null)}>
            <div className={classnames(styles.imgContainer, !route || state !== '1' ? styles.imgContainerForbidden : null)}>
              <Icon type={icon} className={baseStyles.navBtnIcon} style={{ color: 'white' }} />
            </div>
            <span className={classnames(styles.itemText, baseStyles.ellipsisText, !route || state !== '1' ? styles.itemTextForbidden : null)}>{name}</span>
            <div className={baseStyles.chevronContainer} >
              <Icon type="angle-right" className={baseStyles.chevron} />
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderMenu()}
      </div>
    );
  }
}

AppSubFuncs.propTypes = {
};

export default connect(({ user, base }) => ({ user, base }))(AppSubFuncs);
