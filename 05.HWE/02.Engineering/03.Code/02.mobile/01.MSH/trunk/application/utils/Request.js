/**
 * request
 * 公用 ajax 请求
 */
// import _ from 'lodash';
import Toast from 'react-native-root-toast';
import { NavigationActions } from 'react-navigation';
import Global from '../Global';

const statusMap = {
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
  413: '请求实体太大',
  414: '请求URI超长',
  420: '业务处理异常',
  500: '服务器内部错误',
  501: '服务器不支持此请求所需的功能',
  502: '网关错误',
};

function error({ status, msg, url }) {
  return { status, msg, url };
}

function handleRequestException(e) {
  if (e.status) {
    // 非授权相关错误，直接提示。授权错误可能涉及到已经渲染的场景里会做特殊处理，所以放给业务开发者自己处理
    if (e.status !== 401 && e.status !== 403) {
      console.log(e);
      Toast.show(e.msg);
    }
  } else {
    console.log(e);
    Toast.show('处理请求出错！');
  }
}

async function post(url, data, config) {
  return request({
    method: 'POST',
    url,
    body: JSON.stringify(data),
    config,
  });
}

async function get(url, data, config) {
  let sendUrl = url;
  if (data) {
    const appendParam = `data=${JSON.stringify(data)}`;
    sendUrl += sendUrl.indexOf('?') !== -1 ? `&${appendParam}` : `?${appendParam}`;
  }
  return request({
    method: 'GET',
    url: sendUrl,
    config,
  });
}

async function put(url, data, config) {
  return request({
    method: 'PUT',
    url,
    body: JSON.stringify(data),
    config,
  });
}

async function patch(url, data, config) {
  return request({
    method: 'PATCH',
    url,
    body: JSON.stringify(data),
    config,
  });
}

async function del(url, config) {
  return request({
    method: 'DELETE',
    url,
    config,
  });
}

async function form(url, data, config) {
  return request({
    method: 'POST',
    url,
    body: data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    config,
  });
}

async function request({
  method, url, headers, body,
}) {
  // console.log('>>> method, url, headers, body in request():', method, url, headers, body);
  const xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    // console.log('>>> in request() before open:', xhr);
    // 打开连接
    xhr.open(method, url);
    // 设置超时
    // xhr.timeout = 5000; // Global.getHostTimeout();
    xhr.timeout = Global.getHostTimeout();
    // 设置请求头文件
    const initHs = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    };
    // console.log('>>> init headers:', initHs);
    const hs = Object.keys(initHs).map((value) => {
      return {
        value,
        text: initHs[value],
      };
    });
    for (let i = hs.length - 1; i >= 0; i--) {
      xhr.setRequestHeader(hs[i].value, hs[i].text);
    }
    // 如果当前用户对象存在，把 JSESSIONID 拼到请求报文的头文件中，达到 APP 端会话保持的目的
    if (Global.getUser() && Global.getUser().sessionId !== null) {
      xhr.setRequestHeader('JSESSIONID', Global.getUser().sessionId);
      xhr.setRequestHeader('sid', Global.getUser().sessionId);
    }

    // 发送数据
    // console.log('>>> in request() before xhr send():', xhr);
    // console.log('>>> body:', body);
    if (method === 'POST') {
      xhr.send(body);
    } else if (method === 'PUT') {
      xhr.send(body);
    } else {
      xhr.send();
    }

    // 处理超时
    xhr.ontimeout = () => {
      return reject(error({ status: '-1', msg: statusMap['-1'], url }));
    };

    // 处理返回报文
    xhr.onload = () => {
      // console.log('>>> onload() in request():', xhr);
      // 业务处理异常
      if (xhr.status === 420) {
        return reject(error({ status: `${xhr.status}`, msg: (JSON.parse(xhr.responseText)).msg, url }));
      }
      // 请求出错
      if (xhr.status !== 200) {
        // 未授权
        if (xhr.status === 401 || xhr.status === 403) {
          // 需要登录时调用登录
          NavigationActions.navigate({ routeName: Global.getLoginRoute() });
        }
        return reject(error({ status: `${xhr.status}`, msg: statusMap[`${xhr.status}`], url }));
      }
      return resolve(JSON.parse(xhr.responseText));
    };

    // 错误处理
    xhr.onerror = () => {
      console.log('>>> onerror() in request():', xhr);
      reject(error({ status: `${xhr.status}`, msg: statusMap[`${xhr.status}`], url }));
    };
  });
}

export {
  post, get, put, patch, del, form, handleRequestException,
};
