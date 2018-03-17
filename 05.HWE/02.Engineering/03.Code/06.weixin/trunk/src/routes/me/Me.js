import React from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
import classnames from 'classnames';
// import { Grid, Carousel, TabBar, Button, Icon } from 'antd-mobile';

import styles from './Me.less';
import commonStyles from '../../utils/common.less';

class Me extends React.Component {
  constructor(props) {
    super(props);
    this.renderMenu = this.renderMenu.bind(this);
  }

  renderMenu() {
    return (
      <div></div>
    );
  }

  render() {
    const { user } = this.props.base;
    const portrait = { backgroundImage: 'url(/api/images/40287d8161c679950161c67b5fd00000.png)' }; // user.portrait ? { backgroundImage: `url(/api/images/${user.portrait})` } : {};
    return (
      <div className={styles.container}>
        <div className={classnames(commonStyles.userBg, styles.bgContainer)} >
          <div className={styles.portraitContainer} >
            <div
              className={classnames(styles.portrait, /* !user || !user.portrait*/false ? commonStyles.userPortrait : null)}
              style={portrait}
            />
          </div>
          <div className={styles.name} >{user.name}</div>
        </div>
        <div className={commonStyles.sep15} />
        <div>
          {this.renderMenu()}
        </div>
      </div>
    );
  }
}

Me.propTypes = {
};

export default connect(({ user, base }) => ({ user, base }))(Me);
