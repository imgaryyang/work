import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Toast } from 'antd-mobile';
import classnames from 'classnames';

import Icon from '../../components/FAIcon';
import styles from './Me.less';
import commonStyles from '../../utils/common.less';
import { image } from '../../services/baseService';

import Global from '../../Global';

class Me extends React.Component {
  constructor(props) {
    super(props);

    this.renderMenu = this.renderMenu.bind(this);
    this.onMenuPress = this.onMenuPress.bind(this);
  }

  onMenuPress(route, title, passProps) {
    if (route) {
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
      Toast.info(`${title}即将开通`);
    }
  }

  renderMenu() {
    const menus = Global.Config.services.me;
    return menus.map(({ id, name, route, icon, passProps, separator }, idx) => {
      const sep = separator === true ? <div className={classnames(commonStyles.sep15, styles.topLine, styles.bottomLine)} /> : null;
      const topLine = idx === 0 ? styles.topLine : '';
      const bottomLine = idx === menus.length - 1 ? styles.bottomLine : '';
      const sepLine = separator === true || idx === menus.length - 1 ? '' : styles.bottomLine;
      return (
        <div key={`me_menu_item_${id}_${idx + 1}`} className={styles.itemContainer} >
          <div
            className={classnames(styles.contentContainer, topLine, bottomLine)}
            onClick={() => {
              this.onMenuPress(route, name, passProps);
            }}
          >
            <div className={styles.iconContainer} ><Icon type={icon} className={styles.itemIcon} /></div>
            <div className={classnames(styles.nameContainer, sepLine)} >
              <div className={styles.itemName} >{name}</div>
              <div className={styles.chevronContainer} >
                <Icon type="angle-right" className={styles.chevron} />
              </div>
            </div>
          </div>
          {sep}
        </div>
      );
    });
  }

  render() {
    const { user, screen } = this.props.base;
    // console.log(user);
    const portrait = user.portrait ? { backgroundImage: `url(${image(user.portrait)})` } : {};
    // console.log(portrait);
    return (
      <div className={styles.container}>
        <div
          className={classnames(commonStyles.userBg, styles.bgContainer)}
          style={{ height: screen.width * 9 / 16 }}
        >
          <div className={styles.portraitContainer} >
            <div
              className={classnames(styles.portrait, !user || !user.portrait ? commonStyles.userPortrait : null)}
              style={portrait}
            />
          </div>
          <div className={styles.name} >{user.name}</div>
        </div>
        <div className={commonStyles.sep15} />
        <div>
          {this.renderMenu()}
        </div>
        <div className={commonStyles.sep15} />
      </div>
    );
  }
}

Me.propTypes = {
};

export default connect(({ user, base }) => ({ user, base }))(Me);
