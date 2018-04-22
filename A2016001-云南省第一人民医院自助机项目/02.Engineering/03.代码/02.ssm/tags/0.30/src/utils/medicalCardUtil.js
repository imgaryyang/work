//import eventUtil from './eventUtil';
//import baseUtil from './baseUtil';
//import lightUtil from './lightUtil';
//const Light = lightUtil.medicalCard;
//const logger = baseUtil.getLogger('medicalCardUtil'); 
//const DEVICE_ID="LHSSMDeviceActiveX",
//	secretKey="636265822144" /*"ffffffffffff"*/,
//	
//	eventFlag = "medicalCard",
//	dev_mode = baseUtil.dev_mode;;
//let DEVICE,DEVICE_Handle=null;
//
///***以下是开发模式***/
//const emptyF = function(){};
//var DEVICE_dev_state = 0;
//const DEVICE_dev = {
//		LH_IDC_OpenDevice:function(){setTimeout(()=>{DEVICE_dev_state = 2 },1*2000); return "{\"stateCode\":0,\"nHandle\":0}"},
//		LH_IDC_GetStatus:function(){ return "{\"stateCode\":\""+DEVICE_dev_state+"\",\"nHandle\":\"200\"}"},//口内
//		LH_IDC_M1Detect:emptyF,//寻卡
//		LH_IDC_M1LoadSecKey:emptyF,//校验密钥
//		LH_IDC_M1ReadBlock:function(h,s,b){
//			var d = "";
//			if(s==1){
//				if(b==0){
//					d= "5301";
//				}else if(b==1){
//					d= "01";
//				}else if(b==2){
//					d= "101";
//				}
//			}else if(s==2){
//				if(b==0){
//					d= "000003009";
//					//d= "100000816";
//					//d= "000000000";
//					d = "000075938";
//					d = '000078180'
//					d = '000076138';
//					// d = '000026735'
//					// 53010110100007593810
//					// 53010110110
//				}else if(b==1){
//					d= "1";
//				//	d="9"
//				}else if(b==2){
//					d= "0";
//				}
//			}//0001 8999 9668 9615 63 03
//			
//			return "{\"stateCode\":0,\"idNo\": \"421022197901131833\", \"name\": \"黄勇\",\"cardNo\":\""+d+"\"}"
//		},
//		LH_IDC_Accept:emptyF,//允许进卡
//		LH_IDC_Eject:function(){DEVICE_dev_state = 0},
//		LH_IDC_CloseDevice:function(){DEVICE_dev_state = 0},
//		LH_IDC_Capture:emptyF,
//}
///***开发模式定义结束***/
//
//function addListener(event,func){
//	eventUtil.addListener(eventFlag,event,func);
//}
//function removeListener(event,index){
//	eventUtil.removeListener(eventFlag,event,index);
//}
//function fireEvents(event,arg){
//	eventUtil.fireEvents(eventFlag,event,arg);
//}
//
///**
// * 支持的事件
// * cardPushed 插卡
// * cardPoped 拔卡
// * cardSwallowed 吞卡
// */
//function init(){
//	
//	if(dev_mode)DEVICE = DEVICE_dev;
//	if(!DEVICE) DEVICE = document.getElementById(DEVICE_ID);
//	if(!DEVICE)throw new Error("找不到ocx控件");
//	
//	var json = DEVICE.LH_IDC_OpenDevice("COM6:9600:E:8:1",2);
//	logger.log('init : ' + json);
//	var obj = JSON.parse(json);
//	if(obj.stateCode != 0 )throw new Error("就诊卡读卡器初始化失败");
//	DEVICE_Handle = obj.nHandle;
//	return obj.nHandle;
//}
///**
// * 获取状态
// * @param nHandle
// * @returns
// */
//function getStatus(){
//	if(null === DEVICE_Handle)init();
//	var json = DEVICE.LH_IDC_GetStatus(DEVICE_Handle);
//	var obj = JSON.parse(json);
//	/* if(obj.stateCode != 0 && obj.stateCode != 1 && obj.stateCode != 2)
//		throw new Error("读取诊疗卡状态出错，状态码出错,code = "+ obj.stateCode);*/
//	return obj.stateCode;
//}
//function readCard(){//TODO 根据实际情况获取信息
//	if(null === DEVICE_Handle)init();
//	DEVICE.LH_IDC_M1Detect(DEVICE_Handle);//寻卡
//	var cardNo = readCardNo();
//	return {cardNo:cardNo};
//}
//function readBlock(section,block){
//	DEVICE.LH_IDC_M1LoadSecKey(DEVICE_Handle,section,block,secretKey);
//	var json = DEVICE.LH_IDC_M1ReadBlock(DEVICE_Handle,section,block);
//	var obj = JSON.parse(json);
//	if(obj.stateCode != 0)throw new Error("读取诊疗卡数据出错，状态码 :"+ obj.stateCode);
//	return obj.cardNo;
//}
//function readCardNo(){
//	var cardNo1 = readBlock(1,0);//省市编码：第1扇区第1块(块编码为0)
//	var cardNo2 = readBlock(1,1);//区县编码：第1扇区第2块(块编码为1)
//	var cardNo3 = readBlock(1,2);//医疗机构类别：第1扇区第3块(块编码为3)
//	var cardNo4 = readBlock(2,0);//顺序号：第2扇区第1块(块编码为0)
//	var cardNo5 = readBlock(2,1);//校验码：第2扇区第2块(块编码为1)
//	var cardNo6 = readBlock(2,2);//重复建卡标识：第2扇区第3块(块编码为2)
//	logger.log('省市编码:'+cardNo1);
//	logger.log('区县编码 :'+cardNo2);
//	logger.log('医疗机构类别 : '+cardNo3);
//	logger.log('顺序号 : '+cardNo4);
//	logger.log('校验码:'+cardNo5);
//	logger.log('重复建卡标识:'+cardNo6);
//	return cardNo1+cardNo2+cardNo3+cardNo4+cardNo5+cardNo6;
//}
///**
// * 打开读卡设备并开始监听,监听到卡触发插卡事件、并停止监听
// */
//function listenCard(){
//	logger.log('listenCard : ');
//	if(null === DEVICE_Handle)init();
//	var status = getStatus();
//	if(status == 2){//卡在内部
//		Light.turnOn();
//		var cardInfo = readCard();
//		fireEvents('cardPushed',cardInfo);
//	}else{
//		Light.blink();
//		var json = DEVICE.LH_IDC_Accept(DEVICE_Handle, 2);//允许进卡
//		logger.log('Accept : '+json);
//		startListenLoop();//开始循环
//	}
//}
//
//var looping = false;
//
//function stopListenCard(){
//	logger.log('stopListenCard');
//	looping = false;//停止循环
//}
//
//function startListenLoop(){//0.读卡器中无卡 1.卡在门口 2.卡在机内
//	logger.log('startListenLoop');
//	if(null === DEVICE_Handle)init();
//	var old = getStatus();
//	if(old == 2 ){/**之前插入*/}
//	function listenCardState(){logger.log('startListenLoop ');
//		if(!looping)return;//防止时间差带来的错误
//		var state = getStatus();
//		//logger.log('listenCardState{old:'+old+",state:"+state+"}");
//		if(state == 2 && old != 2 ){// 之前无卡，现在有卡，
//			var cardInfo = readCard();
//			stopListenCard();//停止循环
//			Light.turnOn();
//			fireEvents('cardPushed',cardInfo);//触发插卡
//		}else if(state != 2 && old == 2 ){// 之前有卡，现在无卡，触发弹卡
//			Light.turnOff();
//			fireEvents('cardPoped',{cardState:state,oldState:old});
//		}else{
//			fireEvents('error',{msg:'读取读卡器状态失败,state:'+state});
//		}
//		old=state;
//		if(looping)setTimeout(listenCardState,500);
//	}
//	looping = true;
//	setTimeout(listenCardState,200);  
//}
////退卡
//function popCard(){
//	Light.blink();
//	if(null === DEVICE_Handle)init();
//	stopListenCard();//如果有监听，停止循环
//	fireEvents('cardPoped');
//	DEVICE.LH_IDC_Eject(DEVICE_Handle);
//	logger.log('popCard');
//}
//function closeDevice(){
//	Light.turnOff();
//	stopListenCard();//停止循环
//	if(null !== DEVICE_Handle)DEVICE.LH_IDC_CloseDevice(DEVICE_Handle);
//	DEVICE_Handle=null;
//	logger.log('closeDevice');
//}
////开启超时吞卡处理
//function swallowWhenTimeout(time){
//	var key,t=0;
//	function listenCardState(){logger.log('swallowWhenTimeout ',time);
//		try {
//			var state = getStatus();//1 口 0 无 2 内
//			if (state == 1 || state == 2) {//未取走
//				if (t >= time) {//超时 
//					DEVICE.LH_IDC_Capture(DEVICE_Handle)//吞卡
//					closeDevice()//关闭设备
//					return;
//				}
//			} else if (state == 0) {// 取走
//				closeDevice()//关闭设备
//				return ;
//			}
//			t = t + 200;
//		} catch (e) {
//			throw e;
//		}
//		setTimeout(listenCardState,200);
//	}
//	setTimeout(listenCardState,200);
//}
////安全退卡
//function safePopCard(time){
//	if(null === DEVICE_Handle)init();
//	var state = getStatus();//1 口 0 无 2 内
//	if(state == 0 ){
//		closeDevice()//关闭设备
//		return ;
//	}
//	if(state == 2 )popCard();
//	if(!time)time=30*1000;
//	swallowWhenTimeout(time);
//}
//const MCARD={
//	listenCard:listenCard,//监听到卡返回卡信息并停止监听
//	stopListenCard : stopListenCard,
//	safeClose:safePopCard,
//	on:addListener,
//	un:removeListener,
//}
//export default MCARD;
