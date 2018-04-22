import dva from 'dva';
import { loadAssayRecords, loadAssayImage, printAssay,loadTmsRecords,loadTmsDetails,printTms } from '../../services/AssayService';

import baseUtil from '../../utils/baseUtil';
import printUtil from '../../utils/printUtil';
import lightUtil from '../../utils/lightUtil';
export default {

	namespace: 'assay',

	state: {
		records : [],
		imagePath : null ,
		tmsRecords:[],
		tmsRecord : null,
		printing:false,
	},

	effects: {
	    *loadAssayRecords({ payload }, { select, call, put }) {
	        const { record } = payload;
	        if(record.dtReg > record.dtEnd){
	        	baseUtil.notice("开始日期不能大于结束日期，请您重新选择！");
	        	return;
	        }
	        else{
	        	const { data } = yield call(loadAssayRecords,record);
		    	if (data && data.success ) {
		    		yield put({
		    			type: 'setState',
		    			payload: { records:data.result }
		    		})
		    	}
	        }
	    },
	    *print({ payload }, { select, call, put }){
	    	const { record } = payload;
	    	const {data} = yield call(loadAssayImage,record);
	    	if (data && data.success && data.result ) {
	    		try{
	    			var imagePath = data.result.filePath;
	    			console.info("检验报告图片： " , imagePath);
	    			yield put({
		    			type: 'setState',
		    			payload: { printing:true }
		    		})
	    			/*lightUtil.form.blink();
	    			var jobId = yield printUtil.printCommonAssay(imagePath);
	    			var status = 1;
	    			while(status == 1){
	    				yield baseUtil.sleep(500);
	    				status = yield printUtil.lodopPrintStatus(jobId);
	    			}
	    			lightUtil.form.turnOff();*/
	    			yield printUtil.printCommonAssay(imagePath);
	    		}catch(e){
	    			console.info(e);
	    			baseUtil.notice("打印检验报告错误，请至柜台办理打印业务！");
	    			return;
	    		}
	    		yield put({
	    			type: 'setState',
	    			payload: {printing:false }
	    		});
	    		yield put({
	    			type: 'printCallback',
	    			payload: { record:record}
	    		});
	    	}else{
	    		baseUtil.notice("无法获取报告内容，请至柜台办理打印业务！");
	    	}
	    },
	    *printCallback({ payload }, { select, call, put }){
	    	const { record } = payload;
	    	const {data} = yield call(printAssay,record); //TODO 先不回传
	    	//const data = {success : true};
	    	if (data && data.success ) {
	    		yield put({type: 'loadAssayRecords',payload:{record}});//后台将查询条件加到查询结果中，所以可以直接重新查询
	    	}else{
	    		baseUtil.notice("打印结果记录失败,请联系管理员");
	    	}
	    },
	    *loadTmsRecords({ payload ,callback}, { select, call, put }) {
	    	const { record } = payload;
	    	if(record.startDate > record.endDate){
	        	baseUtil.notice("开始日期不能大于结束日期，请您重新选择！");
	        	return;
	        }else{
	        	const { data } = yield call(loadTmsRecords,record);
		    	if (data && data.success ) {
		    		console.info("输血科化验单列表 : ",data.result);
		    		yield put({
		    			type: 'setState',
		    			payload: { tmsRecords:data.result }
		    		})
		    	}
	        }
	    },
	    *loadTmsDetails({ payload ,callback}, { select, call, put }) {
	    	const { record } = payload;
	    	const {data} = yield call(loadTmsDetails,record);
	    	if (data && data.success && data.result ) {
	    		var tmsRecord = {...record,details:data.result||[]}
	    		try{
	    			yield put({
		    			type: 'setState',
		    			payload: { tmsRecord }
		    		})
	    		}catch(e){
	    			console.info(e);
	    			baseUtil.notice("打印检验报告错误，请至柜台办理打印业务！");
	    			return;
	    		}
	    	}else{
	    		baseUtil.notice("无法获取报告内容，请至柜台办理打印业务！");
	    	}
	    },
	    *printTms({ payload }, { select, call, put }){
	    	const { record } = payload;
	    	const {data} = yield call(loadTmsDetails,record);
	    	if (data && data.success && data.result ) {
	    		var tmsRecord = {...record,details:data.result||[]}
	    		console.info("输血科明细 : ",tmsRecord);
	    		try{
	    			yield put({
	    				type: 'setState',
	    				payload: { printing:true }
		    		})
	    			/*lightUtil.form.blink();
	    			var jobId = yield printUtil.printBloodAssay(tmsRecord);
	    			var status = 1;
	    			while(status == 1){
	    				yield baseUtil.sleep(500);
	    				status = yield printUtil.lodopPrintStatus(jobId);
	    			}
	    			lightUtil.form.turnOff();*/
	    			yield printUtil.printBloodAssay(tmsRecord);
	    		}catch(e){
	    			console.info(e);
	    			baseUtil.notice("打印检验报告错误，请至柜台办理打印业务！");
	    			return;
	    		}
	    	}else{
	    		baseUtil.notice("无法获取报告内容，请至柜台办理打印业务！");
	    	}
	    	yield put({
    			type: 'setState',
    			payload: { printing:false }
    		});
    		yield put({
    			type: 'tmsCallback',
    			payload: { record:record}
    		});
	    },
	    *tmsCallback({ payload }, { select, call, put }){
	    	const { record } = payload;
	    	const {data} = yield call(printTms,record);
	    	if (data && data.success ) {
	    		if(data.msg == "1"){//成功
	    		  yield put({type: 'loadTmsRecords',payload:{record}});
	    		}
	    		else if(data.msg == "0"){//失败
	    		  baseUtil.notice("打印结果记录失败,请联系管理员");	
	    		}
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
		reset(state,{ payload}) {
			return {
				records : [],
				imagePath : null ,
				tmsRecords:[],
				tmsRecord : null,
				printing:false,
			}
		}
	},
};