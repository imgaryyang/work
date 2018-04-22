import eventUtil from './eventUtil.jsx';
import baseUtil from './baseUtil.jsx';
import lightUtil from './lightUtil.jsx';
import logUtil,{ log } from  "./logUtil.jsx";

const Light = lightUtil.medicalCard;
const DEVICE_ID = "LHSSMDeviceActiveX";
const secretKey = "A1B2C3D4E5F6";//龙南医院的M1卡生产密钥
const eventFlag = "medicalCard";
const dev_mode = baseUtil.dev_mode;

var DEVICE,DEVICE_Handle = null;
var timeRate = 300;//读取速率

/***以下是开发模式***/
const emptyF = function(){};
var DEVICE_dev_state = 0;
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
					// pucDataOut:'0000000000019999'+'0000000000000000',
					// pucDataOut:'5301011010000105'+'0000000000000000',
//					pucDataOut:'0000000031933311'+'0000000000000000',
//					pucDataOut:'0000001170412460'+'0000000000000000',
//					pucDataOut:'0000000323907955'+'0000000000000000',//患者
					pucDataOut:'0000000197517067'+'0000000000000000',//运维人员
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
		LH_YC_ClosePort:function(){},
}
/***开发模式定义结束***/

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
	console.info('init ',DEVICE_Handle);
	var YC_stateCode = DEVICE.LH_YC_OpenPort(DEVICE_Handle);
	if(YC_stateCode != 144)throw new Error("打开英辰读卡器失败");
	
	var YC_stateCode = DEVICE.LH_YC_DevInit(DEVICE_Handle,0);
	if(YC_stateCode != 144)throw new Error("设备初始化失败");
	
	return DEVICE_Handle;
}
function beep(){
	try{
		DEVICE.LH_YC_Reader_Beep(DEVICE_Handle,30);
	}catch(e){
		
	}
}
//非接M1寻卡
function findCard(){  
	if(null === DEVICE_Handle)init();
	var json = DEVICE.LH_YC_ISO14443A_GetCard(DEVICE_Handle,0);
	var obj = JSON.parse(json);
	var YC_stateCode = obj.stateCode;
	log('就诊卡-findCard',YC_stateCode);
	return YC_stateCode;
	//if(YC_stateCode == 144)return true;//有卡
	//return false;//无卡
}

//下载密码到读卡器
function downloadKey(){
	var YC_stateCode = DEVICE.LH_YC_M1_DownloadKeyToReader(DEVICE_Handle,0,secretKey);
	log('就诊卡-downloadKey',YC_stateCode);
	if(YC_stateCode != 144)throw new Error("下载密码到读卡器失败");
}

//非接M1认证扇区密钥
function authentication(){
	var YC_stateCode = DEVICE.LH_YC_M1_Authentication(DEVICE_Handle,0,6,secretKey);
	log('就诊卡-downloadKey',authentication);
	if(YC_stateCode != 144)throw new Error("非接M1认证扇区密钥失败");
}

//非接M1读数据
function readCardNo(){
	var BlockData;
	var json = DEVICE.LH_YC_M1_Read(DEVICE_Handle,4);
	log('就诊卡-readCardNo',json);
	var obj = JSON.parse(json);
	var YC_stateCode = obj.stateCode;
	if(YC_stateCode != 144){
		baseUtil.error("非接M1认证扇区密钥失败");
		throw new Error("非接M1认证扇区密钥失败");
	}
	var pucDataOut = obj.pucDataOut; 
	if(!pucDataOut){
		baseUtil.error("无效的卡片");
		throw new Error("就诊卡无卡内数据");
	}
	if(pucDataOut.length != 32){
		baseUtil.error("卡号长度不正确");
		throw new Error("就诊卡卡内数据长度异常");
	}
	var cardNo  = pucDataOut.substr(0,16) 
	return cardNo
}
function readCard(){
	if(null === DEVICE_Handle)init();
	// findCard();//寻卡
	downloadKey();//下载秘钥
	authentication();//认证
	var cardNo = readCardNo();
	return {cardNo:cardNo};
}
/**
 * 打开读卡设备并开始监听,监听到卡触发插卡事件、并停止监听
 */
var stopFlag = true;
function listenCard(){
	log('开启就诊卡监听');
	if(null === DEVICE_Handle)init();
	Light.blink();//灯闪烁
	var old = 0;//默认无卡
	stopFlag = false;
	function loop(){
		var now = findCard();//寻卡
		console.info(old,now);
		if(old!=144 && now == 144 ){
			try {
				var cardInfo = readCard();
				fireEvents('cardPushed',cardInfo);
				Light.turnOn();	
			} catch (e) {
				log('读卡错误',e);
				baseUtil.speak('card_wrongMedicalCard');
				closeDevice();
			}
		}else{
			if(!stopFlag)setTimeout(loop,300);
		}
	}
	loop();
}
function stopListenCard(){
	log('就诊卡-关闭就诊卡监听');
	Light.turnOff();//灯闪烁
	stopFlag = true;
}
var stayCount = 0;
function closeDevice(){
	Light.turnOff();
	stopListenCard();
	// if(null !== DEVICE_Handle)DEVICE.LH_YC_ClosePort(DEVICE_Handle);//TODO
	DEVICE_Handle=null;
	log('就诊卡 closeDevice');
}
function close(){
	closeDevice();
}
const MCARD={
	listenCard:listenCard,//监听到卡返回卡信息并停止监听
	safeClose:closeDevice,
	close:close,//完全关闭
	// open:openCard,
	findCard,
	readCard,
	on:addListener,
	un:removeListener,
}
module.exports = MCARD;
