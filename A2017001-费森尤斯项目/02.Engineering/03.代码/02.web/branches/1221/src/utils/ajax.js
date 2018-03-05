import request from './request';

const ERROR_HANDLER = {};
function addErrorHandler(status, handler) {
  const key = `${status}`;
  if (!ERROR_HANDLER[key]) ERROR_HANDLER[key] = [];
  ERROR_HANDLER[key].push(handler);
}

function handleError(status, response) {
  let handlers = ERROR_HANDLER[`${status}`];
  if (handlers && handlers.length > 0) {
    handlers.forEach(f => f(status, response));
  } else {
    if (status && status >= 400 && status < 500) {
      handlers = ERROR_HANDLER['400+'];
    } else if (status && status >= 500) {
      handlers = ERROR_HANDLER['500+'];
    } else {
      handlers = ERROR_HANDLER.http;
    }
    if (handlers && handlers.length > 0) {
      handlers.forEach(f => f(status, response));
    }
  }
}

function toQueryString(obj) {
  return obj ? Object.keys(obj).sort().map((key) => {
    let val = obj[key];
    if (Array.isArray(val)) {
      return val.sort().map((val2 = '') => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(val2)}`;
      }).join('&');
    }
    if (!val) val = '';
    return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
  }).join('&') : '';
}

const headers = new Headers();
headers.append('X-Requested-With', 'XMLHttpRequest');

const paramDefault = {
  credentials: 'include',
  headers,
};

const paramGet = {
  method: 'GET',
};

const paramPost = {
  method: 'POST',
};

const paramPut = {
  method: 'PUT',
};

const paramDelete = {
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

function GET(url, param = {}, config) {
  const data = JSON.stringify(param);
  const getUrl = `${url}?${toQueryString({ data })}`;
  return Request(getUrl, {
    ...paramDefault,
    ...paramGet,
    ...config,
  });
}

function POST(url, param = {}, config) {
  return Request(url, {
    body: JSON.stringify(param),
    ...paramDefault,
    ...paramPost,
    ...config,
  });
}

function PUT(url, param = {}, config) {
  return Request(url, {
    body: JSON.stringify(param),
    ...paramDefault,
    ...paramPut,
    ...config,
  });
}

function DELETE(url, param = {}, config) {
  return Request(url, {
    body: JSON.stringify(param),
    ...paramDefault,
    ...paramDelete,
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
