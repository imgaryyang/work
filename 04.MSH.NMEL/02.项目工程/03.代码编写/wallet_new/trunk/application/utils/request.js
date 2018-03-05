'use strict';
/**
 * request
 * 公用 ajax 请求
 */
var self = {};

(function() {
	'use strict';
	console.log('--------------- request ----------------');
	if (self.request) {
		return
	}
	console.log('/////////////// request /////////////////');

	self.request = function(url, config) {
		console.log(url);
		let status = {
			'0'  : '看来服务器闹情绪了，请您稍等片刻再试吧！',
			'400': '服务器无法处理此请求',
			'401': '请求未授权',
			'403': '禁止访问此请求',
			'404': '请求的资源不存在',
			'405': '不允许此请求',
			'406': '不可接受的请求',
			'407': '您发送的请求需要代理身份认证',
			'412': '请求的前提条件失败',
			'414': '请求URI超长',
			'500': '服务器内部错误',
			'501': '服务器不支持此请求所需的功能',
			'502': '网关错误',
		};

		let method = config ? (config.method ? (config.method.toUpperCase() === 'GET' ? 'GET' : 'POST') : 'POST') : 'POST';

		let headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		};
		headers = config ? (config.headers ? config.headers : headers) : headers;
		/*if(Global.USER_LOGIN_INFO != null)
			headers['sid'] = Global.USER_LOGIN_INFO['sid'] + '';*/

		let body = config ? (config.body ? config.body : '') : '';

		const xhr = new XMLHttpRequest();

		return new Promise((res, rej) => {

			xhr.open(method, url);

			//处理返回报文
			xhr.onload = () => {
				/*console.log('Utils.request() - xhr:');
				console.log(xhr);
				console.log('Utils.request() - xhr.status:' + xhr.status);*/
				if (xhr.status != 200) {

					console.log('Utils.request() - xhr.status:' + xhr.status);
					console.log('Utils.request() - xhr.status != 200 - xhr:');
					console.log(xhr);

					if(xhr.status === 401 || xhr.status === 403) {
						//TODO:需要登录时调用登录
						/*Global.interceptedRoute = null;
						this.props.navigator._goToLogin();*/
					}
					return rej({'status': xhr.status, 'msg': status[xhr.status + '']});
				}
				return res(JSON.parse(xhr.responseText));
			};


			//设置超时时间
			xhr.timeout = 3000;//Global.hostTimeout;
			//超时处理
			xhr.ontimeout = () => {
				this.hideLoading();
				this.toast('请求超时，请稍后再试！');
			};

			let hs = Object.keys(headers).map(value => {
		        return {
		            value,
		            text: headers[value]
		        };
		    });
			for (let i = hs.length - 1; i >= 0; i--) {
				xhr.setRequestHeader(hs[i]['value'], hs[i]['text']);
			}

			if(method === 'POST')
				xhr.send(body);
			else
				xhr.send();
			
		});
	}

  	self.request.polyfill = true;

})();

module.exports = self;

