/**
 * 客户化的prototype
 */
import React, {
  Component,
} from 'react';

import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import EasyIcon from 'rn-easy-icon';
import EasyCard from 'rn-easy-card';

import * as Global from '../Global';
import UserStore from '../flux/UserStore';
import AuthAction from '../flux/AuthAction';
import ToastAction from '../flux/ToastAction';
import LoadingAction from '../flux/LoadingAction';
import InputPwdAction from '../flux/InputPwdAction';

/**
 * 为Array扩展 contains 方法，检验数组是否包含某对象
 */
Object.defineProperty(Array.prototype, 'contains', {
  value(needle) {
    for (const i in this) {
      if (this[i] === needle) {
        return true;
      }
    }
    return false;
  },
  enumerable: false,
});

/**
 * 公用Ajax请求
 */
Object.defineProperty(Component.prototype, 'request', {
  value(url, config) {
    const status = {
      '-1': '请求超时，请稍后再试',
      0: '看来服务器闹情绪了，请您稍等片刻再试吧',
      400: '服务器无法处理此请求',
      401: '请求未授权',
      403: '禁止访问此请求',
      404: '请求的资源不存在',
      405: '不允许此请求',
      406: '不可接受的请求',
      407: '您发送的请求需要代理身份认证',
      412: '请求的前提条件失败',
      414: '请求URI超长',
      420: '业务处理异常',
      500: '服务器内部错误',
      501: '服务器不支持此请求所需的功能',
      502: '网关错误',
    };

    let method = 'POST';
    if (config && config.method && ['', 'POST', 'DELETE', 'PUT', 'GET'].indexOf(config.method.toUpperCase()) > 0) {
      method = config.method.toUpperCase();
    }

    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    headers = config ? (config.headers ? config.headers : headers) : headers;
    if (UserStore.getUser() != null && UserStore.getUser().sessionId != null) {
      headers.JSESSIONID = UserStore.getUser().sessionId;
      headers.sid = UserStore.getUser().sessionId;
    }

    const body = config ? (config.body ? config.body : '') : '';

    const xhr = new XMLHttpRequest();

    return new Promise((res, rej) => {

      xhr.open(method, url);

      // 设置超时时间
      xhr.timeout = Global._hostTimeout;

      const hs = Object.keys(headers).map((value) => {
        return {
          value,
          text: headers[value],
        };
      });

      for (let i = hs.length - 1; i >= 0; i--) {
        xhr.setRequestHeader(hs[i].value, hs[i].text);
      }
      if (method === 'POST') {
        xhr.send(body);
      } else if (method === 'PUT') {
        xhr.send(body);
      } else {
        xhr.send();
      }

      this.setState({
        _requestErr: false,
        _requestErrMsg: null,
      });

      // 超时处理
      xhr.ontimeout = () => {
        return rej({ status: -1, msg: status['-1'], url });
      };

      // 处理返回报文
      xhr.onload = () => {
        if (xhr.status === 420) { // 业务处理异常
          return rej({ status: xhr.status, msg: (JSON.parse(xhr.responseText)).msg, url });
        }
        if (xhr.status !== 200) { // 请求出错
          if (xhr.status === 401 || xhr.status === 403) { // 未授权
            // TODO:需要登录时调用登录
            AuthAction.clearContinuePush();
            AuthAction.needLogin();
          }
          return rej({ status: xhr.status, msg: status[`${xhr.status}`], url });
        }
        this.hideLoading();
        this.setState({
          _refreshing: false,
          _pullToRefreshing: false,
          _infiniteLoading: false,
          _requestErr: false,
          _requestErrMsg: null,
        });
        return res(JSON.parse(xhr.responseText));
      };
    });
  },
  enumerable: false,
});

/**
 * 处理request异常
 */
Object.defineProperty(Component.prototype, 'handleRequestException', {
  value(e) {
    this.hideLoading();
    this.setState({
      _refreshing: false,
      _pullToRefreshing: false,
      _infiniteLoading: false,
      _requestErr: true,
      _requestErrMsg: e.msg,
    });
    if (e.status === 0 || e.status) {
      if (e.status !== 401 && e.status !== 403) {
        this.toast(e.msg);
        console.log(e);
      }
    } else {
      this.toast('处理请求出错！');
      console.log(e);
    }
  },
  enumerable: false,
});

/**
 * 显示加载过渡视图
 */
Object.defineProperty(Component.prototype, 'getLoadingView', {
  value(msg, cb, style) {
    if (this.state._refreshing /* || this.state._pullToRefreshing */) {
      const spinner = this.state._refreshing ? (
        <View style={{
          width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
        }}
        >
          <ActivityIndicator />
        </View>
      ) : null;
      return (
        <View style={[{ margin: 20, alignItems: 'center', justifyContent: 'center' }, style]}>
          {spinner}
          <Text style={{ color: 'rgba(187,187,187,1)', textAlign: 'center' }}>{msg || '载入中...'}</Text>
        </View>
      );
    } else if (this.state._requestErr) {
      return (
        <View style={[{ margin: 20, alignItems: 'center', justifyContent: 'center' }, style]}>
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center' }}
            onPress={() => {
              if (typeof cb === 'function') {
                cb();
              }
            }}
          >
            <EasyIcon name="ios-refresh-outline" color="rgba(187,187,187,1)" size={35} width={40} height={40} />
            <Text style={{ color: 'rgba(187,187,187,1)', textAlign: 'center' }}>{this.state._requestErrMsg}</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  },
  enumerable: false,
});

/**
 * 显示无限加载视图
 */
Object.defineProperty(Component.prototype, 'getInfiniteLoadingView', {
  value(msg, cb, style) {
    if (this.state._infiniteLoading) {
      const spinner = this.state._infiniteLoading ? (
        <View style={{
          width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
        }}
        >
          <ActivityIndicator />
        </View>
      ) : null;
      return (
        <View style={[{ margin: 20, alignItems: 'center', justifyContent: 'center' }, style]}>
          {spinner}
          <Text style={{ color: 'rgba(187,187,187,1)', textAlign: 'center' }}>{msg || '正在载入更多信息...'}</Text>
        </View>
      );
    } else if (this.state._requestErr) {
      return (
        <View style={[{ margin: 20, alignItems: 'center', justifyContent: 'center' }, style]}>
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center' }}
            onPress={() => {
              if (typeof cb === 'function') {
                cb();
              }
            }}
          >
            <EasyIcon name="ios-refresh-outline" color="rgba(187,187,187,1)" size={35} width={40} height={40} />
            <Text style={{ color: 'rgba(187,187,187,1)', textAlign: 'center' }}>{this.state._requestErrMsg}</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  },
  enumerable: false,
});

/**
 * 显示list空数据提示信息
 */
Object.defineProperty(Component.prototype, 'getEmptyView', {
  /**
   * 显示list空数据提示信息
   * @param  {[bool]}  options.condition      [附加判断条件，根据条件判断是否显示空数据提示信息]
   * @param  {[string]}  options.msg            [提示信息]
   * @param  {[string]}  options.reloadMsg      [重新加载提示信息]
   * @param  {[function]} options.reloadCallback [重新加载回调函数]
   * @param  {[elements]} options.buttons        [额外显示的按钮]
   * @param  {[object]}  options.style          [容器扩展样式]
   * @return {[elements]}                        [提示信息视图]
   */
  value({ condition, msg, reloadMsg, reloadCallback, buttons, style }) {
    let cond = !this.state._refreshing && !this.state._pullToRefreshing && !this.state._requestErr;
    if (condition === true || condition === false) {
      cond = cond && condition;
    }
    // 满足显示空数据提示信息条件
    if (cond) {
      let msgText = msg || '暂无相关数据';
      if (typeof reloadCallback === 'function') {
        msgText += `，${reloadMsg || '点击刷新按钮重新查询'}`;
      }

      let content = null;
      if (typeof reloadCallback === 'function') {
        content = (
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center', padding: 15 }}
            onPress={() => {
              reloadCallback();
            }}
          >

            <EasyIcon name="ios-refresh-outline" color="rgba(187,187,187,1)" size={35} width={40} height={40} />
            <Text style={{ color: 'rgba(187,187,187,1)', textAlign: 'center' }}>{msgText}</Text>

          </TouchableOpacity>
        );
      } else {
        content = (
          <View style={{ alignItems: 'center', justifyContent: 'center', padding: 15 }}>
            <Text style={{ color: 'rgba(187,187,187,1)', textAlign: 'center' }}>{msgText}</Text>
          </View>
        );
      }

      return (
        <EasyCard radius={6} style={[{ margin: 8, marginTop: 20 }, style]}>
          {content}
          {buttons}
        </EasyCard>
      );
    } else {
      return null;
    }
  },
  enumerable: false,
});

/**
 * 显示toast信息
 */
Object.defineProperty(Component.prototype, 'toast', {
  value(msg) {
    ToastAction.show(msg);
  },
  enumerable: false,
});

/**
 * 显示载入遮罩
 */
Object.defineProperty(Component.prototype, 'showLoading', {
  value() {
    LoadingAction.show(true);
  },
  enumerable: false,
});

/**
 * 隐藏载入遮罩
 */
Object.defineProperty(Component.prototype, 'hideLoading', {
  value() {
    LoadingAction.show(false);
  },
  enumerable: false,
});

/**
 * 6位密码键盘显示
 */
Object.defineProperty(Component.prototype, 'inputPwd', {
  value(callback) {
    InputPwdAction.inputPwd(callback);
  },
  enumerable: false,
});

/**
 * 6位密码键盘隐藏
 */
Object.defineProperty(Component.prototype, 'hidePwd', {
  value() {
    InputPwdAction.hidePwd();
  },
  enumerable: false,
});

