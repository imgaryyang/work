const DEVICE_ID='unpay';
let UP_Device;


/******************************Ocx 内置函数封装 **********/
//1)	调用初始化函数UMS_Init(appType)
function UMSInit(){
	UP_Device.MySetApptype(1);//1 银行卡 2 全民付
	var iret = UP_Device.UMSInit();
	if(iret!=0)throw new Error("银联控件初始化失败");
}


//3)	调用进卡函数UMS_EnterCard()
function UMSEnterCard(){
	var iret = UP_Device.UMSEnterCard();
	if(iret!=0)throw new Error("初始化读卡器失败");
}
//4)	调用检测卡函数UMS_CheckCard (byte *state_out)，判断读卡器内或者非接感应器上是否有卡。
function UMSCheckCard(){
	var iret = UP_Device.UMSCheckCard();
	if(iret<0)throw new Error("检测卡位置失败!");
	return iret;// 0 卡在读卡器内 1 卡在读卡器口! other 无卡
}

function UMSReadCard(){		
	var json = {stateCode:-1};
	var iret = UP_Device.UMSReadCard();
	json  = JSON.parse(iret);
	if(json.stateCode < 0)throw new Error("读卡失败");
	return json.cardNo;
}
function UMSCardSwallow(){		
	var iret = UP_Device.UMSCardSwallow();
	if(iret!=0)throw new Error("吞卡失败");
}

function UMSEjectCard(){
	var iret = UP_Device.UMSEjectCard();
	if(iret != 0)throw new Error("弹卡失败");
	return iret;// 
}
function UMSStartPin(){
	var iret = UP_Device.UMSStartPin();
	if(iret != 0)throw new Error("打开密码键盘失败");
	return iret;// 
}
function UMSGetOnePass(){
	return UP_Device.UMSGetOnePass();
}
function UMSGetPin(){
	var iret = UP_Device.UMSGetPin();
	if(iret != 0)throw new Error("获取密码键盘密文失败");
	return iret;// 
}
function UMSSetReq(req){//
	var iret = UP_Device.UMSSetReq(req);
	if(iret != 0)throw new Error("设置入参失败");
	return iret;
}
function UMSTransCard(req){
	var iret = UP_Device.UMSTransCard(req);
	console.info('交易返回',iret);
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
/*****************************工具函数 **********/

var cardPushEvents=[];
var cardPopEvents=[];
var EVENTS={
	"error":[],
	"payInit":[],//初始化
	"cardOpen":[],//打开读卡器
	"cardPush":[],//插入银行卡
	"cardExist":[],//检测到银行卡
	"cardRead":[],//读卡成功
	"cardPop":[],//弹出卡
	"cardClose":[],//关闭读卡器
	"pinOpen":[],//关闭密码键盘
	'pinCountChange':[],//密码键盘按键数量更改
	'pinKeyDown':[],//密码键盘按下普通按键
	'pinKeyDelete':[],//密码键盘按下更正键
	'pinKeyCancel':[],//密码键盘按下取消键
	'pinKeyEnter':[],//密码键盘按下确定键或者按够6位
	'pinTimeOut':[],//密码键盘超时
	'pinReaded':[],//读取密码键盘成功
}

function addListener(key,func){
	var array = EVENTS[key],index=0;
	if(array){
		if(array.length > 1){
			var max = array[array.length-1];
			index = max.key+1;
		}
		EVENTS[key].push({key:index,func:func});
	}
	return index;
}
function removeListener(key,index){
	var array = EVENTS[key];
	if(!array)return;
	for(var i=0;i<array.length;i++){
		if(array[i].key == index){
			array.splice(i,1);
			break;
		}
	}
}
function fireEvents(key,arg){
	var array = EVENTS[key]||[];
	for(var i=0;i<array.length;i++){
		array[i].func(key,arg);
	}
}

function fireError(arg){
	fireEvents("error",arg)
}
/*****************************支付流程 **********/
/**
 * 初始化交易、打开读卡器
 */
function reset(){
	
}
function init(){console.info('init',DEVICE_ID,UP_Device);
	var ret = -1;
	if(!UP_Device) UP_Device = document.getElementById(DEVICE_ID);
	console.info('UP_Device',UP_Device);
	if(!UP_Device){
		throw new Error("找不到ocx控件");
	}
	/*if(!UP_Device.MySetApptype){
		throw new Error("ocx控件加载异常");
	}*/
	ret = UMSInit();
	fireEvents('payInit');
	return ret;
}
function openCard(){	console.info('openCard');
	var state = 2,cardExist=false;
	UMSEnterCard();
	state = UMSCheckCard();
	if(state === 0 || state === 3 ||state === 4 ){
		cardExist = true;
	}
	fireEvents('cardOpen',{cardState:state,cardExist:cardExist});//传入打开时读卡器状态	// 0 内部 3电子现金 4 非接
	return {state:state,cardExist:cardExist};
}
var cardListenerKey;
function listenCard(){console.info('listenCard');
	var old = UMSCheckCard();
	if(old === 0 || old === 3 ||old === 4 ){//之前插入
		fireEvents('cardExist',{cardState:state});
	}
	function listenCardState(){
		var state = UMSCheckCard();
		if(state === 0 || state === 3 ||state === 4 ){// 0 内部 3电子现金 4 非接
			if(old === 1 || old === 2 ){//之前未插入
				fireEvents('cardPush',{cardState:state,oldState:old});
			}
		}else if(state === 1 || state === 2 ){
			if(old === 0 || old === 3 ||old === 4 ){//之前插入
				fireEvents('cardPop',{cardState:state,oldState:old});
			}
			if(old != state)fireEvents('cardPop',{cardState:state});
		}else{
			fireEvents('error',{msg:'读取读卡器状态失败',error:e});
		}
		old=state;
	}
	cardListenerKey = setInterval(listenCardState,100);  
}
function stopListenCard(){console.info('stopListenCard');
	if(cardListenerKey)clearInterval(cardListenerKey);
}

function readCard(){console.info('readCard');
	try{
		var cardNo = UMSReadCard();
		fireEvents('cardRead',{cardNo:cardNo});
		return {cardNo:cardNo};
	}catch(e){
		fireEvents('error',{msg:'设备异常',error:e});
		return;
	}
}

function startPin(){ console.info('startPin');
	UMSStartPin();
	fireEvents('pinOpen');
}
function listenPin(){ console.info('listenPin');
	var time,pin=0;
	function listenPinKey(){
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
			clearInterval(time);
			setTimeout(readPin,100);
		}else if(key==255){//没按
		}else if(key==2){//超时
			fireEvents('pinTimeOut');
			clearInterval(time);
		}else{//未知键值!
			fireEvents('error',{msg:'未知键值:'+key});
			clearInterval(time);
		}
	}
	time = setInterval(listenPinKey,100);  
	//readPin();
}
function readPin(){console.info('readPin');
	UMSGetPin();//读取密文
	fireEvents('pinReaded');
}

function popCard(){console.info('popCard');
	if(!UP_Device) UP_Device= document.getElementById(DEVICE_ID);
	if(!UP_Device){
		fireEvents('error',{msg:"找不到ocx控件"});
		return;
	}
	UMSEjectCard();
	//循环等待取走卡片
	var popkey,count =0,timeout = 30*1000;
	function listenCardState(){
		count+=100;
		var state = UMSCheckCard();
		if(state === 2){// 已经取走
			clearInterval(popkey);
		}else if(count>timeout && state === 1 ){//时间到并且依然在卡口
			clearInterval(popkey);
			UMSCardSwallow();
		}
	}
	popkey = setInterval(listenCardState,100); 
}
function pay(req){console.info('pay');
	try {
		UMSSetReq(req);
		var resp = UMSTransCard(req);
		if(resp.stateCode == '0'){
			console.info('解析返回字符串');
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
			console.info('解析结果');
			console.dir(result);
			return {stateCode:resp.stateCode,result:result}
		}else{
			throw new Error("交易异常");
		}
	} catch (e) {
		throw new Error("交易异常");
	}
	
}
function startPay(){
	var ret = init();
	if(ret !== -1){
		return openCard();
	}else{
		return false;
	}
}
function startAndListenPin(){
	startPin();
	listenPin();
}


const UP={
	DEVICE: UP_Device,
	UMS : UMS,
	payEvent:addListener,
	init : init,
	openCard : openCard,
	listenCard : listenCard,
	stopListenCard : stopListenCard,
	readCard : readCard, 
	popCard : popCard ,
	startPin : startPin ,
	listenPin : listenPin ,
	readPin : readPin,
	pay : pay,
	startPay:startPay,
	startAndListenPin:startAndListenPin,
}
export default UP;
