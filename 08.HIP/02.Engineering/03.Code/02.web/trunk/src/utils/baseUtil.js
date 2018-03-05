const openLog = true;

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
const AlertProviders = [];
function addAlertProvider(provider){
	AlertProviders.push(provider);
}

function alert(type,title,msg){
	var args = arguments;
	if ( args.length == 1 ){
		msg = type;
		type="";
	}else if(args.length == 2){
		msg = title;
		title = type;
		type = "";
	}
	for(var provider of AlertProviders){
		if(typeof provider == 'function' ){
			provider(type,title,msg);
		}
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
	function log(msg){
		if(openLog)console.info(module+"."+msg);
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
const util={
	sleep:sleep,
	getLogger:getLogger,
	addNoticeProvider:addNoticeProvider,
	notice:notice,
	addErrorProvider:addErrorProvider,
	error:error,
	alert:alert,
	addAlertProvider:addAlertProvider,
	launchFullScreen:launchFullScreen
}
export default util; 