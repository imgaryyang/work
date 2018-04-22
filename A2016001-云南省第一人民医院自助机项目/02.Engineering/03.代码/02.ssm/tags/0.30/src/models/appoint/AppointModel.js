import dva from 'dva';
import { loadDeptList, loadScheduleList, loadAppointSources, appointBook,loadAppointHistory, appointSign, appointCancel } from '../../services/AppointService';
import baseUtil from '../../utils/baseUtil';
import medicalCard  from '../../utils/medicalCardUtil';
import miCard  from '../../utils/miCardUtil';
import idCard  from '../../utils/idCardUtil';
import printUtil from '../../utils/printUtil';
import moment               from 'moment';
export default {
  namespace: 'appoint',

  state: {
	  departments : [], //可预约科室列表
	  schedules : [],    //可预约医生排班
	  filteredSchedules : [],    //排班查询结果
	  doctors:[],//可预约医生列表，从排版中抽取
	  appointments : [],//可预约号源 (时间段)
	  history : [],     // 预约历史
	  department : {},  // 选中科室
	  schedule : {},     // 选中排班
	  appointment : {}, // 选中号源
  },

  subscriptions: {},
  
  effects: {
    *loadDeptList({ payload }, { select, call, put }) {
      const {data} = yield call(loadDeptList);
      if (data && data.success ) {
        console.info("获取科室列表 ",(data.result||[]).length +"条");
        yield put({
          type: 'setState',
          payload: { departments:data.result }
        })
      }
    },
    *loadScheduleList({ payload }, { select, call, put }) {
      const { query } = payload;
  	  const { data } = yield call(loadScheduleList,query);
     
  	  if (!(data && data.success && data.result)) {
  		baseUtil.notice("获取排班信息失败！");
  		return;
  	  }
  	  const schedules = data.result;
  	  console.info("获取排班信息 ",(schedules.result||[]).length +"条");
  	  const filteredSchedules = [];
  	  const doctors = [];
  	  let map = {};
  	  for(var schedule of schedules){//抽取医生信息
  		filteredSchedules.push(schedule); 
  		if(!map[schedule.doctorCode]){
  			map[schedule.doctorCode] = true;
  			doctors.push({
  				code:schedule.doctorCode,
  				name:schedule.doctorName,
  				type:schedule.doctorType,
  				typeName:schedule.doctorTypeName,
  				pinyin:schedule.doctorPinyin,
  			});
  		}
  	  }
  	  yield put({
  	    type: 'setState',
  	    payload: { schedules,doctors,filteredSchedules}
  	  })
    },
    *querySchedule({ payload }, { select, call, put }) {//前台查询
    	const schedules = yield select(state => state.appoint.schedules);
    	const { query } = payload;
    	var filteredSchedules = schedules.filter(function(item){
    		var result = true;
    		if(query.doctor && query.doctor.code){
    			result = result && item.doctorCode == query.doctor.code;
    		}
    		if(query.date){ 
    			let clinicDate = item.clinicDate? item.clinicDate:item.onDutyTime.split(" ")[0];
    			result = result && clinicDate == query.date;
    		}
    		if(query.durationName){
    			result = result && item.clinicDurationName == query.durationName ;
    		}
    		return result; 
    	});
    	yield put({
     	  type: 'setState',
     	  payload: { filteredSchedules:filteredSchedules }
     	})
      },
    *loadAppointSources({ payload }, { select, call, put }) {// 暂时没有用到，排班直接返回号源信息
  	  const {data} = yield call(loadAppointSources);
  	  if (data && data.success ) {
  	    yield put({
  	      type: 'setState',
  	      payload: { appointments:data.result }
  	    })
  	  }
    },
    *loadAppointHistory({ payload }, { select, call, put }) {
      const baseInfo = yield select(state => state.patient.baseInfo);
      var query= {
    	patientName:baseInfo.name,
    	patientNo:baseInfo.no,
    	patientPhone:baseInfo.mobile||"",
       	appointmentTime:moment().format('YYYY-MM-DD'),
      }
  	  const {data} = yield call(loadAppointHistory,query);
  	  if (data && data.success ) {
  	    yield put({
  	      type: 'setState',
  	      payload: { history:data.result||[] }
  	    })
  	  }
    },
    *appointBook({ payload }, { select, call, put }) {
      const {appointment} = payload;
      const baseInfo = yield select(state => state.patient.baseInfo);
      const appoint = {
    	...appointment,
    	patientNo:baseInfo.no,
    	patientName:baseInfo.name,
    	patientSex:baseInfo.gender||"3",
    	patientPhone:baseInfo.mobile||baseInfo.telephone||"",
    	patientIdNo:baseInfo.idNo || "",
    	remarks:''
      };
      console.info("准备预约",appoint);
  	  const {data} = yield call(appointBook,appoint);
  	  if (data && data.success && data.result ) {
  		console.info("预约成功",data.result);
  		var result = data.result
  		var newAppoint = {
    	  ...appoint,
    	  appointmentTime : result.appointmentTime,
    	  verifyCode : result.verifyCode,
    	  appointmentNo : result.appointmentNo,
    	  appointmentInfo : result.appointmentInfo,
    	  patientName : result.patientName,
    	  appointmentDate : result.appointmentDate,
    	  deptName : result.deptName,
    	  scheduleDeptName : result.scheduleDeptName,
    	  clinicHouse : result.clinicHouse,
    	  houseLocation : result.houseLocation,
    	  hospitalDistrictName : result.hospitalDistrictName
    	}
  	    yield put({
  	      type: 'setState',
  	      payload: { 
  	    	appointment : newAppoint
  	      }
  	    })
  		try{
  			yield printUtil.printAppoint(newAppoint);
  		}catch(e){
  			baseUtil.notice("打印机异常，打印凭证失败");
  		}
  	  }else if(data && data.msg ){
  		baseUtil.error(data.msg);
  	  }else{
  		baseUtil.error("预约失败");
  	  }
    },
    *appointSign({ payload ,callback}, { select, call, put }) {
      const { appointment} = payload;
      const baseInfo = yield select(state => state.patient.baseInfo);
      const appoint = {
    	...appointment,
    	patientNo:baseInfo.no,
    	cardNo:"",
      };
	  const {data} = yield call(appointSign,appoint);
	  if (data && data.success ) {
		//打印签到凭条
		var result = data.result
		var newAppoint = {
    	  ...appoint,
    	  appointmentInfo : result.appointmentInfo,
    	  patientName : result.patientName,
    	  appointmentDate : result.appointmentDate,
    	  deptName : result.deptName,
    	  scheduleDeptName : result.scheduleDeptName,
    	  clinicHouse : result.clinicHouse,
    	  houseLocation : result.houseLocation,
    	  hospitalDistrictName : result.hospitalDistrictName
    	}
		try{
			yield printUtil.printSign(newAppoint);
		}catch(e){
			baseUtil.notice("打印机异常，打印凭证失败");
		}
		
  	    if(callback)callback("签到成功");
  	    yield put({type: 'loadAppointHistory',});
  	  }else{
  		if(callback)callback("签到失败");  
  	  }
    },
    *appointCancel({ payload,callback }, { select, call, put }) {
      const { appointment} = payload;
  	  const {data} = yield call(appointCancel,appointment);
  	  if (data && data.success ) {
  	    if(callback)callback("取消成功");
  	    yield put({type: 'loadAppointHistory',});
  	  }else{
  		if(callback)callback("取消失败");  
  	  }
    },
    *setState({ payload ,callback}, { select, call, put }) {
      yield put({
        type: 'changeState',
        payload: payload
      });
      if(callback)callback();
    },
  },
  reducers: {
    changeState (state, {payload}) {
      return { ...state, ...payload,};
    },
    reset (state, {payload}) {
      return {
    	  departments : [], //可预约科室列表
    	  schedules : [],    //可预约医生排班
    	  filteredSchedules : [],    //排班查询结果
    	  doctors:[],//可预约医生列表，从排版中抽取
    	  appointments : [],//可预约号源 (时间段)
    	  history : [],     // 预约历史
    	  department : {},  // 选中科室
    	  schedule : {},     // 选中排班
    	  appointment : {}, // 选中号源
      }
    },
  },
};

