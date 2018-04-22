import eventUtil from './eventUtil.jsx';
import baseUtil from './baseUtil.jsx';
import logUtil,{ log } from  "./logUtil.jsx";
const HOST = '127.0.0.1';
const PORT = 7777;
const DEVICE_ID = "LHSSMDeviceActiveX";
const eventFlag = "socket";
const dev_mode = baseUtil.dev_mode;;
let DEVICE = null;

const DEVICE_dev={
	LH_SocketCommClose	:function(){return "{\"resultCode\":0}"},
	LH_SocketCommClient	:function(){return "{\"resultCode\":0}"},
	LH_SocketCommClientSendMsg:function(msg){
		var resp = {resultCode:0};
		if(msg.indexOf('A') == 0){
			var data = {
				"resultCode":0,
				"recMsg":[
			       {"zh":"1","mc":"氢化可的松","dj":"0.8600","sl":"1","cs":"1","kzjb":"","yzsj":"2017-07-12 15:00:05","ysid":"8798","kzjbmc":"甲类","ysxm":"孙桢","ksmc":"心脏大血管外科","ksid":"35","flmmc":""},
			       {"zh":"1","mc":"5%葡萄糖","dj":"4.4000","sl":"1","cs":"1","kzjb":"","yzsj":"2017-07-12 15:00:05","ysid":"8798","kzjbmc":"甲类","ysxm":"孙桢","ksmc":"心脏大血管外科","ksid":"35","flmmc":""},
			       {"zh":"1","mc":"对乙酰氨基酚","dj":"15.0830","sl":"1","cs":"1","kzjb":"","yzsj":"2017-07-12 15:00:05","ysid":"8798","kzjbmc":"自费","ysxm":"孙桢","ksmc":"心脏大血管外科","ksid":"35","flmmc":""},
			       {"zh":"1","mc":"布洛芬","dj":"11.6300","sl":"1","cs":"1","kzjb":"","yzsj":"2017-07-12 15:00:05","ysid":"8798","kzjbmc":"自费","ysxm":"孙桢","ksmc":"心脏大血管外科","ksid":"35","flmmc":""},
			       
			       {"zh":"2","mc":"氢化可的松","dj":"0.8600","sl":"1","cs":"1","kzjb":"","yzsj":"2017-07-12 15:00:05","ysid":"8798","kzjbmc":"甲类","ysxm":"孙桢","ksmc":"心脏大血管外科","ksid":"35","flmmc":""},
			       {"zh":"2","mc":"5%葡萄糖","dj":"4.4000","sl":"1","cs":"1","kzjb":"","yzsj":"2017-07-12 15:00:05","ysid":"8798","kzjbmc":"甲类","ysxm":"孙桢","ksmc":"心脏大血管外科","ksid":"35","flmmc":""},
			       {"zh":"2","mc":"对乙酰氨基酚","dj":"15.0830","sl":"1","cs":"1","kzjb":"","yzsj":"2017-07-12 15:00:05","ysid":"8798","kzjbmc":"自费","ysxm":"孙桢","ksmc":"心脏大血管外科","ksid":"35","flmmc":""},
			       {"zh":"2","mc":"布洛芬","dj":"11.6300","sl":"1","cs":"1","kzjb":"","yzsj":"2017-07-12 15:00:05","ysid":"8798","kzjbmc":"自费","ysxm":"孙桢","ksmc":"心脏大血管外科","ksid":"35","flmmc":""},
			       
			       {"zh":"3","mc":"氢化可的松","dj":"0.8600","sl":"1","cs":"1","kzjb":"","yzsj":"2017-05-03 15:00:05","ysid":"8798","kzjbmc":"甲类","ysxm":"孙桢","ksmc":"心脏大血管外科","ksid":"35","flmmc":""},
			       {"zh":"3","mc":"5%葡萄糖","dj":"4.4000","sl":"1","cs":"1","kzjb":"","yzsj":"2017-05-03 15:00:05","ysid":"8798","kzjbmc":"甲类","ysxm":"孙桢","ksmc":"心脏大血管外科","ksid":"35","flmmc":""},
			       {"zh":"3","mc":"对乙酰氨基酚","dj":"15.0830","sl":"1","cs":"1","kzjb":"","yzsj":"2017-05-03 15:00:05","ysid":"8798","kzjbmc":"自费","ysxm":"孙桢","ksmc":"心脏大血管外科","ksid":"35","flmmc":""},
			       {"zh":"3","mc":"布洛芬","dj":"11.6300","sl":"1","cs":"1","kzjb":"","yzsj":"2017-05-03 15:00:05","ysid":"8798","kzjbmc":"自费","ysxm":"孙桢","ksmc":"心脏大血管外科","ksid":"35","flmmc":""}
		    ]};
			resp = data;
		}else if (msg.indexOf('B') == 0){
			resp = {"resultCode":0,"recMsg":{"state":"0","knsj":"00018998646896156303","yczf":"106","jzje":"10","zfje":"5","jmje":"0"}};
		}else if (msg.indexOf('C') == 0){
			resp = {resultCode:0,"recMsg":{"state":"0"}};
		}else if (msg.indexOf('D') == 0){
			resp = {resultCode:0};
		}else if (msg.indexOf('E') == 0){
			resp = {resultCode:0};
		}else if (msg.indexOf('F') == 0){
			resp = {resultCode:0};
		}
		return JSON.stringify(resp);
	},
}

var ERROR_HANDLER={};

function addErrorHandler(status,handler){
	var key = ''+status;
	if(!ERROR_HANDLER[key])ERROR_HANDLER[key]= [];
	ERROR_HANDLER[key].push(handler);
}
function handleError(status,response){
	var key = ''+status;
	var handlers = ERROR_HANDLER[key];
	if(handlers && handlers.length > 0){
		for(var handler of handlers){
			handler(status,response);
		}
	}
}


const GB2312UnicodeConverter = {  
	ToUnicode: function (str) {  
		return escape(str).toLocaleLowerCase().replace(/%u/gi, '\\u');  
	},  
	ToGB2312: function (str) {  
		return unescape(str.replace(/\\u/gi, '%u'));  
	}  
};
function init(){
	if(dev_mode)DEVICE = DEVICE_dev;
	if(!DEVICE) DEVICE = document.getElementById(DEVICE_ID);
	if(!DEVICE)throw new Error("找不到ocx控件");
}

//建立Socket连接
function createConnection(){
	var ret = DEVICE.LH_SocketCommClient(HOST, PORT);
	var json = JSON.parse(ret);
	var resultCode = json.resultCode;
	if(resultCode != 0){
		throw new Error("Socket连接建立失败:",HOST,PORT);
	}
	return json;
}
//关闭Socket连接
function closeConnection(){
	var ret = DEVICE.LH_SocketCommClose();
	log('closeConnection ',ret);
	var json = JSON.parse(ret);
	var resultCode = json.resultCode;
	if(resultCode != 0){
		throw new Error("Socket关闭失败:",HOST,PORT);
	}
	return json;
}

function sendMsg(msg){
	var ret = DEVICE.LH_SocketCommClientSendMsg(msg, 1024 * 64);
	return ret ;
}
var defaultConfig = {
		
}
function request(str,config){
	config = {...defaultConfig,...config};
	if(!config.quiet)handleError("beforeSend",str);
	var data={data:{resultCode:-1,recMsg:''}};
	
	log("****************socket request **************");
	var exception = null;
	try{
		log("**| init ");
		init();
		var con = createConnection();
		log("**| connect "+con);
		log("**| send  "+ str);
		var response = sendMsg(str);
		log("**| response  "+ response);
		var json  = JSON.parse(response);
		// log("**| response json  "+ json);
		if(json.state != '0'){
			if(!config.quiet)handleError("biz",str);
		}
		data = {data:json};
	}catch(e){
		log('socket异常',e);
		exception = e ;
		if(!config.quiet)handleError("500",str);
	}
	try{
		closeConnection()
	}catch(e){
		log('socket异常',e);
	}
	if(!config.quiet)handleError("afterSend",str);
	log("****************socket end **************");
	if(exception)throw e;
	return data;
}
function SEND(str,config) {
	var resp = request( str||"", config);
	return resp;
}

const Socket={
	SEND:SEND, 
	addErrorHandler:addErrorHandler,
}

module.exports = Socket;
