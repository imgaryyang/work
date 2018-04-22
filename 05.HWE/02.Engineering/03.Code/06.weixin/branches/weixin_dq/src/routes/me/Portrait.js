import React from 'react';
import { connect } from 'dva';
import { WhiteSpace } from 'antd-mobile';
import styles from './Portrait.less';

class Portrait extends React.Component {
  login() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/login',
    });
  }

  render() {
    const { user } = this.props.base;
    const { mobile } = user;
    const phone = mobile ? mobile.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') : '';
    return (
      <div className={styles['contaner']}>
        <WhiteSpace />
        <div className={styles['protrait']} />
        <WhiteSpace />
        <div className={styles['text']}>{user.name}</div>
        {user.name ? (<WhiteSpace />) : ''}
        <div className={styles['text']}>{phone}</div>
        {phone ? (<WhiteSpace />) : ''}
      </div>
    );
  }
}

Portrait.propTypes = {
};

export default connect(({ home, user, base }) => ({ home, user, base }))(Portrait);
