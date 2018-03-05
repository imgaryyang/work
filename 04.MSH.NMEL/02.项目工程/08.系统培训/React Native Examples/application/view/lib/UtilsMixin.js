'use strict';
/**
 * 公用方法
 */

let Global = require('../../Global');
let React = require('react-native');
let Icon = require('react-native-vector-icons/Ionicons');

let {
    Alert,
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    AsyncStorage,
} = React;

/**
 * 为Array扩展 contains 方法，检验数组是否包含某对象
 */
Array.prototype.contains = function ( needle ) {
  for (let i in this) {
    if (this[i] == needle) return true;
  }
  return false;
}

let UtilsMixin = {

	/**
	 * 异步后台请求
	 * @param  url 请求地址
	 * @param  config 请求的配置参数
	 * 		{
	 * 			method: 	string 可空 GET/POST 默认为 POST
	 * 			headers: 	object 可空 需要加到请求头文件里的参数
	 * 			body: 		string 可空 使用POST发起请求时放到报文体中的数据
	 * 		}
	 * @return 
	 */
	request: function(url, config) {
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
		if(Global.USER_LOGIN_INFO != null)
			headers['sid'] = Global.USER_LOGIN_INFO['sid'] + '';

		let body = config ? (config.body ? config.body : '') : '';

		const xhr = new XMLHttpRequest();

		return new Promise((res, rej) => {

			xhr.open(method, url);

			//处理返回报文
			xhr.onload = () => {
				/*console.log('UtilsMixin.request() - xhr:');
				console.log(xhr);
				console.log('UtilsMixin.request() - xhr.status:' + xhr.status);*/
				if (xhr.status != 200) {

					console.log('UtilsMixin.request() - xhr.status:' + xhr.status);
					console.log('UtilsMixin.request() - xhr.status != 200 - xhr:');
					console.log(xhr);

					if(xhr.status === 401 || xhr.status === 403) {
						Global.interceptedRoute = null;
						this.props.navigator._goToLogin();
					}
					return rej({'status': xhr.status, 'msg': status[xhr.status + '']});
				}
				return res(JSON.parse(xhr.responseText));
			};


			//设置超时时间
			xhr.timeout = Global.hostTimeout;
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
	},

	/**
	 * 当使用request提交请求时，在catch中调用此方法处理公共错误信息
	 * @param  error
	 * @return 
	 */
	requestCatch: function(e) {
		this.hideLoading();
		if(0 == e.status || e.status) {
			if(e.status != 401 && e.status != 403) {
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

	/**
	 * listView没有数据时显示的提示信息
	 * @param  text 	显示的文字
	 * @param  onPress	点击触发的回调事件
	 * @return 
	 */
	getListRefreshView: function(text, onPress) {
		return (
			<TouchableOpacity 
				style={[Global.styles.CENTER, {flexDirection: 'row', height: 35,}]} 
				onPress={() => {
					if(onPress && typeof onPress == 'function')
						onPress();
				}} >
				<Text style={{marginRight: 10}} >{text}</Text>
                <Icon name='refresh' size={20} color={Global.colors.FONT_GRAY} style={[Global.styles.ICON]} />
			</TouchableOpacity>
		);
	},

	/**
	 * ListView的下拉刷新控制器
	 * @param  onRefresh 	下拉刷新被触发时回调的事件
	 * @return 
	 */
	getRefreshControl: function(onRefresh) {
		//console.log('in getRefreshControl......')
		return (
			<RefreshControl
				refreshing={this.state.isRefreshing}
				onRefresh={() => {
					if(onRefresh && typeof onRefresh == 'function') 
						onRefresh();
				}}
				tintColor="#929292"
				title="重新载入..."
				colors={['#ff0000', '#00ff00', '#0000ff']}
				progressBackgroundColor="#ffff00"
			/>
        )
	},

	/**
	 * 显示载入遮罩
	 */
	showLoading: function() {
		this.props.showLoading();
	},

	/**
	 * 隐藏载入遮罩
	 */
	hideLoading: function() {
		this.props.hideLoading();
	},

	/**
	 * toast msg
	 */
	toast: function(msg) {
		this.props.toast(msg);
	},

	/*
	 * 获取随机颜色
	*/
	getRandomColor: function() {
		let cs = [
			'rgba(46, 204, 113, 1)',
			'rgba(142, 68, 173, 1)',
			'rgba(52, 73, 94, 1)',
			'rgba(243, 156, 18, 1)',
			'rgba(230, 126, 34, 1)',
			'rgba(231, 76, 60, 1)',
			'rgba(149, 165, 166, 1)',
		];
		let number = (1+Math.random()*(7-1)).toFixed(0);
		return cs[number - 1];
		//return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
	},

	updateUserInfo: async function(userInfo) {
		let user = await AsyncStorage.getItem(Global.ASK_USER);
		var user_info = JSON.parse(user);
		for(var key in userInfo){
			user_info[key] = userInfo[key];
		}
		Global.USER_LOGIN_INFO = user_info;
		//console.log(Global.USER_LOGIN_INFO);
		await AsyncStorage.setItem(Global.ASK_USER, JSON.stringify(user_info));
		this.props.refreshUser();
	},
};

module.exports = UtilsMixin;
