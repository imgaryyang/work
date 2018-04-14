import request from './request';

const ERROR_HANDLER = {};

function addErrorHandler(status, handler) {
  const key = `${status}`;
  if (!ERROR_HANDLER[key])ERROR_HANDLER[key] = [];
  ERROR_HANDLER[key].push(handler);
}

function handleError(status, response) {
  const key = `${status}`;
  var handlers = ERROR_HANDLER[key];
  if (handlers && handlers.length > 0) {
    for (var handler of handlers) {
      handler(status, response);
    }
  } else {
    var handlers;
    if (status && status >= 400 && status < 500) {
      handlers = ERROR_HANDLER['400+'];
    } else if (status && status >= 500) {
      handlers = ERROR_HANDLER['500+'];
    } else {
      handlers = ERROR_HANDLER['http'];
    }
    if (handlers && handlers.length > 0) {
      for (var handler of handlers) {
        if (handler)handler(status, response);
      }
    }
  }
}

function toQueryString(obj) {
  return obj ? Object.keys(obj).sort().map((key) => {
    let val = obj[key];
    if (Array.isArray(val)) {
      return val.sort().map((val2) => {
        if (!val2)val2 = '';
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
  if (!config.quiet)handleError('beforeSend', url);
  response.then((resp) => {
    if (!config.quiet)handleError('afterSend', url);
    if (resp.err) {
      if (!resp.err.response) return resp;
      const { status } = resp.err.response;
      handleError(status, resp.err.response);
    } else if (resp.data) {
      if (!resp.data.success) {
        const msg = resp.data.msg || '处理错误,请稍后再试！';
        handleError('biz', msg);
      }
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
