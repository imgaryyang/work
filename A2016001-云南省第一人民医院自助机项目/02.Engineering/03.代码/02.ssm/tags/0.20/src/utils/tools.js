/**
 * Validations of form text input
 */
'use strict';

/**
 * 格式化金额 
 * c - 精度 默认小数点后两位
 * d - 小数点 默认 .
 * t - 三位分隔符 默认 ,
 */
Object.defineProperty(Number.prototype, 'formatMoney', {
	value: function() {
		var n = this, 
		c = isNaN(c = Math.abs(c)) ? 2 : c, 
		d = d == undefined ? "." : d, 
		t = t == undefined ? "," : t, 
		s = n < 0 ? "-" : "", 
		i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
		j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	},
	enumerable: false
});

/**
 * 将带parent属性的数组转为树状结构
 */
Object.defineProperty(Array.prototype, 'arrayToTree', {
	value: function() {
		var array = this;
		var all = {}, rtnArr = [];
		for(var i = 0 ; i < array.length ; i++) {
			var item = array[i];
			item.children = [];
			item.key = '/' + item.code;
			all[item.id] = item;
		}
		for(var i = 0 ; i < array.length ; i++) {
			var item = array[i], parentId = item.parent;
			if(parentId && all[parentId]) {
				var parent = all[parentId];
				parent.children.push(item);
				item.parent = parent; //将父子做关联 child.parent为父，parent.index为第一个子
				if(!parent.index)parent.index = item;
			}else{
				rtnArr.push(item);
			}
		}
		return rtnArr;
	},
	enumerable: false
});

