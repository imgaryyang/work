import dva from 'dva';
import { loadCaseHistoryRecords, loadCaseHistory, loadCheckRecords, loadCheckInfo, loadCheckInfoForPrint } from '../services/OutpatientService';

import LodopFuncs       from '../utils/LodopFuncs';

export default {

	namespace: 'outpatient',

	state: {
		caseHistoryRecords: [],
		caseHistoryRecordsLoaded: false,
		caseHistory: [],
		caseHistoryLoaded: false,

		checkRecords: [],
		checkRecordsLoaded: false,
		checkInfo: [],
		checkInfoLoaded: false,
		checkInfoDetail: [],
		checkInfoDetailLoaded: false,
	},

	//订阅
	subscriptions: {
	},

	//远程请求
	effects: {

	/**
	 * 载入病历记录
	 */
    * loadCaseHistoryRecords ({ payload }, { select, call, put }) {
    	const {data} = yield call(loadCaseHistoryRecords);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				caseHistoryRecords: data.result,
	  				caseHistoryRecordsLoaded: true,
	  			},
	      })
      }
    },

	/**
	 * 载入病历信息
	 */
    * loadCaseHistory ({ payload }, { select, call, put }) {
    	const {data} = yield call(loadCaseHistory, payload);
    	if (data && data.success ) {
    		yield put({
	  			type: 'printReport',
	  			payload: {
	  				caseHistory: data.result,
	  				caseHistoryLoaded: true,
	  			},
	      })
      }
    },

	/**
	 * 载入检验记录
	 */
    * loadCheckRecords ({ payload }, { select, call, put }) {
    	const {data} = yield call(loadCheckRecords);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				checkRecords: data.result,
	  				checkRecordsLoaded: true,
	  			},
	      })
      }
    },

	/**
	 * 载入检验单信息
	 */
    * loadCheckInfo ({ payload }, { select, call, put }) {
    	const {data} = yield call(loadCheckInfo, payload);
    	if (data && data.success ) {
    		yield put({
	  			type: 'setState',
	  			payload: {
	  				checkInfo: data.result,
	  				checkInfoLoaded: true,
	  			},
	      })
      }
    },
    
    /**
	 * 打印检验单信息
	 */
	* loadCheckInfoForPrint ({ payload }, { select, call, put }) {
		const {data} = yield call(loadCheckInfoForPrint, payload.checkRecord);
		if (data && data.success ) {
			yield put({
	  			type: 'printCheckInfo',
	  			payload: {
	  				currentCheckRecord : payload.checkRecord,
	  				checkInfoDetail: data.result,
	  				checkInfoDetailLoaded: true,
	  			},
	      })
	  }
	},
    
	},

	//处理state
	reducers: {
		//病历报告单打印
		printReport (state, {payload}) {
			payload.caseHistory.map(
				(row, idx) => {
					const { id, treatmentDate, departmentId, departmentName, doctorId, doctorName, doctorJobTitleId, doctorJobTitle, printTimes } = row;
					
					var LODOP = LodopFuncs.getLodop();
					LODOP.PRINT_INITA(10,10,762,580,"打印控件功能演示_Lodop功能_昆明某医院报告单全样");
					LODOP.SET_PRINT_STYLE("FontColor","#0000FF");
					LODOP.ADD_PRINT_SHAPE(2,66,23,705,253,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(1,94,24,704,1,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(1,122,24,704,1,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(1,150,24,704,1,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(1,178,24,704,1,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(1,206,24,704,1,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(1,234,24,704,1,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(1,262,24,704,1,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(1,290,24,704,1,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(0,66,140,1,252,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(0,66,257,1,252,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(0,66,373,1,252,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(0,66,490,1,112,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(0,66,607,1,112,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(2,328,23,705,60,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(1,358,24,704,1,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(2,399,23,705,60,0,1,"#800000");
					LODOP.ADD_PRINT_SHAPE(1,428,24,704,1,0,1,"#800000");
					LODOP.ADD_PRINT_TEXT(13,162,408,10,"中国云南省昆明市XXX医院检查报告单");
					LODOP.SET_PRINT_STYLEA(0,"FontSize",15);
					LODOP.SET_PRINT_STYLEA(0,"FontColor","#800000");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(73,30,100,20,"病历ID：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(101,30,100,20,"就诊时间：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(129,30,100,20,"科室ID：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(157,30,100,20,"科室：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(185,30,100,20,"医生ID：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(213,30,100,20,"医生名称：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(241,30,100,20,"医生职称ID：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(269,30,100,20,"医生职称：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(297,30,100,20,"打印次数：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(73,266,100,20,"病人编号：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(101,266,100,20,"联系电话：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(129,266,100,20,"门诊/住院号：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(157,266,100,20,"检查类型：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(185,266,100,20,"申请科室：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(213,266,100,20,"登记时间：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(241,266,100,20,"检查时间：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(269,266,100,20,"报告时间：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(297,266,100,20,"审核时间：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(73,502,100,20,"病人性别：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(101,502,100,20,"联系地址：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(129,502,100,20,"病   床：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(157,502,100,20,"检查项目：");
					LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
					LODOP.ADD_PRINT_TEXT(335,25,100,20,"影像表现");
					LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
					LODOP.ADD_PRINT_TEXT(403,25,100,20,"诊断结论");
					LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
					 					
					LODOP.ADD_PRINT_TEXT(73,150,100,20,row.id);
					LODOP.ADD_PRINT_TEXT(101,150,130,20,row.treatmentDate);
					LODOP.ADD_PRINT_TEXT(129,150,100,20,row.departmentId);
					LODOP.ADD_PRINT_TEXT(157,150,100,20,row.departmentName);
					LODOP.ADD_PRINT_TEXT(185,150,100,20,row.doctorId);
					LODOP.ADD_PRINT_TEXT(213,150,100,20,row.doctorName);
					LODOP.ADD_PRINT_TEXT(241,150,100,20,row.doctorJobTitleId);
					LODOP.ADD_PRINT_TEXT(269,150,100,20,row.doctorJobTitle);
					LODOP.ADD_PRINT_TEXT(297,150,100,20,row.printTimes);
					
					LODOP.ADD_PRINT_TEXT(73,380,100,20,"");
					LODOP.ADD_PRINT_TEXT(101,380,100,20,"");
					LODOP.ADD_PRINT_TEXT(129,380,100,20,"");
					LODOP.ADD_PRINT_TEXT(157,380,100,20,"");
					LODOP.ADD_PRINT_TEXT(185,380,100,20,"");
					LODOP.ADD_PRINT_TEXT(213,380,100,20,"");
					LODOP.ADD_PRINT_TEXT(241,380,100,20,"");
					LODOP.ADD_PRINT_TEXT(269,380,100,20,"");
					LODOP.ADD_PRINT_TEXT(297,380,100,20,"");
					
					
					LODOP.ADD_PRINT_TEXT(73,615,100,20,"");
					LODOP.ADD_PRINT_TEXT(102,615,100,20,"");
					LODOP.ADD_PRINT_TEXT(129,615,100,20,"");
					LODOP.ADD_PRINT_TEXT(157,615,100,20,"");
					
					LODOP.PREVIEW();//调用的是打印预览界面
					//LODOP.PRINT_DESIGN();//调用的是打印涉及功能
				}
			);
			let {...props} = payload;
			return {
				...state, 
				...props,
			};
		},
		
		//检验单打印
		printCheckInfo (state, {payload}) {
			var LODOP = LodopFuncs.getLodop();
			LODOP.PRINT_INITA(10,10,762,580,"打印控件功能演示_Lodop功能_昆明某医院报告单全样");
			LODOP.SET_PRINT_STYLE("FontColor","#0000FF");
			LODOP.ADD_PRINT_SHAPE(2,66,23,705,90,0,1,"#800000");
			LODOP.ADD_PRINT_SHAPE(2,166,23,705,300,0,1,"#800000");
			LODOP.ADD_PRINT_TEXT(74,60,70,20,"检查单号");
			LODOP.ADD_PRINT_TEXT(104,60,70,20,"申请科室");
			LODOP.ADD_PRINT_TEXT(134,60,70,20,"样本类型");
			LODOP.ADD_PRINT_TEXT(74,294,70,20,"    姓名");
			LODOP.ADD_PRINT_TEXT(104,294,70,20,"申请医生");
			LODOP.ADD_PRINT_TEXT(134,294,70,20,"审核医生");
			LODOP.ADD_PRINT_TEXT(74,520,70,20,"申请日期");
			LODOP.ADD_PRINT_TEXT(104,520,70,20,"接收日期");
			LODOP.ADD_PRINT_TEXT(134,520,70,20,"审核日期");
			LODOP.ADD_PRINT_TEXT(74,130,100,20,payload.currentCheckRecord.patientId);
			LODOP.ADD_PRINT_TEXT(104,130,100,20,payload.currentCheckRecord.requestDeptName);
			LODOP.ADD_PRINT_TEXT(134,130,100,20,payload.currentCheckRecord.specimenTypeName);
			LODOP.ADD_PRINT_TEXT(74,364,100,20,payload.currentCheckRecord.patientName);
			LODOP.ADD_PRINT_TEXT(104,364,100,20,payload.currentCheckRecord.requestDoctorName);
			LODOP.ADD_PRINT_TEXT(134,364,100,20,payload.currentCheckRecord.checkDoctorName);
			LODOP.ADD_PRINT_TEXT(74,590,130,20,payload.currentCheckRecord.requestDate);
			LODOP.ADD_PRINT_TEXT(104,590,130,20,payload.currentCheckRecord.receiveDate);
			LODOP.ADD_PRINT_TEXT(134,590,130,20,payload.currentCheckRecord.checkDate);
			LODOP.ADD_PRINT_TEXT(172,30,40,20,"项目");
			LODOP.ADD_PRINT_TEXT(172,294,70,20,"    结果");
			LODOP.ADD_PRINT_TEXT(172,470,60,20,"参考范围");
			LODOP.ADD_PRINT_TEXT(172,640,40,20,"单位");
			/*var i = 0;
			var left = 
			for(i=0;i<4;i++){
				
			}*/
			//payload.currentCheckRecord
			//{ requestDate, checkType, checkTypeName, departmentName, doctorName, doctorJobTitle, state, printTimes,
	        //patientName, requestDeptName, requestDoctorName, receiveDate, specimenTypeName, checkDoctorName, checkDate};
			var top = 170,left1 = 30,left2 = 314,left3 = 460, left4 = 620;
			var i = 1,j = 30;
			var tmp = 0;
			payload.checkInfoDetail.map(
				(row, idx) => {
					const {id, index, item, result, state, range, unit} = row;
					
					tmp = top + j;
					top = tmp;
					LODOP.ADD_PRINT_TEXT(tmp,left1,200,20,row.item);
					LODOP.ADD_PRINT_TEXT(tmp,left2,70,20,row.result);
					LODOP.ADD_PRINT_TEXT(tmp,left3,100,20,row.range);
					LODOP.ADD_PRINT_TEXT(tmp,left4,80,20,row.unit);
					
				}
			);
			//LODOP.PREVIEW();//调用的是打印预览界面
			LODOP.PRINT_DESIGN();//调用的是打印涉及功能
			let {...props} = payload;
			return {
				...state, 
				...props,
			};
		},
		
		/**
		 * 通用setState
		 */
		setState (state, {payload}) {
			let {...props} = payload;
			return {
				...state, 
				...props,
			};
		},

	},
};


