'use strict';
/**
 * 所有公用过滤器
 */

var FilterMixin = {

	/**
	 * 格式化卡号，显示卡号后4位，前面所有数字显示为 *
	 * @param  {[string]}
	 * @return {[string]}
	 */
	filterCardNumLast4: function(cn) {
		if (cn != null)
			return cn.substr(cn.length - 4);
	},

	/**
	 * 格式化身份证号，显示前4位及后4位，中间的所有数字显示为 *
	 * @param  {[type]}
	 * @return {[type]}
	 */
	filterIdCard: function(cn) {
		var rtn = '';
		if (cn != null) {
			rtn = cn.substr(0, 4);
			rtn += '************';
			rtn += cn.substr(cn.length - 4);
		}
		return rtn;
	},

	/**
	 * 格式化卡号为每4为加一空格
	 */
	filterBankCard: function(cn) {
		let rtn = "";
		for(let i = 0 ; cn && i <= cn.length ; i++) {
			if(i != 0 && i % 4 == 0)
				rtn += ' ';
			rtn += cn.substr(i, 1);
		}
		return rtn;
	},

	/**
	 * 数字格式化金额，整数位每三位用逗号隔开，小数点保留n位(默认保留两位)
	 */
	filterMoney: function(s, n) {
		if (s != null && s != undefined) {
			n = n > 0 && n <= 20 ? n : 2;
			s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
			let l = s.split(".")[0].split("").reverse(),
				r = s.split(".")[1];
			let t = "";
			for (let i = 0; i < l.length; i++) {
				t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
			}
			return t.split("").reverse().join("") + "." + r;
		}
		return null;
	},

	/**
	 * 格式化日期 yyyy-mm-dd hh:mm
	 */
	filterDateFmt: function(date) {
		if (date != null && date != undefined) {
			var date = new Date(date);
			var hours = (date.getHours() > 9) ? date.getHours() : '0' + date.getHours();
			var minute = (date.getMinutes() > 9) ? date.getMinutes() : '0' + date.getMinutes();
			// var second = (date.getSeconds() > 9) ? date.getSeconds() : '0' + date.getSeconds();
			var year = date.getFullYear();
			var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
			var day = date.getDate()> 9 ? date.getDate()  : ('0' + date.getDate());
			return year + '-' + month + '-' + day + ' ' + hours + ':' + minute;
		}
		return null;
	},

	/**
	 * 格式化日期 yyyy-mm-dd
	 */
	filterDateFmtToDay: function(date) {
		if (date != null && date != undefined) {
			var date = new Date(date);
			// var hours = (date.getHours() > 9) ? date.getHours() : '0' + date.getHours();
			// var minute = (date.getMinutes() > 9) ? date.getMinutes() : '0' + date.getMinutes();
			// var second = (date.getSeconds() > 9) ? date.getSeconds() : '0' + date.getSeconds();
			var year = date.getFullYear();
			var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
			var day = date.getDate()> 9 ? date.getDate()  : ('0' + date.getDate());
			return year + '-' + month + '-' + day ;
		}
		return null;
	}
};

module.exports = FilterMixin;