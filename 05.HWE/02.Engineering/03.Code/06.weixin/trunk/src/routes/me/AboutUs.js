/**
 * 联系我们
 */
import React from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
import style from './AboutUs.less';
import imgNews from '../../assets/images/logo-l.png';

class AboutUs extends React.Component {
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
        <div className={style['title']}>联想智慧医院</div>
        <div className={style['text1']}>{this.props.base.info.aboutUs  }</div>
      </div>

    );
  }
}


AboutUs.propTypes = {
};

export default connect(base => (base))(AboutUs);
