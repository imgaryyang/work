import eventUtil from './eventUtil';
import socket from './socket';
import baseUtil from './baseUtil';
import lightUtil from './lightUtil';
const logger = baseUtil.getLogger('miCardUtil'); 
const DEVICE_ID="LHSSMDeviceActiveX";
const eventFlag = "miCard";
const dev_mode = baseUtil.dev_mode;;
const Light = lightUtil.miCard;
const PinLight = lightUtil.pin;
let DEVICE,Handle=null;

/***以下是开发模式***/
const emptyF = function(){};
var DEVICE_dev_state = -1;
const DEVICE_dev = {
	LH_IC_InitComm_Baud:function(){return "{\"icdev\":1}"},
	LH_IC_InitComm:function(){
		DEVICE_dev_state=-1;
		setTimeout(()=>{
			DEVICE_dev_state=0;
		},2000); 
		return "{\"icdev\":1}"
	},
	LH_IC_DevBeep:function(){return "{\"stateCode\":0}"},
	LH_IC_InitType:function(){return "{\"stateCode\":0}"},
	LH_IC_Status:function(){return "{\"stateCode\":"+DEVICE_dev_state+"}"},
	LH_IC_ExitComm:function(){DEVICE=null;return "{\"stateCode\":0}"},
}
/***开发模式定义结束***/

function addListener(event,func){
	eventUtil.addListener(eventFlag,event,func);
}
function removeListener(event,index){
	eventUtil.removeListener(eventFlag,event,index);
}
function fireEvents(event,arg){
	eventUtil.fireEvents(eventFlag,event,arg);
}

/**
 * 支持的事件
 * cardPushed 插卡
 * cardPoped 拔卡
 * cardSwallowed 吞卡
 */
function init(){
	if(dev_mode)DEVICE = DEVICE_dev;
	if(!DEVICE) DEVICE = document.getElementById(DEVICE_ID);
	if(!DEVICE)throw new Error("找不到ocx控件");
	var Baud = DEVICE.LH_IC_InitComm(100);
	logger.log('init : ' + Baud);
	
	var BaudObj = JSON.parse(Baud);
	Handle = BaudObj.icdev;
	if(Handle <= 0){
		throw new Error("找不到ocx控件");
	}
	var Type = DEVICE.LH_IC_InitType(Handle,14);
	var TypeObj = JSON.parse(Type);
	if(TypeObj.stateCode != 0){
		throw new Error("不支持的卡类型");
	}
	return BaudObj.icdev;
}
/**
 * 获取状态
 * @param nHandle
 * @returns
 */
function getStatus(){logger.log('getStatus : ');
	if(null === Handle)init();
	var state  = DEVICE.LH_IC_Status(Handle);
	var stateObj = JSON.parse(state);
	var stateCode = stateObj.stateCode;
	return stateCode;
}
function readCard(type,hisUser){//TODO 根据实际情况获取信息
	type =type||'0';
	logger.log('readCard  : ');
	// 关闭设备
	closeDevice();
	Light.turnOn();
	
	//baseUtil.speak('card_inputMiPass');
	//baseUtil.sleep(6000);
	
	PinLight.blink();
	try{
		//socket请求
		var { data } = socket.SEND('D^'+type+'^'+hisUser+'^');
		//var data = {"resultCode":0,"recMsg":{"knsj":"53012150101195121",state:'1',"grbh":"5011194916","xm":"黄燕芳","xb":"女","csrq":"1976-11-14","sfzh":"532727197611145520","cbsf":"在职","age":"40","ye":"196.00","bz":"本地","dw":"云南外服人力资源有限公司","rqlb":"城镇职工"}};
		
		logger.log('get micard  : '+data);
		PinLight.turnOff();
		var recMsg = data.recMsg||{};
		if( !recMsg.knsj || recMsg.state != '0'){
			var cwxx = recMsg.cwxx;
			if(!cwxx){
				baseUtil.error("医保中心返回错误，建议到窗口处理!"); 
			}else{
				baseUtil.error(cwxx); 
			}
			// baseUtil.error("本机器只支持一代社保卡，请核对您的社保卡是否插反及密码是否正确？"); 
		}
		fireEvents('cardReaded', recMsg);//触发插卡
		return data.recMsg;
	}catch(e){
		baseUtil.error("无法读取社保卡，请检查您的卡片和插卡方式"); 
	}
}
//打开读卡设备并开始监听,监听到卡触发插卡事件、并停止监听
function listenCard(){
	Light.blink();
	logger.log('listenCard : ');
	if(null === Handle)init();
	var status = getStatus();
	if(status == 0){//有卡
		Light.turnOn();
		closeDevice();
		fireEvents('cardPushed');//触发插卡
		// var cardInfo = readCard();//popCard();//
	}else{
		Light.blink();
		startListenLoop();//开始循环
	}
}
function listenAndReadCard(){
	Light.blink();
	logger.log('listenCard : ');
	if(null === Handle)init();
	var status = getStatus();
	if(status == 0){//有卡
		Light.turnOn();
		// fireEvents('cardRead');//触发插卡
		var cardInfo = readCard();//popCard();//
	}else{
		Light.blink();
		startListenAndReadLoop();//开始循环
	}
}

var looping = false;
function stopListenCard(){
	logger.log('stopListenCard');
	looping = false;//停止循环
}

function startListenLoop(){//0 //读卡器中无卡//1 //卡在门口//2 //卡在机内
	logger.log('startListenLoop');
	if(null === Handle)init();
	var old = getStatus();
	function listenCardState(){
		if(!looping)return;//防止时间差带来的错误
		var state = getStatus();
		//logger.log('listenCardState{old:'+old+",state:"+state+"}");
		if(state == 0 && old != 0 ){// 之前无卡，现在有卡，
			// var cardInfo = readCard();
			stopListenCard();//停止循环
			closeDevice();
			fireEvents('cardPushed');//触发插卡
		}else if(state != 0 && old == 0 ){// 之前有卡，现在无卡，触发弹卡
			fireEvents('cardPoped',{cardState:state,oldState:old});
		}else{
			fireEvents('error',{msg:'读取读卡器状态失败,state:'+state});
		}
		old=state;
		if(looping)setTimeout(listenCardState,500);
	}
	looping = true;
	setTimeout(listenCardState,100);  
}
function startListenAndReadLoop(){//0 //读卡器中无卡//1 //卡在门口//2 //卡在机内
	logger.log('startListenLoop');
	if(null === Handle)init();
	var old = getStatus();
	function listenCardState(){
		if(!looping)return;//防止时间差带来的错误
		var state = getStatus();
		//logger.log('listenCardState{old:'+old+",state:"+state+"}");
		if(state == 0 && old != 0 ){// 之前无卡，现在有卡，
			 var cardInfo = readCard();
			stopListenCard();//停止循环
		}else if(state != 0 && old == 0 ){// 之前有卡，现在无卡，触发弹卡
			fireEvents('cardPoped',{cardState:state,oldState:old});
		}else{
			fireEvents('error',{msg:'读取读卡器状态失败,state:'+state});
		}
		old=state;
		if(looping)setTimeout(listenCardState,500);
	}
	looping = true;
	setTimeout(listenCardState,100);  
}
//退卡
function popCard(){
	if(null === Handle)init();
	stopListenCard();//如果有监听，停止循环
	fireEvents('cardPoped');
	DEVICE.LH_IDC_Eject(Handle);
	logger.log('popCard');
}
function closeDevice(){
	Light.turnOff();
	stopListenCard();//停止循环
	if(null !== Handle)DEVICE.LH_IC_ExitComm(Handle);
	Handle=null;
	logger.log('closeDevice');
}

const MCARD={
	listenCard:listenCard,//监听到卡返回卡信息并停止监听
	listenAndReadCard:listenAndReadCard,
	listenCardLeave:startListenLoop,
	stopListenCard : stopListenCard,
	safeClose:closeDevice,
	on:addListener,
	un:removeListener,
	readCard,
}
export default MCARD;
