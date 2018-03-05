'use strict';

/**
*卡号过滤器
**/

import React from 'react-native';

const FilterCardNumber = (ComposedComponent) =>{
	var CardNumberHoc = React.createClass({
		getInitialState:function(){
			return null;
		},

		componentDidMount:function(){
			console.log('---FilterCardNumber componentDidMount---');
		},

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

		render:function(){
			return <ComposedComponent navigator={this.props.navigator} route={this.props.route} 
						{...this.props}
						filterCardNumLast4={this.filterCardNumLast4} 
						filterIdCard = {this.filterIdCard} 
						filterBankCard = {this.filterBankCard} /> ;
		},
	});
	return (CardNumberHoc);
}

module.exports = FilterCardNumber ;