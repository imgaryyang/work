import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { Redirect } from 'dva/router';
import { List, InputItem, WhiteSpace, WingBlank, Button, Flex } from 'antd-mobile';

class FormItem extends React.Component {
  state = {
    buttonDisabled: false,
    second: 30,
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
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.mobile.replace(/\s/g, '').length < 11) {
          alert('手机号不符合格式');
          return;
        }
        if (values.smscode !== '666666') {
          alert('验证码输入错误');
          return;
        }
        const mobile = values.mobile.replace(/\s/g, '');
        console.log('Received values of form: ', values);
        this.props.dispatch({
          type: 'base/register',
          payload: {
            ...values,
            openid: 'wxd27c1704bb78cf0c',
            // openid,
            mobile,
          },
        });
        console.log('response...', this.props.base.user);
      }
    });
  }
  timer = null;
  clockTimer = null;
  sendAuthSM() {
    console.log('in send auth sm');
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
  // onChange(value) {
  //   if (value.replace(/\s/g, '').length === 11) {
  //     this.props.dispatch({
  //       type: 'base/save',
  //       payload: { mobile: value },
  //     });
  //   }
  // }
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
const Login = createForm()(FormItem);
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
export default connect(base => (base))(Login);
