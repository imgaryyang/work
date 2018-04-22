/**
 * 联系我们
 */
import React from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
import style from './AboutUs.less';
// import imgNews from '../../assets/images/logo-l.png';
import commonStyles from '../../utils/common.less';

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
    const { screen } = this.props.base;
    return (
      <div>
        <div className={style['logoHolder']}>
          <div
            style={{
              width: screen.width / 2,
              height: screen.height / 10,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'auto 100%',
            }}
            className={commonStyles.logo}
          />
        </div>
        <div className={style['title']}>联想智慧医院</div>
        <div className={style['text1']}>{this.props.base.info.aboutUs }</div>
      </div>

    );
  }
}


AboutUs.propTypes = {
};

export default connect(base => (base))(AboutUs);
