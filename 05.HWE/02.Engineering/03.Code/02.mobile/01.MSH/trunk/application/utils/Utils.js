/**
 * 公用方法
 */

import React from 'react';

import {
  Alert,
} from 'react-native';

import * as Global from '../Global';

const UtilsHoc = (ComposedComponent) => {
  const UtilHoc = React.createClass({

    /**
     * 异步后台请求
     * @param  url 请求地址
     * @param  config 请求的配置参数
     * method: string 可空 GET/POST 默认为 POST
     * headers: object 可空 需要加到请求头文件里的参数
     * body: string 可空 使用POST发起请求时放到报文体中的数据
     * @return
     */
    request(url, config) {
      const status = {
        0: '看来服务器闹情绪了，请您稍等片刻再试吧！',
        400: '服务器无法处理此请求',
        401: '请求未授权',
        403: '禁止访问此请求',
        404: '请求的资源不存在',
        405: '不允许此请求',
        406: '不可接受的请求',
        407: '您发送的请求需要代理身份认证',
        412: '请求的前提条件失败',
        414: '请求URI超长',
        500: '服务器内部错误',
        501: '服务器不支持此请求所需的功能',
        502: '网关错误',
      };

      const method = config ? (config.method ? (config.method.toUpperCase() === 'GET' ? 'GET' : 'POST') : 'POST') : 'POST';

      let headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      headers = config ? (config.headers ? config.headers : headers) : headers;
      /* if(Global.USER_LOGIN_INFO != null)
        headers['sid'] = Global.USER_LOGIN_INFO['sid'] + '';*/

      const body = config ? (config.body ? config.body : '') : '';

      const xhr = new XMLHttpRequest();

      return new Promise((res, rej) => {
        xhr.open(method, url);

        // 处理返回报文
        xhr.onload = () => {
          /* console.log('Utils.request() - xhr:');
          console.log(xhr);
          console.log('Utils.request() - xhr.status:' + xhr.status);*/
          if (xhr.status !== 200) {
            console.log(`Utils.request() - xhr.status:${xhr.status}`);
            console.log('Utils.request() - xhr.status != 200 - xhr:');
            console.log(xhr);

            if (xhr.status === 401 || xhr.status === 403) {
              Global.interceptedRoute = null;
              this.props.navigator._goToLogin();
            }
            return rej({ status: xhr.status, msg: status[`${xhr.status}`] });
          }
          return res(JSON.parse(xhr.responseText));
        };


        // 设置超时时间
        xhr.timeout = Global.hostTimeout;
        // 超时处理
        xhr.ontimeout = () => {
          this.hideLoading();
          this.toast('请求超时，请稍后再试！');
        };

        const hs = Object.keys(headers).map((value) => {
          return {
            value,
            text: headers[value],
          };
        });
        for (let i = hs.length - 1; i >= 0; i--) {
          xhr.setRequestHeader(hs[i]['value'], hs[i]['text']);
        }

        if (method === 'POST') { xhr.send(body); } else { xhr.send(); }
      });
    },

    /**
     * 当使用request提交请求时，在catch中调用此方法处理公共错误信息
     * @param  error
     * @return
     */
    requestCatch(e) {
      this.hideLoading();
      if (e.status === 0 || e.status) {
        if (e.status !== 401 && e.status !== 403) {
          Alert.alert(
            '错误',
            e.msg,
          );
        }
      } else {
        Alert.alert(
          '错误',
          '处理请求出错！',
        );
        console.warn(e);
      }
    },

    render() {
      return (<ComposedComponent
        request={this.request}
        requestCatch={this.requestCatch}
        {...this.props}
        {...this.state}
      />);
    },
  });

  return (UtilHoc);
};

module.exports = UtilsHoc;

