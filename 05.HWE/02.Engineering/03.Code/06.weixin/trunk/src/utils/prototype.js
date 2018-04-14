import { Component } from 'react';

/**
 * 为Array扩展 contains 方法，检验数组是否包含某对象
 */
Object.defineProperty(Array.prototype, 'contains', {
  value(needle) {
    for (const i in this) {
      if (this[i] === needle) return true;
    }
    return false;
  },
  enumerable: false,
});

/**
 * 格式化金额
 * c - 精度 默认小数点后两位
 * d - 小数点 默认 .
 * t - 三位分隔符 默认 ,
 */
Object.defineProperty(Number.prototype, 'formatMoney', {
  value(fixed) {
    let n = this;
    const c = isNaN(fixed) ? 2 : fixed;
    const d = d === undefined ? '.' : d;
    const t = t === undefined ? ',' : t;
    const s = n < 0 ? '-' : '';
    const i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c), 10));
    let j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
  },
  enumerable: false,
});

Object.defineProperty(Array.prototype, 'find', {
  value(func) {
	for (var i = 0; i < this.length; i++) {
        if (func(this[i]))return this[i];
    }
	return;
  },
  enumerable: false,
});

/**
 * 取医生对象
 */
Object.defineProperty(Component.prototype, 'getPatientById', {
  value(user, id) {
    const { map } = user;
    for (let i = 0; map && map.userPatients && i < map.userPatients.length; i++) {
      if (id === map.userPatients[i].id) return map.userPatients[i];
    }
    return null;
  },
  enumerable: false,
});

/**
 * 从URL中取参数
 */
Object.defineProperty(Component.prototype, 'getUrlParam', {
  value(name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    console.log('url:', window.location.search);
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
    /* var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null; */
  },
  enumerable: false,
});

/**
 * 从URL中取参数
 */
Object.defineProperty(Component.prototype, 'getUrlParams', {
  value() {
    const url = window.location.search; // 获取url中"?"符后的字串
    const params = {};
    if (url.indexOf('?') !== -1) {
      const str = url.substr(1);
      const strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        params[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
    }
    return params;
  },
  enumerable: false,
});
