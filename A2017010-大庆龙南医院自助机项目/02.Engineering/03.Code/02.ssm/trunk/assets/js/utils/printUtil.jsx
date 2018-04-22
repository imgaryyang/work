import eventUtil from './eventUtil.jsx';
import baseUtil from './baseUtil.jsx';
import lightUtil from './lightUtil.jsx';
import logUtil,{ log } from  "./logUtil.jsx";
import LodopFuncs from './LodopFuncs.jsx';
import polyfill from 'babel-polyfill';
import moment from 'moment';
const eventFlag = "print";

const LODAP_ID = "LODOP_OB";
const MS_PRINTER_ID = "MSPrintActiveX";

var LODAP,MS_PRINTER,JOB_ID;

const dev_mode = baseUtil.dev_mode;

const PRINTER_dev = {

}
const LODAP_dev ={

}
function  waitForPrint(JOB_ID){
	async function  wait(JOB_ID){
		var status = 1;
		while(status == 1){
			await baseUtil.sleep(12*1000);
			status = lodopPrintStatus(JOB_ID);
			log('lodopPrintStatus status ',status);
		}
	}
	wait();
}
function init(){
	if(dev_mode){return;}
	if(!LODAP) LODAP = document.getElementById(LODAP_ID);
	if(!MS_PRINTER) MS_PRINTER = document.getElementById(MS_PRINTER_ID);

	if(!LODAP)throw new Error("找不到报告打印机控件");
	if(!MS_PRINTER)throw new Error("找不到热敏打印机控件");
}
function notice(status){
	if(status == 1){
		baseUtil.notice('打印机未连接或未上电，请联系维护人员。');
	}
	else if(status == 2){
		baseUtil.notice('打印机和调用库不匹配，请联系维护人员。');
	}
	else if(status == 3){
		baseUtil.notice('打印头打开，请联系维护人员。');
	}
	else if(status == 4){
		baseUtil.notice('切刀未复位，请联系维护人员。');
	}
	else if(status == 5){
		baseUtil.notice('打印头过热，请联系维护人员。');
	}
	else if(status == 6){
		baseUtil.notice('黑标错误，请联系维护人员。');
	}
	else if(status == 7){
		baseUtil.notice('打印纸已经用完，请添加新的打印纸。');
	}
	else if(status == 8){
		baseUtil.notice('打印纸即将用完，请及时更换打印纸。');
	}
}
//获取报告打印机状态
function getReportPrinterStatus(){
	if(dev_mode )return  {state:0,msg:''};
	init();
	var json = -1;
	try {
		var LODOP = LodopFuncs.getLodop();
		json = LODOP.GET_VALUE("PRINT_STATUS_BUSY", "last");//获取最后一次任务状态
	} catch (e) {
		log('报告打印机异常',e);
		return {state:json,msg:'报告打印机故障，请联系工作人员',exception:'异常'+e};
	}
	log('getReportPrinterStatus ', json );
	if(json == 0){
		return {state:json,msg:''};
	}else  if(json == 1){
		return {state:json,msg:'报告打印机忙碌中，请联系工作人员',exception:'打印机忙碌'};
	}else{
		return {state:json,msg:'凭条打印机故障，请联系工作人员',exception:'异常'};
	}
	return json;
}
//获取凭条打印机状态
function getMSPrinterStatus(){
	if(dev_mode )return  {state:0,msg:''};
	init();
	var json = -1;
	try {
		var setPrintport = MS_PRINTER.SetPrintport("COM5",38400);//设置串口
		var setInit = MS_PRINTER.SetInit();//打印机初始化
		json = MS_PRINTER.GetStatus();
		var resultCode = MS_PRINTER.SetClose();;//打印机关闭
	} catch (e) {
		log('凭条打印机异常',e);
		return {state:json,msg:'凭条打印机故障，请联系工作人员',exception:'异常'+e};
	}
	log('getMSPrinterStatus ', json );
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
function  printMedicalRecord(msg){
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
	//LODOP.SET_PRINTER_INDEX("Canon LBP3000");
	LODOP.SET_PRINTER_INDEX(-1);
	JOB_ID = LODOP.PRINT();
	waitForPrint(JOB_ID);
	lightUtil.form.turnOff();
	return JOB_ID;
}

/**
 * 打印图片检验报告
 * @returns
 */
function printCommonAssay(assay,imagePath){
	//if(dev_mode){return;}
	lightUtil.form.blink();
	init();
	// LODOP.print.....调用打印机方法
	let LODOP = LodopFuncs.getLodop();
	LODOP.PRINT_INIT("检查单报告");
	LODOP.ADD_PRINT_IMAGE("0cm","0.1cm","100%","100%","<img border='0' src='"+imagePath+"' />");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);//按原图比例(不变形)缩放模式
	LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS",true);
	//LODOP.SET_PRINTER_INDEX("Canon LBP3000");
	LODOP.SET_PRINTER_INDEX(-1);
	JOB_ID = LODOP.PRINT();
	waitForPrint(JOB_ID);
	lightUtil.form.turnOff();

	return JOB_ID;
}

/**
 * 打印图片pacs报告
 * @returns
 */
function printCommonPacs(assay,imagePath){
	//if(dev_mode){return;}
	lightUtil.form.blink();
	init();
	// LODOP.print.....调用打印机方法
	let LODOP = LodopFuncs.getLodop();
	LODOP.PRINT_INIT("检查单报告");
	LODOP.ADD_PRINT_IMAGE("0cm","0.1cm","100%","100%","<img border='0' src='"+imagePath+"' />");
	LODOP.SET_PRINT_STYLEA(0,"Stretch",2);//按原图比例(不变形)缩放模式
	LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS",true);
	//LODOP.SET_PRINTER_INDEX("Canon LBP3000");
	LODOP.SET_PRINTER_INDEX(-1);
	JOB_ID = LODOP.PRINT();
	waitForPrint(JOB_ID);
	lightUtil.form.turnOff();

	return JOB_ID;
}

/**
 * 打印血液科检验报告
 * @returns
 */
function printBloodAssay(result){
	if(dev_mode){return;}
	lightUtil.form.blink();
	init();
	/**
	 * orderno-标本号;jyname-试验项目;result-结果;
	 * jydate-检验日期;jydoctor-检验者;bgdate-;
	 * bgdoctor-;shdate-审核日期;shdoctor-审核者
	**/
	// LODOP.print.....调用打印机方法
	let hospital = "大庆龙南医院";
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
	//LODOP.SET_PRINTER_INDEX("Canon LBP3000");
	LODOP.SET_PRINTER_INDEX(-1);
	JOB_ID = LODOP.PRINT();
	waitForPrint(JOB_ID);
	lightUtil.form.turnOff();
	return JOB_ID;
}

function printPrescriptionRecord(result){
  if(dev_mode){return;}
  lightUtil.form.blink();
  init();
  // LODOP.print.....调用打印机方法
  let LODOP = LodopFuncs.getLodop();
  let type = '门诊';
  let hospital = '大庆龙南医院';//医院名称
  let tex1 = '处 方 笺';
  let prescriptionType = result.prescriptionType;
  let drugDispenser = result.pharmacyWindow;//'门诊西药房';//取药药房
  let dateValue = result.date.substring(0,10);
  let year = dateValue.substring(0,4);
  let month = dateValue.substring(5,7);
  let day = dateValue.substring(8,10);
  let date = year + '年' + month + '月' + day + '日';
  let prescriptionNo = result.prescriptionNo;//'17121950003';//处方号
  let department = result.department;//'急诊科';//科别
  let unit = result.unit;//'大庆市龙南医院信息科';//单位
  let patientNo = result.patientNo;//'000000888888';//病历号
  let patientName = result.patientName;//'黄孙';//姓名
  let gender = result.gender;//'男';//性别
  let genderText = '';
  if(gender == '1'){
	  genderText = '男';
  }
  if(gender == '2'){
	  genderText = '女';
  }
  let age = jsGetAge(result.birthday.substring(0,10));;//'8天';//年龄
  //费别转换
  let payType = '';//'自费';//费别
  let medicalCardNo = result.medicalCardNo;//卡内数据
  if((medicalCardNo.substring(0,3) == '01^') && type =='02'){//01油田医保（管局）
    payType = '管局';
  }
  else if((medicalCardNo.substring(0,3) == '02^') && type == '01'){//02市政医保
	payType = '市政';
  }
  else if((medicalCardNo.substring(0,3) != '01^') && (medicalCardNo.substring(0,3) != '02^')){
    payType = '自费';
  }
  let address = result.address;//'上海市松江区车墩镇东门村779号';//地址
  let mobilPhone = result.mobilPhone;//'13564479086';//电话
  let clinicalDiagnosis = result.clinicalDiagnosis;//'外伤症';//临床诊断
  let remarks = result.remarks;//'慢性病';
  let items = result.items;//药品明细
  let dispensing = result.dispensing;
  let auditor = result.auditor;
  let distributor = result.distributor;
  let checker = result.checker;
  let doctor = result.doctor;//'管理员106';
  let totalAmount = result.totalAmount.formatMoney();//'105.68';//处方总金额

  LODOP.PRINT_INIT('处方单');
  //LODOP.ADD_PRINT_RECT(5,5,755,"98%",0,1);
  LODOP.ADD_PRINT_TEXT(42,28,60,30,type);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',14);
  LODOP.SET_PRINT_STYLEA(0,'Bold',1);
  LODOP.ADD_PRINT_TEXT(32,150,200,50,hospital);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',21);
  LODOP.SET_PRINT_STYLEA(0,'Bold',1);
  LODOP.ADD_PRINT_TEXT(32,360,150,50,tex1);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',21);
  LODOP.SET_PRINT_STYLEA(0,'Bold',1);
  LODOP.ADD_PRINT_ELLIPSE(22,615,85,45,0,1);
  LODOP.ADD_PRINT_TEXT(32,620,76,40,prescriptionType);
  LODOP.SET_PRINT_STYLEA(0,"FontSize",18);
  LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
  LODOP.ADD_PRINT_TEXT(80,-5,100,30,'取药药房：');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
  LODOP.ADD_PRINT_TEXT(80,90,160,30,drugDispenser);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.ADD_PRINT_TEXT(80,250,80,30,'日期：');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
  LODOP.ADD_PRINT_TEXT(80,325,140,30,date);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.ADD_PRINT_TEXT(80,475,80,30,'处方号：');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
  LODOP.ADD_PRINT_TEXT(80,550,150,30,prescriptionNo);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.ADD_PRINT_TEXT(105,-5,100,30,'科别：');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
  LODOP.ADD_PRINT_TEXT(105,90,160,30,department);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.ADD_PRINT_TEXT(105,250,80,30,'病历号：');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
  LODOP.ADD_PRINT_TEXT(105,325,140,30,patientNo);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.ADD_PRINT_TEXT(105,475,80,30,'单位：');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
  LODOP.ADD_PRINT_TEXT(105,550,220,30,unit);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.ADD_PRINT_TEXT(130,-5,100,30,'姓名：');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
  LODOP.ADD_PRINT_TEXT(130,90,160,30,patientName);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.ADD_PRINT_TEXT(130,250,80,30,'性别：');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
  LODOP.ADD_PRINT_TEXT(130,325,30,30,genderText);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.ADD_PRINT_TEXT(130,360,60,30,'年龄：');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
  LODOP.ADD_PRINT_TEXT(130,415,60,30,age);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.ADD_PRINT_TEXT(130,475,80,30,'费别：');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
  LODOP.ADD_PRINT_TEXT(130,550,150,30,payType);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.ADD_PRINT_TEXT(155,-5,100,30,'地址：');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
  LODOP.ADD_PRINT_TEXT(155,90,385,30,address);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.ADD_PRINT_TEXT(155,475,80,30,'电话：');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
  LODOP.ADD_PRINT_TEXT(155,550,150,30,mobilPhone);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.ADD_PRINT_TEXT(180,-5,100,30,'临床诊断：');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
  LODOP.ADD_PRINT_TEXT(180,90,200,30,clinicalDiagnosis);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  
  LODOP.ADD_PRINT_TEXT(205,14,60,30,'备注：');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
  LODOP.ADD_PRINT_TEXT(205,70,230,30,remarks);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  
  /*if(prescriptionType === '1'){
    LODOP.ADD_PRINT_TEXT(205,14,60,30,'备注：');
    LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
    LODOP.SET_PRINT_STYLEA(0,'Alignment',3);
    LODOP.ADD_PRINT_TEXT(205,70,230,30,remark);
    LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  }*/
  LODOP.ADD_PRINT_LINE(230,25,231,745,0,1);
  LODOP.ADD_PRINT_LINE(460,225,230,226,0,1);
  LODOP.ADD_PRINT_LINE(460,375,230,376,0,1);
  LODOP.ADD_PRINT_LINE(460,680,230,681,0,1);
  LODOP.ADD_PRINT_TEXT(232,25,30,40,'R');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',20);
  LODOP.SET_PRINT_STYLEA(0,'Bold',1);
  LODOP.ADD_PRINT_TEXT(245,40,20,30,'p');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',13);
  LODOP.SET_PRINT_STYLEA(0,'Bold',1);
  LODOP.ADD_PRINT_TEXT(240,80,80,30,'药品名称');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
  LODOP.ADD_PRINT_TEXT(240,260,80,30,'剂型规格');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
  LODOP.ADD_PRINT_TEXT(240,480,80,30,'用法用量');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
  LODOP.ADD_PRINT_TEXT(240,695,50,30,'数量');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
  LODOP.ADD_PRINT_LINE(265,25,266,745,0,1);
  let startHeight = 270;
  let fixedHeight = 30;
  /*let lineTop1SatrtHeight = 265;
  let lineTop2SatrtHeight = 266;
  let lineFixeHeight = 30;*/
  for(let i=0;i<items.length;i++){
    LODOP.ADD_PRINT_TEXT((startHeight+(fixedHeight*i)),25,200,30,items[i].drugName);
    LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
    LODOP.ADD_PRINT_TEXT((startHeight+(fixedHeight*i)),230,140,30,items[i].specifications);
    LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
    LODOP.ADD_PRINT_TEXT((startHeight+(fixedHeight*i)),380,300,30,items[i].usageAndDosage);
    LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
    LODOP.ADD_PRINT_TEXT((startHeight+(fixedHeight*i)),695,50,30,items[i].number);
    LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  }
  LODOP.ADD_PRINT_LINE(460,25,461,745,0,1);
  LODOP.ADD_PRINT_LINE(490,25,491,745,0,1);
  LODOP.ADD_PRINT_LINE(520,25,521,745,0,1);
  LODOP.ADD_PRINT_LINE(520,150,460,151,0,1);
  LODOP.ADD_PRINT_LINE(520,300,460,301,0,1);
  LODOP.ADD_PRINT_LINE(520,450,460,451,0,1);
  LODOP.ADD_PRINT_LINE(520,600,460,601,0,1);
  LODOP.ADD_PRINT_TEXT(468,45,60,30,'发药印');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
  LODOP.ADD_PRINT_TEXT(495,605,145,30,dispensing);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
  LODOP.ADD_PRINT_TEXT(468,195,60,30,'审核印');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
  LODOP.ADD_PRINT_TEXT(495,605,145,30,auditor);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
  LODOP.ADD_PRINT_TEXT(468,345,60,30,'调配印');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
  LODOP.ADD_PRINT_TEXT(495,605,145,30,distributor);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
  LODOP.ADD_PRINT_TEXT(468,495,60,30,'核对印');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
  LODOP.ADD_PRINT_TEXT(495,605,145,30,checker);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
  LODOP.ADD_PRINT_TEXT(468,645,60,30,'医师印');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
  LODOP.ADD_PRINT_TEXT(495,605,145,30,doctor);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Alignment',2);
  LODOP.ADD_PRINT_TEXT(525,25,100,30,'处方总金额：');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.ADD_PRINT_TEXT(525,115,200,30,totalAmount);
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.ADD_PRINT_TEXT(550,25,580,30,'注：当日处方当日有效，过期重新开方。');
  LODOP.SET_PRINT_STYLEA(0,'FontSize',10);
  LODOP.SET_PRINT_STYLEA(0,'Italic',1);

  LODOP.SET_PRINTER_INDEX(-1);
  JOB_ID = LODOP.PRINT();
  waitForPrint(JOB_ID);
  lightUtil.form.turnOff();
  return JOB_ID;
}

/**
 * 打印现金明细
 * @returns
 */
function printCashDetails(result){

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
	var registerAmount = result.registerAmount.formatMoney();//挂号费
	var text1 = "自助机";
	var text2 = "预约当日该医师有可能遇急事不能坐诊，请谅解！";
	//var printTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	var printTime = moment().format('YYYY-MM-DD HH:mm:ss');
	var isOldOrLhz = "";
	var patientBirthday = result.patientBirthday;
	var lhz = result.lhz;
	var age = result.age;
	if(lhz == '1'){
		isOldOrLhz = "*";
	}
	else if(lhz == '0'){
		if(age > 70){
			isOldOrLhz = "*";
		}
	}
	else{
		isOldOrLhz = "";
	}

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
		MS_PRINTER.PrintString("出诊医师 "+doctorName);
		MS_PRINTER.SetSizetext(1, 1);
		MS_PRINTER.PrintString(underline);
		MS_PRINTER.SetSizetext(2, 1);
		MS_PRINTER.PrintString(appointmentNo+"号 "+isOldOrLhz+patientName);
		MS_PRINTER.SetBold(1);
		MS_PRINTER.PrintString("为了避免您重复排队，您就诊卡内余额应大于"+registerAmount+"元，请您提前充值！");
		MS_PRINTER.SetBold(0);
		MS_PRINTER.PrintString("请您于 "+appointmentTime.substring(0,16)+" 提前15分钟");
		//MS_PRINTER.PrintString("到"+text1+"或"+houseLocation+deptName+"分诊台签到");
		MS_PRINTER.PrintString("到"+text1+"或"+houseLocation+"签到");
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
	}else{
		notice(getStatus);
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
	var isOldOrLhz = "";
	var patientBirthday = result.patientBirthday;
	var lhz = result.lhz;
	var age = result.age;
	if(lhz == '1'){
		isOldOrLhz = "*";
	}
	else if(lhz == '0'){
		if(age > 70){
			isOldOrLhz = "*";
		}
	}
	else{
		isOldOrLhz = "";
	}

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
		MS_PRINTER.PrintString("出诊医师 "+doctorName);
		MS_PRINTER.SetSizetext(1, 1);
		MS_PRINTER.PrintString(underline);
		MS_PRINTER.SetSizetext(2, 1);
		//MS_PRINTER.SetBold(1);//加粗
		MS_PRINTER.PrintString(clinicHouse+"  "+appointmentNo+"号 "+isOldOrLhz+patientName);
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
	}else{
		notice(getStatus);
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
	if(predepositMode == '0105'){ predepositModeText = "建设银行"; }
	var patientNo = result.patientNo;
	var patientName = result.patientName;
	var gender = baseInfo.gender;//1-男 2-女
	var genderText = "";
	if(gender == '1'){ genderText = "男"; }
	if(gender == '2'){ genderText = "女"; }
	var birthday = baseInfo.birthday;
	//var currentYear = moment().format('YYYY');
	var age = jsGetAge(baseInfo.birthday.substring(0,10));
	var unitCode = baseInfo.unitCode;
	var expenseType = "";
	if(!unitCode ){
	}else if(unitCode.substring(0,1) == 'Y'){
		expenseType = "医保";
	}else if(unitCode.substring(0,1) == 'X'){
		expenseType = "新农合";
	}else if(unitCode  == '0000'){
		expenseType = "自费";
	}else if(unitCode.substring(0,1) == 'M'){
		expenseType = "民政补助";
	}else if(unitCode.substring(0,1) == 'S'){
		expenseType = "商业保险";
	}else if(unitCode.substring(0,1) == 'C'){
		expenseType = "慈善补助";
	}else{
		expenseType = "公费";
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
	}else{
		notice(getStatus);
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
	if(predepositMode == '0105'){ predepositModeText = "建设银行"; }
	var patientNo = baseInfo.no;
	var patientName = baseInfo.name;
	var gender = baseInfo.gender;//1-男 2-女
	var genderText = "";
	if(gender == '1'){ genderText = "男"; }
	if(gender == '2'){ genderText = "女"; }
	var birthday = baseInfo.birthday;
	//var currentYear = moment().format('YYYY');
	var age = jsGetAge(baseInfo.birthday.substring(0,10));
	var unitCode = baseInfo.unitCode;
	var expenseType = "";
	if(!unitCode ){
	}else if(unitCode.substring(0,1) == 'Y'){
		expenseType = "医保";
	}else if(unitCode.substring(0,1) == 'X'){
		expenseType = "新农合";
	}else if(unitCode  == '0000'){
		expenseType = "自费";
	}else if(unitCode.substring(0,1) == 'M'){
		expenseType = "民政补助";
	}else if(unitCode.substring(0,1) == 'S'){
		expenseType = "商业保险";
	}else if(unitCode.substring(0,1) == 'C'){
		expenseType = "慈善补助";
	}else{
		expenseType = "公费";
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
	}else{
		notice(getStatus);
	}
	lightUtil.ticket.turnOff();
}

/**
 * 打印缴费凭条
 * @returns
 */
function printConsumeReceipt(fees,order,baseInfo,machineInfo,clinicals){
	if(dev_mode){return;}
	lightUtil.ticket.blink();
	init();
	// MS_PRINTER.print.....调用打印机方法
	//var cs,cwxx,dj,flmmc,ksid,ksmc,kzjbmc,mc,sl,ysid,ysxm,yzsj,zh;
	var headerText = "缴费凭证";//倍高
	var hospatil = "大庆龙南医院";
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
	var unitCode = baseInfo.unitCode;
	var expenseType = "";
	if(!unitCode ){
	}else if(unitCode.substring(0,1) == 'Y'){
		expenseType = "医保";
	}else if(unitCode.substring(0,1) == 'X'){
		expenseType = "新农合";
	}else if(unitCode  == '0000'){
		expenseType = "自费";
	}else if(unitCode.substring(0,1) == 'M'){
		expenseType = "民政补助";
	}else if(unitCode.substring(0,1) == 'S'){
		expenseType = "商业保险";
	}else if(unitCode.substring(0,1) == 'C'){
		expenseType = "慈善补助";
	}else{
		expenseType = "公费";
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
		MS_PRINTER.SetLinespace(30);//设置行间距
		MS_PRINTER.PrintString(headerText);
		MS_PRINTER.PrintString("");
		MS_PRINTER.SetSizetext(1, 1);
		MS_PRINTER.PrintString(hospatil+"     "+orderNo);
		MS_PRINTER.SetSizetext(2, 1);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString("姓名:"+patientName+"      "+"性别:"+genderText+"          "+"年龄:"+age);
		MS_PRINTER.PrintString("病人编号:"+patientNo+" ("+expenseType+") ");
		/*for(i=0;i<fees.length;i++){
			MS_PRINTER.PrintString(fees[i].mc+" "+fees[i].dj);
		}*/
		MS_PRINTER.PrintString("合计金额:"+amt+"          "+"减免:"+reduceAmt);
		MS_PRINTER.PrintString(/*"个人账户金额:"+paAmt+"        "+*/"预存账户金额:"+selfAmt);
		MS_PRINTER.PrintString("医保金额:"+miAmt);
		MS_PRINTER.PrintString("预存余额:"+balance);
		MS_PRINTER.SetSizetext(1, 1);
		MS_PRINTER.SetLinespace(30);//设置行间距
		MS_PRINTER.PrintString("操作员:"+operator+"              "+"收费日期:"+tranTime.substring(0,10));
		MS_PRINTER.PrintString(note);
		MS_PRINTER.PrintString("------------------------------------------------");
		//打印就医指南
		clinicals = clinicals ||[];
		for(var clinical of clinicals ){
			printGuideCotent(baseInfo,machineInfo,clinical);
		}
		var printFeedline = MS_PRINTER.PrintFeedline(7);
		//MS_PRINTER.PrintMarkposition();//检测黑标,黑标模式下检测黑标， 停止在黑标位置
		//MS_PRINTER.PrintMarkpositioncut();//检测黑标进纸到切纸位置
		//var printCutpaper = MS_PRINTER.PrintMarkcutpaper(0);//int iMode： 0 全切、 1 半切
		var printCutpaper = MS_PRINTER.PrintCutpaper(0);//int iMode： 0 全切、 1 半切
		var setClean = MS_PRINTER.SetClean();//清理缓存
		var resultCode = MS_PRINTER.SetClose();

	}else{
		notice(getStatus);
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
	var attentionContent1 = "请自行妥善保管，下次就诊请携带就诊卡。";
	var attentionContent2 = "如遇丢失，需要补办，补办就诊卡需要收费。";

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
		MS_PRINTER.PrintString("就诊卡余额："+balance);
		MS_PRINTER.PrintString("  操作员："+operator);
		MS_PRINTER.SetSizetext(2, 2);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString(attentionContent1);
		MS_PRINTER.PrintString(attentionContent2);
		var printFeedline = MS_PRINTER.PrintFeedline(7);
		//MS_PRINTER.PrintMarkposition();//检测黑标,黑标模式下检测黑标， 停止在黑标位置
		//MS_PRINTER.PrintMarkpositioncut();//检测黑标进纸到切纸位置
		//var printCutpaper = MS_PRINTER.PrintMarkcutpaper(0);//int iMode： 0 全切、 1 半切
		var printCutpaper = MS_PRINTER.PrintCutpaper(0);//int iMode： 0 全切、 1 半切
		var setClean = MS_PRINTER.SetClean();//清理缓存
		var resultCode = MS_PRINTER.SetClose();
	}else{
		notice(getStatus);
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
	var attentionContent1 = "请自行妥善保管，下次就诊请携带就诊卡。";
	var attentionContent2 = "如遇丢失，需要补办，补办就诊卡需要收费"+selfAmt+"元。";

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
		MS_PRINTER.PrintString("就诊卡余额："+balance);
		MS_PRINTER.PrintString("  操作员："+operator);
		MS_PRINTER.SetSizetext(2, 2);
		MS_PRINTER.SetLinespace(55);//设置行间距
		MS_PRINTER.PrintString(attentionContent1);
		MS_PRINTER.PrintString(attentionContent2);
		var printFeedline = MS_PRINTER.PrintFeedline(7);
		//MS_PRINTER.PrintMarkposition();//检测黑标,黑标模式下检测黑标， 停止在黑标位置
		//MS_PRINTER.PrintMarkpositioncut();//检测黑标进纸到切纸位置
		//var printCutpaper = MS_PRINTER.PrintMarkcutpaper(0);//int iMode： 0 全切、 1 半切
		var printCutpaper = MS_PRINTER.PrintCutpaper(0);//int iMode： 0 全切、 1 半切
		var setClean = MS_PRINTER.SetClean();//清理缓存
		var resultCode = MS_PRINTER.SetClose();
	}else{
		notice(getStatus);
	}
	lightUtil.ticket.turnOff();
}
/**
 * 打印住院预缴凭条
 * @returns
 */
function printForegift(result,baseInfo,inpatientInfo,machineInfo,payChannel){
	if(dev_mode){return;}
	lightUtil.ticket.blink();
	init();
	// MS_PRINTER.print.....调用打印机方法
	var headerText = "住院预缴凭证";//倍高
	var hospatil = "大庆龙南医院";
	var orderNo = result.orderNo;//收据号
	var patientName = result.patientName;//病人姓名
	var gender = baseInfo.gender;//1-男 2-女
	var genderText = "";
	if(gender == '1'){ genderText = "男"; }
	if(gender == '2'){ genderText = "女"; }
	var birthday = baseInfo.birthday;

	var predepositMode = payChannel//"现金";//预存渠道
	var predepositModeText = "";
	if(predepositMode == '0000'){ predepositModeText = "现金"; }
	if(predepositMode == 'balance'){ predepositModeText = "门诊预存转住院预缴"; }
	if(predepositMode == '9998'){ predepositModeText = "微信"; }
	if(predepositMode == '9999'){ predepositModeText = "支付宝"; }
	if(predepositMode == '0306'){ predepositModeText = "广发银行"; }
	if(predepositMode == '0103'){ predepositModeText = "农业银行"; }
	if(predepositMode == '0308'){ predepositModeText = "招商银行"; }
	if(predepositMode == '6509'){ predepositModeText = "云南农信"; }
	if(predepositMode == '0301'){ predepositModeText = "交通银行"; }
	if(predepositMode == '0104'){ predepositModeText = "中国银行"; }
	if(predepositMode == '0105'){ predepositModeText = "建设银行"; }
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
		MS_PRINTER.PrintString("预缴金额:"+amt);
		MS_PRINTER.PrintString("门诊账户余额:"+balance);
		MS_PRINTER.PrintString("住院账户余额:"+payment);
		MS_PRINTER.PrintString("预存方式："+predepositModeText);
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
	}else{
		notice(getStatus);
	}
	lightUtil.ticket.turnOff();
}
/**
 * 打印就医指南
 * @returns
 */
function printGuide(baseInfo,machineInfo,guides){
	if(dev_mode){return;}
	lightUtil.ticket.blink();
	init();
	var setPrintport = MS_PRINTER.SetPrintport("COM5",38400);//设置串口
	var setInit = MS_PRINTER.SetInit();//打印机初始化
	var getStatus = MS_PRINTER.GetStatus();
	if(getStatus == 0){
		var setClean = MS_PRINTER.SetClean();//清理缓存
		MS_PRINTER.PrintMarkpositionprint();//检测黑标进纸到打印位置

		printGuideCotent(baseInfo,machineInfo,guides);

		var printFeedline = MS_PRINTER.PrintFeedline(7);
		var printCutpaper = MS_PRINTER.PrintCutpaper(0);//int iMode： 0 全切、 1 半切
		var setClean = MS_PRINTER.SetClean();//清理缓存
		var resultCode = MS_PRINTER.SetClose();
	}else{
		notice(getStatus);
	}
	lightUtil.ticket.turnOff();
}

/**
 * 打印就医指南明细
 * @returns
 */
function printGuideCotent(baseInfo,machineInfo,clinical){
	var { guides  } = clinical;
	if(!(guides && guides.length > 0))return;
	var headerText = "就医指南";//倍高
	var hospital = "大庆龙南医院";
	var patientNo = baseInfo.no;//病人编号
	var patientName = baseInfo.name;//病人姓名
	var hisUser = machineInfo.hisUser;
	var doctorName = "";
	var tradeId = clinical.tradeId;
	/*var tranTime = moment(clinical.specStartTime).format('YY-MM-DD HH:mm');*/
	var balance = baseInfo.balance;
	var note = '预存:不用排队挂号、缴费，不用携带现金';

	MS_PRINTER.SetLinespace(55);//设置行间距
	MS_PRINTER.SetSizetext(2, 2);
	MS_PRINTER.PrintString("");
	MS_PRINTER.PrintString(headerText);

	MS_PRINTER.SetLinespace(30);//设置行间距
	MS_PRINTER.SetSizetext(1, 1);
	MS_PRINTER.PrintString(hospital);
	MS_PRINTER.SetLinespace(10);//设置行间距
	//添加病人编号条码2017-11-21
	MS_PRINTER.Print1Dbar(3, 60, 0, 2, 10, patientNo);
	MS_PRINTER.PrintString("姓名:"+patientName+" 病人编号:"+patientNo+" 交易ID:"+tradeId);
	MS_PRINTER.SetLinespace(30);//设置行间距
	MS_PRINTER.PrintString("------------------------------------------------");
	for(var guide of guides){
		var { mc,uniqueflag,addr,jyid,pfck,doctorName }  = guide;
		doctorName = guide.doctorName;
		var drugWindow1="";
		var drugWindow2="";
		var drugWindow3="";
		var drugWindow4="";
		var drugWindow5="";
		var drugWindow6="";
		if(pfck == '' || pfck == null){//不是药品
			MS_PRINTER.PrintString(mc);
			if(addr)MS_PRINTER.PrintString("      "+addr);
		}
		else{//药品
			if(pfck == '601'){
				drugWindow1 = "1号";
			}
			if(pfck == '602'){
				drugWindow2 = "2号";
			}
			if(pfck == '603'){
				drugWindow3 = "3号";
			}
			if(pfck == '604'){
				drugWindow4 = "4号";
			}
			if(pfck == '605'){
				drugWindow5 = "5号";
			}
			if(pfck == '606'){
				drugWindow6 = "急诊药房 ";
			}
			MS_PRINTER.PrintString(mc);
			MS_PRINTER.PrintString("请到门诊1楼"+drugWindow1+drugWindow2+drugWindow3+drugWindow4+drugWindow5+drugWindow6+"窗口");
		}

	}

	MS_PRINTER.PrintString("------------------------------------------------");
	MS_PRINTER.PrintString("预存账户余额:"+balance.formatMoney());
	MS_PRINTER.PrintString("就诊医生:"+doctorName);
	/*MS_PRINTER.PrintString("就诊医生:"+doctorName+" 就医时间:"+tranTime);*/
	MS_PRINTER.PrintString("------------------------------------------------");
	MS_PRINTER.PrintString(note);
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
const printer={
	printMedicalRecord:printMedicalRecord,
	printCommonAssay:printCommonAssay,
	printCommonPacs:printCommonPacs,
	printBloodAssay:printBloodAssay,
	printPrescriptionRecord:printPrescriptionRecord,
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
	printForegift:printForegift,
	getReportPrinterStatus,
}
module.exports = printer;
