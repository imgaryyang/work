
import eventUtil from './eventUtil.jsx';
import baseUtil from './baseUtil.jsx';
import moment from 'moment';
import lightUtil from './lightUtil.jsx';
import logUtil,{ log } from  "./logUtil.jsx";

const Light = lightUtil.bankCard;
const PinLight = lightUtil.pin;

const DEVICE_ID="unpay",
	eventFlag = "unionpay",
	dev_mode = true;//baseUtil.dev_mode;//大庆不使用银联
let DEVICE,DEVICE_Handle=null;

/***以下是开发模式***/
const emptyF = function(){};
const DEVICE_dev = {
		cardState:1,//0 内部 3电子现金 4 非接 1 2 无卡
		pinCode:255,
		pinCount:0,
		MySetApptype:function(){return 0;},
		UMSInit:function(){
			setTimeout(()=>{this.cardState = 0},4*1000);//3秒后插入卡
			return 0;
		},
		UMSEnterCard:function(){return 0;},
		UMSCheckCard:function(){return this.cardState;},
		UMSReadCard:function(){return JSON.stringify({stateCode:0,cardNo:'66678883456'})},
		UMSEjectCard:function(){this.cardState = 2;return 0;},	
		UMSStartPin:function(){setTimeout(()=>{this.pinCode = 42},2*1000);return 0;},
		UMSGetOnePass:function(){
			var code = this.pinCode;
			if(this.pinCode == 42){
				this.pinCode = 255;
				this.pinCount  = this.pinCount+1;
				setTimeout(()=>{
					if(this.pinCount < 6)this.pinCode = 42;
					else this.pinCode = 13;
				},3*1000);//1秒输入一次
			}
			return code;
		},
		UMSGetPin:function(){return 0;},
		UMSSetReq:function(){return 0;},
		UMSTransCard:function(req){
			var amt = req.substring(18,30);//2	应答码 req.resp
			var date = moment().format('MMDD');
			var time = moment().format('HHmmss'); 
			var lsh = moment().format('X');
			var msg =  "00"//2	应答码
				+"交易成功"+"          "+"          "+"          "+"  "//40	应答码说明信息（汉字）
				+"6228480402564890018 "//20	交易卡号
				+amt//12	金额
				+"123456"//	6	终端流水号（凭证号）
				+"654321"//	6	批次号
				+date//	4	交易日期MMDD
				+time//	6	交易时间hhmmss
				+lsh+"  "//	12	系统参考号（中心流水号）
				+"111111"//	6	授权号
				+"abcdefghigklmno"//	15	商户号
				+"88888888"//	8	终端号
				+"2_借记卡".pad(1021)//	1024	48域附加信息（采用第4章所述格式传出）
				+"123";//	3	3个校验字符
			return JSON.stringify({stateCode:'0',responseText:msg})
		},
		UMSCardSwallow:function(){return 0;},
		UMSCardClose:function(){return 0;},
}


function addListener(event,func){
	eventUtil.addListener(eventFlag,event,func);
}
function removeListener(event,index){
	eventUtil.removeListener(eventFlag,event,index);
}
function fireEvents(event,arg){
	eventUtil.fireEvents(eventFlag,event,arg);
}


/******************************Ocx 内置函数封装 **********/
//1)	调用初始化函数UMS_Init(appType)
function UMSInit(){
	DEVICE.MySetApptype(1);//1 银行卡 2 全民付
	var iret = DEVICE.UMSInit();
	if(iret!=0)throw new Error("银联控件初始化失败");
}


//3)	调用进卡函数UMS_EnterCard()
function UMSEnterCard(){
	var iret = DEVICE.UMSEnterCard();
	if(iret!=0)throw new Error("初始化读卡器失败");
}
//4)	调用检测卡函数UMS_CheckCard (byte *state_out)，判断读卡器内或者非接感应器上是否有卡。
function UMSCheckCard(){
	var iret = DEVICE.UMSCheckCard();
	if(iret<0)throw new Error("检测卡位置失败!");
	return iret;// 0 卡在读卡器内 1 卡在读卡器口! other 无卡
}

function UMSReadCard(){		
	var json = {stateCode:-1};
	var iret = DEVICE.UMSReadCard();
	json  = JSON.parse(iret);
	if(json.stateCode < 0)throw new Error("读卡失败");
	return json.cardNo;
}
function UMSCardSwallow(){		
	var iret = DEVICE.UMSCardSwallow();
	if(iret!=0)throw new Error("吞卡失败");
}
function UMSCardClose(){		
	var iret = DEVICE.UMSCardClose();
	if(iret!=0)throw new Error("关闭读卡器失败");
}
function UMSEjectCard(){
	var state = UMSCheckCard();
	if(state === 0 || state === 3 ||state === 4 ){
		var iret = DEVICE.UMSEjectCard();
		Light.blink();
		if(iret != 0)throw new Error("弹卡失败");
		return iret;// 
	}else{
		return 0;
	}	
}
function UMSStartPin(){
	var iret = DEVICE.UMSStartPin();
	if(iret != 0)throw new Error("打开密码键盘失败");
	return iret;// 
}
function UMSGetOnePass(){
	return DEVICE.UMSGetOnePass();
}
function UMSGetPin(){
	var iret = DEVICE.UMSGetPin();
	if(iret != 0)throw new Error("获取密码键盘密文失败");
	return iret;// 
}
function UMSSetReq(req){//
	var iret = DEVICE.UMSSetReq(req);
	if(iret != 0)throw new Error("设置入参失败");
	return iret;
}
function UMSTransCard(req){
	var iret = DEVICE.UMSTransCard(req);
	//log('银联-银联交易返回',iret);
	var json = {stateCode:-1,reponseText:''};
	if(!iret)return json;
	json  = JSON.parse(iret);
	//if(json.stateCode < 0)throw new Error("交易失败");
	return json;
}
var UMS={
	Init:UMSInit,
	EnterCard:UMSEnterCard,
	CheckCard:UMSCheckCard,
	ReadCard:UMSReadCard,
	EjectCard:UMSEjectCard,	
	StartPin:UMSStartPin,
	GetOnePass:UMSGetOnePass,
	GetPin:UMSGetPin,
	SetReq:UMSSetReq,
	TransCard:UMSTransCard,
	CardClose:UMSCardClose,
}

/*****************************支付流程 **********/
/**
 * 初始化交易、打开读卡器
 */
function init(){log('银联-银联 init ocx');
	if(dev_mode)DEVICE = DEVICE_dev;
	if(!DEVICE) DEVICE = document.getElementById(DEVICE_ID);
	if(!DEVICE)throw new Error("找不到ocx控件");
}
function initEnv(callback){log('银联-银联 环境初始化');
	if(!DEVICE)init();
	UMSInit();
	if(callback)callback();
}
function listenCard(callback){log('银联-监听银行卡 : ');
	UMSEnterCard();//允许进卡
	var state = UMSCheckCard();
	if(state === 0 || state === 3 ||state === 4 ){
		log('银联-卡已存在，读取');
		try{
			var cardInfo = readCard();
			if(callback)callback(cardInfo);
			return;
		}catch(e){
			log('银联-银行卡 : 异常读卡后弹出当前卡');
			baseUtil.speak('unionpay_checkBankcard');// 播放语音
			UMSEjectCard();//弹出卡，等待重新读
			startCardListenLoop(callback);//开始循环
		}
	}else{
		baseUtil.speak('unionpay_insertCard');
		startCardListenLoop(callback);//开始循环
	}
}
var cardLooping = false;
function startCardListenLoop(callback){log('银联-银行卡监听循环');
	var old = UMSCheckCard();
	if(old === 0 || old === 3 ||old === 4 ){//之前插入
		log('银联-卡已存在，读取');
		try{
			var cardInfo = readCard();
			if(callback)callback(cardInfo);
			return;
		}catch(e){
			log('银联-银行卡 : 异常读卡后弹出当前卡');
			UMSEjectCard();//弹出卡，等待重新读
		}
	}
	cardLooping = true;
	function listenCardState(){
		if(!cardLooping)return;
		var state = UMSCheckCard();
		if(state === 0 || state === 3 ||state === 4 ){// 0 内部 3电子现金 4 非接
			if(old === 1 || old === 2 ){//之前未插入
				try{
					log('银联-银行卡 : 试图读卡');
					var cardInfo = readCard();
					log('银联-银行卡 : 读卡完毕，卡号 '+cardInfo.cardNo);
					if(callback)callback(cardInfo);
					return;
				}catch(e){
					log('银联-银行卡 : 读卡异常',e);
					baseUtil.speak('unionpay_checkBankcard');// 播放语音
					setTimeout(()=>{
						log('银联-银行卡 : 异常读卡后弹出当前卡');
						UMSEjectCard();//弹出卡，等待重新读
						listenCardState();
					},4000);
				}
			}
		}else if(state === 1 || state === 2 ){
			if(old === 0 || old === 3 ||old === 4 ){//之前插入
				//fireEvents('cardPoped',cardInfo);//触发弹卡
			}
		}else{
			throw new Error("读取读卡器状态失败,状态码： "+ state);
		}
		old=state;
		if(cardLooping)setTimeout(listenCardState,200);
	}
	setTimeout(listenCardState,200);
}
function stopListenCard(){log('银联-停止监听银行卡');
	cardLooping=false;
}

function readCard(){log('银联-读卡号');
	Light.turnOn();
	var cardNo = UMSReadCard();
	return {cardNo:cardNo};
}

function listenPin(config){ log('银联-开始监听密码键盘');
	PinLight.blink();
	UMSStartPin();//开启密码键盘
	startListenPinLoop(config);
}
function stopListenPin(config){ log('银联-停止监听密码键盘');
	pinLooping = false;
	PinLight.turnOff();
}
var pinLooping = false;
function startListenPinLoop(config){ log('银联-开启密码键盘循环');
	const {
		onChange,
		onTimeout,
		onCancel,
		onEnter,
		onError,
	} = config;
	pinLooping = true;
	var pin=0;
	baseUtil.speak('unionpay_enterPass');// 播放语音
	function listenPinKey(){
		if(!pinLooping)return;
		var key = UMSGetOnePass();
		if(key==42){ 
			pin++;
			if(onChange)onChange(pin);
		}else if(key==8){
			if(pin > 0)pin = pin-1;
			if(onChange)onChange(pin);
		}else if(key==27){
			pin = 0;
			if(onChange)onChange(pin);
		}else if(key==13){//确认
			if(onEnter)onEnter();
			stopListenPin();
			return;
		}else if(key==255){//没按
		}else if(key==2){//超时
			if(onTimeout)onTimeout();
			stopListenPin();
			return;
		}else{//未知键值!
			if(onError)onError();
			stopListenPin();
			return;
		}
		if(pinLooping) setTimeout(listenPinKey,200);  
	}
	setTimeout(listenPinKey,200);  
}
function readPin(callback){log('银联-读取密码');
	UMSGetPin();//读取密文
	if(callback)callback();
}

function safeClose(){log('银联-弹出卡并关闭读卡器');
	if(!DEVICE)init();
	stopListenCard();
	stopListenPin();
	PinLight.turnOff();
	var state = UMSCheckCard();
	if(state == 0 ){//内部
		UMSEjectCard();
	} 
	//循环等待取走卡片
	var popLooping = true,count =0,timeout = 2*60*1000;
	function listenCardState(){
		count+=200;
		var state = UMSCheckCard();
		if(state === 2){// 已经取走
			popLooping = false;//TODO 没有提供关闭函数
			UMSCardClose();//关闭读卡器
			Light.turnOff();
		}else if(count>timeout && state === 1 ){//时间到并且依然在卡口
			popLooping = false;
			UMSCardSwallow();//TODO 没有提供关闭函数
			UMSCardClose();//关闭读卡器
			Light.turnOff();
		}
		if(popLooping)setTimeout(listenCardState,200); 
	}
	setTimeout(listenCardState,200); 
}
function pay(req){log('银联-支付请求报文('+req.length+') ',req);
	try {
		UMSSetReq(req);
		var resp = UMSTransCard(req);
		log('银联-支付返回报文 '+resp.responseText);
		if(resp.stateCode == '0'){//TODO 可以不用解析
			var responseText = resp.responseText;
			log('银联-解析返回字符串'+responseText.length);
			var strRespCode = responseText.substring(0,2);//2	应答码
			log('银联-unionpay.req.应答码['+strRespCode+'] ',strRespCode.length+'位');
//			var strRespInfo = responseText.substring(2,38);//40	应答码说明信息（汉字）
//			log('银联-unionpay.req.	应答码说明信息['+strRespInfo+'] ',strRespInfo.length+'位');
//			var strCardNo = responseText.substring(38,58);//20	交易卡号
//			log('银联-unionpay.req.	交易卡号['+strCardNo+'] ',strCardNo.length+'位');
//			var strAmount = responseText.substring(58,70);//12	金额
//			log('银联-unionpay.req.	金额['+strAmount+'] ',strAmount.length+'位');
//			var strTrace = responseText.substring(70,76);//6	终端流水号（凭证号）
//			log('银联-unionpay.req.	终端流水号['+strTrace+'] ',strTrace.length+'位');
//			var strBatch = responseText.substring(76,82);//6	批次号
//			log('银联-unionpay.req.	批次号['+strBatch+'] ',strBatch.length+'位');
//			var strTransDate = responseText.substring(82,86);//4	交易日期MMDD
//			log('银联-unionpay.req.	交易日期['+strTransDate+'] ',strTransDate.length+'位');
//			var strTransTime = responseText.substring(86,92);//6	交易时间hhmmss
//			log('银联-unionpay.req.	交易时间['+strTransTime+'] ',strTransTime.length+'位');
//			var strRef = responseText.substring(92,104);//12	系统参考号（中心流水号）
//			log('银联-unionpay.req.	系统参考号['+strRef+'] ',strRef.length+'位');
//			var strAuth = responseText.substring(104,110);//	6	授权号
//			log('银联-unionpay.req.	授权号['+strAuth+'] ',strAuth.length+'位');
//			var strMId = responseText.substring(110,125);//	15	商户号	
//			log('银联-unionpay.req.商户号	['+strMId+'] ',strMId.length+'位');
//			var strTId = responseText.substring(125,133);//	8	终端号	
//			log('银联-unionpay.req.终端号	['+strTId+'] ',strTId.length+'位');
//			var strMemo = responseText.substring(133,1157);//1024	48域附加信息（采用第4章所述格式传出）
//			log('银联-unionpay.req.48域附加信息	[] ',strMemo.length+'位');
			var result =  {
				strRespCode : strRespCode, 
				responseText:responseText,
			}
			log('银联-解析结果',result);
			return {stateCode:resp.stateCode,result:result}
		}else{
			throw new Error("交易异常");
		}
	} catch (e) {
		throw new Error("交易异常");
	}
	
}
const UP={
	initEnv : initEnv,
	listenCard:listenCard,//监听到卡返回卡信息并停止监听
	listenPin:listenPin,
	stopListenCard : stopListenCard,
	readPin:readPin,
	pay:pay,
	safeClose:safeClose,
	on:addListener,
	un:removeListener,
}
module.exports = UP;