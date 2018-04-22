import eventUtil from './eventUtil';
import baseUtil from './baseUtil';
const logger = baseUtil.getLogger('miCardUtil'); 
const DEVICE_ID="all_device",
	secretKey="A0A1A2A3A4A5",
	eventFlag = "miCard",
	dev_mode = true;
let DEVICE,DEVICE_Handle=null;

/***以下是开发模式***/
const emptyF = function(){};
var DEVICE_dev_state = 0;
const DEVICE_dev = {
		LH_IDC_OpenDevice:function(){
			setTimeout(()=>{DEVICE_dev_state = 2 },2*1000); 
			setTimeout(()=>{DEVICE_dev_state = 0 },15*1000); //15s后拔卡
			return "{\"nHandle\":0}"
		},
		LH_IDC_GetStatus:function(){ return "{\"stateCode\":\""+DEVICE_dev_state+"\",\"nHandle\":\"100\"}"},//口内
		LH_IDC_M1Detect:emptyF,//寻卡
		LH_IDC_M1LoadSecKey:emptyF,//校验密钥
		//LH_IDC_M1ReadBlock:function(){return "{\"stateCode\":0,\"blockData\":\"6666777788889999AAAABBBBCCCC0001\"}"},
		LH_IDC_M1ReadBlock:function(){return "{\"stateCode\":0,\"idNo\":\"530102199403221709\",\"name\":\"温雨婷\"}"},
		LH_IDC_Accept:emptyF,//允许进卡
		LH_IDC_Eject:emptyF,
		LH_IDC_CloseDevice:function(){DEVICE_dev_state = 0},
		LH_IDC_Capture:emptyF,
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
	if(dev_mode){
		DEVICE = DEVICE_dev;
	}
	if(!DEVICE) DEVICE = document.getElementById(DEVICE_ID);
	if(!DEVICE){
		throw new Error("找不到ocx控件");
	}
	var json = DEVICE.LH_IDC_OpenDevice("COM4:9600:E:8:1", 2);
	logger.log('init : ' + json);
	var obj = JSON.parse(json);
	DEVICE_Handle = obj.nHandle;
	return obj.nHandle;
}
/**
 * 获取状态
 * @param nHandle
 * @returns
 */
function getStatus(){logger.log('getStatus : ');
	if(null === DEVICE_Handle)init();
	var json = DEVICE.LH_IDC_GetStatus(DEVICE_Handle);
//	logger.log('getStatus : ' + json);
	var obj = JSON.parse(json);
	//if(obj.stateCode != 0 && obj.stateCode != 1 && obj.stateCode != 2)
	//throw new Error("读取诊疗卡状态出错，状态码出错,code = "+ obj.stateCode);
	return obj.stateCode;
}
function readCard(){//TODO 根据实际情况获取信息
	if(null === DEVICE_Handle)init();
	DEVICE.LH_IDC_M1Detect(DEVICE_Handle);//寻卡
	DEVICE.LH_IDC_M1LoadSecKey(DEVICE_Handle,0,0,secretKey);//校验密钥
	//var wirte = DEVICE.LH_IDC_M1WriteBlock(DEVICE_Handle,0,1,"6666777788889999AAAABBBBCCCC0001",32);
	var json = DEVICE.LH_IDC_M1ReadBlock(DEVICE_Handle, 0, 1);
	logger.log('readCard : ' + json);
	var obj = JSON.parse(json);
	if(obj.stateCode != 0)throw new Error("读取诊疗卡数据出错，状态码 :"+ obj.stateCode);
	return {cardNo:obj.blockData};
}
//打开读卡设备并开始监听,监听到卡触发插卡事件、并停止监听
function listenCard(){
	logger.log('listenCard : ');
	if(null === DEVICE_Handle)init();
	var status = getStatus();
	if(status == 2){//卡在内部 popCard(nHandle);
		var cardInfo = readCard();//popCard();//
		fireEvents('cardPushed',cardInfo);//触发插卡
	}else{
		DEVICE.LH_IDC_Accept(DEVICE_Handle, 2);//允许进卡
		startListenLoop();//开始循环
	}
}
var looping = false;
function stopListenCard(){
	logger.log('stopListenCard');
	looping = false;//停止循环
}

function startListenLoop(){//0 //读卡器中无卡//1 //卡在门口//2 //卡在机内
	logger.log('startListenLoop');
	if(null === DEVICE_Handle)init();
	var old = getStatus();
	if(old == 2 ){//之前插入
		//fireEvents('cardExist',{cardState:state});
	}
	function listenCardState(){
		if(!looping)return;//防止时间差带来的错误
		var state = getStatus();
		//logger.log('listenCardState{old:'+old+",state:"+state+"}");
		if(state == 2 && old != 2 ){// 之前无卡，现在有卡，
			var cardInfo = readCard();
			stopListenCard();//停止循环
			fireEvents('cardPushed',cardInfo);//触发插卡
		}else if(state != 2 && old == 2 ){// 之前有卡，现在无卡，触发弹卡
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
	if(null === DEVICE_Handle)init();
	stopListenCard();//如果有监听，停止循环
	fireEvents('cardPoped');
	DEVICE.LH_IDC_Eject(DEVICE_Handle);
	logger.log('popCard');
}
function closeDevice(){
	stopListenCard();//停止循环
	if(null !== DEVICE_Handle)DEVICE.LH_IDC_CloseDevice(DEVICE_Handle);
	DEVICE_Handle=null;
	logger.log('closeDevice');
}

const MCARD={
	listenCard:listenCard,//监听到卡返回卡信息并停止监听
	listenCardLeave:startListenLoop,
	stopListenCard : stopListenCard,
	safeClose:closeDevice,
	on:addListener,
	un:removeListener,
}
export default MCARD;
