import moment from 'moment';
import eventUtil from './eventUtil.jsx';
import baseUtil from './baseUtil.jsx';
import logUtil,{ log } from  "./logUtil.jsx";

const DEVICE_ID = "LHSSMDeviceActiveX";
const secretKey="FFFFFFFFFFFFFFFF";
const eventFlag = "idCard";
const dev_mode = baseUtil.dev_mode;
const total = 5;//身份证尝试次数
let DEVICE,DEVICE_Handle=null;

/***以下是开发模式***/
const emptyF = function(){};
var DEVICE_dev_state = -6;
const DEVICE_dev = {
		LH_YC_FindFirstHIDDevID:function(){return 1},
		LH_YC_OpenPort:function(){return 144},
		LH_YC_DevInit:function(){return 144},
		LH_YC_StartFindIDCard:function(){return JSON.stringify({stateCode:159})},
		LH_YC_SelectIDCard:function(){return JSON.stringify({stateCode:144})},
		LH_YC_Reader_Beep:function(){return JSON.stringify({stateCode:144})},
		LH_YC_ReadBaseMsg:function(){
			var cardInfo = {"stateCode":144,"Name":"红志军","Sex":"男","Nation":"汉","Born":"19400101","Address":"黑龙江省大庆市让胡路区牛逼公社","IDCardNo":"230604194001017357","GrantDept":"分宜县公安局","UserLifeBegin":"20110319","UserLifeEnd":"20310319","IdCardUID":"414CBB0364F27F5D","puiRecvIDLen":8};
			return JSON.stringify(cardInfo)
		},
		LH_YC_IDCARD_ReadUID:function(){
			var cardInfo = {"stateCode":144,"IdCardUID":"414CBB0364F27F5D","puiRecvIDLen":8};
			return JSON.stringify(cardInfo)
		},
		LH_YC_ClosePort:function(){},
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

function init(){
	if(dev_mode)DEVICE = DEVICE_dev;
	if(!DEVICE) DEVICE = document.getElementById(DEVICE_ID);
	if(!DEVICE)throw new Error("找不到ocx控件");
	
	DEVICE_Handle = DEVICE.LH_YC_FindFirstHIDDevID();// 寻找设备
	if(DEVICE_Handle == -1){
		DEVICE_Handle = null;
		throw new Error("查找英辰的HID设备失败");
	}
	
	var YC_stateCode = DEVICE.LH_YC_OpenPort(DEVICE_Handle);
	if(YC_stateCode != 144)throw new Error("打开英辰读卡器失败");
	
	var YC_stateCode = DEVICE.LH_YC_DevInit(DEVICE_Handle,0);
	if(YC_stateCode != 144)throw new Error("设备初始化失败");
	log('身份证-init',DEVICE_Handle);
	return DEVICE_Handle;
}

//开始寻找身份证卡
function findIdCard(){
	if(null === DEVICE_Handle)init();
	var json = DEVICE.LH_YC_StartFindIDCard(DEVICE_Handle);
	var obj = JSON.parse(json);
	var YC_stateCode = obj.stateCode;
	log('身份证-findIdCard',YC_stateCode);
	if(YC_stateCode == 159)return true;
	return false;
}

//身份证选卡
function selectIDCard(){
	var json = DEVICE.LH_YC_SelectIDCard(DEVICE_Handle);
	var obj = JSON.parse(json);
	log('身份证-selectIDCard',obj);
	return obj;
}
//身份证读取证/卡固定信息
function readBaseMsg(){
	var json = DEVICE.LH_YC_ReadBaseMsg(DEVICE_Handle);
	var obj = JSON.parse(json);//TODO 
	log('身份证-readBaseMsg',obj);
	if(obj.statecode != 144)obj.msg = '身份证无法识别';
	return obj;
}
//读取身份证序列号
function readUID(){
	var json = DEVICE.LH_YC_IDCARD_ReadUID(DEVICE_Handle);
	var obj = JSON.parse(json);//TODO 
	log('身份证-readUID',obj);
	return obj;
}
/**
 * 获取状态
 */
function readCard(){//TODO 
	try{
		if(null === DEVICE_Handle)init();
	}catch(e){
		return {state:-1,msg:'初始化读卡器失败'};
	}
	var bseMsg={state:-1};
	var uidMsg={state:-1};
	
	for(var i=0;i<total;i++){//循环直到成功，最多尝试5次
		
		var selectObj = selectIDCard();
		if(selectObj.stateCode == 129){//129重复读取
			continue;
		}
		
		bseMsg = readBaseMsg();
		if(bseMsg.stateCode == 65){//65 重复读取
			continue;
		}else{
			// var uidMsg = readUID();
			break;
		}
	}
	var cardInfo = {...bseMsg};//,...uidMsg
	log('身份证-readCard',cardInfo);
	// var cardInfo = {"stateCode":144,"Name":"黄志军","Sex":"男","Nation":"汉","Born":"19840816","Address":"江西省新余市分宜县高岚乡岚胜路55号","IDCardNo":"360521198408168016","GrantDept":"分宜县公安局","UserLifeBegin":"20110319","UserLifeEnd":"20310319","IdCardUID":"414CBB0364F27F5D","puiRecvIDLen":8};
	return cardInfo;
}


var readLoopFlag = false;
function readLoop(cb){
	var has = false;
	try{
		has = findIdCard();
	}catch(e){
		cb({state:-1,msg:'初始化读卡器失败'});
		return;
	}
	if(!has){
		if(readLoopFlag)setTimeout(()=>{
			readLoop(cb);
		},200)
	}else{
		var cardInfo = readCard();
		cb(cardInfo);
	}
}
//打开读卡设备并开始监听,监听到卡触发插卡事件、并停止监听
function listenCard(cb){
	readLoopFlag = true;
	readLoop(cb);
}
function stopListenCard(){
	log('身份证-stopListenCard');
	readLoopFlag = false;
	closeDevice();
}

function closeDevice(){
	if(null === DEVICE_Handle)init();
	DEVICE.LH_YC_ClosePort(DEVICE_Handle);
	DEVICE_Handle = null;
}

const idCard={
	listenCard:listenCard,//监听到卡返回卡信息并停止监听
	init:init,
	on:addListener,
	close:stopListenCard,
	un:removeListener,
}
module.exports = idCard;