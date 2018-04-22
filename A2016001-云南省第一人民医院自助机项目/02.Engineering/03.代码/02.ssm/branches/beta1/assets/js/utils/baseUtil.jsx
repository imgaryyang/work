import eventUtil from './eventUtil.jsx';
import logUtil,{ log } from  "./logUtil.jsx";
import moment from 'moment';
const dev_mode = false;
const eventFlag ='base';
function addListener(event,func){
	return eventUtil.addListener(eventFlag,event,func);
}
function removeListener(event,index){
	return eventUtil.removeListener(eventFlag,event,index);
}
function fireEvents(event,arg){
	return eventUtil.fireEvents(eventFlag,event,arg);
}
function register(name,value){
	base[name] = value;
}

function closeTodayCash(){
	var time = moment().format('YYYY-MM-DD');
	var key = 'CASH_'+ time +'_SWITCH';
	log('closeTodayCash key',key);
	window.localStorage.setItem( key,'0');
}
function enableTodayCash(){
	var time = moment().format('YYYY-MM-DD');
	var key = 'CASH_'+ time +'_SWITCH';
	log('closeTodayCash key',key);
	window.localStorage.setItem( key,'1');
}
function isTodayCanCash(){
	//var time =moment().subtract(20, 'minutes').format('YYYY-MM-DD');//12点20分后开启现金
	var time = moment().format('YYYY-MM-DD');
	var key = 'CASH_'+ time +'_SWITCH';
	var SWITCH = window.localStorage.getItem( key);
	
	var oldTime = moment().subtract(2, 'days').format('YYYY-MM-DD');
	var oldKey = 'CASH_'+ oldTime +'_SWITCH';
	window.localStorage.removeItem(oldKey);
	
	if(SWITCH && SWITCH == '0')return false;
	else return true;
}
function getSysConfig(name,defaults){
	var value  = defaults;
	if(window.ssmConfig){
		if(window.ssmConfig[name] !== undefined ){
			value = window.ssmConfig[name];
		}
	}
	return value;
}
var base = {
	speak:(audioKey)=>{
		var audioDom = document.getElementById("audio_"+audioKey);
		if(audioDom && audioDom.play)audioDom.play();
	},
	sleep:(ms)=>{
		return new Promise(resolve => setTimeout(resolve, ms));
	},
	confirm:()=>{},
	error:()=>{},
	notice:()=>{},
	warning:()=>{},
	goHome:()=>{},
	getCurrentPatient:()=>{},
	login:()=>{},
	logout:()=>{},
	getMachineInfo:()=>{},
	mask:()=>{console.info('mask')},
	unmask:()=>{console.info('unMask')},
	reloadPatient:()=>{},
	register,
	isTodayCanCash,
	enableTodayCash,
	closeTodayCash,
	fireEvents,
	on:addListener,
	getSysConfig,
	dev_mode,
	un:removeListener,
}

module.exports = base;