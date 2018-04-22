import eventUtil from './eventUtil';
import baseUtil from './baseUtil';
const DEVICE_ID="IdCardActiveX",
	secretKey="A0A1A2A3A4A5",
	eventFlag = "idCard",
	dev_mode = baseUtil.dev_mode;;
import moment from 'moment';
let DEVICE,DEVICE_Handle=null;

/***以下是开发模式***/
const emptyF = function(){};
var DATA ={
		
} ["","倪凡睦","男","汉","1980-05-20","江西省 景德镇市 浮梁县","441203198005203675","江西省 景德镇","2010-01-01"];
var DEVICE_dev_state = -6;
const DEVICE_dev = {
		openport:function(){return 0},
		closeport:function(){return 0},
		ReadCard2:function(){
			setTimeout(()=>{
				var info = {
					NameL:"倪凡睦",
					Address:"江西省 景德镇市 浮梁县",
					SexL:'男',
					NationL:'汉',
					Born:'1980-05-20',
					CardNo:'441203198005203675',
					Police:'江西省 景德镇',
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
	var pp = DEVICE.ReadCard2();
	if(pp!=0)throw new Error("读取身份证失败");
}
//打开读卡设备并开始监听,监听到卡触发插卡事件、并停止监听
function listenCard(){
	readCard();
}
function onCardReaded(info){
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
	document.getElementById("idCardUserName").value="";
	document.getElementById("idCardAddress").value="";
	DEVICE.ClearAll();
	DEVICE.closeport();
	fireEvents('cardPuted',cardInfo);//触发插卡
}
function closeDevice(){
	if(!DEVICE)init();
	DEVICE.closeport();
}

const idCard={
	listenCard:listenCard,//监听到卡返回卡信息并停止监听
	init:init,
	on:addListener,
	close:closeDevice,
	un:removeListener,
}
export default idCard;
