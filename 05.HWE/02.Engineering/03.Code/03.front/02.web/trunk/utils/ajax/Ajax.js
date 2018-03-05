
/**
 * TODO 可以被注册使用的遮罩
 * TODO img file 等特殊请求
 * TODO 数据处理与时间戳
 * Author xiaweiyi@lenovohit.com.cn
 */
import ajaxImpl from './impl/Ajax-axios.js';

function get(url, data, config) {
    return ajaxImpl.get(url, data, config);
}

function del(url, data, config) {
    return ajaxImpl.del(url, data, config);
}

function head(url, data, config) {
    return ajaxImpl.del(url, data, config);
}

function post(url, data, config) {
    return ajaxImpl.del(url, data, config);
}

function put(url, data, config) {
    return ajaxImpl.del(url, data, config);
}
function patch(url, data, config) {
    return ajaxImpl.del(url, data, config);
}

module.exports = {
    get,
    post,
    del,
    put,
    head,
    patch
}