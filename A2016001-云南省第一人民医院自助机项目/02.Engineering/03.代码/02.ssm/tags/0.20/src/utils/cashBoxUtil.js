import eventUtil from './eventUtil';
import baseUtil from './baseUtil';
const  logger    = baseUtil.getLogger('cashBoxUtil'); 
const  DEVICE_ID = "all_device";
const  eventFlag = "cashBox";
const  dev_mode  = false;


const  BILL_STATUS_IDLING 		           =900 //空闲状态,可以进行投币
const  BILL_STATUS_ACCEPT 		           =901 //正在进纸币状态
const  BILL_STATUS_RETURNING  	           =902 //正在退币状态
const  BILL_STATUS_RETURN  		           =903 //退币结束状态

const  BILL_STATUS_DISABLE  		       =930 //禁止投币状态，需要执行允许投币ZT_BILL_EnableBill()才能接收纸币
const  BILL_STATUS_NEED_RESET 	           =931 //识币器需要重新复位，才能正常

const  BILL_STATUS_JAM 			           =950 //卡纸
const  BILL_STATUS_BOX_FULL  	           =951 //仓满  钱箱满
const  BILL_STATUS_MECHANICAL_FAILURE 	   =952 //机械故障 状态CASHCODE 47
const  BILL_STATUS_FRAUDMONEY 	           =953 //发现钓鱼(将投入的币强行拉出) 状态45
const  BILL_STATUS_BOX_LEAVE 		       =954 //钱箱离位
const  BILL_STATUS_BOX_REPLACING 		   =955 //钱箱复位
const  BILL_STATUS_MUST_TAKE_MONEY 		   =956 //必须从钱箱将钱取出，然后才能再次投币

const  ERR_NO_ERROR = 0; //成功
const  ERR_CANT_OPEN_PORT =        -1; //串口被用
const  ERR_TIMEOUT      =          -2; //超时
const  ERR_SENDERROR     =         -3; //发送失败
const  ERR_READERROR    =          -4; //接收失败
const  ERR_PARAERROR     =         -5; //参数错误

const  ERR_POWEROFF      =        -6; //掉电
const  ERR_LINEOFF       =       -7; //拔掉串口线

const  ERR_RevInfo      =        -8; //接收数据错误

const  ERR_UNKNOW_ERROR   =      -9; //未知错误

const BILL_STATUS_RESUME = 99999999;//不知道
const ERR_SENDBUF = 99999999;//不知道
const ERR_CANCELED = 99999999;//不知道
/***以下是开发模式***/
let denominations;
function LH_BILL_OpenDevice(pstrCom, nFage){
	return JSON.stringify({stateCode:0,nHandle:'cash'});
}
function LH_BILL_Reset(nHandle){
	return JSON.stringify({stateCode:0});
}
function LH_BILL_GetStatus(nHandle){
	return JSON.stringify({stateCode:BILL_STATUS_IDLING});
}
function LH_BILL_SetDenominations(nHandle, nEnabledDenominations){
	var den = nEnabledDenominations.toString(2);
	var reg=/\d{2}/g,rs=s.match(reg);
	rs.push(s.substring(rs.join('').length));
	denominations=[];
	for(var r of rs){
		denominations.push('5');
	}
}
function LH_BILL_EnableBill(nHandle){
	return JSON.stringify({stateCode:0});
}
function LH_BILL_SetMainInfo(szData){
	return JSON.stringify({stateCode:0});
}
function LH_BILL_PollBill(nHandle){
	return JSON.stringify({stateCode:0});
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
	return JSON.stringify({stateCode:0});
}

const DEVICE_dev = {}
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
	
	var openJson = DEVICE.LH_BILL_OpenDevice("COM3:9600:E:8:1", 0);
	logger.log('init-open : ' + openJson);
	var obj = JSON.parse(openJson);
	DEVICE_Handle = obj.nHandle;
	
	var restJson = DEVICE.LH_BILL_Reset(DEVICE_Handle);
	logger.log('init-rest : ' + restJson);
	setDenominations(127);//所有纸币
	return obj.nHandle;
}
/**
 * 获取状态
 * @param nHandle
 * @returns
 */
function getStatus(){
	if(null === DEVICE_Handle)init();
	var stateJson = DEVICE.LH_BILL_GetStatus(DEVICE_Handle);
	logger.log('getStatus : ' + stateJson);
	var obj = JSON.parse(stateJson);
	return obj.stateCode;
}
function setDenominations(types){
	if(null === DEVICE_Handle)init();
	var setJson = DEVICE.LH_BILL_SetDenominations(DEVICE_Handle,types);
	logger.log('setDenominations : ' + setJson);
	var obj = JSON.parse(setJson);
	return obj.stateCode;
}
//打开读卡设备并开始监听
function listenCash(){
	if(null === DEVICE_Handle)init();
	var stateCode = getStatus();
	logger.log('listenCash : '+stateCode);
	if(INIT_STATE_COUNT == 3 ){
		if(stateCode == BILL_STATUS_IDLING || stateCode==BILL_STATUS_DISABLE){
			startListenLoop();//"识币器状态正常 可以循环投币"
		}else{
			throw new Error("识币器状态异常 不可以循环投币");
		}
	}else{
		INIT_STATE_COUNT++;
		setTimeout(listenCash,200);//前三次循环获取空闲状态
	}
}
var looping = false,pauseFlag = false;
function pause(){
	logger.log('pause ' );
	pauseFlag = true;
}
function stopPause(){
	logger.log('stopPause ' );
	pauseFlag = false;
}
function stopListenCash(){
	logger.log('stopListenCash');
	looping = false;//停止循环
	if(null !== DEVICE_Handle)DEVICE.LH_BILL_DisableBill(DEVICE_Handle);
}

function startListenLoop(){//0 //读卡器中无卡//1 //卡在门口//2 //卡在机内
	logger.log('startListenLoop');
	if(null === DEVICE_Handle)init();
	looping = true;
	function pollbill(){
		if(!looping)return;//防止时间差带来的错误
		if(pauseFlag){
			if(looping)setTimeout(pollbill,200);//暂停，只循环，不取钱
			return;
		}
		var nRetJson  = DEVICE.LH_BILL_PollBill(DEVICE_Handle);
		logger.log('poolbill : ' + nRetJson);
		var nRet = JSON.parse(nRetJson).stateCode;
		if(nRet >0 && nRet<101){ 
			console.info("成功接收纸币（"+nRet+"）元" );  //成功接收纸币（nRet）元
			fireEvents('cashPushed',nRet);//触发插卡
			pause();      //暂停，等交易完成后唤醒                  
		}else if(nRet >1000 && nRet<1101){                 //暂存纸币（nRet-1000）元
			var stake = DEVICE.LH_BILL_StackedBill(DEVICE_Handle);     //注意要执行压币
			console.info("执行压币 : " + stake);
			var stakeObj = JSON.parse(stake);
		}else  if(nRet >2000 && nRet<2101){                //最后压币失败（nRet-2000）元
			throw new Error("钱箱接收币异常("+(nRet-2000)+")元，退出接收币");
		}else if(BILL_STATUS_IDLING == nRet ||  BILL_STATUS_ACCEPT == nRet || BILL_STATUS_RETURNING == nRet ){
			                                               //"空闲状态"\"进币状态"\"正在退币状态" 不做处理
		}else if(BILL_STATUS_RETURN == nRet || BILL_STATUS_DISABLE == nRet){ 
			var enble = DEVICE.LH_BILL_EnableBill(DEVICE_Handle); 
			var enbleObj = JSON.parse(enble);	           //币已经退出、要重新允许投币
			//logger.log('币已经退出、要重新允许投币 : '+enble);stopListenCash();closeDevice();
			if(ERR_NO_ERROR != enbleObj.stateCode)         throw new Error("重新允许投币失败");
		}else  if(BILL_STATUS_DISABLE == nRet ){           //"禁止投币状态或不可收的面额
			var enble = DEVICE.LH_BILL_EnableBill(DEVICE_Handle);
			var enbleObj = JSON.parse(enble);
			if(ERR_NO_ERROR != enbleObj.stateCode)         throw new Error("重新允许投币失败");
		}else  if(BILL_STATUS_NEED_RESET == nRet ){        //识币器需要重新复位
			var reset = DEVICE.LH_BILL_Reset(DEVICE_Handle);
			var resetObj = JSON.parse(enble);
			if(ERR_NO_ERROR != resetObj.stateCode)         throw new Error("执行复位失败");
		}else if(BILL_STATUS_JAM == nRet || BILL_STATUS_BOX_FULL == nRet || BILL_STATUS_MECHANICAL_FAILURE == nRet){//设备故障或者不能投币
			if(BILL_STATUS_JAM == nRet)                    logger.log("卡币，退出接收币 "+String(nRet));
			else if(BILL_STATUS_JAM == nRet)               logger.log("钱箱满，退出接收币 "+String(nRet));
			else if(BILL_STATUS_MECHANICAL_FAILURE == nRet)logger.log("机械故障，退出接收币 "+String(nRet));
			stopListenCash();
		}else if(BILL_STATUS_MUST_TAKE_MONEY == nRet){
			throw new Error("停止投币，必须从钱箱将钱取出，然后才能再次投币 "+String(nRet));
		}
		else if(BILL_STATUS_FRAUDMONEY == nRet)     {   logger.log("发现钓鱼 "+String(nRet)); }
		else if(BILL_STATUS_BOX_LEAVE == nRet)      {   logger.log("钱箱离位 "+String(nRet));}
		else if(BILL_STATUS_BOX_REPLACING == nRet)  {	logger.log("钱箱复位 "+String(nRet));}
		else if(BILL_STATUS_RESUME == nRet)         {	logger.log("可恢复性错误 "+String(nRet));} 
		else if(ERR_CANT_OPEN_PORT == nRet)         {	logger.log("打开串口失败 "+String(nRet));}
		else if(ERR_TIMEOUT == nRet)                {	logger.log("串口通信超时错误 "+String(nRet));}
		else if(ERR_SENDBUF == nRet)                {	logger.log("串口通信发送指令错误 "+String(nRet));}
		else if(ERR_CANCELED == nRet)               {	logger.log("串口通信取消错误 "+String(nRet));}
		else if(ERR_READERROR == nRet)              {	logger.log("串口通信取读数据错误 "+String(nRet));}
		else if(ERR_PARAERROR == nRet)              {	logger.log("串口通信参数错误 "+String(nRet));}
		else                                        {	logger.log("未处理状态 "+String(nRet));}
		if(looping)setTimeout(pollbill,200);
	}
	setTimeout(pollbill,200);  
}

function closeDevice(){
	stopListenCash();//停止循环
	if(null !== DEVICE_Handle)DEVICE.LH_BILL_CloseDevice(DEVICE_Handle);
	DEVICE_Handle=null;
	logger.log('closeDevice');
}

const MCARD={
	listenCash:listenCash,//监听到卡返回卡信息并停止监听
	stopListenCash : stopListenCash,
	safeClose:closeDevice,
	pause:pause,
	stopPause:stopPause,
	on:addListener,
	un:removeListener,
}
export default MCARD;
