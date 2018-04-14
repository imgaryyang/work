import React from 'react';
import { connect } from 'dva';
import { Button, Toast } from 'antd-mobile';
import PropTypes from 'prop-types';

import Global from '../../Global';
import { colors } from '../../utils/common';
import { filterTextBreak } from '../../utils/Filters';
import { testMobile, testNumber } from '../../utils/validation';
import Icon from '../../components/FAIcon';

import styles from './SMSVerify.less';

class SMSVerity extends React.Component {
  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);
    this.sendSecurityCode = this.sendSecurityCode.bind(this);
    this.verifySecurityCode = this.verifySecurityCode.bind(this);
    this.countdown = this.countdown.bind(this);
  }

  componentDidMount() {
    const { dispatch, base, initMobile } = this.props;
    dispatch({
      type: 'base/setState',
      payload: {
        smsData: { ...base.smsData, mobile: initMobile, securityCode: '' },
        second: Global.Config.global.authCodeResendInterval,
        sendButtonDisabled: false,
        verifyButtonDisabled: false,
      },
    });
    this.mobile.focus();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.clockTimer);
  }

  onChangeText(value) {
    const { dispatch, base } = this.props;
    const { smsData } = base;
    dispatch({
      type: 'base/setState',
      payload: {
        smsData: { ...smsData, ...value },
      },
    });
  }

  timer = null;
  clockTimer = null;
  mobile = null;
  securityCode = null;

  countdown() {
    const interval = Global.Config.global.authCodeResendInterval;
    const { dispatch, base } = this.props;
    const { second } = base;
    if (second === 0) {
      dispatch({
        type: 'base/setState',
        payload: { second: interval },
      });
      return;
    }

    this.clockTimer = setTimeout(
      () => {
        dispatch({
          type: 'base/setState',
          payload: { second: second ? second - 1 : interval },
        });
        this.countdown();
      },
      1000,
    );
  }

  /**
   * 发送验证码
   * @returns {boolean}
   */
  sendSecurityCode() {
    // console.log('before sendSecurityCode.');
    const { dispatch, base, verifyType } = this.props;
    const { smsData } = base;
    if (!smsData.mobile) {
      Toast.info('请填写手机号！');
      this.mobile.select();
      return false;
    } else if (!testMobile(smsData.mobile)) {
      Toast.info('您输入的手机号不符合要求，请重新输入！');
      this.mobile.select();
      return false;
    } else {
      // 开始发送计时
      this.countdown();
      this.timer = setTimeout(
        () => {
          dispatch({
            type: 'base/setState',
            payload: { sendButtonDisabled: false },
          });
        },
        Global.Config.global.authCodeResendInterval * 1000,
      );
      dispatch({
        type: 'base/sendSecurityCode',
        payload: {
          type: verifyType,
          mobile: smsData.mobile,
        },
        showMsg: msg => (msg === '_LOADING_' ? Toast.loading() : Toast.info(msg, 2, null, false)),
      });
    }
  }

  /**
   * 校验验证码
   * @returns {boolean}
   */
  verifySecurityCode() {
    const { dispatch, base, verifyType, afterVerify, afterVerifyText } = this.props;
    const { smsData } = base;
    if (!smsData.mobile) {
      Toast.info('请填写手机号！');
      this.mobile.select();
      return false;
    } else if (!testMobile(smsData.mobile)) {
      Toast.info('您输入的手机号不符合要求，请重新输入！');
      this.mobile.select();
      return false;
    } else if (!smsData.securityCode) {
      Toast.info('请填写验证码！');
      this.securityCode.select();
      return false;
    } else if (smsData.securityCode.length !== 6 || !testNumber(smsData.securityCode)) {
      Toast.info('您输入的验证码不符合要求，请重新输入！');
      this.securityCode.select();
      return false;
    } else {
      dispatch({
        type: 'base/verifySecurityCode',
        payload: {
          type: verifyType,
          mobile: smsData.mobile,
          code: smsData.securityCode,
          // hospitalId: '',
          // id: smsMessage.id,
        },
        showMsg: msg => (msg === '_LOADING_' ? Toast.loading() : Toast.info(msg, 2, null, false)),
        afterVerify,
        afterVerifyText,
      });
    }
  }

  render() {
    const { base, buttonText, mobileEditable, buttonDisabled } = this.props;
    const { second, sendButtonDisabled, smsData, verifyButtonDisabled } = base;
    // console.log('smsData:', smsData);
    const sendBtnText = sendButtonDisabled ?
      `${second}秒钟后可\n再次发送` :
      '点击免费\n获取验证码';
    return (
      <div className={styles.formContainer}>
        <div className={styles.rowContainer}>
          <div className={styles.iconContainer}>
            <Icon type="mobile" className={styles.icon} style={{ fontSize: 22 }} />
          </div>
          <input
            ref={(c) => { this.mobile = c; }}
            className={styles.input}
            placeholder="请输入登录手机号"
            value={smsData.mobile}
            onChange={e => this.onChangeText({ mobile: e.target.value })}
            maxLength={11}
            disabled={!mobileEditable}
          />
        </div>
        <div className={styles.rowContainer}>
          <div className={styles.iconContainer}>
            <Icon type="comments" className={styles.icon} />
          </div>
          <input
            ref={(c) => { this.securityCode = c; }}
            className={styles.input}
            placeholder="请输入验证码"
            value={smsData.securityCode}
            onChange={e => this.onChangeText({ securityCode: e.target.value })}
            maxLength={6}
          />
          <div
            className={styles.sendBtn}
            style={sendButtonDisabled ? { color: colors.FONT_LIGHT_GRAY } : {}}
            onClick={() => {
              if (!sendButtonDisabled) this.sendSecurityCode();
            }}
          >
            <div>{filterTextBreak(sendBtnText)}</div>
          </div>
        </div>
        <Button
          type="primary"
          onClick={this.verifySecurityCode}
          style={{ marginTop: 20 }}
          disabled={buttonDisabled || verifyButtonDisabled}
          loading={buttonDisabled || verifyButtonDisabled}
        >
          {buttonText}
        </Button>
      </div>
    );
  }
}

SMSVerity.propTypes = {
  verifyType: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  initMobile: PropTypes.string,
  mobileEditable: PropTypes.bool,
  afterVerify: PropTypes.func,
  afterVerifyText: PropTypes.string,
  buttonDisabled: PropTypes.bool,
};

SMSVerity.defaultProps = {
  buttonText: '确定',
  initMobile: '',
  mobileEditable: true,
  afterVerify: () => {},
  afterVerifyText: '验证成功！',
  buttonDisabled: false,
};

export default connect(({ base }) => ({ base }))(SMSVerity);
