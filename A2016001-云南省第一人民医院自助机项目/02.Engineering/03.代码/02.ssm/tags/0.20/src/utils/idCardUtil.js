import eventUtil from './eventUtil';
import baseUtil from './baseUtil';
const DEVICE_ID="all_device",
	secretKey="A0A1A2A3A4A5",
	eventFlag = "idCard",
	dev_mode = true;
let DEVICE,DEVICE_Handle=null;

/***以下是开发模式***/
const emptyF = function(){};
var DATA = ["","张三","女","汉","2010-01-01","中国","100000110000011000001","北京市","2010-01-01"];
var DEVICE_dev_state = -6;

const DEVICE_dev = {
		LH_ID_OpenDevice:function(){
			console.info('open ',DEVICE_dev_state);
			setTimeout(()=>{DEVICE_dev_state = 0;},4*1000);
			return "{\"nHandle\":5}"
		},
		LH_ID_Reset:emptyF,
		LH_ID_GetStatus:function(){return "{\"stateCode\":0}"},//口内
		LH_ID_FindID:function(){console.info('123123 ',DEVICE_dev_state);return "{\"stateCode\":"+DEVICE_dev_state+"}"},//emptyF,//寻卡
		LH_ID_GetData:function(n,index){return "{\"stateCode\":0,\"CardInfo\":\""+DATA[index]+"\"}"},//,//校验密钥
		LH_IDC_CloseDevice:function(){DEVICE_dev_state=-6},
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
 * cardPuted 插卡
 * cardLeave 拔卡
 */
function init(){
	if(dev_mode){
		DEVICE = DEVICE_dev;
	}
	if(!DEVICE) DEVICE = document.getElementById(DEVICE_ID);
	if(!DEVICE){
		throw new Error("找不到ocx控件");
	}
	var json = DEVICE.LH_ID_OpenDevice(1001,1);
	//console.info('LH_ID_OpenDevice : ',json);
	var obj = JSON.parse(json);
	DEVICE_Handle = obj.nHandle;
//	var statusJson = DEVICE.LH_ID_GetStatus(DEVICE_Handle);
//	console.info('LH_ID_GetStatus : ',statusJson);
//	var status = JSON.parse(statusJson);
//	if(status.stateCode != 0)throw new Error("身份证读卡器不可用");
	return obj.nHandle;
}
/**
 * 获取状态
 */
function findCard(){
	if(null === DEVICE_Handle)init();
	var json = DEVICE.LH_ID_FindID(DEVICE_Handle);
	//console.info('LH_ID_FindID ',json);
	var obj = JSON.parse(json);
	return obj.stateCode;
}
function syncReadAllInfo(Timeout){
	if(null === DEVICE_Handle)init();
	var json = DEVICE.LH_ID_Read(DEVICE_Handle, Timeout);
	var obj = JSON.parse(json);//console.info(json);
	return obj;
}

function readCard(num){//读取单个信息
	if(null === DEVICE_Handle)init();
	var json = DEVICE.LH_ID_GetData(DEVICE_Handle, num);
	var obj = JSON.parse(json);//console.info(json,num);
	if(obj.stateCode != 0)throw new Error("读取身份证数据出错，状态码 :"+ obj.stateCode);
	return obj.CardInfo;
}
function readAllInfo(){//读取所有信息
	if(null === DEVICE_Handle)init();
	//DEVICE.LH_ID_Reset(DEVICE_Handle);
	var userName = readCard(1);//姓名
	//console.info(userName);
	var sex = readCard(2);//：性别（男/女）
	var nation = readCard(3);//：民族
	var birthday = readCard(4);//：出生日期（）
	var address = readCard(5);//：地址
	var idNo = readCard(6);//：身份证号
	var issuer = readCard(7);//issuer：发证机关
	var effectiveDate = readCard(8);//effectiveDate：有效日期
	//var img = readCard(9);//img：照片绝对路径
	closeDevice();//关闭设备
	
	return {
		userName:userName,
		sex :sex,
		nation:nation,
		birthday :birthday,
		address:address,
		idNo :idNo,
		issuer :issuer,
		effectiveDate:effectiveDate,
		//img :img
	};
}
//打开读卡设备并开始监听,监听到卡触发插卡事件、并停止监听
function listenCard(){
	if(null === DEVICE_Handle)init();
	DEVICE.LH_ID_Reset(DEVICE_Handle);
	var status = findCard();//console.info("findcard : ",status);
	console.info("****************",status);
	if(status != -6){//卡在
		var cardInfo = readAllInfo();//popCard();//
		fireEvents('cardPuted',cardInfo);//触发插卡
	}else{
		startListenLoop();//开始循环
	}
}
var looping = false;
function stopListenLoop(){
	looping = false;
}
function startListenLoop(){//0 //读卡器中无卡//1 //卡在门口//2 //卡在机内
	if(null === DEVICE_Handle)init();
	var old = findCard();
	if(old == 0 ){//之前插入
		//fireEvents('cardExist',{cardState:state});
	}
	function listenCardState(){
		var state = findCard();//console.info(state,old);
		if(state != -6 && old == -6 ){// 之前无卡，现在有卡，
			var cardInfo = readAllInfo();
			fireEvents('cardPuted',cardInfo);//触发插卡
			stopListenLoop();//停止循环
		}else if(state == -6 && old != -6 ){// 之前有卡，现在无卡，触发弹卡
			fireEvents('cardLeave',{cardState:state,oldState:old});
		}else{
			fireEvents('error',{msg:'读取读卡器状态失败,state:'+state});
		}
		old=state;
		if(looping)setTimeout(listenCardState,500);
	}
	looping = true;
	setTimeout(listenCardState,500);  
}
function closeDevice(){
	if(null === DEVICE_Handle)init();
	var json = DEVICE.LH_IDC_CloseDevice(DEVICE_Handle);
	DEVICE_Handle=null;
	//console.info('LH_IDC_CloseDevice ',json);
	console.info("closeDevice ",DEVICE_Handle,DEVICE_dev_state);
}

const idCard={
	listenCard:listenCard,//监听到卡返回卡信息并停止监听
	init:init,
	findCard:findCard,
	readAllInfo:readAllInfo,
	syncReadAllInfo:syncReadAllInfo,
	on:addListener,
	close:closeDevice,
	un:removeListener,
}
export default idCard;
