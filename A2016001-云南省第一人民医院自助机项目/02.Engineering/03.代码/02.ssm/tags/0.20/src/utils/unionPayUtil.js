
import eventUtil from './eventUtil';
import baseUtil from './baseUtil';
const logger = baseUtil.getLogger('unpayUtil'); 
const DEVICE_ID="unpay",
	eventFlag = "unionpay",
	dev_mode = true;
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
		UMSEjectCard:function(){return 0;},	
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
		UMSTransCard:function(){return 0;},
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

function UMSEjectCard(){
	var iret = DEVICE.UMSEjectCard();
	if(iret != 0)throw new Error("弹卡失败");
	return iret;// 
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
	logger.log('交易返回',iret);
	var json = {stateCode:-1,reponseText:'交易失败'};
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
}

/*****************************支付流程 **********/
/**
 * 初始化交易、打开读卡器
 */
function init(){
	if(dev_mode){
		DEVICE = DEVICE_dev;
	}
	var ret = -1;
	if(!DEVICE) DEVICE = document.getElementById(DEVICE_ID);
	logger.log('DEVICE',DEVICE);
	if(!DEVICE){
		throw new Error("找不到ocx控件");
	}
	/*if(!DEVICE.MySetApptype){throw new Error("ocx控件加载异常");}*/
		
	ret = UMSInit();
	fireEvents('payInit');
	return ret;
}
function initEnv(){logger.log('init',DEVICE_ID,DEVICE);
	init();
	UMSEnterCard();
	var state = UMSCheckCard();
	if(state === 0 || state === 3 ||state === 4 ){
		return {cardExist:true}
	}
	return {cardExist:false}
}
function listenCard(){
	logger.log('listenCard : ');
	if(null === DEVICE_Handle)initEnv();
	var state = UMSCheckCard();
	if(state === 0 || state === 3 ||state === 4 ){
		var cardInfo = 	readCard();
		fireEvents('cardPushed',cardInfo);//触发插卡
	}else{
		startCardListenLoop();//开始循环
	}
}
var cardLooping = false;
function startCardListenLoop(){logger.log('startCardListenLoop');
	cardLooping = true;
	var old = UMSCheckCard();
	if(old === 0 || old === 3 ||old === 4 ){//之前插入
		var cardInfo = 	readCard();
		fireEvents('cardPushed',cardInfo);//触发插卡
	}
	function listenCardState(){
		if(!cardLooping)return;
		var state = UMSCheckCard();
		if(state === 0 || state === 3 ||state === 4 ){// 0 内部 3电子现金 4 非接
			if(old === 1 || old === 2 ){//之前未插入
				var cardInfo = 	readCard();
				fireEvents('cardPushed',cardInfo);//触发插卡
				stopListenCard()
			}
		}else if(state === 1 || state === 2 ){
			if(old === 0 || old === 3 ||old === 4 ){//之前插入
				fireEvents('cardPoped',cardInfo);//触发弹卡
				stopListenCard()
			}
		}else{
			throw new Error("读取读卡器状态失败,状态码： "+ state);
		}
		old=state;
		if(cardLooping)setTimeout(listenCardState,200);
	}
	setTimeout(listenCardState,200)
}
function stopListenCard(){logger.log('stopListenCard');
	cardLooping=false;
}

function readCard(){logger.log('readCard');
	var cardNo = UMSReadCard();
	return {cardNo:cardNo};
}

function listenPin(){ logger.log('listenPin');
	UMSStartPin();
	startListenPinLoop();
}

function startListenPinLoop(){ logger.log('startListenPinLoop');
	var pinLooping = true,pin=0;
	function listenPinKey(){
		if(!pinLooping)return;
		var key = UMSGetOnePass();
		if(key==42){
			fireEvents('pinKeyDown');
			fireEvents('pinCountChange',{pinCount:++pin,pinKey:key});
		}else if(key==8){
			if(pin > 0)pin = pin-1;
			fireEvents('pinKeyDelete');//退格
			fireEvents('pinCountChange',{pinCount:pin,pinKey:key});
		}else if(key==27){
			pin = 0;
			fireEvents('pinKeyCancel');//取消
			fireEvents('pinCountChange',{pinCount:pin,pinKey:key});
		}else if(key==13){//确认
			fireEvents('pinKeyEnter');
			pinLooping = false;
			setTimeout(readPin,200);
		}else if(key==255){//没按
		}else if(key==2){//超时
			fireEvents('pinTimeOut');
			pinLooping = false;
		}else{//未知键值!
			fireEvents('error',{msg:'未知键值:'+key});
			pinLooping = false;
		}
		if(pinLooping) setTimeout(listenPinKey,200);  
	}
	setTimeout(listenPinKey,200);  
}
function readPin(){logger.log('readPin');
	UMSGetPin();//读取密文
	fireEvents('pinReaded');
}

function safeClose(){logger.log('popCard and safeClose');
	if(!DEVICE) DEVICE= document.getElementById(DEVICE_ID);
	if(!DEVICE){
		fireEvents('error',{msg:"找不到ocx控件"});
		return;
	}
	UMSEjectCard();
	//循环等待取走卡片
	var popLooping = true,count =0,timeout = 30*1000;
	function listenCardState(){
		count+=200;
		var state = UMSCheckCard();
		if(state === 2){// 已经取走
			popLooping = false;//TODO 没有提供关闭函数
		}else if(count>timeout && state === 1 ){//时间到并且依然在卡口
			popLooping = false;
			UMSCardSwallow();//TODO 没有提供关闭函数
		}
		if(popLooping)setTimeout(listenCardState,200); 
	}
	setTimeout(listenCardState,200); 
}
function pay(req){logger.log('pay');
	try {
		UMSSetReq(req);
		var resp = UMSTransCard(req);
		if(resp.stateCode == '0'){
			logger.log('解析返回字符串');
			var responseText = resp.responseText;
			var strRespCode = responseText.substring(0,2);//2	应答码
			var strRespInfo = responseText.substring(2,42);//40	应答码说明信息（汉字）
			var strCardNo = responseText.substring(42,62);//20	交易卡号
			var strAmount = responseText.substring(62,74);//12	金额
			var strTrace = responseText.substring(74,80);//6	终端流水号（凭证号）
			var strBatch = responseText.substring(80,86);//6	批次号
			var strTransDate = responseText.substring(86,90);//4	交易日期MMDD
			var strTransTime = responseText.substring(90,96);//6	交易时间hhmmss
			var strRef = responseText.substring(96,108);//12	系统参考号（中心流水号）
			var strAuth = responseText.substring(108,114);//	6	授权号
			var strMId = responseText.substring(114,129);//	15	商户号	
			var strTId = responseText.substring(129,137);//	8	终端号		
			var strMemo = responseText.substring(137,1161);//1024	48域附加信息（采用第4章所述格式传出）
			var result =  {
				strRespCode : strRespCode, 
				strRespInfo : strRespInfo, 
				strCardNo : strCardNo, 
				strAmount : strAmount,
				strTrace : strTrace,
				strBatch : strBatch,
				strTransDate : strTransDate, 
				strTransTime : strTransTime,
				strRef : strRef, 
				strAuth : strAuth,
				strMId : strMId, 
				strTId : strTId, 
				strMemo : strMemo,
			}
			logger.log('解析结果');
			console.dir(result);
			return {stateCode:resp.stateCode,result:result}
		}else{
			throw new Error("交易异常");
		}
	} catch (e) {
		throw new Error("交易异常");
	}
	
}
//function safeListenCard(){
//	
//}
//function safeListenPin(){
//	
//}
const UP={
	initEnv : initEnv,
	listenCard:listenCard,//监听到卡返回卡信息并停止监听
	listenPin:listenPin,
	stopListenCard : stopListenCard,
	pay:pay,
	safeClose:safeClose,
	on:addListener,
	un:removeListener,
}
export default UP;
