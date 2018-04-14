import React from 'react';
import { connect } from 'dva';
import { Toast } from 'antd-mobile';

import Global from '../Global';
import Config from '../Config';
import SMSVerify from './common/SMSVerify';

import styles from './LoginBySMS.less';
import commonStyles from '../utils/common.less';

const screenWidth = document.documentElement.clientWidth;
const screenHeight = document.documentElement.clientHeight;

class Login extends React.Component {
  constructor(props) {
    super(props);

    Global.setConfig(Config);
    const { dispatch } = this.props;
    dispatch({
      type: 'base/setScreen',
      payload: {
        width: screenWidth,
        height: screenHeight,
      },
    });

    this.login = this.login.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  login(smsData) {
    // console.log(smsData);
    const { dispatch } = this.props;
    dispatch({
      type: 'base/loginAfterVerify',
      payload: {
        token: smsData.token,
        mobile: smsData.mobile,
      },
      showMsg: msg => (msg === '_LOADING_' ? Toast.loading() : Toast.info(msg, 2, null, false)),
      loginDown: () => {},
    });
  }

  render() {
    const { base } = this.props;
    const { loginButtonDisabled, openid, userId } = base;
    let verifyType = '';
    if (openid) verifyType = Global.securityCodeType.REG_WX; // 微信登录
    else if (userId) verifyType = Global.securityCodeType.REG_ZFB; // 支付宝登录
    else verifyType = Global.securityCodeType.REG_WEB; // Web登录

    return (
      <div style={{ padding: '0 30px 40px 30px' }}>
        <div className={styles.logoHolder}>
          <div
            style={{
              width: screenWidth / 2,
              height: screenHeight / 10,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'auto 100%',
            }}
            className={commonStyles.logo}
          />
        </div>
        <div className={styles.formContainer}>
          <SMSVerify
            verifyType={verifyType}
            buttonText="登录"
            afterVerifyText="验证成功，正在登录，请稍候..."
            afterVerify={this.login}
            buttonDisabled={loginButtonDisabled}
          />
        </div>
      </div>
    );
  }
}

Login.propTypes = {
};

export default connect(base => (base))(Login);
