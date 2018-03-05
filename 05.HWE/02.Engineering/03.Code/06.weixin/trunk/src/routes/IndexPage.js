import React from 'react';
import { connect } from 'dva';

class IndexPage extends React.Component {
  componentDidMount() {
    const openid = this.getOpenId();
    if (openid) {
      const { dispatch } = this.props;
      dispatch({
        type: 'base/login',
        payload: { openid },
      });
    } else {
      alert('非法请求');
    }
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
  render() {
    return (
      <div>让你干非法勾当，被踢出来了吧！！！！</div>
    );
  }
}
IndexPage.propTypes = {
};

export default connect(base => (base))(IndexPage);
