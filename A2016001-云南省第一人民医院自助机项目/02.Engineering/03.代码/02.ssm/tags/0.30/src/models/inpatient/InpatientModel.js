import dva from 'dva';
import { loadInpatientInfo,loadInpatientBills } from '../../services/InpatientService';
import baseUtil from '../../utils/baseUtil';
//import printUtil from '../../utils/printUtil';
import eventUtil from '../../utils/eventUtil';

export default {

	namespace: 'inpatient',

	state: {
		inpatientInfo:{},
		records : [],
	},
	payEvent({dispatch, history }) {//支付事件监听
		eventUtil.addListener("model","afterForegift",function(){
			console.info('预缴完成触发事件 ');
			dispatch({type: 'reloadInpatient'});
		});
	},
	effects: {
		*load({ payload }, { select, call, put }) {
			const { param } = payload;
			yield put({ type: 'loadInpatient',payload: { param}})
			yield put({ type: 'loadBills',payload: { param}})
		},
		*loadInpatient({ payload }, { select, call, put }) {
			const { param } = payload;
	    	// param.patientNo = "5011194916";//TODO 测试数据
	        const { data } = yield call(loadInpatientInfo,{patientNo:param.patientNo});
	        if (data && data.success && data.result ) {
	    		yield put({
	    			type: 'setState',
	    			payload: { inpatientInfo:data.result }
	    		})
	    	}else{
	    		baseUtil.error('患者无当前住院信息');
	    		return;
	    	}
		},
		*reloadInpatient({ payload ,callback}, { select, call, put }) {
			const baseInfo = yield select(state => state.patient.baseInfo);
	        const { data } = yield call(loadInpatientInfo,{patientNo:baseInfo.no});
	        if (data && data.success && data.result ) {
	    		yield put({
	    			type: 'setState',
	    			payload: { inpatientInfo:data.result }
	    		})
	    		if(callback)callback(data.result);
	    	}else{
	    		baseUtil.error('患者无当前住院信息');
	    		return;
	    	}
		},
	    *loadBills({ payload }, { select, call, put }) {
			const inpatientInfo = yield select(state => state.inpatient.inpatientInfo);
			const { inDate, outDate } = inpatientInfo
	        const { param } = payload;
	        const { beginDate , endDate} = param;
	        var query ={
	        		...inpatientInfo,
	        		beginDate:beginDate||inDate,
	        		endDate:endDate||outDate
	        };
	    	const { data } = yield call(loadInpatientBills,query);
	    	
	    	if (data && data.success ) {
	    		yield put({
	    			type: 'setState',
	    			payload: { records:data.result }
	    		})
	    	}else{
	    		
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
		"changeState"(state,{ payload}) {
			return {...state,...payload};
		},
		"rest"(state,{ payload}) {
			return {
				inpatientInfo:{},
				records : [],
			};
		},
	},
};