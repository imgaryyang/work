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
var native_random = Math.random; 

var random = function(min, max, exact) { 
  if (arguments.length === 0) { 
    return native_random(); 
  } else if (arguments.length === 1) { 
    max = min; 
    min = 0; 
  } 
  var range = min + (native_random()*(max - min)); 
  return exact === void(0) ? Math.round(range) : range.toFixed(exact); 
};

var base = {
	speak:(audioKey)=>{
		var audioDom = document.getElementById("audio_"+audioKey);
		if(audioDom && audioDom.play)audioDom.play();
	},
	speakTip:(o)=>{return;
		o = o||{};
		var keys = [
		   'tip_beauty','tip_comming','tip_dont_touch','tip_iammachine','tip_tackmoney',
		   'tip_ihavemoney','tip_isBroken','tip_isOk','tip_whokillme','tip_remeber'
		];
		var audioKey = 'tip_isBroken';
		if('8a942adf5c786f31015c788e967a0010' == o.id){
			var r = random(1,10);
			if(r<= 4)audioKey = 'tip_y_hello';
			else audioKey =keys[random(1,10)] ;
		}else if('8a942adf5c786f31015c788f84a70012' == o.id ){
			var r = random(1,10);
			if(r<= 4)audioKey = 'tip_w_hello';
			else audioKey =keys[random(1,10)] ;
		}else if('8a942adf5c795275015c795a60280000' == o.id ){
			var r = random(1,10);
			if(r<= 4){
				audioKey = (r%2 == 0) ?'tip_x_hello':'tip_x_hello_2' ;
			}
			else audioKey =keys[random(1,10)] ;
		}else if('8a942adf5c795275015c795ab1f80001' == o.id ){
			var r = random(1,10);
			if(r<= 4){
				audioKey = (r%2 == 0) ?'tip_c_hello':'tip_c_hello_2' ;
			}
			else audioKey =keys[random(1,10)] ;
		}else{
			audioKey =keys[random(1,10)] ;
		}
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
	goOptHome:()=>{},
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