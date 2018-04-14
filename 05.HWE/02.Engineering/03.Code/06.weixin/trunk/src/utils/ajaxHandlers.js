import { Toast } from 'antd-mobile';

import ajax from './ajax';

const statusMap = {
  '-1': '请求超时，请稍后再试',
  '0': '看来服务器闹情绪了，请您稍等片刻再试吧',
  '400': '服务器无法处理此请求',
  '401': '请求未授权',
  '403': '禁止访问此请求',
  '404': '请求的资源不存在',
  '405': '系统不允许此请求',
  '406': '不可接受的请求',
  '407': '您发送的请求需要代理身份认证',
  '412': '请求的前提条件失败',
  '413': '请求实体太大',
  '414': '请求URI超长',
  '420': '业务处理异常',
  '500': '服务器内部错误',
  '501': '服务器不支持此请求所需的功能',
  '502': '网关错误',
};

function globalAjaxErrorHandler(status, response) {
  console.log('globalAjaxErrorHandler():', status, response);
  Toast.info(statusMap[status]);
}

for (const key in statusMap) {
  ajax.addErrorHandler(key, globalAjaxErrorHandler);
}
