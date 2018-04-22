/**
 * Validations of form text input
 */
'use strict';
function pad(num, n) {  
    var len = num.toString().length;  
    while(len < n) {  
        num = "0" + num;  
        len++;  
    }  
    return num;  
}  
/**
 * 补齐字符串
 */
Object.defineProperty(String.prototype, 'pad', {
	value: function(length,charactor) {
		var str = this,
		charactor = (charactor==null)?" ":charactor;
		var len = str.toString().length; 
		while(len < length) {  
			str = str+charactor;  
			len = str.toString().length; 
	    }  
	    return str;
		
	},
	enumerable: false
});
Object.defineProperty(String.prototype, 'rightPad', {
	value: function(length,charactor) {
		var str = this,
		charactor = (charactor==null)?" ":charactor;
		var len = str.toString().length; 
		while(len < length) {  
			str = str+charactor;  
			len = str.toString().length; 
	    }  
	    return str;
		
	},
	enumerable: false
});
Object.defineProperty(String.prototype, 'leftPad', {
	value: function(length,charactor) {
		var str = this,
		charactor = (charactor==null)?" ":charactor;
		var len = str.toString().length; 
		while(len < length) {  
			str = charactor+str;  
	        len = str.toString().length;  
	    }  
	    return str;
		
	},
	enumerable: false
});
/**
 * 格式化金额 
 * c - 精度 默认小数点后两位
 * d - 小数点 默认 .
 * t - 三位分隔符 默认 ,
 */
Object.defineProperty(Number.prototype, 'formatMoney', {
	value: function(n){
		 let s = this+'';
	     n = n > 0 && n <= 20 ? n : 2;   
	     s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
	     var l = s.split(".")[0].split("").reverse(),   
	     r = s.split(".")[1];   
	     var t = "";   
	     for(var i = 0; i < l.length; i ++ )   
	     {   
	        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
	     }   
	     return t.split("").reverse().join("") + "." + r;   
	},
	  enumerable: false,
});

/**
 * 格式化金额 
 * c - 精度 默认小数点后两位
 * d - 小数点 默认 .
 * t - 三位分隔符 默认 ,
 */
Object.defineProperty(String.prototype, 'formatMoney', {
//	value: function(fixed) {
//	    let n = this;
//	    let c,d,t,s,i,j;
//	    c = isNaN(fixed) ? 2 : fixed;
//	    d = d === undefined ? '.' : d;
//	    t = t === undefined ? ',' : t;
//	    s = n < 0 ? '-' : '';
//	    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c), 10));
//	    j = (j = i.length) > 3 ? j % 3 : 0;
//	    return s + (j ? i.substr(0, j) + t : '')
//	    	+ i.substr(j).replace(/(\d{3})(?=\d)/g, /$1${t}/)
//	    	+ (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
//	  },
	value: function(n){
		 let s = this;
	     n = n > 0 && n <= 20 ? n : 2;   
	     s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
	     var l = s.split(".")[0].split("").reverse(),   
	     r = s.split(".")[1];   
	     var t = "";   
	     for(var i = 0; i < l.length; i ++ )   
	     {   
	        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
	     }   
	     return t.split("").reverse().join("") + "." + r;   
	},
	enumerable: false,
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

