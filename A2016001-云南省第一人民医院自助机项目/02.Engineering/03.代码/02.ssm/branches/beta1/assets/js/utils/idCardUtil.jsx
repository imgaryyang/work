import moment from 'moment';
import eventUtil from './eventUtil.jsx';
import baseUtil from './baseUtil.jsx';
import logUtil,{ log } from  "./logUtil.jsx";

const DEVICE_ID="IdCardActiveX",
	secretKey="A0A1A2A3A4A5",
	eventFlag = "idCard",
	dev_mode = baseUtil.dev_mode;;

let DEVICE,DEVICE_Handle=null;

/***以下是开发模式***/
const emptyF = function(){};
var DEVICE_dev_state = -6;
const DEVICE_dev = {
		openport:function(){return 0},
		closeport:function(){return 0},
		ReadCard2:function(){
			setTimeout(()=>{
				var info = {
					NameL:"鲁东国",
					Address:"昆明源星经贸有限公司",
					SexL:'男',
					NationL:'汉',
					Born:'1978-06-10',
					CardNo:'532923197806102315',
					Police:'昆明源星经贸有限公司',
					Activity:'2010-01-01',
				};
				window.onIdCardReaded(info);
			},1000);
			return 0;
		},
		ReadCard:function(){
			setTimeout(()=>{
				var info = {
					NameL:"马有利",
					Address:"云南省昆明市富民县东村镇中民村委会菖莆箐村",
					SexL:'女',
					NationL:'汉',
					Born:'1994-04-18',
					CardNo:'530124199404180521',
					Police:'云南省昆明市富民县东村镇',
					Activity:'2010-01-01',
				};
				window.onIdCardReaded(info);
			},1000);
			return 0;
		},
		ClearAll:function(){return 0},
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
	if(dev_mode)DEVICE = DEVICE_dev;
	if(!DEVICE) DEVICE = document.getElementById(DEVICE_ID);
	if(!DEVICE)throw new Error("找不到ocx控件");
	window.onIdCardReaded = onCardReaded;
	var pp = DEVICE.openport();
	if(pp==0) return;
    else throw new Error("打开身份证读卡器失败");
}
/**
 * 获取状态
 */
function readCard(){
	if(!DEVICE)init();
	document.getElementById("idCardUserName").value="";
	DEVICE.ClearAll();
	readLoopFlag = true;
	readLoop();
}
var readLoopFlag = false;
function readLoop(){
	var pp = DEVICE.ReadCard();
	//console.info('id card read loop :',pp);
	if(pp != 0 && readLoopFlag ){
		setTimeout(readLoop,200)
	}
}
//打开读卡设备并开始监听,监听到卡触发插卡事件、并停止监听
var callback = null;
function listenCard(cb){
	callback = cb;
	readCard();
}
function onCardReaded(info){
	log('idcard-onCardReaded ');
	document.getElementById("idCardUserName").value = info.NameL;
	document.getElementById("idCardAddress").value = info.Address;
	var userName = document.getElementById("idCardUserName").value;
	var address =  document.getElementById("idCardAddress").value;
	var effectiveDate = info.Activity.substring(0,8);
	var cardInfo = {
		// ...info,
	    userName:userName,
		sex :info.SexL,
		nation:info.NationL,
		birthday : moment(info.Born).format('YYYY-MM-DD'),
		address:address,
		idNo :info.CardNo,
		issuer :info.Police,
		effectiveDate:moment(effectiveDate).format('YYYY-MM-DD'),
	};
	log('idcard-cardInfo ',cardInfo);
	document.getElementById("idCardUserName").value="";
	document.getElementById("idCardAddress").value="";
	DEVICE.ClearAll();
	readLoopFlag = false;
	DEVICE.closeport();
	fireEvents('cardPuted',cardInfo);//触发插卡
	if(callback){
		var cb = callback;
		callback = null;
		cb(cardInfo);
	}
}
function closeDevice(){
	if(!DEVICE)init();
	readLoopFlag = false;
	callback = null;
	DEVICE.closeport();
}

const idCard={
	listenCard:listenCard,//监听到卡返回卡信息并停止监听
	init:init,
	on:addListener,
	close:closeDevice,
	un:removeListener,
}
module.exports = idCard;