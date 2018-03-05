/**
 * 联系我们
 */
import React from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
import style from './ContactUs.less';
import imgNews from '../../assets/images/logo-l.png';

class ContactUs extends React.Component {
  static displayName = 'ContactUs';
  static description = '联系我们';


  componentWillMount() {
    this.props.dispatch({
      type: 'base/getInfo',
      payload: '2c90a85c614a07ce01614a38f8d40004',
    });
  }


  render() {
    return (
      <div>
        <div className={style['logoHolder']}>
          <img src={imgNews} alt="" style={{ width: document.documentElement.clientWidth / 2, height: document.documentElement.clientHeight / 10 }} />
        </div>
        <div className={style['text']}>{this.props.base.info.contactUs }</div>
      </div>

    );
  }
}


ContactUs.propTypes = {
};

export default connect(base => (base))(ContactUs);
