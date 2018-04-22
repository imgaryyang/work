import moment from 'moment';
const openLog = false;
const dev_mode = false;

function speak(audioKey){
	var audioDom = document.getElementById("audio_"+audioKey);
	if(audioDom && audioDom.play)audioDom.play();
}
const NoticeProviders = [];
function addNoticeProvider(provider){
	NoticeProviders.push(provider);
}

function notice(msg){
	for(var provider of NoticeProviders){
		if(typeof provider == 'function' )provider(msg)
	}
}

const ErrorProviders = [];
function addErrorProvider(provider){
	ErrorProviders.push(provider);
}

function error(msg){
	for(var provider of ErrorProviders){
		if(typeof provider == 'function' )provider(msg)
	}
}

const WarningProviders = [];
function addWarningProvider(provider){
	WarningProviders.push(provider);
}

function warning(msg){
	for(var provider of WarningProviders){
		if(typeof provider == 'function' )provider(msg)
	}
}

function sleep(ms) {
	  return new Promise(resolve => setTimeout(resolve, ms))
}
//function loggerFactory(module){
//	function logger(msg){
//		if(openLog)console.info(module+"."+msg);
//	}
//	return logger;
//}
function getLogger(module){
	function log(){
		if(openLog)console.info(module,arguments[0]);
	}
	function info(){
		if(openLog)console.info(module,arguments[0]);
	}
	function warning(){
		if(openLog)console.info(module,arguments[0]);
	}
	function warning(){
		if(openLog)console.info(module,arguments[0]);
	}
	return {log:log};
}
function launchFullScreen(element) {
	 if(element.requestFullscreen) {
	  element.requestFullscreen();
	 } else if(element.mozRequestFullScreen) {
	  element.mozRequestFullScreen();
	 } else if(element.webkitRequestFullscreen) {
	  element.webkitRequestFullscreen();
	 } else if(element.msRequestFullscreen) {
	  element.msRequestFullscreen();
	 }
}
function closeTodayCash(){
	var time = moment().format('YYYY-MM-DD');
	console.info('closeTodayCash time',time);
	var key = 'CASH_'+ time +'_SWITCH';
	console.info('closeTodayCash key',key);
	window.localStorage.setItem( key,'0');
	
}
function enableTodayCash(){
	var time = moment().format('YYYY-MM-DD');
	console.info('closeTodayCash time',time);
	var key = 'CASH_'+ time +'_SWITCH';
	console.info('closeTodayCash key',key);
	window.localStorage.setItem( key,'1');
}
function isTodayCanCash(){
	//var time =moment().subtract(20, 'minutes').format('YYYY-MM-DD');//12点20分后开启现金
	var time = moment().format('YYYY-MM-DD');
	var key = 'CASH_'+ time +'_SWITCH';
	var SWITCH = window.localStorage.getItem( key);
	if(SWITCH && SWITCH == '0')return false;
	else return true;
}
const util={
	speak:speak,
	closeTodayCash,
	enableTodayCash,
	isTodayCanCash,
	sleep:sleep,
	getLogger:getLogger,
	addNoticeProvider:addNoticeProvider,
	notice:notice,
	addErrorProvider:addErrorProvider,
	error:error,
	addWarningProvider:addWarningProvider,
	warning:warning,
	launchFullScreen:launchFullScreen,
	dev_mode:dev_mode,
}
export default util; 