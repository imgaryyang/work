import React from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
// import { Grid, Carousel, TabBar, Button, Icon } from 'antd-mobile';
import styles from './Me.less';
import Profile from './User';


class Me extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <div className={styles['container']}>
        <Route path={`${match.url}/profile`} component={Profile} />
      </div>
    );
  }
}

Me.propTypes = {
};

export default connect()(Me);
