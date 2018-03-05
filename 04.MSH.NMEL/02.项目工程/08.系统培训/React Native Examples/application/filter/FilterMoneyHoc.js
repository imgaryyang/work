'use strict';

/**
*金额过滤器
**/

import React from 'react-native';

const FilterMoneyHoc = (ComposedComponent) =>{
	var MoneyHoc = React.createClass({
		getInitialState:function(){
			return null;
		},

		componentDidMount:function(){
			console.log('---FilterMoney componentDidMount---');
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

		render:function(){
			return <ComposedComponent navigator={this.props.navigator} route={this.props.route} 
						{...this.props}
						filterMoney={this.filterMoney} /> ;
		},
	});
	return (MoneyHoc);
}

module.exports = FilterMoneyHoc ;