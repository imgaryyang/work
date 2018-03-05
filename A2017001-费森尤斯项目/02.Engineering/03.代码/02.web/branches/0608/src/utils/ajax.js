import { notification } from 'antd';
import request from './request';

/**
 * 错误码及对应公共提示信息
 */
const statusMsg = {
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

// TODO: 靠，改不动，完全看不懂！！！(Victor)
const ERROR_HANDLER = {};
function addErrorHandler(status, handler) {
  const key = `${status}`;
  if (!ERROR_HANDLER[key])ERROR_HANDLER[key] = [];
  ERROR_HANDLER[key].push(handler);
}

function handleError(status, response) {
  const key = `${status}`;
  let handlers = ERROR_HANDLER[key];
  if (handlers && handlers.length > 0) {
    for (const handler of handlers) {
      handler(status, response);
    }
  } else {
    // var handlers;
    if (status && status >= 400 && status < 500) {
      handlers = ERROR_HANDLER['400+'];
    } else if (status && status >= 500) {
      handlers = ERROR_HANDLER['500+'];
    } else {
      handlers = ERROR_HANDLER.http;
    }
    if (handlers && handlers.length > 0) {
      for (const handler of handlers) {
        if (handler) handler(status, response);
      }
    }
  }
}

function toQueryString(obj) {
  return obj ? Object.keys(obj).sort().map((key) => {
    let val = obj[key];
    if (Array.isArray(val)) {
      return val.sort().map((val2) => {
        if (!val2) val2 = '';
        return `${encodeURIComponent(key)}=${encodeURIComponent(val2)}`;
      }).join('&');
    }
    if (!val)val = '';
    return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
  }).join('&') : '';
}

const headers = new Headers();
headers.append('X-Requested-With', 'XMLHttpRequest');

const param_default = {
  credentials: 'include',
  headers,
};

const param_get = {
  method: 'GET',
};

const param_post = {
  method: 'POST',
};

const param_put = {
  method: 'PUT',
};

const param_delete = {
  method: 'DELETE',
};

function Request(url, config) {
  const response = request(url, config);
  response.then((resp) => {
    if (resp.err) {
      if (!resp.err.response) return resp;
      const { status } = resp.err.response;
      handleError(status, resp.err.response);
    }
    return resp;
  });
  return response;
}

function GET(url, param, config) { //
  // url+="?"+toQueryString(param||{})
  const pString = JSON.stringify(param || {});
  url += `?${toQueryString({ data: pString })}`;
  return Request(url, {
    ...param_default,
    ...param_get,
    ...config,
  });
}

function POST(url, param, config) {
  return Request(url, {
    body: JSON.stringify(param || {}),
    ...param_default,
    ...param_post,
    ...config,
  });
}

function PUT(url, param, config) {
  return Request(url, {
    body: JSON.stringify(param || {}),
    ...param_default,
    ...param_put,
    ...config,
  });
}

function DELETE(url, param, config) {
  return Request(url, {
    body: JSON.stringify(param || {}),
    ...param_default,
    ...param_delete,
    ...config,
  });
}

const Ajax = {
  GET,
  DELETE,
  POST,
  PUT,
  Request,
  addErrorHandler,
};

export default Ajax;
