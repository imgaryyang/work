import eventUtil from './eventUtil.jsx';
import socket from './socket.jsx';
import baseUtil from './baseUtil.jsx';
import lightUtil from './lightUtil.jsx';
import logUtil,{ log } from  "./logUtil.jsx";

const DEVICE_ID="LHSSMDeviceActiveX";
const eventFlag = "miCard";
const dev_mode = baseUtil.dev_mode;
const Light = lightUtil.miCard;
const PinLight = lightUtil.pin;
let DEVICE,Handle=null;
const total = 5;//身份证尝试次数
/***以下是开发模式***/
const emptyF = function(){};
var DEVICE_dev_state = -1;
const DEVICE_dev = {
		LH_YC_FindFirstHIDDevID:function(){return 1},
		LH_YC_OpenPort:function(){return 144},
		LH_YC_DevInit:function(){return 144},
		LH_YC_StartFindIDCard:function(){return JSON.stringify({stateCode:159})},
		LH_YC_SelectIDCard:function(){return JSON.stringify({stateCode:144})},
		LH_YC_Reader_Beep:function(){return JSON.stringify({stateCode:144})},
		LH_YC_ISO14443A_GetCard:function(){return JSON.stringify({stateCode:144})},
		LH_YC_M1_DownloadKeyToReader:function(){return 144},
		LH_YC_M1_Authentication:function(){return 144},
		LH_YC_M1_Read:function(){
			var data = {
					stateCode:144,
					pucDataOut:'0000000000019999'+'0000000000000000'
			}
			return JSON.stringify(data)
		},
		LH_YC_ReadBaseMsg:function(){
			var cardInfo = {"stateCode":144,"Name":"黄志军","Sex":"男","Nation":"汉","Born":"19840816","Address":"江西省新余市分宜县高岚乡岚胜路55号","IDCardNo":"360521198408168016","GrantDept":"分宜县公安局","UserLifeBegin":"20110319","UserLifeEnd":"20310319","IdCardUID":"414CBB0364F27F5D","puiRecvIDLen":8};
			return JSON.stringify(cardInfo)
		},
		LH_YC_IDCARD_ReadUID:function(){
			var cardInfo = {"stateCode":144,"IdCardUID":"414CBB0364F27F5D","puiRecvIDLen":8};
			return JSON.stringify(cardInfo)
		},
		
		LH_YC_Chk_Card:function(){
			var data = {
					stateCode:144,
					nCardType:80
			}
			return JSON.stringify(data)
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
	
	Handle = DEVICE.LH_YC_FindFirstHIDDevID();// 寻找设备
	if(Handle == -1){
		Handle = null;
		throw new Error("查找英辰的HID设备失败");
	}
	console.info('init ',Handle);
	var YC_stateCode = DEVICE.LH_YC_OpenPort(Handle);
	if(YC_stateCode != 144)throw new Error("打开英辰读卡器失败");
	
	var YC_stateCode = DEVICE.LH_YC_DevInit(Handle,0);
	if(YC_stateCode != 144)throw new Error("设备初始化失败");
	
	return Handle;
}
//检测身份证
function checkIdCard(){//TODO 
	if(null === Handle)init();
	var json = DEVICE.LH_YC_StartFindIDCard(Handle);
	// var json = DEVICE.LH_YC_ReadBaseMsg(Handle);
	var obj = JSON.parse(json);
	return  obj;
}
//检测社保卡
function checkMiCard(){//TODO 
	if(null === Handle)init();
	var json = DEVICE.LH_YC_Chk_Card(Handle);
	var obj = JSON.parse(json);
	log('社保-社保卡-checkMiCard',obj);
	return obj;
}

//身份证选卡
function selectIDCard(){
	var json = DEVICE.LH_YC_SelectIDCard(Handle);
	var obj = JSON.parse(json);
	log('社保-身份证-selectIDCard',obj);
	return obj;
}
//身份证读取证/卡固定信息
function readBaseMsg(){
	var json = DEVICE.LH_YC_ReadBaseMsg(Handle);
	var obj = JSON.parse(json);//TODO 
	log('社保-身份证-readBaseMsg',obj);
	if(obj.statecode != 144)obj.msg = '身份证无法识别';
	return obj;
}
function readIdCard(){
	if(null === Handle)init();
	var bseMsg={state:-1};
	for(var i=0;i<total;i++){//循环直到成功，最多尝试5次
		var selectObj = selectIDCard();
		if(selectObj.stateCode == 129){//129重复读取
			continue;
		}
		bseMsg = readBaseMsg();
		if(bseMsg.stateCode == 65){//65 重复读取
			continue;
		}
		break;
	}
	log('社保-身份证-readCard',bseMsg);
	return bseMsg;
}
//检测所有外设
function checkCard(){
	var idInfo = checkIdCard();
	var idState = idInfo.stateCode;
	log('社保-身份证-checkIdCard',idInfo);
	if(idState == 159){
		var idCardInfo = readIdCard();//如果社保卡的凭证时身份证，则读取身份证信息
		return {...idCardInfo,state:0,medium:'idCard'};
	}
	
	var miInfo = checkMiCard();
	var miState = miInfo.stateCode;
	var nCardType = miInfo.nCardType;
	if(miState == 144){//0x90=144
		DEVICE.LH_YC_Reader_Beep(Handle,30);
		if(nCardType == 80){//#define CARD_TYPE_CPU 80
			return {state:0,medium:'miCard'};
		}
	}
//	if(miState == 32796){//32976=0x801c(16进制)
//		log('社保-社保卡-checkMiCard',"无法识别的接触卡类型/无卡");
//		return {state:32796,medium:'miCard'};
//	}
	return {state:-1};
}

function readCard(cardInfo,hisUser){//TODO 根据实际情况获取信息
	// 关闭设备
	closeDevice();
	Light.turnOn();
	// PinLight.blink();
	try{
		//socket请求
		var data;
		if(dev_mode){
			data  = {"resultCode":0,"recMsg":{"state": "0","knsj": "01^03^180218154787484181153","grbh": "40925053","xm": "红志军","xb": "男","csrq": "1940/1/1 00:00:00","sfzh": "230604194001017357","cbsf": "","age": "77","ye": "4464.65","bz": "","dw": "第一采油厂第二油矿","rqlb": "","dwdm": "YB0Z","cwxx": ""}};
		}else{
			//1交易码 2医保类型3是否是身份证 4社保卡类型 5社保卡密码	6操作员	7是否是自助机
			var {type,medium,password,miCardType } = cardInfo;
			type = type||'0';
			var isId =( medium == 'idCard' )?'1':'0';
			var req = 'D|'+type+'|'+isId+'|'+miCardType+'|'+password+'|'+hisUser+'|'+1+'|';
			data = socket.SEND(req).data;
		}
		log('mi-micard  : ',data);
		//PinLight.turnOff();
		var recMsg = data.recMsg||{};
		if( !recMsg.knsj || recMsg.state != '0'){
			var cwxx = recMsg.cwxx;
			if(!cwxx){
				baseUtil.error("医保中心返回错误，建议到窗口处理!"); 
			}else{
				baseUtil.error(cwxx); 
			}
			return;
			// baseUtil.error("本机器只支持一代社保卡，请核对您的社保卡是否插反及密码是否正确？"); 
		}
		return data.recMsg;
	}catch(e){
		baseUtil.error("无法读取社保卡，请检查您的卡片和插卡方式"); 
	}
}
//打开读卡设备并开始监听,监听到卡触发插卡事件、并停止监听
function listenCard(callback){
	Light.blink();
	if(null === Handle)init();
	var result = checkCard();
	if(result.state == 0 || result.state == 32796){//有卡
		Light.turnOn();
		closeDevice();
		if(callback)callback(result);
	}else {
		Light.blink();
		baseUtil.speak('card_putIdCardOrMiCard');// 播放语音：请插入您的医保卡
		startListenLoop(callback);//开始循环
	}
}
var looping = false;
function stopListenCard(){
	looping = false;//停止循环
}

function startListenLoop(callback){//0 //读卡器中无卡//1 //卡在门口//2 //卡在机内
	if(null === Handle)init();
	var oldResult = checkCard();
	var old = oldResult.state;
	function listenCardState(){
		if(!looping)return;//防止时间差带来的错误
		var now = checkCard();
		var state = now.state;
		//log('listenCardState{old:'+old+",state:"+state+"}");
		if(state == 0 && old != 0 ){// 之前无卡，现在有卡，
			// var cardInfo = readCard();
			stopListenCard();//停止循环
			closeDevice();
			if(callback)callback(now);//触发插卡
		}else if(state != 0 && old == 0 ){// 之前有卡，现在无卡，触发弹卡
			fireEvents('cardPoped',{cardState:state,oldState:old});
		}
//		else{
//			fireEvents('error',{msg:'读取读卡器状态失败,state:'+state});
//			baseUtil.error('读取读卡器状态失败');
//		}
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
}
function closeDevice(){
	Light.turnOff();
	stopListenCard();//停止循环
	if(null !== Handle)DEVICE.LH_YC_ClosePort(Handle);
	Handle=null;
	log('mi-closeDevice');
}

const MCARD={
	listenCard:listenCard,//监听到卡返回卡信息并停止监听
	listenCardLeave:startListenLoop,
	stopListenCard : stopListenCard,
	safeClose:closeDevice,
	on:addListener,
	un:removeListener,
	readCard,
}
module.exports = MCARD;
