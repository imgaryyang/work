'use strict';

/**
*日期过滤器
**/

import React from 'react-native';

const FilterDate = (ComposedComponent) => {
	var  DateHoc = React.createClass({
		getInitialState: function() {
			// console.log('--FilterDate getInitialState--');
			return null ;
		},

	    componentDidMount:function() {
	        console.log('---FilterDate componentDidMount---');
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
		},

		render:function(){
			return <ComposedComponent navigator={this.props.navigator} route={this.props.route}
						{...this.props}
						filterDateFmt={this.filterDateFmt} 
						filterDateFmtToDay={this.filterDateFmtToDay} />;
		},
	});
	return (DateHoc);
}

module.exports = FilterDate ;