import eventUtil from './eventUtil.jsx';
import baseUtil from './baseUtil.jsx';
import moment from 'moment';
const eventFlag = "cardPrint";

const PRINTER_ID = "hitiActiveX";
const PRINTER_KEY = "636265822144";
var PRINTER;

const dev_mode = baseUtil.dev_mode;
const PRINTER_dev = {
 CheckPrinterStatus:function(){return 0},
 movecard:function(){return 0},
 DoCommand:function(){return 0},
 WriteCard:function(){return 0},
 PrintCard:function(){return 0},
 DirectPrint:function(){return 0},
 SetStandbyParameter:function(){return 0},
 ReadCard:function(){
	 const {Key,ShanQu,Kuai} = PRINTER;
	 if(ShanQu == '1'){
		 if(Kuai=='4'){//省市编码：第1扇区第1块(块编码为4)
			 PRINTER.ReadStr="5301";
		 }else if(Kuai=='5'){//区县编码：第1扇区第2块(块编码为5)
			 PRINTER.ReadStr="01";
		 }if(Kuai=='6'){//医疗机构类别：第1扇区第3块(块编码为6)
			 PRINTER.ReadStr="101";
		 } 
	 }else if(ShanQu == '2'){
		 if(Kuai=='8'){//顺序号：第2扇区第1块(块编码为7) 9位
			 var lsh = moment().format('X');
			 PRINTER.ReadStr=lsh.substring(1,10);
		 }else if(Kuai=='9'){//校验码：第2扇区第2块(块编码为8)
			 PRINTER.ReadStr="1";
		 }if(Kuai=='10'){//重复建卡标识：第2扇区第3块(块编码为9)
			 PRINTER.ReadStr="0";
		 } 
	 }
	 return 0;
 },
}
function init(){
	if(dev_mode)PRINTER = PRINTER_dev;
	if(!PRINTER) PRINTER = document.getElementById(PRINTER_ID);
	if(!PRINTER)throw new Error("找不到证卡打印机控件");
}
//检查打印机状态
function CheckPrinterStatus() {
	if(!PRINTER)init();
	var dwRet = PRINTER.CheckPrinterStatus();
	return dwRet;
//	if(dwRet == 0)alert("打印机准备就绪 ！");
//	if(dwRet == -1)console.info("打印机脱机！");
//	if(dwRet == -2)console.info("卡片用完！");
//	if(dwRet == -3)console.info("色带用完！");
//	if(dwRet == -4)console.info("打印机忙碌！");
//	if(dwRet == -5)console.info("打印机正在打印！");
//	if(dwRet == -6)console.info("卡卡！");
}


//移动卡片至非接位置
function moveToReader() {
	if(!PRINTER)init();
	var dwRet = PRINTER.movecard(3);
	
	if(dwRet != 0){
		record('moveToReader','failure');
		throw new Error("移动卡片至非接位置失败！");
	}else{
		record('moveToReader','success');
	}
}

//发送指定命令：重启打印机
function reset() {
	if(!PRINTER)init();
	var dwRet = PRINTER.DoCommand(100);
	
	if(dwRet != 0){
		record('reset','failure');
		throw new Error("重启失败！");
	}else{
		record('reset','success');
	}
}

//发送指定命令：清洁打印机
function clean() {
	if(!PRINTER)init();
	var dwRet = PRINTER.DoCommand(105);
	
	if(dwRet != 0){
		record('clean','failure');
		throw new Error("清洁打印机失败！");	
	}else{
		record('clean','success');
	}
}

function WriteCard(section,block,data) {// 
	if(!PRINTER)init();
	PRINTER.Key = PRINTER_KEY;//秘钥
	PRINTER.ShanQu = section;//扇区
	PRINTER.Kuai = block;//块
	PRINTER.WriteStr = data;//卡号
	var dwRet = PRINTER.WriteCard();
	
	if(dwRet  == 0){
		record('WriteCard','success');
		return;
	}else{
		record('WriteCard','failure');
		if(dwRet  = -1)throw new Error("数据为空！");
		else if(dwRet  == -2)throw new Error("卡号长度超过16位");
		else if(dwRet  == -3)throw new Error("写入失败，请检查秘钥！");
		else if(dwRet  == -4)throw new Error("未找到卡片！");
		else if(dwRet  == -5)throw new Error("打开端口失败！");
		else throw new Error("写卡失败");
	} 
}

function ReadCard(section,block) {
	if(!PRINTER)init();
	PRINTER.Key = PRINTER_KEY;
	PRINTER.ShanQu = section;
	PRINTER.Kuai = block;
	var dwRet = PRINTER.ReadCard();
	
	if(dwRet  == 0){
		var ReadStr = PRINTER.ReadStr;
		//record('ReadCard','success');
		return ReadStr;
	}else{
		//record('ReadCard','failure');
		if(dwRet  == -1)throw new Error("打开端口失败！");
		else if(dwRet  == -2)throw new Error("验证秘钥错误！");
		else if(dwRet  == -3)throw new Error("寻卡失败！");
		else throw new Error("写卡失败！");
	}
	
 }
//closeCardBackIn
function closeCardBackIn() {
	if(!PRINTER)init();
	var dwRet = PRINTER.DoCommand(204);//203
	
	if(dwRet != 0){
		record('closeCardBackIn','failure');
		throw new Error("关闭自动吸卡失败！");	
	}else{
		record('closeCardBackIn','success');
	}
 }
//closeCardBackIn
function openCardBackIn() {
	if(!PRINTER)init();
	var dwRet = PRINTER.DoCommand(203);//203
	
	if(dwRet != 0){
		record('openCardBackIn','failure');
		throw new Error("关闭自动吸卡失败！");	
	}else{
		record('openCardBackIn','success');
	}
 }
//移动卡片到翻转模块
function moveToFlip() {
	if(!PRINTER)init();
	var dwRet = PRINTER.movecard(6);
	
	if(dwRet != 0){
		record('moveToFlip','failure');
		throw new Error("移动卡片到翻转模块失败！");	
	}else{
		record('moveToFlip','success');
	}
 }

//从翻转模块移动卡片到打印位置
function moveToPrint() {
	if(!PRINTER)init();
	var dwRet = PRINTER.movecard(7);
	if(dwRet != 0){
		record('moveToPrint','failure');
		throw new Error("从翻转模块移动卡片到打印位置失败");
	}else{
		record('moveToPrint','success');
	}
 }

//打印就诊卡
function PrintCard(name,cardNo,type){
	if(!PRINTER)init();
	PRINTER.bFlag1 = 1;//0 不停滞 1 不停滞
	PRINTER.bFlag2 = 2;//卡片厚度 
	PRINTER.bFlag3 = 2;//横竖 1 竖 2横版
	
	//动态姓名字体参数
	PRINTER.NameFontSize = 40;//字体大小
	PRINTER.NameFontWeight = 1000;//粗细  400为正常  800为加粗
	PRINTER.NameFontName = "黑体";
	
	PRINTER.Name = name+'('+type+')';
	PRINTER.Name_X = 435+(10-name.length)*45;
	PRINTER.Name_Y = 528;	

	//静态健康号字体参数
	PRINTER.StaticCardNoFontSize = 40;//字体大小
	PRINTER.StaticCardNoFontWeight = 1000;//粗细  400为正常  800为加粗
	PRINTER.StaticCardNoFontName = "黑体";

	PRINTER.StaticCardNo = "健康号：";
	PRINTER.StaticCardNo_X = 632-(cardNo.length-10)*21;
	PRINTER.StaticCardNo_Y = 577;

	//动态健康号字体参数
	PRINTER.CardNoFontSize = 40;//字体大小
	PRINTER.CardNoFontWeight = 1000;//粗细  400为正常  800为加粗
	PRINTER.CardNoFontName = "黑体";

	PRINTER.CardNo = cardNo;//打印的就诊卡号
	PRINTER.CardNo_X = 780-(cardNo.length-10)*21;
	PRINTER.CardNo_Y = 577;
	
//	var printF = PRINTER.DirectPrint;
//	if(!printF)printF = PRINTER.PrintCard;
//	console.info('当前打印方法 ： ', printF);
	var ret = PRINTER.DirectPrint(); 
	console.info('打印指令返回' ,ret);
	if(ret == 0){
		record('PrintCard','success');
		return;
	}else{
		record('PrintCard','failure');
		if(ret == 1)throw new Error("打印机驱动不正确，打印失败！");
		else throw new Error("打印命令发送出错");
	}
	
}
//打印就诊卡
function testPrintCard(){
	if(!PRINTER)init();
	PRINTER.bFlag1 = 1;//1不显示错误信息    0为显示错误信息
	PRINTER.bFlag2 = 2;//1打印完毕不排除卡片一直停留在出卡口不回收   0为打印完毕排除卡片
	PRINTER.bFlag3 = 2;//1打印完毕移动到自定义位置 0为打印完毕不移动到自定义位置
	
	//动态姓名字体参数
	PRINTER.NameFontSize = 40;//字体大小
	PRINTER.NameFontWeight = 1000;//粗细  400为正常  800为加粗
	PRINTER.NameFontName = "黑体";
	
	PRINTER.Name = ' ';
	PRINTER.Name_X = 535+(10-PRINTER.Name.length)*45;
	PRINTER.Name_Y = 528;	

	//静态健康号字体参数
	PRINTER.StaticCardNoFontSize = 40;//字体大小
	PRINTER.StaticCardNoFontWeight = 1000;//粗细  400为正常  800为加粗
	PRINTER.StaticCardNoFontName = "黑体";

	PRINTER.StaticCardNo = ".";
	PRINTER.StaticCardNo_X = 500;
	PRINTER.StaticCardNo_Y = 577;

	//动态健康号字体参数
	PRINTER.CardNoFontSize = 40;//字体大小
	PRINTER.CardNoFontWeight = 1000;//粗细  400为正常  800为加粗
	PRINTER.CardNoFontName = "黑体";

	PRINTER.CardNo = ' ';//打印的就诊卡号
	PRINTER.CardNo_X = 780;
	PRINTER.CardNo_Y = 577;
	
	var ret = PRINTER.DirectPrint(); 
	if(ret == 0){
		record('testPrintCard','success');
		return;
	}else{
		record('testPrintCard','failure');
		if(ret == 1)throw new Error("打印机驱动不正确，打印失败！");
		else throw new Error("打印命令发送出错");
	}
	
}

//打印就诊卡
function printOperatorCard(name,cardNo,type){
	if(!PRINTER)init();
	PRINTER.bFlag1 = 1;//1不显示错误信息    0为显示错误信息
	PRINTER.bFlag2 = 2;//1打印完毕不排除卡片一直停留在出卡口不回收   0为打印完毕排除卡片
	PRINTER.bFlag3 = 2;//1打印完毕移动到自定义位置 0为打印完毕不移动到自定义位置
	
	//动态姓名字体参数
	PRINTER.NameFontSize = 40;//字体大小
	PRINTER.NameFontWeight = 1000;//粗细  400为正常  800为加粗
	PRINTER.NameFontName = "黑体";
	
	PRINTER.Name = name+'('+type+')';
	PRINTER.Name_X = 435+(10-name.length)*45;
	PRINTER.Name_Y = 528;	

	//静态健康号字体参数
	PRINTER.StaticCardNoFontSize = 40;//字体大小
	PRINTER.StaticCardNoFontWeight = 1000;//粗细  400为正常  800为加粗
	PRINTER.StaticCardNoFontName = "黑体";

	PRINTER.StaticCardNo = "健康号：";
	PRINTER.StaticCardNo_X = 632-(cardNo.length-10)*21;
	PRINTER.StaticCardNo_Y = 577;

	//动态健康号字体参数
	PRINTER.CardNoFontSize = 40;//字体大小
	PRINTER.CardNoFontWeight = 1000;//粗细  400为正常  800为加粗
	PRINTER.CardNoFontName = "黑体";

	PRINTER.CardNo = cardNo;//打印的就诊卡号
	PRINTER.CardNo_X = 780-(cardNo.length-10)*21;
	PRINTER.CardNo_Y = 577;
	
//	var printF = PRINTER.DirectPrint;
//	if(!printF)printF = PRINTER.PrintCard;
//	console.info('当前打印方法 ： ', printF);
	var ret = PRINTER.DirectPrint(); 
	console.info('发卡机打印指令返回' ,ret);
	if(ret == 0){
		record('PrintCard','success');
		return;
	}else{
		record('PrintCard','failure');
		if(ret == 1)throw new Error("打印机驱动不正确，打印失败！");
		else throw new Error("打印命令发送出错");
	}
	
}
//移动卡片至待取卡位置
function moveToEntrance() {
	if(!PRINTER)init();
	var dwRet = PRINTER.movecard(10);
	if(dwRet  == 0){
		record('moveToEntrance','success');
		return;
	}else {
		record('moveToEntrance','failure');
		throw new Error("移动卡片至待取卡位置失败！");
	}
 }
//移动卡片至待取卡位置
function moveToBasket() {
	if(!PRINTER)init();
	var dwRet = PRINTER.movecard(4);
	if(dwRet  == 0){
		record('moveToBasket','success');
		return;
	}else {
		record('moveToBasket','failure');
		throw new Error("移动卡片至废卡槽失败！");
	}
 }
//移动卡片至待取卡位置
function moveToOut() {
	if(!PRINTER)init();
	var dwRet = PRINTER.movecard(5);
	if(dwRet  == 0){
		record('moveToOut','success');
		return;
	}else{
		record('moveToOut','failure');
		throw new Error("移动卡片至出口位置失败！");
	}
}
//设置停滞位置和时间
function SetStandbyParameter() {
	if(!PRINTER)init();
	var dwRet = PRINTER.SetStandbyParameter(28,0);
	if(dwRet  == 0){
		record('SetStandbyParameter','success');
		return;
	}else {
		record('SetStandbyParameter','failure');
		throw new Error("设置停滞位置和时间失败！");
	}
}
/**
读上线后真实的就诊卡
省市编码：第1扇区第1块(块编码为4)
区县编码：第1扇区第2块(块编码为5)
医疗机构类别：第1扇区第3块(块编码为6)
顺序号：第2扇区第1块(块编码为7)
校验码：第2扇区第2块(块编码为8)
重复建卡标识：第2扇区第3块(块编码为9)
**/
function ReadCardNo() {
	try{
		var province = ReadCard(1,4);//省市编码：第1扇区第1块(块编码为4)
		console.info("省市编码 : "+province);
		var county = ReadCard(1,5);//区县编码：第1扇区第2块(块编码为5)
		console.info("区县编码 : "+county);
		var org = ReadCard(1,6);//医疗机构类别：第1扇区第3块(块编码为6)
		console.info("医疗机构类别 : "+org);
		var order = ReadCard(2,8);//顺序号：第2扇区第1块(块编码为7)
		console.info("顺序号 : "+order);
		var check = ReadCard(2,9);//校验码：第2扇区第2块(块编码为8)
		console.info("校验码 : "+check);
		var repeat = ReadCard(2,10);//重复建卡标识：第2扇区第3块(块编码为9)
		console.info("重复建卡标识 : "+repeat);
		var cardNo = province+county+org+order+check+repeat;
		record('ReadCardNo','success');
		return cardNo;
	}catch(e){
		record('ReadCardNo','failure');
		throw e;
	}
	
 }
function record(type,result){
	var day = moment().format('YYYY-MM-DD');
	var key = day+'_'+type+'_'+result;
	
	var count_str = window.localStorage.getItem(key);
	if(!count_str)count_str='1'
	var count = parseInt(count_str);
	count = count+1;
	window.localStorage.setItem( key, count );
}
function reduce(){
	var key = "CURRENT_CARD_NO";
	var count_str = window.localStorage.getItem(key);
	if(!count_str)count_str='0';
	
	var count = parseInt(count_str);
	count = count+1;
	window.localStorage.setItem( key, count );
}
const printer = {
  readCardNo:ReadCardNo,
  init:init,
  checkPrinterStatus:CheckPrinterStatus,//检查打印机状态
  moveToReader:moveToReader,//移动卡片至非接位置
  reset:reset,//发送指定命令：重启打印机
  clean:clean,//发送指定命令：清洁打印机
  writeCard:WriteCard,//
  readCard:ReadCard,//读卡
  moveToFlip:moveToFlip,//移动卡片到翻转模块
  moveToPrint:moveToPrint,	//从翻转模块移动卡片到打印位置
  printCard:PrintCard,//打印就诊卡
  moveToEntrance:moveToEntrance,//移动卡片至待取卡位置
  moveToOut:moveToOut,
  moveToBasket,
  testPrintCard,
  printOperatorCard,
  openCardBackIn,
  closeCardBackIn,
  setStandbyParameter:SetStandbyParameter, //设置停滞位置和时间
}

var errors = [
{name:'PAVO_DS_OFFLINE',code: 128,oxCode:'0x00000080',desc:'打印机离线'},
{name:'PAVO_DS_PRINTING',code: 2,oxCode:'0x00000002',desc:'正在打印'},
{name:'PAVO_DS_PROCESSING_DATA',code: 5,oxCode:'0x00000005',desc:'驱动正在处理打印数据'},
{name:'PAVO_DS_SENDING_DATA',code: 6,oxCode:'0x00000006',desc:'驱动正在发送数据给打印机'},
{name:'PAVO_DS_CARD_MISMATCH',code: 65790,oxCode:'0x000100FE',desc:'卡片不匹配'},
{name:'PAVO_DS_CMD_SEQ_ERROR',code:197118,oxCode:'0x000301FE',desc:'指令序列错误'},
{name:'PAVO_DS_SRAM_ERROR',code:196609,oxCode:'0x00030001',desc:'SRAM错误'},
{name:'PAVO_DS_SDRAM_ERROR',code:196865,oxCode:'0x00030101',desc:'SDRAM错误'},
{name:'PAVO_DS_ADC_ERROR',code:197121,oxCode:'0x00030201',desc:'ADC错误'},
{name:'PAVO_DS_NVRAM_ERROR',code:197377,oxCode:'0x00030301',desc:'NVRAM R/W错误'},
{name:'PAVO_DS_SDRAM_CHECKSUM_ERROR',code:197378,oxCode:'0x00030302',desc:'	检查总数错误 - SDRAM'},
{name:'PAVO_DS_FW_WRITE_ERROR',code	:198401,oxCode:'0x00030701',desc:'固件写入错误'},
{name:'PAVO_DS_COVER_OPEN',code	:327681,oxCode:'0x00050001',desc:'上盖打开'},
{name:'PAVO_DS_REJECT_BOX_MISSING',code	:328449,oxCode:'0x00050301',desc:'未检测到废料盒'},
{name:'PAVO_DS_REJECT_BOX_FULL',code:328705,oxCode:'0x00050401',desc:'废料盒已满'},
{name:'PAVO_DS_CARD_OUT',code:32768,oxCode:'0x00008000',desc:'出卡/进卡失败'},
{name:'PAVO_DS_CARD_LOW',code:32769,oxCode:'0x00008001',desc:'卡片过低'},
{name:'PAVO_DS_RIBBON_MISSING',code:524292,oxCode:'0x00080004',desc:'未检测到色带'},
{name:'PAVO_DS_OUT_OF_RIBBON',code:524547,oxCode:'0x00080103',desc:'色带用完'},
{name:'PAVO_DS_RIBBON_IC_RW_ERROR',code:525566,oxCode:'0x000804FE',desc:'色带芯片读写错误'},
{name:'PAVO_DS_UNSUPPORT_RIBBON',code:526078,oxCode:'0x000806FE',desc:'色带类型不符'},
{name:'PAVO_DS_UNKNOWN_RIBBON',code:526590,oxCode:'0x000808FE',desc:'未知色带'},
{name:'PAVO_DS_CARD_JAM1',code:196608,oxCode:'0x00030000',desc:'卡片阻塞在打印机内'},
{name:'PAVO_DS_CARD_JAM2',code:262144,oxCode:'0x00040000',desc:'卡片阻塞在翻转模块'},
{name:'PAVO_DS_CARD_JAM3',code:327680,oxCode:'0x00050000',desc:'卡片阻塞在废料盒'},
{name:'PAVO_DS_WRITE_FAIL',code:31,oxCode:'0x0000001F',desc:'发送指令到打印机失败'},
{name:'PAVO_DS_READ_FAIL',code:47,oxCode:'0x0000002F',desc:'从打印机读取指令失败'},
{name:'PAVO_DS_CARD_THICK_WRONG',code:32780,oxCode:'0x00008010',desc:'厚度选择器没有安装在正确的位置'},
{name:'PAVO_DS_NO_FLIPPER_MODULE',code:285212685,oxCode:'0x1100000D',desc:'未检测到翻转模块'},
{name:'SCARD_E_NO_SMARTCARD',code:2148532236,oxCode:'0x8010000C',desc:'未检测到智能卡'},
{name:'PAVO_DS_LOCKED',code	:30016,oxCode:'0x00007540',desc:'打印机锁定'},
{name:'ERROR_MAGCARD_CONNECT_FAIL',code: 1850,oxCode:'',desc:'无法连接到磁编码模块'},
{name:'ERROR_MAGCARD_READ_FAIL',code:1851,oxCode:'',desc:'读取磁卡信息失败'},
{name:'ERROR_MAGCARD_WRITE_FAIL',code:1852,oxCode:'',desc:'写入磁卡信息失败'},
{name:'ERROR_MAGCARD_NO_TRACK_SELECTED',code:1853,oxCode:'',desc:'未指定读写的磁道'},
{name:'ERROR_MAGCARD_EMPTY_TRACK_DATA',code :1855,oxCode:'',desc:'相应磁道内无数据内容'},
{name:'ERROR_MAGCARD_NO_MODULE',code:1856,oxCode:'',desc:'	未添加磁编码模块'},
{name:'PAVO_DS_0100_COVER_OPEN',code:256,oxCode:'0x00000100',desc:'打印机上盖打开'},
{name:'PAVO_DS_0101_FLIPPER_COVER_OPEN',code:257,oxCode:'0x00000101',desc:'翻转模块上盖打开'},
{name:'PAVO_DS_0200_IC_MISSING',code: 200,oxCode:'0x00000200',desc:'未检测到色带芯片'},
{name:'PAVO_DS_0201_RIBBON_MISSING',code: 513,oxCode:'0x00000201',desc:'未检测到色带'},
{name:'PAVO_DS_0202_RIBON_MISMATCH',code: 514,oxCode:'0x00000202',desc:'色带不匹配'},
{name:'PAVO_DS_0203_RIBBON_TYPE_ERROR',code: 515,oxCode:'0x00000203',desc:'色带类型错误'},
{name:'PAVO_DS_0300_RIBBON_SEARCH_FAIL',code:768,oxCode:'0x00000300',desc:'检测色带失败'},
{name:'PAVO_DS_0301_RIBBON_OUT',code: 769,oxCode:'0x00000301',desc:'色带用完'},
{name:'PAVO_DS_0302_PRINT_FAIL',code: 770,oxCode:'0x00000302',desc:'打印失败'},
{name:'PAVO_DS_0303_PRINT_FAIL',code: 771,oxCode:'0x00000303',desc:'打印失败'},
{name:'PAVO_DS_0304_RIBBON_OUT',code: 772,oxCode:'0x00000304',desc:'色带用完'},
{name:'PAVO_DS_0400_CARD_OUT',code: 1024,oxCode:'0x00000400',desc:'卡片用完'},
{name:'PAVO_DS_0500_CARD_JAM',code: 1280,oxCode:'0x00000500',desc:'卡片阻塞'},
{name:'PAVO_DS_0501_CARD_JAM',code: 1281,oxCode:'0x00000501',desc:'卡片阻塞'},
{name:'PAVO_DS_0502_CARD_JAM',code: 1282,oxCode:'0x00000502',desc:'卡片阻塞'},
{name:'PAVO_DS_0503_CARD_JAM',code: 1283,oxCode:'0x00000503',desc:'卡片阻塞'},
{name:'PAVO_DS_0504_CARD_JAM',code: 1284,oxCode:'0x00000504',desc:'卡片阻塞'},
{name:'PAVO_DS_0505_CARD_JAM',code: 1285,oxCode:'0x00000505',desc:'卡片阻塞'},
{name:'PAVO_DS_0506_CARD_JAM',code: 1286,oxCode:'0x00000506',desc:'卡片阻塞'},
{name:'PAVO_DS_0507_CARD_JAM',code: 1287,oxCode:'0x00000507',desc:'卡片阻塞'},
{name:'PAVO_DS_0508_CARD_JAM',code: 1288,oxCode:'0x00000508',desc:'卡片阻塞'},
{name:'PAVO_DS_0600_CARD_MISMATCH',code: 1536,oxCode:'0x00000600',desc:'卡片不匹配'},
{name:'PAVO_DS_0700_CAM_ERROR',code:1792,oxCode:'0x00000700',desc:'	凸轮错误'},
{name:'PAVO_DS_0800_FLIPPER_ERROR',code: 2048,oxCode:'0x00000800',desc:'翻转模块错误'},
{name:'PAVO_DS_0801_FLIPPER_ERROR',code: 2049,oxCode:'0x00000801',desc:'翻转模块错误'},
{name:'PAVO_DS_0802_FLIPPER_ERROR',code: 2050,oxCode:'0x00000802',desc:'翻转模块错误'},
{name:'PAVO_DS_0803_FLIPPER_ERROR',code: 2051,oxCode:'0x00000803',desc:'翻转模块错误'},
{name:'PAVO_DS_0900_NVRAM_ERROR',code: 2304,oxCode:'0x00000900',desc:'NVRAM错误'},
{name:'PAVO_DS_1000_RIBBON_ERROR',code: 4096,oxCode:'0x00001000',desc:'色带错误'},
{name:'PAVO_DS_1100_RBN_TAKE_CALIB_FAIL',code: 4352,oxCode:'0x00001100',desc:'色带回收滚轮校准失败'},
{name:'PAVO_DS_1101_RBN_SUPPLY_CALIB_FAIL',code: 4353,oxCode:'0x00001101',desc:'色带供给滚轮校准失败'},
{name:'PAVO_DS_1200_ADC_ERROR',code:4608,oxCode:'0x00001200',desc:'ADC错误'},
{name:'PAVO_DS_1300_FW_ERROR',code: 4864,oxCode:'0x00001300',desc:'固件错误'},
{name:'PAVO_DS_1301_FW_ERROR',code: 4865,oxCode:'0x00001301',desc:'固件错误'},
{name:'PAVO_DS_1400_POWER_SUPPLY_ERROR',code:5120,oxCode:'0x00001400',desc:'供电错误'},
];

var statusErrors = {
	'-1':'打印机脱机！,请联系管理人员',
	'-2':'卡片用完！,请联系管理人员添加',
	'-3':'色带用完！,请联系管理人员添加',
	'-4':'打印机忙碌！,请稍后再试',
	'-5':'打印机忙碌！,请稍后再试',
	'-6':'打印机卡卡！,请联系管理人员',
	'1024':'卡片用完！,请联系管理人员添加',
	'769':'色带用完！,请联系管理人员添加',
	'772':'色带用完！,请联系管理人员添加',
}
printer.getErrorMsg=function(status){
	var msg = statusErrors[status+'']
	if(msg)return msg;
	else return '打印机异常，请联系管理人员'
}
//printer.errors = errors;
//for(var error of errors){
//	console.info("{'"+error.code+"':"+JSON.stringify(error)+"},");
//}
module.exports = printer;