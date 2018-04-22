import dva from 'dva';
import { loadCaseHistory,loadCaseDetail,printCallback } from '../../services/CaseService';
import baseUtil from '../../utils/baseUtil';
import printUtil from '../../utils/printUtil';
import lightUtil from '../../utils/lightUtil';
export default {

	namespace: 'medicalCase',

	state: {
		records : [],
		record : null ,
	},

	effects: {
	    *loadCaseHistory({ payload }, { select, call, put }) {
	        const { record } = payload;
	        if(record.startTime > record.endTime){
	        	baseUtil.notice("开始日期不能大于结束日期，请您重新选择！");
	        	return;
	        }
	        else{
	        	const { data } = yield call(loadCaseHistory, record);
		    	
		    	if (data && data.success ) {
		    		yield put({
		    			type: 'setState',
		    			payload: { records:data.result }
		    		})
		    	}
	        }
	    },
	    *loadCaseDetail({ payload }, { select, call, put }) {
		    const { record } = payload;
	    	const {data} = yield call(loadCaseDetail,record);
	    	if (data && data.success ) {
	    		yield put({
	    			type: 'setState',
	    			payload: { record:data.result }
	    		})
	    	}
	    },
	    *print({ payload }, { select, call, put }){
	    	const { record } = payload;
	    	const {data} = yield call(loadCaseDetail,record);
	    	
	    	var msg = null;
	    	if(!(data && data.success && data.result )){
	    		baseUtil.error("无法获取报告内容，请至柜台办理打印业务！");
	    		return;
	    	}
	    	yield put({
    			type: 'setState',
    			payload: { record:data.result }
    		})
    		try{
    			var content = data.result.content;
    			var array = JSON.parse(content);
    			msg = array[0].RecordHTML;
    		}catch(e){
    			yield put({
	    			type: 'setState',
	    			payload: { record:null }
	    		});
    			baseUtil.error("病历格式错误，请至柜台办理打印业务！");
    			return;
    		}
    		
    		try{
    			yield printUtil.printMedicalRecord(msg);
    		}catch(e){
    			baseUtil.error("打印机可能缺纸，请联系工作人员");
    			return;
    		}
    		yield put({
    			type: 'setState',
    			payload: { record:null }
    		});
    		yield put({
    			type: 'printCallback',
    			payload: { record:record}
    		});
	    },
	    *printCallback({ payload }, { select, call, put }){
	    	const { record } = payload;
	    	const {data} = yield call(printCallback,record);
	    	if (data && data.success ) {
	    		yield put({type: 'loadCaseHistory',payload: { record:record}});
	    	}else{
	    		baseUtil.notice("打印结果记录失败,请联系管理员");
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
		"reset"(state,{ payload}) {
			return {
				records : [],
				record : null ,
			};
		},
	},
};