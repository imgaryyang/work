"use strict";

import { Component, PropTypes } from 'react';
import baseUtil from './utils/baseUtil.jsx';

class TimerPage extends Component {
	constructor (props) {
		super(props);
		this.bind = this.bind.bind(this);
	}
	bind(fn,scope){
		var warpper = function(){
			baseUtil.resetTimer();
			return fn.apply(scope,arguments);
		}
		return warpper.bind(this);
	}
}
module.exports = TimerPage;