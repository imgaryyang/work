import axios from 'axios';
import moment from 'moment';
function get(url, data, config) {
	let param = JSON.stringify((data ? data : {}));
	var timestamp = moment().format('X');
	var url = config.url;
	if (url.indexOf('?') == -1) {
		url = url + '?data=' + param + '&_X=' + timestamp;
	} else {
		url = url + '&data=' + param + '&_X=' + timestamp;
	}


	return axios.get(url, config);
}


function post(url, param, options) {
	let data = JSON.stringify((param ? param : {}));
	var config = {
		url: url,
		method: 'post',
		contentType: 'application/json',
		data: data,
		type: 'json',
	};
	return request(config, options);
}
function get(url, param, options) {

	var config = {
		url: url,
		method: 'get',
		data: { data },
		type: 'json',
	};
	return request(config, options);
}
function put(url, param, options) {
	let data = JSON.stringify((param ? param : {}));
	var config = {
		url: url,
		method: 'put',
		data: data,
		contentType: 'application/json',
		type: 'json',
	};
	return request(config, options);
}
function del(url, param, options) {
	var config = {
		url: url,
		method: 'delete',
		data: param ? param : {},
		type: 'json',
	};
	return request(config, options);
}

function del(url, data, config) {
	return axios.del(url, data, config);
}

function head(url, data, config) {
	return axios.del(url, data, config);
}

function post(url, data, config) {
	return axios.del(url, data, config);
}

function put(url, data, config) {
	return axios.del(url, data, config);
}
function patch(url, data, config) {
	return axios.del(url, data, config);
}

module.exports = {
	get,
	post,
	del,
	put,
	head,
	patch
};