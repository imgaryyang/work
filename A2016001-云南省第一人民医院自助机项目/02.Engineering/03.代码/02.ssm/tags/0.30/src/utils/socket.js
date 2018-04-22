import eventUtil from './eventUtil';
import baseUtil from './baseUtil';

const HOST = '127.0.0.1';
const PORT = 7777;
const logger = baseUtil.getLogger('socket'); 
const DEVICE_ID = "LHSSMDeviceActiveX";
const eventFlag = "socket";
const dev_mode = false;//baseUtil.dev_mode;;
let DEVICE = null;

const DEVICE_dev={
	LH_SocketCommClose	:function(){return "{\"resultCode\":0}"},
	LH_SocketCommClient	:function(){return "{\"resultCode\":0}"},
	LH_SocketCommClientSendMsg:function(msg){
		var resp = {resultCode:0};
		if(msg.indexOf('A') == 0){
			resp = {"resultCode":0,"recMsg":{"knsj":"53012150101195121","grbh":"5011194916","xm":"黄燕芳","xb":"女","csrq":"1976-11-14","sfzh":"532727197611145520","cbsf":"在职","age":"40","ye":"196.00","bz":"本地","dw":"云南外服人力资源有限公司","rqlb":"城镇职工"}};
		}else if (msg.indexOf('B') == 0){
			resp = {"resultCode":0,"recMsg":{"state":"0","knsj":"00018998646896156303","yczf":"106","jzje":"10","zfje":"5","jmje":"0"}};
		}else if (msg.indexOf('C') == 0){
			resp = {resultCode:0};
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
	console.info('createConnection ',ret);
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
	console.info('closeConnection ',ret);
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
	
	logger.log("****************socket request **************");
	try{
		init();
		logger.log("**| init ");
		var con = createConnection();
		logger.log("**| connect "+con);
		logger.log("**| send  "+ str);
		var response = sendMsg(str);
		logger.log("**| response  "+ response);
		var json  = JSON.parse(response);
		// logger.log("**| response json  "+ json);
		if(json.state != '0'){
			if(!config.quiet)handleError("biz",str);
		}
		data = {data:json};
	}catch(e){
		console.info(e);
		if(!config.quiet)handleError("500",str);
		throw e;
	}finally{
		closeConnection()
	}
	if(!config.quiet)handleError("afterSend",str);
	
	return data;
}
function SEND(str,config) {
	return request( 
		str||"",// JSON.stringify( param||{} ),
		config
	);
}

const Socket={
	SEND:SEND, 
	addErrorHandler:addErrorHandler,
}

export default Socket;
