import eventUtil from './eventUtil.jsx';
import baseUtil from './baseUtil.jsx';
import lightUtil from './lightUtil.jsx';
import logUtil,{ log } from  "./logUtil.jsx";

const Light = lightUtil.cash;
const DEVICE_ID = "LHSSMDeviceActiveX";
const eventFlag = "cashBox";
const dev_mode  = baseUtil.dev_mode;;
const DENOMINATIONS = 120 ;//面额

const BILL_STATUS_IDLING 		           =900 //空闲状态,可以进行投币
const BILL_STATUS_ACCEPT 		           =901 //正在进纸币状态
const BILL_STATUS_RETURNING  	           =902 //正在退币状态
const BILL_STATUS_RETURN  		           =903 //退币结束状态

const BILL_STATUS_DISABLE  		       =930 //禁止投币状态，需要执行允许投币ZT_BILL_EnableBill()才能接收纸币
const BILL_STATUS_NEED_RESET 	           =931 //识币器需要重新复位，才能正常

const BILL_STATUS_JAM 			           =950 //卡纸
const BILL_STATUS_BOX_FULL  	           =951 //仓满  钱箱满
const BILL_STATUS_MECHANICAL_FAILURE 	   =952 //机械故障 状态CASHCODE 47
const BILL_STATUS_FRAUDMONEY 	           =953 //发现钓鱼(将投入的币强行拉出) 状态45
const BILL_STATUS_BOX_LEAVE 		       =954 //钱箱离位
const BILL_STATUS_BOX_REPLACING 		   =955 //钱箱复位
const BILL_STATUS_MUST_TAKE_MONEY 		   =956 //必须从钱箱将钱取出，然后才能再次投币

const ERR_NO_ERROR = 0; //成功

const ERR_CANT_OPEN_PORT =        -1; //串口被用
const ERR_TIMEOUT        =        -2; //超时
const ERR_SENDERROR      =        -3; //发送失败
const ERR_READERROR      =        -4; //接收失败
const ERR_PARAERROR      =        -5; //参数错误
const ERR_POWEROFF       =        -6; //掉电
const ERR_LINEOFF        =        -7; //拔掉串口线
const ERR_RevInfo        =        -8; //接收数据错误
const ERR_UNKNOW_ERROR   =        -9; //未知错误

const ERR_EXCEPTION = -99;//不知道

const ERR_SENDBUF = 99999999;//不知道
const ERR_CANCELED = 99999999;//不知道
const BILL_STATUS_RESUME = 99999999;//不知道
const BILL_STATUS_904 = 904;//不知道

var COUNT_ERR_TIMEOUT = 0;
/***以下是开发模式***/
let denominations,bill_state = 900;
function LH_BILL_OpenDevice(pstrCom, nFage){
	setTimeout(()=>{
		bill_state = 2;
	},1000);
	return JSON.stringify({stateCode:0,nHandle:'cash'});
}
function LH_BILL_Reset(nHandle){
	return JSON.stringify({stateCode:0});
}
function LH_BILL_GetStatus(nHandle){
	return JSON.stringify({stateCode:BILL_STATUS_IDLING});
}
function LH_BILL_SetDenominations(nHandle, nEnabledDenominations){
	return JSON.stringify({stateCode:0});
}
function LH_BILL_EnableBill(nHandle){
	return JSON.stringify({stateCode:0});
}
function LH_BILL_SetMainInfo(szData){
	return JSON.stringify({stateCode:0});
}
function LH_BILL_PollBill(nHandle){
	log('cashbox-bill_state',bill_state);
	var ret = JSON.stringify({stateCode:bill_state});
	if(bill_state != 900){
		bill_state = 900;
		setTimeout(()=>{
			bill_state = 2;
		},5000);
	}
	return ret;
}
function LH_BILL_StackedBill(nHandle){
	return JSON.stringify({stateCode:0});
}
function LH_BILL_IsBusy(nHandle){
	return JSON.stringify({stateCode:0});
}
function LH_BILL_DisableBill(nHandle){
	return JSON.stringify({stateCode:0});
}
function LH_BILL_CloseDevice(nHandle){
	bill_state =0;
	return JSON.stringify({stateCode:0});
}

const DEVICE_dev = {
  LH_BILL_OpenDevice,
  LH_BILL_Reset,
  LH_BILL_GetStatus,
  LH_BILL_SetDenominations,
  LH_BILL_EnableBill,
  LH_BILL_SetMainInfo,
  LH_BILL_PollBill,
  LH_BILL_StackedBill,
  LH_BILL_IsBusy,
  LH_BILL_DisableBill,
  LH_BILL_CloseDevice,
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





let DEVICE,DEVICE_Handle=null,INIT_STATE_COUNT = 0;
/**
 * 初始化
 */
function init(){
	DEVICE = null;DEVICE_Handle=null;INIT_STATE_COUNT = 0;
	if(dev_mode)DEVICE = DEVICE_dev;
	if(!DEVICE) DEVICE = document.getElementById(DEVICE_ID);
	if(!DEVICE) throw new Error("找不到ocx控件");
	
	//1 打开设备
	var openJson,openObj,openState;
	try{
		openJson = DEVICE.LH_BILL_OpenDevice("COM4:9600:E:8:1", 0);
		log('cashbox-打开纸币器' + openJson);
		var openObj = JSON.parse(openJson);
		openState = openObj.stateCode;
		DEVICE_Handle = openObj.nHandle;
	}catch(e){
		throw new Error("打开纸币器失败");
	}
	if(openState != 0 )throw new Error("打开纸币器失败");
	
	//2 设备复位
	var resetJson,resetObj,resetState;
	try{
		resetJson = DEVICE.LH_BILL_Reset(DEVICE_Handle);
		log('cashbox-设备复位 : ' + resetJson);
		resetObj = JSON.parse(resetJson);
		resetState = resetObj.stateCode;
	}catch(e){
		throw new Error("设备复位失败");
	}
	if(resetState != 0 )throw new Error("设备复位失败");
	
	
	//3 设置投币类型
	var denJson,denObj,denState;
	try{
		denJson = DEVICE.LH_BILL_SetDenominations(DEVICE_Handle,DENOMINATIONS);
		log('cashbox-设置纸币面额 : ' + denJson);
		denObj = JSON.parse(denJson);
		denState = denObj.stateCode;
	}catch(e){
		throw new Error("设置纸币面额失败");
	}
	if(denState != 0 )throw new Error("设置纸币面额失败");
}
/**
 * 获取状态
 */
function getStatus(){
	if(null === DEVICE_Handle)init();
	try{
		var stateJson = DEVICE.LH_BILL_GetStatus(DEVICE_Handle);
		log('cashbox-纸币器状态 : ' + stateJson);
		var obj = JSON.parse(stateJson);
		return obj.stateCode;
	}catch(e){
		return ERR_EXCEPTION;
	}
}
/**
 * 设置日志基本信息
 */
function setMainInfo(){//TODO ocx有问题
	if(null === DEVICE_Handle)init();
	try{
		var json = DEVICE.LH_BILL_SetMainInfo("13988888888");//TODO 设置重要信息用于记录日志
		log('cashbox-设置日志基本信息 : ' + json);
		var obj = JSON.parse(json);
		if(obj.stateCode != 0 )throw new Error("设置日志基本信息失败");
	}catch(e){
		console.info(e);
		throw new Error("设置日志基本信息失败");
	}
}
/**
 * 预备动作，前三次循环获取状态，出问题时抛出异常
 */
function prepare(callback,error){ 
	log('cashbox-prepare ' );
	if(null === DEVICE_Handle)init();
	var stateCode = getStatus();
	if(INIT_STATE_COUNT == 3 ){//TODO 有问题
		if(stateCode == BILL_STATUS_IDLING || stateCode==BILL_STATUS_DISABLE){
			log('cashbox-纸币前三次 状态正确: ' + stateCode);
			// setMainInfo();//设置日志信息，异常跳出，不会开启循环
			if(callback)callback();
		}else{
			if(error)error(stateCode);
			else throw new Error("识币器状态异常 不可以循环投币");
		}
	}else{
		INIT_STATE_COUNT++;
		setTimeout(()=>{
			prepare(callback,error)
		},200);//前三次循环获取空闲状态
	}
}
/**
 * 允许投币
 */
function enableBill(){
	if(null === DEVICE_Handle)init();
	try{
		var json = DEVICE.LH_BILL_EnableBill(DEVICE_Handle);
		log('cashbox-允许投币' + json);
		var obj = JSON.parse(json);
		return obj.stateCode;
	}catch(e){
		log('cashbox-允许投币失败' + json);
		return ERR_EXCEPTION;
	}
}
/**
 * 禁止投币
 */
function disableBill(){
	if(null === DEVICE_Handle)init();
	try{
		var json = DEVICE.LH_BILL_DisableBill(DEVICE_Handle);
		log('cashbox-禁止投币' + json);
		var obj = JSON.parse(json);
		if(obj.stateCode != 0 )throw new Error("禁止投币失败");
	}catch(e){
		throw new Error("禁止投币失败");
	}
}
var timeout = 0;
/**
 * 开启投币循环
 */
function listenCash(callbacks,time){
	if(null === DEVICE_Handle)init();
	if(timeout > 0){//防重复循环
		timeout = time;
		log('cashbox-listenCash','循环正在进行，不重新开启,只重置时间');
		return;
	}
	timeout = time;
	try{
		Light.blink();
	}catch(e){
		console.info(e);
	}
	startListenLoop(callbacks);
}
function stopListenCash(){
	log('cashbox-stopListenCash');
	timeout = 0;
	try{
		Light.turnOff();
	}catch(e){
		console.info(e);
	}
	disableBill();//禁止投币
}
function startListenLoop(callbacks){
	const {
		success,
		error,
		unConfirm,
		full,
		accept,
		returning,
		idle,
		stop,
		recorder,
	} = callbacks;
	if(null === DEVICE_Handle)init();
	log('cashbox-开启纸币循环');
	
	var oldRet = null;//BILL_STATUS_IDLING;
	function pollbill(){
		try{
			timeout = timeout -200;
			if(timeout <= 0){//防止时间差带来的错误
				log('cashbox-时间到，停止循环 ' );
				closeDevice();//停止监听
				stop();//回调
				return;
			}
			var nRetJson;
			var nRet ;
			try{
				nRetJson = DEVICE.LH_BILL_PollBill(DEVICE_Handle);
				nRet = JSON.parse(nRetJson).stateCode;
			}catch(e){
				console.info(e);
				log('cashbox-拉币异常 ',e);
				closeDevice();//停止监听
				if(error){error(ERR_EXCEPTION,'拉币失败');}
				return;
			}
			
			log('cashbox-拉币 : ' + nRet);
			if(ERR_TIMEOUT != nRet){
				COUNT_ERR_TIMEOUT = 0;
			}
				
			if(nRet >0 && nRet<101){                           //成功接收纸币（nRet）元
				log("cashbox-成功接收纸币（"+nRet+"）元" );  
				timeout = 0;
				if(success)success(nRet); 
				return;
			}else if(nRet >1000 && nRet<1101){                 //暂存纸币（nRet-1000）元
				try{
					var stakeJson = DEVICE.LH_BILL_StackedBill(DEVICE_Handle);     //注意要执行压币
					log("cashbox-执行压币 : " + stakeJson);
					var stakeObj = JSON.parse(stakeJson);
					if(stakeObj.stateCode != ERR_NO_ERROR){
						closeDevice();//停止监听
						if(unConfirm){unConfirm(nRet+'_'+stakeObj.stateCode);}//压币失败
						return;
					}
				}catch(e){
					log("cashbox-执行压币 异常: " , e);
					closeDevice();//停止监听
					if(unConfirm){unConfirm(nRet);}//压币失败
					return;
				}
			}else  if(nRet >2000 && nRet<2101){                //最后压币失败（nRet-2000）元
				var msg = "钱箱接收币异常("+(nRet-2000)+")元，退出接收币";
				log("cashbox-钱箱错误:" + msg);
				closeDevice();//停止监听
				if(unConfirm){unConfirm(nRet);}
				return;
			}else if(BILL_STATUS_IDLING == nRet  ){           //"空闲状态" 
				if(oldRet != nRet && idle){idle(nRet)}
			}else if(BILL_STATUS_ACCEPT == nRet ){            //"进币状态"
				if(oldRet != nRet && accept){
					accept(nRet);
					timeout = timeout + 20*1000;//执行压币之后会有6次左右的904，因此增加延迟时间，保证纸币能够顺利读取
					log("cashbox-进币状态");
				}
			}else if(BILL_STATUS_RETURNING == nRet ){//"正在退币状态" 暂时不作处理 
				if(oldRet != nRet && returning){
					returning(nRet);
					log("cashbox-正在退币状态");	
				}
			}else if(BILL_STATUS_RETURN == nRet || BILL_STATUS_DISABLE == nRet){ 
				log('cashbox-币已经退出、要重新允许投币 : ');
				var enble = enableBill(); 
				if(ERR_NO_ERROR != enble){
					var msg = "重新允许投币失败";
					log("cashbox-钱箱错误:" + msg);
					closeDevice();//停止监听
					if(error)error(enble,msg);
					return;
				} 
			}else if(BILL_STATUS_DISABLE == nRet ){           //"禁止投币状态或不可收的面额
				var enble = enableBill();
				log('cashbox-不可接受面额'+enble);
				if(ERR_NO_ERROR != enble) {
					var msg = "重新允许投币失败";
					log("cashbox-钱箱错误:" + msg);
					closeDevice();//停止监听
					if(error)error(nRet,msg);
					return;
				}        
			}else  if(BILL_STATUS_NEED_RESET == nRet ){        //识币器需要重新复位
				var resetJson,resetObj,resetState;
				try{
					resetJson = DEVICE.LH_BILL_Reset(DEVICE_Handle);
					log('cashbox-设备复位 : ' + resetJson);
					resetObj = JSON.parse(resetJson);
					resetState = resetObj.stateCode;
				}catch(e){
					resetState = ERR_EXCEPTION; 
				}
				if(resetState != ERR_NO_ERROR ){
					var msg = "执行复位失败";
					log("cashbox-钱箱错误:" + msg);
					closeDevice();//停止监听
					if(error)error(nRet,msg);
					return;
				}
			}else if(BILL_STATUS_JAM == nRet ){ //卡币
				var msg =  "卡币，退出接收币 "+ nRet;
				log("cashbox-钱箱错误:" + msg);
				closeDevice();
				if(error)error(nRet,msg);
				return;
			}else if( BILL_STATUS_BOX_FULL == nRet){   //钱箱满
				var msg = "钱箱满，退出接收币 "+nRet;
				log("cashbox-钱箱错误:" + msg);
				closeDevice();
				if(error)error(nRet,msg);
				return;
			}else if( BILL_STATUS_MECHANICAL_FAILURE == nRet){//机械故障
				var msg = "机械故障，退出接收币 "+nRet;
				log("cashbox-钱箱错误:" + msg);
				closeDevice();
				if(error)error(nRet,msg);
				return;
			}else if(BILL_STATUS_MUST_TAKE_MONEY == nRet){
				var msg = "停止投币，必须从钱箱将钱取出，然后才能再次投币 "+nRet;
				log("cashbox-钱箱错误:" + msg);
				closeDevice();
				if(error)error(nRet,msg);
				return;
			}else if(BILL_STATUS_FRAUDMONEY == nRet)  { 
				var msg = "发现钓鱼 " +nRet;
				log("cashbox-钱箱错误:" + msg);
				closeDevice();
				if(error)error(nRet,msg);
				return;
			}else if(BILL_STATUS_BOX_LEAVE == nRet) { 
				var msg = "发现钓鱼 "+ nRet;
				log("cashbox-钱箱错误:" + msg);
				closeDevice();
				if(error)error(nRet,msg);
				return;
			}else if(BILL_STATUS_BOX_REPLACING == nRet){
				log("cashbox-钱箱复位 "+ nRet);
			}else if(BILL_STATUS_904 == nRet) {	
				log("cashbox-904 "+nRet);
				if(oldRet != nRet && accept){
					accept(nRet);
					log("cashbox-094-遮罩");
				}
			}else if(BILL_STATUS_RESUME == nRet) {	
				log("cashbox-可恢复性错误 "+nRet);
			}else if(ERR_CANT_OPEN_PORT == nRet) {	
				var msg = "打开串口失败 "+nRet;
				log("cashbox-钱箱错误:" + msg);
				closeDevice();
				if(error)error(nRet,msg);
				return;
			}else if(ERR_TIMEOUT == nRet) {	
				COUNT_ERR_TIMEOUT++;
				var msg = "串口通信超时错误 "+nRet+"["+COUNT_ERR_TIMEOUT+"次]";
				log("cashbox-钱箱错误:" + msg);
				if(recorder)recorder(nRet,msg);
				if(COUNT_ERR_TIMEOUT > 10 ){//十次串口通信超时，记录错误
					closeDevice();
					if(error)error(nRet,msg);
					return;	
				}
			}else if(ERR_SENDBUF == nRet) {	
				var msg = "串口通信发送指令错误 "+nRet;
				log("cashbox-钱箱错误:" + msg);
				closeDevice();
				if(error)error(nRet,msg);
				return;
			}else if(ERR_CANCELED == nRet) {
				var msg = "串口通信取消错误 "+nRet;
				log("cashbox-钱箱错误:" + msg);
				closeDevice();
				if(error)error(nRet,msg);
				return;
			}else if(ERR_READERROR == nRet) {
				var msg = "串口通信取读数据错误 "+nRet;
				log("cashbox-钱箱错误:" + msg);
				closeDevice();
				if(error)error(nRet,msg);
				return;
			}else if(ERR_PARAERROR == nRet) {	
				var msg = "串口通信参数错误 "+nRet;
				log("cashbox-钱箱错误:" + msg);
				closeDevice();
				if(error)error(nRet,msg);
				return;
			}else {	
				var msg = "未知错误 "+nRet
				log("cashbox-钱箱错误:" + msg);
				baseUtil.warning(msg);
				closeDevice();
				if(error)error(nRet,msg);
				return;
			}
			oldRet = nRet;
			setTimeout(pollbill,200);
		}catch(e){
			var msg = "拉币函数异常 "+ JSON.stringify(e);
			log("cashbox-钱箱错误:" + msg);
			baseUtil.warning(msg);
			closeDevice();
			if(error)error('',msg);
			return;
		}
	}
	setTimeout(pollbill,200);  
}
function closeDevice(){
	try{
		Light.turnOff();
		stopListenCash();//停止循环
		if(null !== DEVICE_Handle)DEVICE.LH_BILL_CloseDevice(DEVICE_Handle);
		DEVICE_Handle=null;
		log('cashbox-closeDevice');
	}catch(e){
		log('cashbox-关闭失败',e);
	}
}

const MCARD={
	listenCash:listenCash,//监听到卡返回卡信息并停止监听
	stopListenCash : stopListenCash,
	safeClose:closeDevice,
	on:addListener,
	un:removeListener,
	prepare,
}
module.exports = MCARD;
