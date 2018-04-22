"use strict";

import { Component, PropTypes } from 'react';
import baseUtil from './utils/baseUtil.jsx';
import TimerPage from './TimerPage.jsx';
var TIMER_COUNT = 0;
class TimerModule extends TimerPage {
	constructor (props) {
		super(props);
		this.timer = this.timer.bind(this);
		this.timeResetHandler = this.timeResetHandler.bind(this);
		this.timeLimit  = baseUtil.getSysConfig('base.page.time',60*1000);
		
		baseUtil.regTimerResetHandler(this.timeResetHandler);
		TIMER_COUNT = this.timeLimit;
		this.timer();
	}
	timeResetHandler(){
		TIMER_COUNT = this.timeLimit;
	}
	componentWillUnmount() {
		if(this.timeId)clearTimeout(this.timeId);
	}
	timer(){//console.info('TimerModule ',TIMER_COUNT);
		this.timeId = setTimeout(()=>{
			if( TIMER_COUNT <= 0 ) {
				baseUtil.goHome('timerModule timeout');
			} else{
				TIMER_COUNT = TIMER_COUNT -1000;
				this.timer();	
			}
		},1000);
	}
	
}
module.exports = TimerModule;