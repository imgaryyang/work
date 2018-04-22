import React from 'react';
import { connect } from 'dva';

import baseUtil from '../utils/baseUtil.js';

import Config from '../Config';
import Global from '../Global';

const screenWidth = document.documentElement.clientWidth;
const screenHeight = document.documentElement.clientHeight;

class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    Global.setConfig(Config);
    const { dispatch } = this.props;
    dispatch({
      type: 'base/setState',
      payload: {
        currHospital: Global.Config.hospital,
      },
    });
    dispatch({
      type: 'base/setScreen',
      payload: {
        width: screenWidth,
        height: screenHeight,
      },
    });
  }

  componentDidMount() {
    const openid = this.getOpenId();
    console.log('openId:', openid);

    const userId = this.getUserId();
    console.log('userId:', userId);

    const route = this.getRoute();
    const funcIdx = this.getFuncIdx();
    // route = 'appoint/departments';
    console.log('route&funcIdx:', route, funcIdx);
    if (openid) {
      // alert(`openid：${openid}`);
      const { dispatch } = this.props;
      dispatch({
        type: 'base/loginByOpenId',
        payload: { openid, route: route || '', funcIdx: funcIdx === null ? -1 : funcIdx },
      });
    } else if (userId) {
      // alert(`userId：${userId}`);
      const { dispatch } = this.props;
      dispatch({
        type: 'base/loginByUserId',
        payload: { userId, route: route || '', funcIdx: funcIdx === null ? -1 : funcIdx },
      });
    } else {
      alert(`非法请求${window.location}`);
    }
  }
  getOpenId() {
    return baseUtil.dev_mode ? baseUtil.loginUser.openid : this.getUrlParam('openid');
    // return this.getUrlParam('openid');
  }
  getUserId() {
    return baseUtil.dev_mode ? baseUtil.loginUser.userId : this.getUrlParam('userId');
    // return this.getUrlParam('userId');
  }
  getRoute() {
    return this.getUrlParam('route');
  }
  getFuncIdx() {
    return this.getUrlParam('funcIdx') ? this.getUrlParam('funcIdx') : -1;
  }
  getUrlParam(name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    console.log('url:', window.location.search);
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
    /* var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null; */
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
  render() {
    return (
      <div />
    );
  }
}
IndexPage.propTypes = {
};

export default connect(base => (base))(IndexPage);