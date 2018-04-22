import eventUtil from './eventUtil';
import baseUtil from './baseUtil';
import LodopFuncs from './LodopFuncs';
import moment                   from 'moment';
import lightUtil from './lightUtil';

const logger = baseUtil.getLogger('print'); 
const eventFlag = "print";

const LODAP_ID = "LODOP_OB";
const MS_PRINTER_ID = "MSPrintActiveX";

var LODAP,MS_PRINTER,JOB_ID;

const dev_mode = baseUtil.dev_mode;

const PRINTER_dev = {
		
}
const LODAP_dev ={
		
}
async function  waitForPrint(JOB_ID){
	var status = 1;
	while(status == 1){
		await baseUtil.sleep(12*1000);
		status = lodopPrintStatus(JOB_ID);
		logger.log('lodopPrintStatus status ',status);
	}
}
function init(){
	if(dev_mode){return;}
	if(!LODAP) LODAP = document.getElementById(LODAP_ID);
	if(!MS_PRINTER) MS_PRINTER = document.getElementById(MS_PRINTER_ID);
	
	if(!LODAP)throw new Error("找不到报告打印机控件");
	if(!MS_PRINTER)throw new Error("找不到热敏打印机控件");
}
function getMSPrinterStatus(){
	if(dev_mode )return  {state:0,msg:''};
	init();
	console.info('MS_PRINTER ',MS_PRINTER);
	var json = -1;
	try {
		var setPrintport = MS_PRINTER.SetPrintport("COM5",38400);//设置串口
		var setInit = MS_PRINTER.SetInit();//打印机初始化
		json = MS_PRINTER.GetStatus();
		var resultCode = MS_PRINTER.SetClose();;//打印机关闭
	} catch (e) {
		console.info(e);
		return {state:json,msg:'凭条打印机故障，请联系工作人员',exception:'异常'+e};
	}
	console.info('getMSPrinterStatus ', json );
	if(json == 0){
		return {state:json,msg:''};
	}else  if(json == 1){
		return {state:json,msg:'凭条打印机通讯故障，请联系工作人员',exception:'打印机未连接或未上电'};
	}else  if(json == 2){
		return {state:json,msg:'无法打印凭条，请联系工作人员',exception:'打印机和调用库不匹配'};
	}else  if(json == 3){
		return {state:json,msg:'无法打印凭条，请联系工作人员',exception:'打印头打开'};
	}else  if(json == 4){
		return {state:json,msg:'凭条打印机无法切纸，请联系工作人员',exception:'切刀未复位'};
	}else  if(json == 5){
		return {state:json,msg:'凭条打印机过热，请稍后再试',exception:'打印头过热'};
	}else  if(json == 6){
		return {state:json,msg:'打印纸规格错误，请联系工作人员',exception:'黑标错误'};
	}else  if(json == 7){
		return {state:json,msg:'凭条纸不足，请联系工作人员添加凭条打印纸',exception:'纸尽'};
	}else  if(json == 8){
		return {state:json,msg:'凭条纸不足，请联系工作人员添加凭条打印纸',exception:'纸将尽'};
	}else{
		return {state:json,msg:'凭条打印机故障，请联系工作人员',exception:'异常'};
	}
	return json;
}
/**
 * 打印病历
 * @returns
 */
async function  printMedicalRecord(msg){
	if(dev_mode){return;}
	lightUtil.form.blink();
	init();
	//LODOP.SET_PRINTER_INDEX("Hewlett-Packard HP LaserJet 400 M401d");
	//LODOP.SET_PRINTER_INDEX("Canon LBP3000");
	/*var regStr = "</div>"; // 要计算的字符
	var regex = new RegExp(regStr, 'g'); // 使用g表示整个字符串都要匹配
	var result = msg.match(regex);
	var count = !result ? 0 : result.length;
	if(count == 1){//表示只有一个病例
		var LODOP = LodopFuncs.getLodop();
		LODOP.PRINT_INITA("0cm","0.1cm",800,800,"门诊病历");
		LODOP.ADD_PRINT_HTML("0cm","0.1cm","100%","100%",msg);
		LODOP.SET_PRINTER_INDEX("Hewlett-Packard HP LaserJet 400 M401d");
		LODOP.PRINT();
	}
	if(count == 2){//表示还有附加病历
		var divIndex = msg.indexOf("</div>");
		var div1 = msg.substring(0,divIndex+6);
		var div2 = msg.substring(divIndex+6,msg.length);
		var LODOP = LodopFuncs.getLodop();
		LODOP.PRINT_INITA("0cm","0.1cm",800,800,"门诊病历"); 
		LODOP.ADD_PRINT_HTML("0cm","0.1cm","100%","100%",msg);
		LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT","Width:100%;Height:100%");
		LODOP.SET_PRINTER_INDEX("Hewlett-Packard HP LaserJet 400 M401d");
		LODOP.PRINT();
		//LODOP.PREVIEW();
	}*/
	// LODOP.print.....调用打印机方法
	var LODOP = LodopFuncs.getLodop();
	LODOP.PRINT_INITA("0cm","0.1cm",800,800,"门诊病历");
	LODOP.ADD_PRINT_HTML("0cm","0.1cm","100%","100%",msg);
	//A5纸打印
	//LODOP.SET_PRINT_PAGESIZE(2,"14.8cm","21cm","");
	LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS",true);
	LODOP.SET_PRINTER_INDEX("Canon LBP3000");
	//LODOP.SET_PRINTER_INDEX(-1);
	JOB_ID = LODOP.PRINT();
	await waitForPrint(JOB_ID);
	lightUtil.form.turnOff();
	return JOB_ID;
}

/**
 * 打印图片检验报告
 * @returns
 */
async function printCommonAssay(imagePath){
	if(dev_mode){return;}
	lightUtil.form.blink();
	init();
	// LODOP.print.....调用打印机方法
	let LODOP = LodopFuncs.getLodop();
	LODOP.PRINT_INIT("检查单报告");
	LODOP.ADD_PRINT_IMAGE("0cm","0.1cm","100%","100%","<img border='0' src='"+imagePath+"' />");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);//按原图比例(不变形)缩放模式
	LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS",true);
	LODOP.SET_PRINTER_INDEX("Canon LBP3000");
	//LODOP.SET_PRINTER_INDEX(-1);
	JOB_ID = LODOP.PRINT();
	await waitForPrint(JOB_ID);
	lightUtil.form.turnOff();
	return JOB_ID;
}
/**
 * 打印血液科检验报告
 * @returns
 */
async function printBloodAssay(result){
	if(dev_mode){return;}
	lightUtil.form.blink();
	init();
	/**
	 * orderno-标本号;jyname-试验项目;result-结果;
	 * jydate-检验日期;jydoctor-检验者;bgdate-;
	 * bgdoctor-;shdate-审核日期;shdoctor-审核者
	**/
	// LODOP.print.....调用打印机方法
	let hospital = "云南省第一人民医院";
	let reportType = result.jymodelname;
	let specimenNo = result.orderno;
	let medicalRecordNo = result.patientNo;
	let patientName = result.patientName;
	let gender = result.patientSex;
	let age = result.patientAge;
	let department = result.patientDeptname;
	let inpatientArea = result.inpatientArea;
	let bedNo = result.bedNo;
	let diagnosis = result.clinicalDiagnosis;
	let orderDate = result.orderdate;
	let checkDoctor = result.jsdoctor;
	let reportDate = result.auditDate;
	
	let LODOP = LodopFuncs.getLodop();
	
	LODOP.PRINT_INIT("血液科报告");
	//LODOP.SET_PRINT_STYLE("FontSize",10);
	//LODOP.ADD_PRINT_RECT(0,5,755,500,0,1);
	LODOP.ADD_PRINT_TEXT(20,267,260,30,hospital);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
	LODOP.SET_PRINT_STYLEA(0,"Bold",1);
	LODOP.ADD_PRINT_TEXT(45,280,220,30,reportType);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",14);
	LODOP.SET_PRINT_STYLEA(0,"Bold",1);
	LODOP.ADD_PRINT_TEXT(75,30,76,26,"标本号：");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(75,87,106,26,specimenNo);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(101,30,76,26,"病案号：");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(101,87,106,26,medicalRecordNo);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(101,227,60,26,"姓名：");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(101,271,83,26,patientName);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(101,370,60,26,"性别：");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(101,414,38,26,gender);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(101,491,60,26,"年龄：");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(101,535,60,26,age);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(127,30,76,26,"科别：");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(127,87,106,26,department);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(127,227,60,26,"病区：");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(127,271,83,26,inpatientArea);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(127,491,60,26,"床号：");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(127,535,60,26,bedNo);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(153,30,76,26,"诊断：");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(153,87,106,26,diagnosis);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(190,100,180,26,"项目");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT(190,280,310,26,"反映格局");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
	LODOP.ADD_PRINT_TEXT(190,590,115,26,"检测结果");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_SHAPE(1,210,20,715,1,0,1,"#000000");
	var startHeight = 216;
	var startTextHeight = 237;
	var fixedHeight = 26;
	var temp;
	var i;
	for(i=0;i<result.details.length;i++){
		LODOP.ADD_PRINT_TEXT((startHeight+(fixedHeight*i)),30,250,26,result.details[i].id.jyname);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
		LODOP.ADD_PRINT_TEXT((startHeight+(fixedHeight*i)),280,310,26,result.details[i].result_fygj);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
		LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
		LODOP.ADD_PRINT_TEXT((startHeight+(fixedHeight*i)),590,115,26,result.details[i].result);
		LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
		temp = i;
	}
	LODOP.ADD_PRINT_SHAPE(1,(startHeight+(fixedHeight*(temp+1))),20,715,1,0,1,"#000000");
	LODOP.ADD_PRINT_TEXT((startTextHeight+(fixedHeight*(temp+1))),30,125,26,"标本接收时间：");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT((startTextHeight+(fixedHeight*(temp+1))),136,162,26,orderDate);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT((startTextHeight+(fixedHeight*(temp+1))),301,76,26,"检测者：");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT((startTextHeight+(fixedHeight*(temp+1))),361,151,26,checkDoctor);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT((startTextHeight+(fixedHeight*(temp+1))),513,94,26,"报告时间：");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT((startTextHeight+(fixedHeight*(temp+1))),589,162,26,reportDate);
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.ADD_PRINT_TEXT((startTextHeight+(fixedHeight*(temp+2))),30,254,26,"注：次结果仅对此标本有效");
	LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
	LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS",true);
	LODOP.SET_PRINTER_INDEX("Canon LBP3000");
	//LODOP.SET_PRINTER_INDEX(-1);
	JOB_ID = LODOP.PRINT();
	await waitForPrint(JOB_ID);
	lightUtil.form.turnOff();
	return JOB_ID;
}

/**
 * 打印现金明细
 * @returns
 */
async function printCashDetails(result){
	
}

//PRINT_STATUS_EXIST---判断该打印任务是否还处在队列中,1-在:表示还没有打印完成;0-不在:表示打印完成
function lodopPrintStatus(result){
	if(dev_mode){return 0;}
	var LODOP = LodopFuncs.getLodop();
	var status = LODOP.GET_VALUE("PRINT_STATUS_EXIST",result);
	return status;
}

/**
 * 打印预约
 * @returns
 */
function printAppoint(result){
	if(dev_mode){return;}
	lightUtil.ticket.blink();
	init();
	// MS_PRINTER.print.....调用打印机方法
	var title = "门诊预约单";
	var hospitalArea = result.hospitalDistrictName;//"新院区";
	var deptName = result.deptName;//"呼吸内科";
	var houseLocation = result.houseLocation;
	var doctorName = result.doctorName;//"徐晓梅";
	var underline = "------------------------------------------------";
	var clinicHouse = result.clinicHouse;
	var appointmentNo = result.appointmentNo;//"1";
	var patientName = result.patientName;//"陈永仁";
	var appointmentTime = result.appointmentTime;//"2017-04-08 08:20";
	var text1 = "自助机";
	var text2 = "预约当日该医师有可能遇急事不能坐诊，请谅解！";
	//var printTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	var printTime = moment().format('YYYY-MM-DD HH:mm:ss');
	
	var setPrintport = MS_PRINTER.SetPrintport("COM5",38400);//设置串口
	var setInit = MS_PRINTER.SetInit();//打印机初始化
	var getStatus = MS_PRINTER.GetStatus();
	/**
	获取打印机状态(GetStatus):0 打印机正常;1 打印机未连接或未上电;2 打印机和调用库不匹配
	3 打印头打开;4 切刀未复位;5 打印头过热;6 黑标错误;7 纸尽;8 纸将尽
	**/
	if(getStatus == 0){
		var setClean = MS_PRINTER.SetClean();//清理缓存
		MS_PRINTER.PrintMarkpositionprint();//检测黑标进纸到打印位置
		//char* strData： 打印的字符串内容,int iImme; 是否加换行指令0x0a： 0 加换行指令 1 不加换行指令
		MS_PRINTER.SetSizetext(2, 2);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString(title);
		MS_PRINTER.SetSizetext(2, 1);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString(deptName+"  "+houseLocation);
		MS_PRINTER.PrintString("坐诊医师 "+doctorName);
		MS_PRINTER.SetSizetext(1, 1);
		MS_PRINTER.PrintString(underline);
		MS_PRINTER.SetSizetext(2, 1);
		MS_PRINTER.PrintString(appointmentNo+"号 "+patientName);
		MS_PRINTER.PrintString("请您于 "+appointmentTime.substring(0,16)+" 前");
		MS_PRINTER.PrintString("到"+text1+"或"+houseLocation+deptName+"分诊台签到");
		MS_PRINTER.SetSizetext(1, 1);
		MS_PRINTER.PrintString(underline);
		MS_PRINTER.SetSizetext(2, 1);
		MS_PRINTER.PrintString(text2);
		MS_PRINTER.PrintString("打印时间"+printTime);
		var printFeedline = MS_PRINTER.PrintFeedline(7);
		//MS_PRINTER.PrintMarkposition();//检测黑标,黑标模式下检测黑标， 停止在黑标位置
		//MS_PRINTER.PrintMarkpositioncut();//检测黑标进纸到切纸位置
		//var printCutpaper = MS_PRINTER.PrintMarkcutpaper(0);//int iMode： 0 全切、 1 半切
		var printCutpaper = MS_PRINTER.PrintCutpaper(0);//int iMode： 0 全切、 1 半切
		var setClean = MS_PRINTER.SetClean();//清理缓存
		var resultCode = MS_PRINTER.SetClose();
	}
	else if(getStatus == 1){
		baseUtil.notice('打印机未连接或未上电，请联系维护人员。');
	}
	else if(getStatus == 2){
		baseUtil.notice('打印机和调用库不匹配，请联系维护人员。');
	}
	else if(getStatus == 3){
		baseUtil.notice('打印头打开，请联系维护人员。');
	}
	else if(getStatus == 4){
		baseUtil.notice('切刀未复位，请联系维护人员。');
	}
	else if(getStatus == 5){
		baseUtil.notice('打印头过热，请联系维护人员。');
	}
	else if(getStatus == 6){
		baseUtil.notice('黑标错误，请联系维护人员。');
	}
	else if(getStatus == 7){
		baseUtil.notice('打印纸已经用完，请添加新的打印纸。');
	}
	else if(getStatus == 8){
		baseUtil.notice('打印纸即将用完，请及时更换打印纸。');
	}
	lightUtil.ticket.turnOff();
}
/**
 * 打印签到
 * @returns
 */
function printSign(result){
	if(dev_mode){return;}
	lightUtil.ticket.blink();
	init();
	// MS_PRINTER.print.....调用打印机方法
	var title = "门诊签到单";
	var hospitalArea = result.hospitalDistrictName;//"新院区";
	var deptName = result.deptName;//"呼吸内科";
	var houseLocation = result.houseLocation;
	var doctorName = result.doctorName;//"徐晓梅";
	var underline = "------------------------------------------------";
	var clinicHouse = result.clinicHouse;
	var appointmentNo = result.appointmentNo;//"1";
	var patientName = result.patientName;//"陈永仁";
	var appointmentTime = result.appointmentTime;//"2017-04-08 08:20";
	var text1 = "到候诊室等候呼叫";
	var text2 = "预约当日该医师有可能遇急事不能坐诊，请谅解！";
	//var printTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	var printTime = moment().format('YYYY-MM-DD HH:mm:ss');
	
	var setPrintport = MS_PRINTER.SetPrintport("COM5",38400);//设置串口
	var setInit = MS_PRINTER.SetInit();//打印机初始化
	var getStatus = MS_PRINTER.GetStatus();
	/**
	获取打印机状态(GetStatus):0 打印机正常;1 打印机未连接或未上电;2 打印机和调用库不匹配
	3 打印头打开;4 切刀未复位;5 打印头过热;6 黑标错误;7 纸尽;8 纸将尽
	**/
	if(getStatus == 0){
		var setClean = MS_PRINTER.SetClean();//清理缓存
		MS_PRINTER.PrintMarkpositionprint();//检测黑标进纸到打印位置
		//char* strData： 打印的字符串内容,int iImme; 是否加换行指令0x0a： 0 加换行指令 1 不加换行指令
		MS_PRINTER.SetSizetext(2, 2);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString(title);
		MS_PRINTER.SetSizetext(2, 1);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString(deptName+"  "+houseLocation);
		MS_PRINTER.PrintString("坐诊医师 "+doctorName);
		MS_PRINTER.SetSizetext(1, 1);
		MS_PRINTER.PrintString(underline);
		MS_PRINTER.SetSizetext(2, 1);
		//MS_PRINTER.SetBold(1);//加粗
		MS_PRINTER.PrintString(clinicHouse+"  "+appointmentNo+"号 "+patientName);
		//MS_PRINTER.SetBold(0);//不加粗
		MS_PRINTER.PrintString("请您于  "+appointmentTime.substring(0,16)+"前");
		MS_PRINTER.PrintString(text1);
		MS_PRINTER.SetSizetext(1, 1);
		MS_PRINTER.PrintString(underline);
		MS_PRINTER.SetSizetext(2, 1);
		MS_PRINTER.PrintString(text2);
		MS_PRINTER.PrintString("打印时间 "+printTime);
		var printFeedline = MS_PRINTER.PrintFeedline(7);
		//MS_PRINTER.PrintMarkposition();//检测黑标,黑标模式下检测黑标， 停止在黑标位置
		//MS_PRINTER.PrintMarkpositioncut();//检测黑标进纸到切纸位置
		//var printCutpaper = MS_PRINTER.PrintMarkcutpaper(0);//int iMode： 0 全切、 1 半切
		var printCutpaper = MS_PRINTER.PrintCutpaper(0);//int iMode： 0 全切、 1 半切
		var setClean = MS_PRINTER.SetClean();//清理缓存
		var resultCode = MS_PRINTER.SetClose();
	}
	else if(getStatus == 1){
		baseUtil.notice('打印机未连接或未上电，请联系维护人员。');
	}
	else if(getStatus == 2){
		baseUtil.notice('打印机和调用库不匹配，请联系维护人员。');
	}
	else if(getStatus == 3){
		baseUtil.notice('打印头打开，请联系维护人员。');
	}
	else if(getStatus == 4){
		baseUtil.notice('切刀未复位，请联系维护人员。');
	}
	else if(getStatus == 5){
		baseUtil.notice('打印头过热，请联系维护人员。');
	}
	else if(getStatus == 6){
		baseUtil.notice('黑标错误，请联系维护人员。');
	}
	else if(getStatus == 7){
		baseUtil.notice('打印纸已经用完，请添加新的打印纸。');
	}
	else if(getStatus == 8){
		baseUtil.notice('打印纸即将用完，请及时更换打印纸。');
	}
	lightUtil.ticket.turnOff();
}
/**
 * 打印门诊预存凭条
 * @returns
 */
function printRechargeReceipt(result,baseInfo,machineInfo,payChannel){
	if(dev_mode){return;}
	lightUtil.ticket.blink();
	init();
	// MS_PRINTER.print.....调用打印机方法
	var bizType = result.orderNo;//业务类型  '00': '门诊预存','01': '预约','02': '挂号','04': '住院预缴','05': '办理就诊卡'
	var headerText = "门诊预存及余额凭证";//倍高
	var receiptNumber = result.orderNo;
	var predepositTime = result.tranTime;
	var isRefund = "可退费";
	var isPhysicalAvailable  = "体检可用";
	var predepositMode = payChannel//"现金";//预存渠道
	var predepositModeText = "";
	if(predepositMode == '0000'){ predepositModeText = "现金"; }
	if(predepositMode == '9998'){ predepositModeText = "微信"; }
	if(predepositMode == '9999'){ predepositModeText = "支付宝"; }
	if(predepositMode == '0306'){ predepositModeText = "广发银行"; }
	if(predepositMode == '0103'){ predepositModeText = "农业银行"; }
	if(predepositMode == '0308'){ predepositModeText = "招商银行"; }
	if(predepositMode == '6509'){ predepositModeText = "云南农信"; }
	if(predepositMode == '0301'){ predepositModeText = "交通银行"; }
	if(predepositMode == '0104'){ predepositModeText = "中国银行"; }
	var patientNo = result.patientNo;
	var patientName = result.patientName;
	var gender = baseInfo.gender;//1-男 2-女
	var genderText = "";
	if(gender == '1'){ genderText = "男"; }
	if(gender == '2'){ genderText = "女"; }
	var birthday = baseInfo.birthday;
	//var currentYear = moment().format('YYYY');
	var age = jsGetAge(baseInfo.birthday.substring(0,10));
	var relationCard = baseInfo.relationCard;//关联卡号，社保卡卡号
	var relationType = baseInfo.relationType;//关联类型
	var expenseType = "";
	if(relationType == '01'){
		expenseType = "社保"; 
	}
	else if(relationType == '02'){
		expenseType = "新农合"; 
	}
	else{ 
		expenseType = "自费单位"; 
	}
	var deposit = result.realAmt.formatMoney();
	var accountBalance = baseInfo.balance.formatMoney();
	var operatorNo = machineInfo.hisUser;//取自助机在HIS系统中的编号
	var attentionContent = "请自行妥善保管";

	var setPrintport = MS_PRINTER.SetPrintport("COM5",38400);//设置串口
	var setInit = MS_PRINTER.SetInit();//打印机初始化
	var getStatus = MS_PRINTER.GetStatus();
	/**
	获取打印机状态(GetStatus):0 打印机正常;1 打印机未连接或未上电;2 打印机和调用库不匹配
	3 打印头打开;4 切刀未复位;5 打印头过热;6 黑标错误;7 纸尽;8 纸将尽
	**/
	if(getStatus == 0){
		var setClean = MS_PRINTER.SetClean();//清理缓存
		MS_PRINTER.PrintMarkpositionprint();//检测黑标进纸到打印位置
		//设置汉字放大
		/*
		int iHeight:倍高 0无效,1有效;
		int iWidth： 倍宽 0 无效 1 有效;
		int iUnderline： 下划线 0 无效 1 有效;
		int iChinesetype： 汉字字形 0 24*24 1 16*16
		*/
		MS_PRINTER.SetSizetext(2, 2);
		//char* strData： 打印的字符串内容,int iImme; 是否加换行指令0x0a： 0 加换行指令 1 不加换行指令
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString(headerText);
		MS_PRINTER.SetSizetext(2, 1);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString("收据号: "+receiptNumber);
		MS_PRINTER.PrintString("");
		MS_PRINTER.PrintString(predepositTime);
		MS_PRINTER.PrintString("资金帐户："+isRefund+"|"+isPhysicalAvailable);
		MS_PRINTER.PrintString("预存方式："+predepositModeText);
		MS_PRINTER.PrintString("          "+patientNo);
		MS_PRINTER.PrintString("          "+patientName+"   "+genderText+age+"岁");
		MS_PRINTER.PrintString("          "+expenseType);
		MS_PRINTER.PrintString("    存款："+deposit);
		MS_PRINTER.PrintString("账户余额："+accountBalance);
		MS_PRINTER.PrintString("  操作员："+operatorNo);
		MS_PRINTER.SetSizetext(2, 2);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString(attentionContent);
		var printFeedline = MS_PRINTER.PrintFeedline(7);
		//MS_PRINTER.PrintMarkposition();//检测黑标,黑标模式下检测黑标， 停止在黑标位置
		//MS_PRINTER.PrintMarkpositioncut();//检测黑标进纸到切纸位置
		//var printCutpaper = MS_PRINTER.PrintMarkcutpaper(0);//int iMode： 0 全切、 1 半切
		var printCutpaper = MS_PRINTER.PrintCutpaper(0);//int iMode： 0 全切、 1 半切
		var setClean = MS_PRINTER.SetClean();//清理缓存
		var resultCode = MS_PRINTER.SetClose();
		console.info("resultCode="+resultCode);
	}
	else if(getStatus == 1){
		baseUtil.notice('打印机未连接或未上电，请联系维护人员。');
	}
	else if(getStatus == 2){
		baseUtil.notice('打印机和调用库不匹配，请联系维护人员。');
	}
	else if(getStatus == 3){
		baseUtil.notice('打印头打开，请联系维护人员。');
	}
	else if(getStatus == 4){
		baseUtil.notice('切刀未复位，请联系维护人员。');
	}
	else if(getStatus == 5){
		baseUtil.notice('打印头过热，请联系维护人员。');
	}
	else if(getStatus == 6){
		baseUtil.notice('黑标错误，请联系维护人员。');
	}
	else if(getStatus == 7){
		baseUtil.notice('打印纸已经用完，请添加新的打印纸。');
	}
	else if(getStatus == 8){
		baseUtil.notice('打印纸即将用完，请及时更换打印纸。');
	}
	lightUtil.ticket.turnOff();
}

/**
 * 打印退款凭证
 * @returns
 */
function printRefundReceipt(result,order,baseInfo,machineInfo){
	if(dev_mode){return;}
	lightUtil.ticket.blink();
	init();
	// MS_PRINTER.print.....调用打印机方法
	var headerText = "门诊退款及余额凭证";//倍高
	var receiptNumber = result.settleNo;
	var predepositTime = result.createTime;
	var isRefund = "可退费";
	var isPhysicalAvailable  = "体检可用";
	var predepositMode = result.payChannelCode//"现金";//预存渠道
	var predepositModeText = "";
	if(predepositMode == '0000'){ predepositModeText = "现金"; }
	if(predepositMode == '9998'){ predepositModeText = "微信"; }
	if(predepositMode == '9999'){ predepositModeText = "支付宝"; }
	if(predepositMode == '0306'){ predepositModeText = "广发银行"; }
	if(predepositMode == '0103'){ predepositModeText = "农业银行"; }
	if(predepositMode == '0308'){ predepositModeText = "招商银行"; }
	if(predepositMode == '6509'){ predepositModeText = "云南农信"; }
	if(predepositMode == '0301'){ predepositModeText = "交通银行"; }
	if(predepositMode == '0104'){ predepositModeText = "中国银行"; }
	var patientNo = baseInfo.no;
	var patientName = baseInfo.name;
	var gender = baseInfo.gender;//1-男 2-女
	var genderText = "";
	if(gender == '1'){ genderText = "男"; }
	if(gender == '2'){ genderText = "女"; }
	var birthday = baseInfo.birthday;
	//var currentYear = moment().format('YYYY');
	var age = jsGetAge(baseInfo.birthday.substring(0,10));
	var relationCard = baseInfo.relationCard;//关联卡号，社保卡卡号
	var relationType = baseInfo.relationType;//关联类型
	var expenseType = "";
	if(relationType == '01'){
		expenseType = "社保"; 
	}
	else if(relationType == '02'){
		expenseType = "新农合"; 
	}
	else{ 
		expenseType = "自费单位"; 
	}
	var deposit = result.amt.formatMoney();
	var accountBalance = baseInfo.balance.formatMoney();
	var operatorNo = machineInfo.hisUser;//取自助机在HIS系统中的编号
	var attentionContent = "请自行妥善保管";

	var setPrintport = MS_PRINTER.SetPrintport("COM5",38400);//设置串口
	var setInit = MS_PRINTER.SetInit();//打印机初始化
	var getStatus = MS_PRINTER.GetStatus();
	/**
	获取打印机状态(GetStatus):0 打印机正常;1 打印机未连接或未上电;2 打印机和调用库不匹配
	3 打印头打开;4 切刀未复位;5 打印头过热;6 黑标错误;7 纸尽;8 纸将尽
	**/
	if(getStatus == 0){
		var setClean = MS_PRINTER.SetClean();//清理缓存
		MS_PRINTER.PrintMarkpositionprint();//检测黑标进纸到打印位置
		MS_PRINTER.SetSizetext(2, 2);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString(headerText);
		MS_PRINTER.SetSizetext(2, 1);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString("收据号: "+receiptNumber);
		MS_PRINTER.PrintString("");
		MS_PRINTER.PrintString("    日期："+predepositTime);
		MS_PRINTER.PrintString("资金帐户："+isRefund+"|"+isPhysicalAvailable);
		MS_PRINTER.PrintString("退款方式："+predepositModeText);
		MS_PRINTER.PrintString("  门诊号："+patientNo);
		MS_PRINTER.PrintString("    姓名："+patientName+"   "+genderText+age+"岁");
		MS_PRINTER.PrintString("    性质："+expenseType);
		MS_PRINTER.PrintString("  存款："+"-"+deposit);
		MS_PRINTER.PrintString("账户余额："+accountBalance);
		MS_PRINTER.PrintString("  操作员："+operatorNo);
		MS_PRINTER.SetSizetext(2, 2);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString(attentionContent);
		var printFeedline = MS_PRINTER.PrintFeedline(7);
		//MS_PRINTER.PrintMarkposition();//检测黑标,黑标模式下检测黑标， 停止在黑标位置
		//MS_PRINTER.PrintMarkpositioncut();//检测黑标进纸到切纸位置
		//var printCutpaper = MS_PRINTER.PrintMarkcutpaper(0);//int iMode： 0 全切、 1 半切
		var printCutpaper = MS_PRINTER.PrintCutpaper(0);//int iMode： 0 全切、 1 半切
		var setClean = MS_PRINTER.SetClean();//清理缓存
		var resultCode = MS_PRINTER.SetClose();
		console.info("resultCode="+resultCode);
	}
	else if(getStatus == 1){
		baseUtil.notice('打印机未连接或未上电，请联系维护人员。');
	}
	else if(getStatus == 2){
		baseUtil.notice('打印机和调用库不匹配，请联系维护人员。');
	}
	else if(getStatus == 3){
		baseUtil.notice('打印头打开，请联系维护人员。');
	}
	else if(getStatus == 4){
		baseUtil.notice('切刀未复位，请联系维护人员。');
	}
	else if(getStatus == 5){
		baseUtil.notice('打印头过热，请联系维护人员。');
	}
	else if(getStatus == 6){
		baseUtil.notice('黑标错误，请联系维护人员。');
	}
	else if(getStatus == 7){
		baseUtil.notice('打印纸已经用完，请添加新的打印纸。');
	}
	else if(getStatus == 8){
		baseUtil.notice('打印纸即将用完，请及时更换打印纸。');
	}
	lightUtil.ticket.turnOff();
}

/**
 * 打印缴费凭条
 * @returns
 */
function printConsumeReceipt(fees,order,baseInfo,machineInfo){
	if(dev_mode){return;}
	lightUtil.ticket.blink();
	init();
	// MS_PRINTER.print.....调用打印机方法
	//var cs,cwxx,dj,flmmc,ksid,ksmc,kzjbmc,mc,sl,ysid,ysxm,yzsj,zh;
	var headerText = "缴费凭证";//倍高
	var hospatil = "云南省第一人民医院";
	var orderNo = order.orderNo;//收据号
	var patientName = order.patientName;//病人姓名
	var gender = baseInfo.gender;//1-男 2-女
	var genderText = "";
	if(gender == '1'){ genderText = "男"; }
	if(gender == '2'){ genderText = "女"; }
	var birthday = baseInfo.birthday;
	//var currentYear = moment().format('YYYY');
	var age = jsGetAge(baseInfo.birthday.substring(0,10));
	var patientNo = order.patientNo;//病人编号
	var relationCard = baseInfo.relationCard;//关联卡号，社保卡卡号
	var relationType = baseInfo.relationType;//关联类型
	var expenseType = "";
	if(relationType == '01'){
		expenseType = "社保"; 
	}
	else if(relationType == '02'){
		expenseType = "新农合"; 
	}
	else{ 
		expenseType = "自费"; 
	}
	var amt = order.amt.formatMoney();//交易金额
	var reduceAmt = order.reduceAmt.formatMoney();//减免金额
	var paAmt = order.paAmt.formatMoney();//个人账户金额
	var selfAmt = order.selfAmt.formatMoney();//个人自付金额
	var miAmt = order.miAmt.formatMoney();//医保报销金额
	var balance = baseInfo.balance.formatMoney();//账户余额
	var operator = machineInfo.hisUser;//取自助机在HIS系统中的编号
	var tranTime = order.tranTime;//交易时间
	if(tranTime == null || tranTime == ''){
		tranTime = moment(new Date()).format('YYYY-MM-DD');
	}
	var note = "提示:如需收费票据，请持就诊卡到收费处打印。";
	//var bizType = order.bizType;//业务类型  '00': '门诊预存','01': '预约','02': '挂号','04': '住院预缴','05': '办理就诊卡'
	//var patientIdNo = order.patientIdNo;//病人身份证号
	//var patientCardNo = order.patientCardNo;//病人卡号	
	//var patientCardType = order.patientCardType;//就诊卡类型
	//var createTime = order.createTime;//创建时间
	//var finishTime = order.finishTime;//完成时间
	//var realAmt = order.realAmt.formatMoney();// 已支付金额
	//var lastAmt = order.lastAmt.formatMoney();// 最后一次支付金额
	var setPrintport = MS_PRINTER.SetPrintport("COM5",38400);//设置串口
	var setInit = MS_PRINTER.SetInit();//打印机初始化
	var getStatus = MS_PRINTER.GetStatus();
	var i;
	/**
	获取打印机状态(GetStatus):0 打印机正常;1 打印机未连接或未上电;2 打印机和调用库不匹配
	3 打印头打开;4 切刀未复位;5 打印头过热;6 黑标错误;7 纸尽;8 纸将尽
	**/
	if(getStatus == 0){
		var setClean = MS_PRINTER.SetClean();//清理缓存
		MS_PRINTER.PrintMarkpositionprint();//检测黑标进纸到打印位置
		//设置汉字放大
		/*
		int iHeight:倍高 0无效,1有效;
		int iWidth： 倍宽 0 无效 1 有效;
		int iUnderline： 下划线 0 无效 1 有效;
		int iChinesetype： 汉字字形 0 24*24 1 16*16
		*/
		MS_PRINTER.SetSizetext(2, 2);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString(headerText);
		MS_PRINTER.PrintString("");
		MS_PRINTER.SetSizetext(2, 1);
		MS_PRINTER.PrintString(hospatil+"     "+orderNo);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString("姓名:"+patientName+"      "+"性别:"+genderText+"          "+"年龄:"+age);
		MS_PRINTER.PrintString("病人编号:"+patientNo);
		MS_PRINTER.PrintString(expenseType);
		MS_PRINTER.SetLinespace(55);//设置行间距
		/*for(i=0;i<fees.length;i++){
			MS_PRINTER.PrintString(fees[i].mc+" "+fees[i].dj);
		}*/
		MS_PRINTER.PrintString("合计金额:"+amt+"          "+"减免:"+reduceAmt);
		MS_PRINTER.PrintString(/*"个人账户金额:"+paAmt+"        "+*/"预存账户金额:"+selfAmt);
		MS_PRINTER.PrintString("医保金额:"+miAmt);
		MS_PRINTER.PrintString("预存余额:"+balance);
		MS_PRINTER.PrintString("");
		MS_PRINTER.PrintString("操作员:"+operator+"              "+"收费日期:"+tranTime.substring(0,10));
		MS_PRINTER.PrintString(note);
		var printFeedline = MS_PRINTER.PrintFeedline(7);
		//MS_PRINTER.PrintMarkposition();//检测黑标,黑标模式下检测黑标， 停止在黑标位置
		//MS_PRINTER.PrintMarkpositioncut();//检测黑标进纸到切纸位置
		//var printCutpaper = MS_PRINTER.PrintMarkcutpaper(0);//int iMode： 0 全切、 1 半切
		var printCutpaper = MS_PRINTER.PrintCutpaper(0);//int iMode： 0 全切、 1 半切
		var setClean = MS_PRINTER.SetClean();//清理缓存
		var resultCode = MS_PRINTER.SetClose();
		console.info("resultCode="+resultCode);
	}
	else if(getStatus == 1){
		baseUtil.notice('打印机未连接或未上电，请联系维护人员。');
	}
	else if(getStatus == 2){
		baseUtil.notice('打印机和调用库不匹配，请联系维护人员。');
	}
	else if(getStatus == 3){
		baseUtil.notice('打印头打开，请联系维护人员。');
	}
	else if(getStatus == 4){
		baseUtil.notice('切刀未复位，请联系维护人员。');
	}
	else if(getStatus == 5){
		baseUtil.notice('打印头过热，请联系维护人员。');
	}
	else if(getStatus == 6){
		baseUtil.notice('黑标错误，请联系维护人员。');
	}
	else if(getStatus == 7){
		baseUtil.notice('打印纸已经用完，请添加新的打印纸。');
	}
	else if(getStatus == 8){
		baseUtil.notice('打印纸即将用完，请及时更换打印纸。');
	}
	lightUtil.ticket.turnOff();
}
/**
 * 打印办卡凭条
 * @returns
 */
function printDoCardFees(result,baseInfo,machineInfo){
	if(dev_mode){return;}
	lightUtil.ticket.blink();
	init();
	// MS_PRINTER.print.....调用打印机方法
	var headerText = "办理就诊卡凭证";//倍高
	var bizType = result.bizType;//业务类型  '00': '门诊预存','01': '预约','02': '挂号','04': '住院预缴','05': '办理就诊卡'
	var orderNo = result.orderNo;
	var patientName = result.patientName;//
	var patientNo = result.patientNo;//
	var selfAmt = result.selfAmt.formatMoney();//补卡费用
	var gender = baseInfo.gender;//1-男 2-女
	var genderText = "";
	if(gender == '1'){ genderText = "男"; }
	if(gender == '2'){ genderText = "女"; }
	var birthday = baseInfo.birthday;
	var age = jsGetAge(baseInfo.birthday.substring(0,10));
	var balance = baseInfo.balance.formatMoney();
	var operator = machineInfo.hisUser;//取自助机在HIS系统中的编号
	var createTime = result.createTime;
	if(createTime == null){
		createTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	}
	var attentionContent = "请自行妥善保管";

	var setPrintport = MS_PRINTER.SetPrintport("COM5",38400);//设置串口
	var setInit = MS_PRINTER.SetInit();//打印机初始化
	var getStatus = MS_PRINTER.GetStatus();
	/**
	*获取打印机状态(GetStatus):0 打印机正常;1 打印机未连接或未上电;2 打印机和调用库不匹配
	*3 打印头打开;4 切刀未复位;5 打印头过热;6 黑标错误;7 纸尽;8 纸将尽
	**/
	if(getStatus == 0){
		var setClean = MS_PRINTER.SetClean();//清理缓存
		MS_PRINTER.PrintMarkpositionprint();//检测黑标进纸到打印位置
		//设置汉字放大
		/**
		*int iHeight:倍高 0无效,1有效;
		*int iWidth： 倍宽 0 无效 1 有效;
		*int iUnderline： 下划线 0 无效 1 有效;
		*int iChinesetype： 汉字字形 0 24*24 1 16*16
		**/
		MS_PRINTER.SetSizetext(2, 2);
		//char* strData： 打印的字符串内容,int iImme; 是否加换行指令0x0a： 0 加换行指令 1 不加换行指令
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString(headerText);
		MS_PRINTER.SetSizetext(2, 1);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString("  收据号："+orderNo);
		MS_PRINTER.PrintString("");
		MS_PRINTER.PrintString("    日期："+createTime.substring(0,10));
		MS_PRINTER.PrintString("病人编号："+patientNo);
		MS_PRINTER.PrintString("          "+patientName+"   "+genderText+" "+age+"岁");
		MS_PRINTER.PrintString("办卡费用："+selfAmt);
		MS_PRINTER.PrintString("账户余额："+balance);
		MS_PRINTER.PrintString("  操作员："+operator);
		MS_PRINTER.SetSizetext(2, 2);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString(attentionContent);
		var printFeedline = MS_PRINTER.PrintFeedline(7);
		//MS_PRINTER.PrintMarkposition();//检测黑标,黑标模式下检测黑标， 停止在黑标位置
		//MS_PRINTER.PrintMarkpositioncut();//检测黑标进纸到切纸位置
		//var printCutpaper = MS_PRINTER.PrintMarkcutpaper(0);//int iMode： 0 全切、 1 半切
		var printCutpaper = MS_PRINTER.PrintCutpaper(0);//int iMode： 0 全切、 1 半切
		var setClean = MS_PRINTER.SetClean();//清理缓存
		var resultCode = MS_PRINTER.SetClose();
		console.info("resultCode="+resultCode);
	}
	else if(getStatus == 1){
		baseUtil.notice('打印机未连接或未上电，请联系维护人员。');
	}
	else if(getStatus == 2){
		baseUtil.notice('打印机和调用库不匹配，请联系维护人员。');
	}
	else if(getStatus == 3){
		baseUtil.notice('打印头打开，请联系维护人员。');
	}
	else if(getStatus == 4){
		baseUtil.notice('切刀未复位，请联系维护人员。');
	}
	else if(getStatus == 5){
		baseUtil.notice('打印头过热，请联系维护人员。');
	}
	else if(getStatus == 6){
		baseUtil.notice('黑标错误，请联系维护人员。');
	}
	else if(getStatus == 7){
		baseUtil.notice('打印纸已经用完，请添加新的打印纸。');
	}
	else if(getStatus == 8){
		baseUtil.notice('打印纸即将用完，请及时更换打印纸。');
	}
	lightUtil.ticket.turnOff();
}
/**
 * 打印补卡凭条
 * @returns
 */
function printMakeUpCardFees(result,baseInfo,machineInfo){
	if(dev_mode){return;}
	lightUtil.ticket.blink();
	init();
	// MS_PRINTER.print.....调用打印机方法
	var headerText = "补办就诊卡凭证";//倍高
	var bizType = result.bizType;//业务类型  '00': '门诊预存','01': '预约','02': '挂号','04': '住院预缴','05': '办理就诊卡'
	var orderNo = result.orderNo;
	var patientName = result.patientName;//
	var patientNo = result.patientNo;//
	var selfAmt = result.selfAmt.formatMoney();//补卡费用
	var gender = baseInfo.gender;//1-男 2-女
	var genderText = "";
	if(gender == '1'){ genderText = "男"; }
	if(gender == '2'){ genderText = "女"; }
	var birthday = baseInfo.birthday;
	var age = jsGetAge(baseInfo.birthday.substring(0,10));
	var balance = baseInfo.balance.formatMoney();
	var operator = machineInfo.hisUser;//取自助机在HIS系统中的编号
	var createTime = result.createTime;
	if(createTime == null){
		createTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	}
	var attentionContent = "请自行妥善保管";

	var setPrintport = MS_PRINTER.SetPrintport("COM5",38400);//设置串口
	var setInit = MS_PRINTER.SetInit();//打印机初始化
	var getStatus = MS_PRINTER.GetStatus();
	/**
	*获取打印机状态(GetStatus):0 打印机正常;1 打印机未连接或未上电;2 打印机和调用库不匹配
	*3 打印头打开;4 切刀未复位;5 打印头过热;6 黑标错误;7 纸尽;8 纸将尽
	**/
	if(getStatus == 0){
		var setClean = MS_PRINTER.SetClean();//清理缓存
		MS_PRINTER.PrintMarkpositionprint();//检测黑标进纸到打印位置
		//设置汉字放大
		/**
		*int iHeight:倍高 0无效,1有效;
		*int iWidth： 倍宽 0 无效 1 有效;
		*int iUnderline： 下划线 0 无效 1 有效;
		*int iChinesetype： 汉字字形 0 24*24 1 16*16
		**/
		MS_PRINTER.SetSizetext(2, 2);
		//char* strData： 打印的字符串内容,int iImme; 是否加换行指令0x0a： 0 加换行指令 1 不加换行指令
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString(headerText);
		MS_PRINTER.SetSizetext(2, 1);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString("  收据号："+orderNo);
		MS_PRINTER.PrintString("");
		MS_PRINTER.PrintString("    日期："+createTime.substring(0,10));
		MS_PRINTER.PrintString("病人编号："+patientNo);
		MS_PRINTER.PrintString("          "+patientName+"   "+genderText+" "+age+"岁");
		MS_PRINTER.PrintString("补卡费用："+selfAmt);
		MS_PRINTER.PrintString("账户余额："+balance);
		MS_PRINTER.PrintString("  操作员："+operator);
		MS_PRINTER.SetSizetext(2, 2);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString(attentionContent);
		var printFeedline = MS_PRINTER.PrintFeedline(7);
		//MS_PRINTER.PrintMarkposition();//检测黑标,黑标模式下检测黑标， 停止在黑标位置
		//MS_PRINTER.PrintMarkpositioncut();//检测黑标进纸到切纸位置
		//var printCutpaper = MS_PRINTER.PrintMarkcutpaper(0);//int iMode： 0 全切、 1 半切
		var printCutpaper = MS_PRINTER.PrintCutpaper(0);//int iMode： 0 全切、 1 半切
		var setClean = MS_PRINTER.SetClean();//清理缓存
		var resultCode = MS_PRINTER.SetClose();
		console.info("resultCode="+resultCode);
	}
	else if(getStatus == 1){
		baseUtil.notice('打印机未连接或未上电，请联系维护人员。');
	}
	else if(getStatus == 2){
		baseUtil.notice('打印机和调用库不匹配，请联系维护人员。');
	}
	else if(getStatus == 3){
		baseUtil.notice('打印头打开，请联系维护人员。');
	}
	else if(getStatus == 4){
		baseUtil.notice('切刀未复位，请联系维护人员。');
	}
	else if(getStatus == 5){
		baseUtil.notice('打印头过热，请联系维护人员。');
	}
	else if(getStatus == 6){
		baseUtil.notice('黑标错误，请联系维护人员。');
	}
	else if(getStatus == 7){
		baseUtil.notice('打印纸已经用完，请添加新的打印纸。');
	}
	else if(getStatus == 8){
		baseUtil.notice('打印纸即将用完，请及时更换打印纸。');
	}
	lightUtil.ticket.turnOff();
}

/**
 * 打印门诊预存转住院预缴凭条
 * @returns
 */
function printForegift(result,baseInfo,inpatientInfo,machineInfo){
	if(dev_mode){return;}
	lightUtil.ticket.blink();
	init();
	// MS_PRINTER.print.....调用打印机方法
	var headerText = "门诊预存转住院预缴";//倍高
	var hospatil = "云南省第一人民医院";
	var orderNo = result.orderNo;//收据号
	var patientName = result.patientName;//病人姓名
	var gender = baseInfo.gender;//1-男 2-女
	var genderText = "";
	if(gender == '1'){ genderText = "男"; }
	if(gender == '2'){ genderText = "女"; }
	var birthday = baseInfo.birthday;
	//var currentYear = moment().format('YYYY');
	var age = jsGetAge(baseInfo.birthday.substring(0,10));
	var patientNo = result.patientNo;//病人编号
	var amt = result.amt.formatMoney();//交易金额
	var balance = baseInfo.balance.formatMoney();//门诊账户余额
	var inDate = inpatientInfo.inDate;
	var inDiagnose = inpatientInfo.inDiagnose;
	var payment = (inpatientInfo.payment).formatMoney();//住院账户余额
	var deptName = inpatientInfo.deptName;
	var wardName = inpatientInfo.wardName;
	var operator = machineInfo.hisUser;//取自助机在HIS系统中的编号
	var tranTime = result.tranTime;//交易时间
	if(tranTime == null || tranTime == ''){
		tranTime = moment(new Date()).format('YYYY-MM-DD');
	}
	var note = "提示:如需收费票据，请持就诊卡到收费处打印。";
	var setPrintport = MS_PRINTER.SetPrintport("COM5",38400);//设置串口
	var setInit = MS_PRINTER.SetInit();//打印机初始化
	var getStatus = MS_PRINTER.GetStatus();
	/**
	获取打印机状态(GetStatus):0 打印机正常;1 打印机未连接或未上电;2 打印机和调用库不匹配
	3 打印头打开;4 切刀未复位;5 打印头过热;6 黑标错误;7 纸尽;8 纸将尽
	**/
	if(getStatus == 0){
		var setClean = MS_PRINTER.SetClean();//清理缓存
		MS_PRINTER.PrintMarkpositionprint();//检测黑标进纸到打印位置
		//设置汉字放大
		/*
		int iHeight:倍高 0无效,1有效;
		int iWidth： 倍宽 0 无效 1 有效;
		int iUnderline： 下划线 0 无效 1 有效;
		int iChinesetype： 汉字字形 0 24*24 1 16*16
		*/
		MS_PRINTER.SetSizetext(2, 2);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString(headerText);
		MS_PRINTER.PrintString("");
		MS_PRINTER.SetSizetext(2, 1);
		MS_PRINTER.PrintString(hospatil+"     "+orderNo);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString("姓名:"+patientName+"      "+"性别:"+genderText+"          "+"年龄:"+age);
		MS_PRINTER.PrintString("病人编号:"+patientNo);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString("转住院预缴金额:"+amt);
		MS_PRINTER.PrintString("门诊账户余额:"+balance);
		MS_PRINTER.PrintString("住院账户余额:"+payment);
		MS_PRINTER.PrintString("");
		MS_PRINTER.PrintString("操作员:"+operator+"              "+"收费日期:"+tranTime.substring(0,10));
		MS_PRINTER.PrintString(note);
		var printFeedline = MS_PRINTER.PrintFeedline(7);
		//MS_PRINTER.PrintMarkposition();//检测黑标,黑标模式下检测黑标， 停止在黑标位置
		//MS_PRINTER.PrintMarkpositioncut();//检测黑标进纸到切纸位置
		//var printCutpaper = MS_PRINTER.PrintMarkcutpaper(0);//int iMode： 0 全切、 1 半切
		var printCutpaper = MS_PRINTER.PrintCutpaper(0);//int iMode： 0 全切、 1 半切
		var setClean = MS_PRINTER.SetClean();//清理缓存
		var resultCode = MS_PRINTER.SetClose();
		console.info("resultCode="+resultCode);
	}
	else if(getStatus == 1){
		baseUtil.notice('打印机未连接或未上电，请联系维护人员。');
	}
	else if(getStatus == 2){
		baseUtil.notice('打印机和调用库不匹配，请联系维护人员。');
	}
	else if(getStatus == 3){
		baseUtil.notice('打印头打开，请联系维护人员。');
	}
	else if(getStatus == 4){
		baseUtil.notice('切刀未复位，请联系维护人员。');
	}
	else if(getStatus == 5){
		baseUtil.notice('打印头过热，请联系维护人员。');
	}
	else if(getStatus == 6){
		baseUtil.notice('黑标错误，请联系维护人员。');
	}
	else if(getStatus == 7){
		baseUtil.notice('打印纸已经用完，请添加新的打印纸。');
	}
	else if(getStatus == 8){
		baseUtil.notice('打印纸即将用完，请及时更换打印纸。');
	}
	lightUtil.ticket.turnOff();
}

/*根据出生日期算出年龄*/  
function jsGetAge(strBirthday){         
    var returnAge;  
    var strBirthdayArr = strBirthday.split("-");  
    var birthYear = strBirthdayArr[0];  
    var birthMonth = strBirthdayArr[1];  
    var birthDay = strBirthdayArr[2];  
      
    var d = new Date();  
    var nowYear = d.getFullYear();  
    var nowMonth = d.getMonth() + 1;  
    var nowDay = d.getDate();  
      
    if(nowYear == birthYear){  
        returnAge = 0;//同年 则为0岁  
    }  
    else{  
        var ageDiff = nowYear - birthYear ; //年之差  
        if(ageDiff > 0){  
            if(nowMonth == birthMonth) {  
                var dayDiff = nowDay - birthDay;//日之差  
                if(dayDiff < 0)  
                {  
                    returnAge = ageDiff - 1;  
                }  
                else  
                {  
                    returnAge = ageDiff ;  
                }  
            }  
            else  
            {  
                var monthDiff = nowMonth - birthMonth;//月之差  
                if(monthDiff < 0)  
                {  
                    returnAge = ageDiff - 1;  
                }  
                else  
                {  
                    returnAge = ageDiff ;  
                }  
            }  
        }  
        else  
        {  
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天  
        }  
    }  
    return returnAge;//返回周岁年龄  
}
const Socket={
	printMedicalRecord:printMedicalRecord,
	printCommonAssay:printCommonAssay,
	printBloodAssay:printBloodAssay,
	printCashDetails:printCashDetails,
	printAppoint:printAppoint,
	printSign:printSign,
	printRechargeReceipt:printRechargeReceipt,
	printRefundReceipt:printRefundReceipt,
	printConsumeReceipt:printConsumeReceipt,
	lodopPrintStatus:lodopPrintStatus,
	printDoCardFees:printDoCardFees,
	getMSPrinterStatus:getMSPrinterStatus,
	printMakeUpCardFees:printMakeUpCardFees,
	printForegift:printForegift
}

export default Socket;
