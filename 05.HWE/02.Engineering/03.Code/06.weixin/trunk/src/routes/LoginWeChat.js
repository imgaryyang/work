import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { Redirect } from 'dva/router';
import { List, InputItem, WhiteSpace, WingBlank, Button, Flex, Toast } from 'antd-mobile';
import { testMobile } from '../utils/validation';

class FormItem extends React.Component {
  state = {
    buttonDisabled: false,
    second: 30,
    mobile: '',
    hasError: false,
  }
  componentDidMount() {
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.clockTimer);
  }
  getOpenId() {
    return this.getUrlParam('openid');
  }
  getUrlParam(name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
    /* var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;*/
  }
  getUrlParams() {
    const url = window.location.search; // 获取url中"?"符后的字串
    const params = {};
    if (url.indexOf('?') !== -1) {
      const str = url.substr(1);
      const strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        params[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
    }
    return params;
  }
  handleSubmit = (e) => {
    const openid = this.getOpenId();
    const { smsMessage } = this.props.base;
    const mobile = this.state.mobile.replace(/\s/g, '');
    const code = smsMessage && smsMessage.code ? smsMessage.code : '666666';
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // const mobile = values.mobile.replace(/\s/g, '');
        if (!testMobile(mobile)) {
          alert('手机号不符合格式');
          return;
        }
        if (values.smscode !== code) {
          alert('验证码输入错误');
          return;
        }
        this.props.dispatch({
          type: 'base/registerByOpenId',
          payload: {
            ...values,
            openid: 'wxd27c1704bb78cf0c',
            // openid,
            mobile,
            smscode: values.smscode,
          },
        });
        console.log('response...', this.props.base.user);
      }
    });
  }
  timer = null;
  clockTimer = null;
  sendAuthSM() {
    console.log('in send auth sm', this.state.mobile);
    const mobile = this.state.mobile.replace(/\s/g, '');
    if (!testMobile(mobile)) {
      alert('手机号不符合格式！请从新输入');
      return;
    } else {
      this.props.dispatch({
        type: 'base/sendAuthSM',
        payload: {
          mobile,
          type: 'REGISTER',
        },
      });
    }
    this.setState({ buttonDisabled: true }, () => {
      this.countdown();
      this.timer = setTimeout(
        () => {
          this.setState({ buttonDisabled: false });
        },
        30000,
      );
    });
  }

  countdown() {
    if (this.state.second === 0) {
      this.setState({ second: 30 });
      return;
    }

    const second = this.state.second ? this.state.second - 1 : 30;
    this.clockTimer = setTimeout(
      () => {
        this.setState({ second });
        this.countdown();
      },
      1000,
    );
  }
  onErrorClick = () => {
    if (this.state.hasError) {
      Toast.info('请输入是11位电话号码');
    }
  }
  onChange = (value) => {
    if (value.replace(/\s/g, '').length < 11) {
      this.setState({
        hasError: true,
      });
    } else {
      this.setState({
        hasError: false,
      });
    }
    this.setState({
      mobile: value,
    });
  }

  render() {
    const { getFieldProps } = this.props.form;
    const { redirect } = this.props.base;
    const txt = this.state.buttonDisabled ? `${this.state.second}秒后重发` : '获取验证码';
    const style = this.state.buttonDisabled ? styles.dis : styles.smscode;
    if (redirect) {
      return <Redirect to="/home" />;
    }
    return (
      <form>
        <List>
          <InputItem
            {...getFieldProps('mobile')}
            type="phone"
            placeholder="请输入手机号"
            onChange={this.onChange}
            value={this.state.mobile}
            error={this.state.hasError}
            onErrorClick={this.onErrorClick}
          >手机号
          </InputItem>
          <Flex direction="row">
            <InputItem
              {...getFieldProps('smscode')}
              type="text"
              placeholder="请输入验证码"
              maxLength={6}
            >验证码
            </InputItem>
            <div style={style} onClick={() => this.sendAuthSM()}>{txt}</div>
          </Flex>
          <WhiteSpace />
          <WingBlank>
            <Button type="primary" onClick={this.handleSubmit}>登录</Button>
          </WingBlank>
        </List>
      </form>
    );
  }
}
FormItem.propTypes = {
};
const LoginWeChat = createForm()(FormItem);
const styles = {
  smscode: {
    width: '110px',
    height: '43px',
    color: '#3cc51f',
    textAlign: 'center',
    lineHeight: '43px',
    fontSize: '14px',
    borderLeft: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
  },
  dis: {
    width: '110px',
    height: '43px',
    textAlign: 'center',
    lineHeight: '43px',
    fontSize: '14px',
    borderLeft: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
  },
};
export default connect(base => (base))(LoginWeChat);
