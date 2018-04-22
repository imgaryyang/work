import moment from 'moment';
const logTimer = 15;
const logRoot= "c:\\ssmlogs"
const File_WRITER_ID = "LHSSMLogActiveX";
var LOGGER;

function logLoop(){
	console.info("保存日志");
	saveLog();
	setTimeout(logLoop,logTimer*60*1000);
}
function startLogLoop(){
	setTimeout(logLoop,logTimer*60*1000);
}
function getCacheId(){
	var key = "log_id" ;
	var value = window.localStorage.getItem(key);
	if(!value){
		var time = (new Date()).getTime(); //得到毫秒数 
		window.localStorage.setItem( key, time );
		value = window.localStorage.getItem(key);
	}
	return value;
}
function resetCacheId(){
	var key = "log_id" ;
	var time = (new Date()).getTime(); //得到毫秒数 
	window.localStorage.setItem( key, time );
	var value = window.localStorage.getItem(key);
	return value;
}
function getValue(key){
	var log_id = getCacheId();
	var value = window.localStorage.getItem(log_id+'_'+key);
	return value;
}
function getCount(){
	var key = "log_count" ;
	var value = getValue(key);
	if(!value)value='1';
	setValue(key,(parseInt(value)+1));
	return value;
}
function setValue(key,value){
	var log_id = getCacheId();
	window.localStorage.setItem( log_id+'_'+key, value );
}
function writeLogToFile(content){
	if(!LOGGER){
		LOGGER =  document.getElementById(File_WRITER_ID);
	}
	if(!LOGGER){
		console.error('找不到日志记录器');
	}else{
		console.info('LOGGER',LOGGER);
		var month = moment().format('YYYY-MM');//-DD HH:mm:ss
		var day = moment().format('YYYY-MM-DD');
		var fileName = moment().format('HH-mm-ss')+'.log';//moment().format('a.log');
		var res = LOGGER.log(logRoot,month,day,fileName,content);
		console.info('res',res);
	}
}
function saveLog(){
	var log_id = getCacheId();
	resetCacheId();
	var count_str = window.localStorage.getItem(log_id+'_log_count');
	var count = parseInt(count_str);
	var content = '';
	for(var i=1;i<count;i++ ){
		var log = window.localStorage.getItem( log_id+'_'+i, );
		console.info('log : ',log);
		//在此写入文件
		content = content + log+"\n";
	}
	//console.info('content : ',content);
	writeLogToFile(content);
	for(var i=1;i<count;i++ ){
		var log = window.localStorage.removeItem( log_id+'_'+i, );
		//console.info("remove ", log_id+'_'+i,);
	}
	window.localStorage.removeItem(log_id+'_log_count');
}
function log(){
	console.info('log',arguments);
	var args = arguments ||[];
	var param = {
			time:moment().format('YYYY-MM-DD HH:mm:ss'),
			log:args
	}
	var str = JSON.stringify(param);
	var count = getCount();
	setValue(count,str);
}
const util={
	log,
	saveLog,
	startLogLoop,
}
export default util; 