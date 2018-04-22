import eventUtil from './eventUtil';
import baseUtil from './baseUtil';

//const logger = baseUtil.getLogger('light'); 
const logger = {log:()=>{}}
const eventFlag = "light";

const DEVICE_ID = "LHSSMDeviceActiveX";
var DEVICE;

const dev_mode = baseUtil.dev_mode;;
const DEVICE_dev = {
	LH_GL_OpenPortBaud:function(){return "{\"stateCode\":0}"},
	LH_GL_ClosePort:function(){return "{\"stateCode\":0}"},
	LH_GL_SetLight:function(){return "{\"stateCode\":0}"},
}

function init(){
	if(dev_mode)DEVICE = DEVICE_dev;
	if(!DEVICE) DEVICE = document.getElementById(DEVICE_ID);
	if(!DEVICE)throw new Error("找不到灯控控件");
}
//开串口
function open(COM){
	init();
	var resp = DEVICE.LH_GL_OpenPortBaud(COM,9600);
	var json = JSON.parse(resp);
	if(json.stateCode != 0 )throw new Error("打开"+COM+"灯控串口失败");
	logger.log('open '+COM+' : '+resp+",port: "+json.hPort);
	return json.hPort;
	
}
//关串口
function close(PORT_COM){
	var resp =  DEVICE.LH_GL_ClosePort(PORT_COM);
	var json = JSON.parse(resp);
	var stateCode = json.stateCode;
	if(stateCode != '0')throw new Error('关闭灯控串口异常');
}

//int LightNo:指示灯编号0-5
//int Flag:指示灯控制标识，0 常亮 1闪烁 2灭
function setLight(port,no,flag){
	var PORT_COM ;
	if(port == 9 ){
		PORT_COM = open('COM9');
	}else if(port == 10 ){
		PORT_COM = open('COM10');
	}
	logger.log('setLight: '+PORT_COM+','+no+','+flag);
	var resp = DEVICE.LH_GL_SetLight(PORT_COM,no,flag);
	var json = JSON.parse(resp);
	var stateCode = json.stateCode;
	logger.log('setLight: '+resp);
	if(stateCode != '0')throw new Error('灯控异常');
}

var ticket={//凭条出口
	turnOn: function(){
		setLight(9,1,0);
	},
	blink : function(){
		setLight(9,1,1);
	},
	turnOff:function(){
		setLight(9,1,2);
	},
};

var form={//表单出口
	turnOn: function(){
		setLight(9,2,0);
	},
	blink : function(){
		setLight(9,2,1);
	},
	turnOff:function(){
		setLight(9,2,2);
	},
};

var medicalCard={//就诊卡
	turnOn: function(){
		setLight(9,3,0);
	},
	blink : function(){
		setLight(9,3,1);
	},
	turnOff:function(){
		setLight(9,3,2);
	},
};
var cardPrinter={//证卡打印机
	turnOn: function(){
		setLight(9,4,0);
	},
	blink : function(){
		setLight(9,4,1);
	},
	turnOff:function(){
		setLight(9,4,2);
	},
};	
var cash={//钱箱
	turnOn: function(){
		setLight(9,5,0);
	},
	blink : function(){
		setLight(9,5,1);
	},
	turnOff:function(){
		setLight(9,5,2);
	},
};  

var bankCard={  //银联卡入口
	turnOn: function(){
		setLight(10,1,0);
	},
	blink : function(){
		setLight(10,1,1);
	},
	turnOff:function(){
		setLight(10,1,2);
	},
}; 

var miCard={//社保卡
	turnOn: function(){
		setLight(10,2,0);
	},
	blink : function(){
		setLight(10,2,1);
	},
	turnOff:function(){
		setLight(10,2,2);
	},
}; 
var pin={//密码键盘
	turnOn: function(){
		setLight(10,3,0);
	},
	blink : function(){
		setLight(10,3,1);
	},
	turnOff:function(){
		setLight(10,3,2);
	},
}; 
const light={
	ticket,
	form,
	medicalCard,
	cardPrinter,
	cash,
	bankCard,
	miCard,
	pin,
}

export default light;
