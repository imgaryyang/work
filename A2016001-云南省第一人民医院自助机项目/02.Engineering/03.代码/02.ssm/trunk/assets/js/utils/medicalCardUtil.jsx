import eventUtil from './eventUtil.jsx';
import baseUtil from './baseUtil.jsx';
import lightUtil from './lightUtil.jsx';
import logUtil,{ log } from  "./logUtil.jsx";

const Light = lightUtil.medicalCard;
const DEVICE_ID="LHSSMDeviceActiveX",
	secretKey="636265822144" /*"ffffffffffff"*/,
	eventFlag = "medicalCard",
	dev_mode = baseUtil.dev_mode;;
var DEVICE,DEVICE_Handle=null;
var timeRate = 300;//读取速率
var timeOut = 2*60*1000;//超时吞卡

/***以下是开发模式***/
const emptyF = function(){};
var DEVICE_dev_state = 0;
const DEVICE_dev = {
		LH_IDC_OpenDevice:function(){setTimeout(()=>{DEVICE_dev_state = 2 },5*1000); return "{\"stateCode\":0,\"nHandle\":0}"},
		LH_IDC_GetStatus:function(){ return "{\"stateCode\":\""+DEVICE_dev_state+"\",\"nHandle\":\"200\"}"},//口内
		LH_IDC_M1Detect:emptyF,//寻卡
		LH_IDC_M1LoadSecKey:emptyF,//校验密钥
		LH_IDC_M1ReadBlock:function(h,s,b){
			var d = "";
			if(s==1){
				if(b==0){d= "5301";
				}else if(b==1){	d= "01";
				}else if(b==2){d= "101";
				}
			}else if(s==2){
				if(b==0){
					d = '000008144';
					d = '000060964';
					d = '000005393';
					d = '000003004';
					d = '000365420';
					d = '100000461';
					d = '000014501';
					//d = '000008056';
				}else if(b==1){d= "1";
				}else if(b==2){d= "0";
				}
			}
			return "{\"stateCode\":0,\"idNo\": \"421022197901131833\", \"name\": \"黄勇\",\"cardNo\":\""+d+"\"}"
		},
		LH_IDC_Accept:emptyF,//允许进卡
		LH_IDC_Eject:function(){DEVICE_dev_state = 0},
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
	if(dev_mode)DEVICE = DEVICE_dev;
	if(!DEVICE) DEVICE = document.getElementById(DEVICE_ID);
	if(!DEVICE)throw new Error("找不到ocx控件");
	
	var json = DEVICE.LH_IDC_OpenDevice("COM6:9600:E:8:1",2);
	var obj = JSON.parse(json);
	if(obj.stateCode != 0 )throw new Error("就诊卡器初始化失败");
	DEVICE_Handle = obj.nHandle;
	return obj.nHandle;
}
/**
 * 获取状态
 * @param nHandle
 * @returns
 */
function getStatus(){
	if(null === DEVICE_Handle)init();
	var json = DEVICE.LH_IDC_GetStatus(DEVICE_Handle);
	var obj = JSON.parse(json);
	return obj.stateCode;
}
function readCard(){
	if(null === DEVICE_Handle)init();
	DEVICE.LH_IDC_M1Detect(DEVICE_Handle);//寻卡
	var cardNo = readCardNo();
	return {cardNo:cardNo};
}
function readBlock(section,block){
	DEVICE.LH_IDC_M1LoadSecKey(DEVICE_Handle,section,block,secretKey);
	var json = DEVICE.LH_IDC_M1ReadBlock(DEVICE_Handle,section,block);
	var obj = JSON.parse(json);
	if(obj.stateCode != 0)throw new Error("读取诊疗卡数据出错，状态码 :"+ obj.stateCode);
	return obj.cardNo;
}
function readCardNo(){
	var cardNo1 = readBlock(1,0);//省市编码：第1扇区第1块(块编码为0)
	var cardNo2 = readBlock(1,1);//区县编码：第1扇区第2块(块编码为1)
	var cardNo3 = readBlock(1,2);//医疗机构类别：第1扇区第3块(块编码为3)
	var cardNo4 = readBlock(2,0);//顺序号：第2扇区第1块(块编码为0)
	var cardNo5 = readBlock(2,1);//校验码：第2扇区第2块(块编码为1)
	var cardNo6 = readBlock(2,2);//重复建卡标识：第2扇区第3块(块编码为2)
	log('就诊卡-省市编码:'+cardNo1);
	log('就诊卡-区县编码 :'+cardNo2);
	log('就诊卡-医疗机构类别 : '+cardNo3);
	log('就诊卡-顺序号 : '+cardNo4);
	log('就诊卡-校验码:'+cardNo5);
	log('就诊卡-重复建卡标识:'+cardNo6);
	return cardNo1+cardNo2+cardNo3+cardNo4+cardNo5+cardNo6;
}
/**
 * 打开读卡设备并开始监听,监听到卡触发插卡事件、并停止监听
 */
function listenCard(){
	log('开启就诊卡监听');
	if(null === DEVICE_Handle)init();
	var json = DEVICE.LH_IDC_Accept(DEVICE_Handle, 2);//允许进卡
	Light.blink();//灯闪烁
	var old = 0;//默认无卡
	function loop(){
		var now = getStatus();
		onChange(old,now);
		old = now;
		setTimeout(loop,300);
	}
	loop();
}
var stayCount = 0;
function onChange(old,now){//0.读卡器中无卡 1.卡在门口 2.卡在机内
	if( old == 0){
		if(now == 0){//未插入
			stayCount = 0;
		}else if(now == 1){//半插入
			//Light.blink();	
		}else if(now == 2){//插入
			stayCount = 0;
			try {
				var cardInfo = readCard();
				fireEvents('cardPushed',cardInfo);
				Light.turnOn();	
			} catch (e) {
				baseUtil.speak('card_wrongMedicalCard');
				safePopCard();
			}
		}
	}else if( old == 1){
		if(now == 0){//取走
			DEVICE.LH_IDC_Accept(DEVICE_Handle, 2);//允许进卡
			stayCount=0;
			Light.blink();	
		}else if(now == 1){//停留在卡口
			stayCount++;
			if( stayCount*timeRate >= timeOut){//超时，吞卡
				DEVICE.LH_IDC_Capture(DEVICE_Handle)//吞卡
				stayCount = 0;
			}
		}else if(now == 2){//插入
			stayCount = 0;
			try {
				var cardInfo = readCard();
				fireEvents('cardPushed',cardInfo);
				Light.turnOn();	
			} catch (e) {
				safePopCard();
			}
		}
	}else if( old == 2){
		if(now == 0){//取走
			DEVICE.LH_IDC_Accept(DEVICE_Handle, 2);//允许进卡
			stayCount=0;
			Light.blink();	
		}else if(now == 1){//弹出未取走
			Light.blink(); 
		}else if(now == 2){//一直插入中
			
		}
	}
}
//退卡
function popCard(){
	if(null === DEVICE_Handle)init();
	var now = getStatus();
	if(now == 2 ){
		//Light.blink();	
		DEVICE.LH_IDC_Eject(DEVICE_Handle);
	}else{
		//Light.blink();	
	}
	log('就诊卡 popCard');
}
function closeDevice(){
	Light.turnOff();
	if(null !== DEVICE_Handle)DEVICE.LH_IDC_CloseDevice(DEVICE_Handle);
	DEVICE_Handle=null;
	log('就诊卡 closeDevice');
}
function openCard(){
	var json = DEVICE.LH_IDC_Accept(DEVICE_Handle, 2);//允许进卡
	var now = getStatus();
	if(now !=2 ){
		Light.blink();	
	}
}
//安全退卡
function safePopCard(time){
	 popCard();
	// var json = DEVICE.LH_IDC_Accept(DEVICE_Handle, 2);//允许进卡
}
function close(){
	popCard();
	closeDevice();
}
const MCARD={
	listenCard:listenCard,//监听到卡返回卡信息并停止监听
	safeClose:safePopCard,
	close:close,//完全关闭
	open:openCard,
	on:addListener,
	un:removeListener,
}
module.exports = MCARD;
